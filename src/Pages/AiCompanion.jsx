import { ArrowLeft, Send, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './AiCompanion.css';

export default function AICompanion() {
  const navigate = useNavigate();

  return (
    <Layout currentPageName="AI Companion">
      <div className="ai-page">
        <header className="ai-header">
          <button className="back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft />
          </button>
          <div className="ai-title">
            <div className="ai-icon">
              <Heart />
            </div>
            <div>
              <h1>AI Companion</h1>
              <p>Here to listen and support you</p>
            </div>
          </div>
        </header>

        <div className="ai-welcome">
          <div className="ai-avatar">
            <Heart size={28} />
          </div>
          <h2>Hi there! 💜</h2>
          <p>
            I'm your AI companion. I'm here to listen, support, and help you feel better.
            How can I help you today?
          </p>

          <div className="ai-suggestions">
            <button>I'm feeling anxious right now</button>
            <button>Can you help me calm down?</button>
            <button>I need someone to talk to</button>
            <button>Share a positive affirmation</button>
          </div>
        </div>

        <div className="ai-input-bar">
          <input placeholder="Type a message..." />
          <button className="send-btn">
            <Send size={18} />
          </button>
        </div>
      </div>
    </Layout>
  );
}
