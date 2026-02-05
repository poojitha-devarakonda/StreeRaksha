import Layout from '../components/Layout';
import { ArrowLeft, Wind, Smile, Heart, Sun, Music, Play } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Wellness.css';

export default function Wellness() {
  const navigate = useNavigate();

  return (
    <Layout currentPageName="Wellness">
      <div className="wellness-page">

        <header className="wellness-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1>Wellness Hub</h1>
            <p>Nurture your mind and soul</p>
          </div>
        </header>

        {/* Affirmation */}
        <div className="affirmation-card">
          <div className="affirmation-title">
            ✨ Daily Affirmation
          </div>
          <p>"You have the power to create positive change."</p>
        </div>

        {/* Quick Activities */}
        <h3 className="section-title">Quick Activities</h3>
        <div className="quick-activities">
          <div className="activity-card mint">
            <Wind />
            <span>Breathe</span>
          </div>
          <div className="activity-card yellow">
            <Smile />
            <span>Affirmations</span>
          </div>
          <div className="activity-card pink">
            <Heart />
            <span>Gratitude</span>
          </div>
          <div className="activity-card peach">
            <Sun />
            <span>Meditate</span>
          </div>
        </div>

        {/* Wellness Tools */}
            <h3 className="section-title">Wellness Tools</h3>

            <div
            className="tool-card pink-tool"
            onClick={() => navigate('/journal')}
            >
            <div>
                <strong>Personal Journal</strong>
                <p>Express your thoughts and feelings</p>
            </div>
            </div>

            <div
            className="tool-card violet-tool"
            onClick={() => navigate('/ai-companion')}
            >
            <div>
                <strong>AI Companion</strong>
                <p>Talk to your supportive AI friend</p>
            </div>
            </div>

        {/* Recommended */}
        <h3 className="section-title">
          Recommended for You <Music size={18} />
        </h3>

        <div className="music-grid">
          <div className="music-card teal">
            <div>
              <strong>Calm & Peaceful</strong>
              <span>24 tracks</span>
            </div>
            <Play />
          </div>

          <div className="music-card violet">
            <div>
              <strong>Empowerment Anthems</strong>
              <span>32 tracks</span>
            </div>
            <Play />
          </div>

          <div className="music-card blue">
            <div>
              <strong>Gentle Sleep</strong>
              <span>18 tracks</span>
            </div>
            <Play />
          </div>

          <div className="music-card orange">
            <div>
              <strong>Morning Energy</strong>
              <span>20 tracks</span>
            </div>
            <Play />
          </div>
        </div>

      </div>
    </Layout>
  );
}
