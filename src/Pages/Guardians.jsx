import { Plus, User, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { useEffect, useState } from 'react';
import axios from 'axios';
import './Guardian.css';

export default function Guardians() {
  const navigate = useNavigate();
  const [guardians, setGuardians] = useState([]);

  useEffect(() => {
    fetchGuardians();
  }, []);

  const fetchGuardians = async () => {
    try {
      const res = await axios.get("http://localhost:5050/api/guardian");
      setGuardians(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteGuardian = async (id) => {
    await axios.delete(`http://localhost:5050/api/guardian/${id}`);
    fetchGuardians();
  };

  return (
    <Layout currentPageName="Guardians">
      <div className="guardians-page">

        <div className="guardians-header">
          <div>
            <h1>Guardians</h1>
            <p>People who will be alerted in emergencies</p>
          </div>

          <button
            className="add-btn"
            onClick={() => navigate('/guardians-add')}
          >
            <Plus size={20} />
          </button>
        </div>

        <div className="guardians-info">
          <User size={26} />
          <div>
            <strong>Stay Safe</strong>
            <p>Add trusted people who can receive alerts</p>
          </div>
        </div>

        {guardians.length === 0 ? (
          <div className="empty-state">
            <p>No guardians added yet</p>
            <button onClick={() => navigate('/guardians-add')}>
              Add First Guardian
            </button>
          </div>
        ) : (
          <div className="guardians-list">
            {guardians.map((g) => (
              <div className="guardian-card" key={g._id}>
                <div className="avatar">
                  {g.name.charAt(0)}
                </div>

                <div className="guardian-info">
                  <strong>{g.name}</strong>
                  <br />
                  <span>{g.phone}</span>

                  <div className="guardian-meta">
                    <span>{g.relationship}</span>
                  </div>
                </div>

                <div
                  className="guardian-actions"
                  onClick={() => deleteGuardian(g._id)}
                >
                  <Trash2 size={18} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}