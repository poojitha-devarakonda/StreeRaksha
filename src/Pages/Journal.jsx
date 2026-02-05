import { ArrowLeft, Plus, BookOpen, Pencil, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import './Journal.css';

export default function Journal() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('journalEntries')) || [];
    setEntries(data);
  }, []);

  const handleDelete = (id) => {
    const ok = window.confirm('Are you sure you want to delete this entry?');
    if (!ok) return;

    const updated = entries.filter(e => e.id !== id);
    setEntries(updated);
    localStorage.setItem('journalEntries', JSON.stringify(updated));
  };

  return (
    <Layout currentPageName="Journal">
      <div className="journal-page">
        
        <header className="journal-header.back-btn">
          <button onClick={() => navigate('/')} className="back-btn">
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1>My Journal</h1>
            <p>Your safe space to express</p>
          </div>

          <button className="add-btn" onClick={() => navigate('/journal-new')}>
            <Plus size={20} color="#ec4899" />
          </button>
        </header>

        {entries.length === 0 ? (
          <div className="journal-empty">
            <div className="journal-icon">
              <BookOpen />
            </div>
            <h3>Start Your Journal</h3>
            <p>Express your thoughts and track your emotional journey</p>
            <button onClick={() => navigate('/journal-new')}>
              + Write First Entry
            </button>
          </div>
        ) : (
          <div className="journal-list">
            {entries.map(e => (
              <div key={e.id} className="journal-entry-card">
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <strong>{e.title || 'Untitled Entry'}</strong>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <Pencil
                      size={16}
                      style={{ cursor: 'pointer' }}
                      onClick={() => navigate(`/journal-edit/${e.id}`)}
                    />
                    <Trash2
                      size={16}
                      color="#ef4444"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleDelete(e.id)}
                    />
                  </div>
                </div>

                <p>{e.content}</p>
                <small>{new Date(e.date).toLocaleString()}</small>
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}
