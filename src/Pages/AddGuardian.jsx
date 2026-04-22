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

  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // SEND OTP
  async function sendOTP() {
    const res = await fetch("http://localhost:5050/api/guardian/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      alert("OTP sent to email!");
      setOtpSent(true);
    } else {
      alert(data.message);
    }
  }

  // VERIFY OTP
  async function verifyOTP() {
    const res = await fetch("http://localhost:5050/api/guardian/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, otp }),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Guardian added successfully!");
      navigate('/guardians');
    } else {
      alert(data.message);
    }
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
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Phone</label>
          <input
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label>Relationship</label>
          <select
            value={form.relationship}
            onChange={(e) =>
              setForm({ ...form, relationship: e.target.value })
            }
          >
            <option>Friend</option>
            <option>Parent</option>
            <option>Sibling</option>
            <option>Partner</option>
          </select>
        </div>

        {otpSent && (
          <div className="form-group">
            <label>Enter OTP</label>
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
        )}

        <div className="form-actions">
          <button className="cancel" onClick={() => navigate('/guardians')}>
            Cancel
          </button>

          {!otpSent ? (
            <button className="save" onClick={sendOTP}>
              Send OTP
            </button>
          ) : (
            <button className="save" onClick={verifyOTP}>
              Verify OTP
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}