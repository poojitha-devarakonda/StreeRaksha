import { Send, Moon, Users, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './QuickActions.css';

export default function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    { icon: Send, label: 'Start Trip', color: 'violet', to: '/start-trip' },
    { icon: Moon, label: 'Night Mode', color: 'blue', to: '/night-mode' },   // placeholder
    { icon: Users, label: 'Guardians', color: 'red', to: '/guardians' },      // placeholder
    { icon: Heart, label: 'Wellness', color: 'teal', to: '/wellness' },       // placeholder
  ];

  return (
    <div className="quick-actions">
      {actions.map((a) => {
        const Icon = a.icon;

        return (
          <button
            key={a.label}
            type="button"
            className="quick-item"
            onClick={() => navigate(a.to)}
            aria-label={a.label}
          >
            <div className={`quick-icon ${a.color}`}>
              <Icon size={22} />
            </div>
            <span className="quick-label">{a.label}</span>
          </button>
        );
      })}
    </div>
  );
}
