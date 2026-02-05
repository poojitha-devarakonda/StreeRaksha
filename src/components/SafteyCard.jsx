import { Shield } from 'lucide-react';
import './SafteyCard.css';

export default function SafetyCard() {
  return (
    <div className="safety-card">
      <div className="safety-left">
        <div className="safety-icon">
          <Shield size={20} />
        </div>
        <div>
          <div className="safety-label">Safety Status</div>
          <div className="safety-title">Protected & Secure</div>
          <div className="safety-sub">2 guardians linked</div>
        </div>
      </div>

      <div className="safety-right">
        <span className="dot" />
        Active
      </div>
    </div>
  );
}
