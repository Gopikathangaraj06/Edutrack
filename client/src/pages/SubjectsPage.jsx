import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Library } from 'lucide-react';

const SubjectsPage = () => {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    try {
      const res = await api.get('/subjects');
      setSubjects(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const addSubject = async (e) => {
    e.preventDefault();
    if (!newSubject.trim()) return;
    try {
      const res = await api.post('/subjects', { name: newSubject });
      setSubjects([...subjects, res.data]);
      setNewSubject('');
    } catch (error) {
      console.error(error);
    }
  };

  const deleteSubject = async (id) => {
    try {
      await api.delete(`/subjects/${id}`);
      setSubjects(subjects.filter(s => s._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="flex h-full items-center justify-center">Loading subjects...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Library className="text-primary" />
            My Subjects
          </h1>
          <p className="text-slate-500 mt-1">Manage and track your performance across different subjects.</p>
        </div>
        
        <form onSubmit={addSubject} className="flex gap-2 w-full md:w-auto">
          <input 
            type="text" 
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="E.g., Mathematics"
            className="input-field"
          />
          <button type="submit" className="btn-primary whitespace-nowrap">
            <Plus size={18} className="mr-1" /> Add
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map(subject => (
          <div key={subject._id} className="card-container hover:shadow-md transition-shadow relative group">
            <button 
              onClick={() => deleteSubject(subject._id)}
              className="absolute top-4 right-4 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 size={18} />
            </button>
            <h3 className="font-bold text-lg text-slate-800 mb-4">{subject.name}</h3>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-500">Average Score</span>
                  <span className="font-semibold text-slate-700">{Math.round(subject.averageScore)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${subject.averageScore >= 80 ? 'bg-emerald-400' : subject.averageScore >= 50 ? 'bg-amber-400' : 'bg-red-400'}`}
                    style={{ width: `${Math.min(subject.averageScore, 100)}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm py-2 border-t border-slate-100">
                <span className="text-slate-500">Total Tests</span>
                <span className="font-medium">{subject.totalTests}</span>
              </div>
              
              <div className="flex justify-between text-sm py-2 border-t border-slate-100">
                <span className="text-slate-500">Recent Trend</span>
                <span className={`font-medium ${subject.improvement > 0 ? 'text-emerald-500' : subject.improvement < 0 ? 'text-red-500' : 'text-slate-500'}`}>
                  {subject.improvement > 0 ? '+' : ''}{Math.round(subject.improvement)}%
                </span>
              </div>
            </div>
          </div>
        ))}

        {subjects.length === 0 && (
          <div className="col-span-full card-container text-center py-12 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-4">
              <Library size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-1">No subjects yet</h3>
            <p className="text-slate-500">Add a subject to start analyzing your performance.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectsPage;
