import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useState } from 'react';
import './AddGuardian.css';

export default function AddGuardian() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    relationship: 'Friend',
  });

  function saveGuardian() {
    const existing = JSON.parse(localStorage.getItem('guardians') || '[]');
    localStorage.setItem('guardians', JSON.stringify([...existing, form]));
    navigate('/guardians');
  }

  return (
    <Layout currentPageName="Guardians">
      <div className="add-guardian-page">
        <header className="add-header">
          <button className="back-btn" onClick={() => navigate('/guardians')}>
            <ArrowLeft size={22} />
          </button>
          <h1>Add Guardian</h1>
        </header>

        <div className="form-group">
          <label>Name</label>
          <input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Phone Number</label>
          <input
            placeholder="+1 234 567 8900"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Email (Optional)</label>
          <input
            placeholder="email@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Relationship</label>
          <select
            value={form.relationship}
            onChange={(e) => setForm({ ...form, relationship: e.target.value })}
          >
            <option>Friend</option>
            <option>Parent</option>
            <option>Sibling</option>
            <option>Partner</option>
          </select>
        </div>

        <div className="form-actions">
          <button className="cancel" onClick={() => navigate('/guardians')}>
            Cancel
          </button>
          <button className="save" onClick={saveGuardian}>
            Add Guardian
          </button>
        </div>
      </div>
    </Layout>
  );
}
