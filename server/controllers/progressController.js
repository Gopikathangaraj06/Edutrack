const Progress = require('../models/Progress');
const Subject = require('../models/Subject');
const User = require('../models/User');

const calculateXP = (score) => {
  if (score >= 90) return 50;
  if (score >= 75) return 30;
  if (score >= 50) return 15;
  return 5;
};

// @desc    Get all progress entries for user
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res) => {
  try {
    const progress = await Progress.find({ userId: req.user.id }).populate('subjectId', 'name').sort({ date: 1 });
    res.status(200).json(progress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add subject progress
// @route   POST /api/progress
// @access  Private
const addProgress = async (req, res, next) => {
  try {
    const { subjectId, score, date } = req.body;
    if (!subjectId || score === undefined) {
      return res.status(400).json({ message: 'Subject and score are required' });
    }

    const subject = await Subject.findById(subjectId);
    if (!subject || subject.userId.toString() !== req.user.id) {
      return res.status(404).json({ message: 'Subject not found or unauthorized' });
    }

    const parsedDate = date ? new Date(date) : new Date();

    const progress = await Progress.create({
      userId: req.user.id,
      subjectId,
      score,
      date: parsedDate
    });

    // Update Subject Stats
    const allProgressForSubject = await Progress.find({ subjectId });
    const totalTests = allProgressForSubject.length;
    const averageScore = allProgressForSubject.reduce((acc, curr) => acc + curr.score, 0) / totalTests;
    
    // Simple improvement calculation: compare last to average
    const improvement = allProgressForSubject.length > 1 
      ? allProgressForSubject[allProgressForSubject.length - 1].score - allProgressForSubject[allProgressForSubject.length - 2].score 
      : 0;

    subject.totalTests = totalTests;
    subject.averageScore = averageScore;
    subject.improvement = improvement;
    await subject.save();

    // Gamification Logic - Update XP and Level
    const user = await User.findById(req.user.id);
    const xpGained = calculateXP(score);
    user.xp += xpGained;
    
    // Level up logic (every 100 XP = 1 level, starting from level 1)
    user.level = Math.floor(user.xp / 100) + 1;

    // Study streak logic
    const today = new Date().setHours(0,0,0,0);
    const lastActive = new Date(user.lastActive).setHours(0,0,0,0);
    const diffTime = Math.abs(today - lastActive);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays === 1) {
      user.studyStreak += 1;
    } else if (diffDays > 1) {
      user.studyStreak = 1; // Reset streak
    } else if (user.studyStreak === 0) {
      user.studyStreak = 1;
    }
    
    user.lastActive = new Date();
    await user.save();

    res.status(201).json({ 
      message: 'Progress added successfully', 
      progress, 
      userXP: user.xp, 
      userLevel: user.level, 
      userStreak: user.studyStreak 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard analytics (average, weakest, trends)
// @route   GET /api/progress/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id });
    const progress = await Progress.find({ userId: req.user.id }).populate('subjectId', 'name').sort({ date: 1 });

    if (subjects.length === 0) {
      return res.status(200).json({ average: 0, weakest: null, best: null, chartData: [], radarData: [] });
    }

    const overallAverage = subjects.reduce((acc, sub) => acc + sub.averageScore, 0) / subjects.length;

    // Sorting to find best and weakest
    const sortedSubjects = [...subjects].sort((a, b) => b.averageScore - a.averageScore);
    const best = sortedSubjects[0];
    const weakest = sortedSubjects[sortedSubjects.length - 1];

    // Data for charts
    const chartDataMap = {};
    progress.forEach(p => {
      const dateStr = p.date.toISOString().split('T')[0];
      if (!chartDataMap[dateStr]) chartDataMap[dateStr] = {};
      chartDataMap[dateStr][p.subjectId.name] = p.score;
    });

    const chartData = Object.keys(chartDataMap).map(date => {
      return { date, ...chartDataMap[date] };
    });

    const radarData = subjects.map(s => ({
      subject: s.name,
      score: Math.round(s.averageScore * 10) / 10,
      fullMark: 100
    }));

    res.status(200).json({
      average: overallAverage,
      best,
      weakest,
      chartData,
      radarData,
      subjects: sortedSubjects
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Generate Demo Data
// @route   POST /api/progress/demo
// @access  Private
const generateDemoData = async (req, res) => {
  try {
    let subjects = await Subject.find({ userId: req.user.id });
    
    if (subjects.length === 0) {
      const defaultSubjects = ['Mathematics', 'Physics', 'Chemistry', 'English', 'Computer Science', 'History'];
      const subjectDocs = defaultSubjects.map(sub => ({ userId: req.user.id, name: sub }));
      subjects = await Subject.insertMany(subjectDocs);
    }

    const progressEntries = [];
    const now = new Date();
    
    // Create 15 random entries
    for (let i = 0; i < 15; i++) {
        const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
        const randomScore = Math.floor(Math.random() * (95 - 60 + 1) + 60);
        // Random date in last 30 days
        const randomDaysAgo = Math.floor(Math.random() * 30);
        const randomDate = new Date(now.getTime() - (randomDaysAgo * 24 * 60 * 60 * 1000));
        
        progressEntries.push({
            userId: req.user.id,
            subjectId: randomSubject._id,
            score: randomScore,
            date: randomDate
        });
    }

    // Sort entries by date ascending so chronological tests make sense
    progressEntries.sort((a, b) => a.date - b.date);
    await Progress.insertMany(progressEntries);

    // After bulk insert, we need to recalculate subject stats and user XP
    const user = await User.findById(req.user.id);
    let totalXpGained = 0;

    for (const sub of subjects) {
        const allProgress = await Progress.find({ subjectId: sub._id }).sort({ date: 1 });
        if (allProgress.length > 0) {
            sub.totalTests = allProgress.length;
            sub.averageScore = allProgress.reduce((acc, curr) => acc + curr.score, 0) / sub.totalTests;
            sub.improvement = allProgress.length > 1 
              ? allProgress[allProgress.length - 1].score - allProgress[allProgress.length - 2].score 
              : 0;
            await sub.save();
        }
    }

    progressEntries.forEach(entry => {
        totalXpGained += calculateXP(entry.score);
    });

    user.xp += totalXpGained;
    user.level = Math.floor(user.xp / 100) + 1;
    user.studyStreak = Math.max(user.studyStreak, 1); // just default to 1 for demo
    await user.save();

    res.status(201).json({ message: 'Demo data generated successfully', userXP: user.xp, userLevel: user.level, userStreak: user.studyStreak });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProgress, addProgress, getAnalytics, generateDemoData };
