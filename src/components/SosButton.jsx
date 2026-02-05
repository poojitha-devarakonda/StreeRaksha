// SosButton.jsx


import { useState } from 'react';
import { AlertTriangle, Check, X } from 'lucide-react';
import './SosButton.css';

export default function SOSButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="sos-wrap">
         <div className="sos-glow-wrap">
         <div className="sos-glow"></div>
        <div className="sos-btn" onClick={() => setShowModal(true)}>
          <div className="sos-icon">!</div>
          <div className="sos-text">SOS</div>
          <div className="sos-sub">Hold for 2s</div>
          </div>
        </div>
        <p className="sos-caption">
          Hold for 2 seconds to trigger emergency alert
        </p>
      </div>

      {showModal && (
        <div className="sos-overlay">
          <div className="sos-modal">
            <div className="sos-modal-icon">
              <AlertTriangle size={28} color="#ef4444" />
            </div>

            <h2>SOS Alert Triggered!</h2>
            <p className="sos-modal-desc">
              Your emergency contacts and nearby help are being notified with your live location.
            </p>

            <div className="sos-status success">
              <Check /> Location shared
            </div>

            <div className="sos-status success">
              <Check /> 2 guardian(s) notified
            </div>

            <button className="sos-cancel" onClick={() => setShowModal(false)}>
              <X size={16} /> Cancel Alert (False Alarm)
            </button>
          </div>
        </div>
      )}
    </>
  );
}
