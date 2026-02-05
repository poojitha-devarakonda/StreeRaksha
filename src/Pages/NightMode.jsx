import { ArrowLeft, Moon, Clock, Users, Shield, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './NightMode.css';

export default function NightMode() {
  const navigate = useNavigate();

  return (
    <Layout currentPageName="NightMode">
      <div className="night-page">
        <header className="night-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1>Night Shift Mode</h1>
            <p>Enhanced protection for late hours</p>
          </div>
        </header>

        <div className="night-info-card">
          <div className="night-info-head">
            <div className="night-icon">
              <Moon />
            </div>
            <div>
              <h3>What is Night Mode?</h3>
              <p>Extra safety for late shifts</p>
            </div>
          </div>
          <p className="night-desc">
            Night Mode provides continuous safety monitoring with more frequent check-ins (every 5 minutes).
            If you don’t respond, your guardians and emergency services will be automatically notified.
          </p>
        </div>

        <div className="night-list">
          <div className="night-row"><Clock /> Safety check every 5 minutes</div>
          <div className="night-row"><Users /> 2 guardian(s) will be notified</div>
          <div className="night-row"><Shield /> Auto-SOS if no response</div>
          <div className="night-row"><MapPin /> Continuous location sharing</div>
        </div>

        <div className="night-input">
          <label>Work Location (Optional)</label>
          <input placeholder="Enter your work address" />
        </div>

        <button className="night-btn">
          <Moon size={18} /> Activate Night Mode
        </button>
      </div>
    </Layout>
  );
}
