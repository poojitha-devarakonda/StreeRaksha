// SosButton.jsx

import { useState } from "react";
import { AlertTriangle, Check, X } from "lucide-react";
import "./SosButton.css";

export default function SOSButton() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="sos-wrap">
        <div className="sos-glow-wrap">
          <div className="sos-glow"></div>

          <div
            className="sos-btn"
            onClick={async () => {
              try {
                const position = await new Promise((resolve, reject) => {
                  if (!navigator.geolocation) {
                    reject(new Error("Geolocation not supported"));
                  } else {
                    navigator.geolocation.getCurrentPosition(resolve, reject);
                  }
                });

                const { latitude, longitude } = position.coords;

                await fetch("http://localhost:5050/api/guardian/sos", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    location: `https://www.google.com/maps?q=${latitude},${longitude}`,
                  }),
                });

                setShowModal(true);
              } catch (err) {
                console.error("SOS trigger failed:", err);
                alert("Failed to send SOS alert");
              }
            }}
          >
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
              Your emergency contacts and guardians are being notified with your
              live location.
            </p>

            <div className="sos-status success">
              <Check /> Location shared
            </div>

            <div className="sos-status success">
              <Check /> Guardian(s) notified
            </div>

            <button
              className="sos-cancel"
              onClick={() => setShowModal(false)}
            >
              <X size={16} /> Cancel Alert (False Alarm)
            </button>
          </div>
        </div>
      )}
    </>
  );
}