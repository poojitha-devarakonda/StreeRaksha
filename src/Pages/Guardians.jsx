import { ArrowLeft, Plus, Phone, Mail, Pencil, Trash2, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Layout from '../components/Layout';
import './Guardian.css';

export default function Guardians() {
  const navigate = useNavigate();

  const [guardians, setGuardians] = useState(
    JSON.parse(localStorage.getItem('guardians') || '[]')
  );

  const handleDelete = (index) => {
    const ok = window.confirm('Delete this guardian? This cannot be undone.');
    if (!ok) return;

    const updated = guardians.filter((_, i) => i !== index);
    setGuardians(updated);
    localStorage.setItem('guardians', JSON.stringify(updated));
  };

  const handleEdit = (index) => {
    navigate('/guardians-add', { state: { editIndex: index } });
  };

  return (
    <Layout currentPageName="Guardians">
      <div className="guardians-page">
        <header className="guardians-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={22} />
          </button>

          <div>
            <h1>Guardians</h1>
            <p>Your trusted emergency contacts</p>
          </div>

          <button className="add-btn" onClick={() => navigate('/guardians-add')}>
            <Plus size={20} />
          </button>
        </header>

        <div className="guardians-info">
          <Users />
          <div>
            <strong>Who are Guardians?</strong>
            <p>
              Guardians are trusted people who will be notified during emergencies.
              They’ll receive your location and can help coordinate assistance.
            </p>
          </div>
        </div>

        {guardians.length === 0 ? (
          <div className="empty-state">
            <p>No guardians added yet.</p>
            <button onClick={() => navigate('/guardians-add')}>
              Add your first guardian
            </button>
          </div>
        ) : (
          <div className="guardians-list">
            {guardians.map((g, i) => (
              <div key={i} className="guardian-card">
                <div className="avatar">{g.name?.[0]?.toUpperCase()}</div>

                <div className="guardian-info">
                  <strong>{g.name}</strong>
                  <span>{g.relationship}</span>

                  <div className="guardian-meta">
                    <span><Phone size={14} /> {g.phone}</span>
                    {g.email && <span><Mail size={14} /> {g.email}</span>}
                  </div>
                </div>

                <div className="guardian-actions">
                  <Pencil
                    size={16}
                    className="edit-icon"
                    onClick={() => handleEdit(i)}
                  />
                  <Trash2
                    size={16}
                    className="delete-icon"
                    onClick={() => handleDelete(i)}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
