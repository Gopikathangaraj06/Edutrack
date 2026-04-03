import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { TrendingUp, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const AddProgress = () => {
  const [subjects, setSubjects] = useState([]);
  const [subjectId, setSubjectId] = useState('');
  const [score, setScore] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const { updateUserStats } = useContext(AuthContext);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      setSubjects(res.data);
      if (res.data.length > 0) setSubjectId(res.data[0]._id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!score || !subjectId || !date) {
      toast.error('Please enter valid data');
      return;
    }

    const scoreNum = Number(score);
    if (scoreNum < 0 || scoreNum > 100) {
      toast.error("Please enter valid data");
      return;
    }
    
    setIsSaving(true);
    try {
      const res = await api.post('/progress', {
        subjectId,
        score: scoreNum,
        date
      });
      
      const { userXP, userLevel, userStreak } = res.data;
      updateUserStats(userXP, userLevel, userStreak);
      
      toast.success(res.data.message || 'Progress added successfully');
      
      // Clear form and stay on page
      setScore('');
      setDate(new Date().toISOString().split('T')[0]);
      if (subjects.length > 0) setSubjectId(subjects[0]._id);
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save progress');
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-full">Loading...</div>;

  if (subjects.length === 0) {
    return (
      <div className="max-w-xl mx-auto card-container text-center py-12">
        <div className="w-16 h-16 bg-blue-50 text-primary mx-auto rounded-full flex items-center justify-center mb-4">
          <TrendingUp size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">No subjects found</h2>
        <p className="text-slate-500 mb-6">You need to add a subject before tracking your progress.</p>
        <button onClick={() => navigate('/subjects')} className="btn-primary inline-flex">
          Go to Subjects First
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <TrendingUp className="text-primary" />
          Add Progress
        </h1>
        <p className="text-slate-500 mt-1">Record your test scores and track your improvement over time.</p>
      </div>

      <div className="card-container">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="input-field bg-white"
              required
            >
              <option value="" disabled>Select a subject</option>
              {subjects.map(s => (
                <option key={s._id} value={s._id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Score (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              required
              value={score}
              onChange={(e) => setScore(e.target.value)}
              className="input-field"
              placeholder="e.g. 85"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="input-field"
            />
          </div>

          <button type="submit" disabled={isSaving} className={`w-full py-3 mt-4 ${isSaving ? 'bg-blue-300 cursor-not-allowed hidden' : 'btn-primary'} flex items-center justify-center`} style={isSaving ? { backgroundColor: '#93c5fd', color: 'white', borderRadius: '0.5rem' } : {}}>
            {isSaving ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Saving...
              </>
            ) : (
              'Save Progress'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProgress;
