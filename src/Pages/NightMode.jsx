import { ArrowLeft, Moon, Clock, Users, Shield, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import './NightMode.css';

import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function NightMode() {
  const navigate = useNavigate();

  // 🔥 STATE
  const [showSafetyPopup, setShowSafetyPopup] = useState(false);

  // 🔥 TIMERS
  const safetyTimerRef = useRef(null);
  const responseTimeoutRef = useRef(null);

  // 🔁 Start 5 min loop
  const startNightChecks = () => {
    const runCheck = () => {
      setShowSafetyPopup(true);

      safetyTimerRef.current = setTimeout(() => {
        runCheck();
      }, 5 * 60 * 1000); // 5 mins
    };

    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
    }

    runCheck();
  };

  // ⏳ Auto SOS if no response in 1 min
  useEffect(() => {
    if (showSafetyPopup) {
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }

      responseTimeoutRef.current = setTimeout(() => {
        handleNotSafe();
      }, 60 * 1000);
    }

    return () => {
      if (responseTimeoutRef.current) {
        clearTimeout(responseTimeoutRef.current);
      }
    };
  }, [showSafetyPopup]);

  // ✅ USER IS SAFE
 const handleSafe = async () => {
  setShowSafetyPopup(false);

  if (responseTimeoutRef.current) {
    clearTimeout(responseTimeoutRef.current);
  }

  try {
   await axios.post("http://localhost:5050/api/night/checkin", {
  userId: "test123"
});

  } catch (err) {
    console.error(err);
  }
};

  // 🚨 NOT SAFE → trigger SOS
  const handleNotSafe = async () => {
    setShowSafetyPopup(false);

    if (responseTimeoutRef.current) {
      clearTimeout(responseTimeoutRef.current);
    }

    alert("Triggering SOS 🚨");

    try {
      const position = await new Promise((res, rej) =>
        navigator.geolocation.getCurrentPosition(res, rej)
      );

      const { latitude, longitude } = position.coords;

      await axios.post("http://localhost:5050/api/guardian/sos", {
        location: `https://www.google.com/maps?q=${latitude},${longitude}`,
      });
    } catch (err) {
      console.error(err);
    }
    
  };
  const stopNightChecks = async () => {
  // stop main loop
  if (safetyTimerRef.current) {
    clearTimeout(safetyTimerRef.current);
    safetyTimerRef.current = null;
  }

  // stop response timer
  if (responseTimeoutRef.current) {
    clearTimeout(responseTimeoutRef.current);
    responseTimeoutRef.current = null;
  }

  setShowSafetyPopup(false);

  try {
    await axios.post("http://localhost:5050/api/night/stop", {
      userId: "test123"
    });
  } catch (err) {
    console.error(err);
  }

  alert("Night Mode Ended 🌙");
};

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

        {/* 🔥 ACTIVATE */}
       <button
        className="night-btn"
        onClick={async () => {
          try {
            await axios.post("http://localhost:5050/api/night/start", {
              userId: "test123"
            });

            startNightChecks(); // your existing popup loop
            alert("Night Mode Activated 🌙");
          } catch (err) {
            console.error(err);
          }

          
        }}
      ><Moon size={18} /> Activate Night Mode</button>
      <button
  className="night-btn"
  style={{ background: "#8B0000", marginTop: "10px" }}
  onClick={stopNightChecks}
>
  End Night Mode
</button>
        {/* 🔴 POPUP */}
        {showSafetyPopup && (
          <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999
          }}>
            <div style={{
              background: "white",
              padding: "20px",
              borderRadius: "10px",
              textAlign: "center"
            }}>
             <h3 style={{ marginBottom: "15px", fontSize: "20px", color: "#000" }}>
                Are you safe?
              </h3>

              <button onClick={handleSafe} style={{ margin: "10px" }}>
                Yes
              </button>

              <button
                onClick={handleNotSafe}
                style={{ margin: "10px", background: "red", color: "white" }}
              >
                No
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}