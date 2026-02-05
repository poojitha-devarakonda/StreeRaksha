import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './NewJournalEntry.css';

export default function NewJournalEntry() {
  const navigate = useNavigate();
  const [mood, setMood] = useState('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSave = () => {
    const entry = {
      id: Date.now(),
      mood,
      title,
      content,
      date: new Date().toISOString(),
    };

    const prev = JSON.parse(localStorage.getItem('journalEntries')) || [];
    localStorage.setItem('journalEntries', JSON.stringify([entry, ...prev]));

    navigate('/journal');
  };

  return (
    <div className="journal-modal-overlay">
      <div className="journal-modal">
        <header className="journal-modal-header">
          <h2>New Journal Entry</h2>
          <button onClick={() => navigate(-1)}>
            <X />
          </button>
        </header>

        <p>How are you feeling?</p>

        <div className="mood-grid">
          {['Happy', 'Calm', 'Grateful', 'Hopeful', 'Anxious', 'Stressed', 'Sad'].map((m) => (
            <button
              key={m}
              className={mood === m ? 'mood active' : 'mood'}
              onClick={() => setMood(m)}
            >
              {m}
            </button>
          ))}
        </div>

        <input
          placeholder="Title (optional)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="Write your thoughts..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <button className="save-btn" onClick={handleSave}>
          Save Entry
        </button>
      </div>
    </div>
  );
}
