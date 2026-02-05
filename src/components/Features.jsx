// Features.jsx
import { BookOpen, MessageCircle, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './Features.css';

export default function Features() {
  const navigate = useNavigate();

  const items = [
    { icon: BookOpen, title: 'Personal Journal', desc: 'Express your thoughts safely', color: 'pink', path: '/journal' },
    { icon: MessageCircle, title: 'AI Companion', desc: 'Talk to your supportive AI friend', color: 'violet', path: '/ai-companion' },
    { icon: Heart, title: 'Wellness Hub', desc: 'Music, meditation & self-care', color: 'teal', path: '/wellness' },
  ];

  return (
    <div className="features">
      <h3>Features</h3>

      {items.map((item) => {
        const Icon = item.icon;

        return (
          <div
            className="feature-card"
            key={item.title}
            onClick={() => navigate(item.path)}
            style={{ cursor: 'pointer' }}
          >
            <div className={`feature-icon ${item.color}`}>
              <Icon size={20} color="white"/>
            </div>

            <div className="feature-text">
              <div className="feature-title">{item.title}</div>
              <div className="feature-desc">{item.desc}</div>
            </div>

            <span className="chev">›</span>
          </div>
        );
      })}
    </div>
  );
}
