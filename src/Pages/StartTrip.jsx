// src/pages/StartTrip.jsx
import Layout from '../components/Layout';
import { ArrowLeft, MapPin, Send, Clock, Shield, Moon, Users } from 'lucide-react';
import './StartTrip.css';
import { useNavigate } from 'react-router-dom';

export default function StartTrip() {
    const navigate = useNavigate();
  return (
    <Layout currentPageName="StartTrip">
      <div className="trip-page">
        <header className="trip-header">
          <button
            className="back-btn"
            onClick={() => navigate('/')}
            aria-label="Back to Home"
          >
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1>Start Safe Trip</h1>
            <p>We'll watch over your journey</p>
          </div>
        </header>

        <div className="trip-card">
          <div className="input-group">
            <label>Starting Point</label>
            <div className="input-row">
              <MapPin className="green" />
              <input placeholder="Enter your current location" />
              <button className="gps">Use GPS</button>
            </div>
          </div>

          <div className="divider" />

          <div className="input-group">
            <label>Destination</label>
            <div className="input-row">
              <Send className="red" />
              <input placeholder="Where are you going?" />
            </div>
          </div>
        </div>

        <div className="trip-card">
          <div className="slider-header">
            <Clock className="blue" />
            <div>
              <strong>Estimated Duration</strong>
              <p>How long will your trip take?</p>
            </div>
            <span className="time">30m</span>
          </div>
          <input type="range" min="10" max="180" />
          <div className="slider-labels">
            <span>10 min</span>
            <span>3 hours</span>
          </div>
        </div>

        <div className="trip-card">
          <div className="slider-header">
            <Shield className="violet" />
            <div>
              <strong>Safety Check Interval</strong>
              <p>We'll ask if you're safe</p>
            </div>
            <span className="time">15m</span>
          </div>
          <input type="range" min="5" max="60" />
          <div className="slider-labels">
            <span>5 min</span>
            <span>60 min</span>
          </div>
        </div>

        <div className="night-card">
          <Moon />
          <div>
            <strong>Night Shift Mode</strong>
            <p>More frequent checks (every 5 min)</p>
          </div>
          <label className="switch">
            <input type="checkbox" />
            <span className="slider" />
          </label>
        </div>

        <div className="trip-card">
          <div className="notify">
            <Users className="red" />
            <div>
              <strong>2 Guardians will be notified</strong>
              <p>They'll receive your trip details</p>
            </div>
          </div>
        </div>

        <button className="start-btn">Start Safe Trip</button>
      </div>
    </Layout>
  );
}
