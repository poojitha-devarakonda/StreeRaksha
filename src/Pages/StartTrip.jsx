// src/pages/StartTrip.jsx
import { useState, useRef } from "react";
import Layout from '../components/Layout';
import { ArrowLeft, MapPin, Send, Clock, Shield, Moon, Users } from 'lucide-react';
import './StartTrip.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { useEffect } from "react";
const GEOAPIFY_KEY = process.env.REACT_APP_GEOAPIFY_KEY;

export default function StartTrip() {
  const navigate = useNavigate();
  const [showSafetyPopup, setShowSafetyPopup] = useState(false);
  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(30);
  const [interval, setInterval] = useState(1);
  const [nightMode, setNightMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [activeTripId, setActiveTripId] = useState(null);
  const [tracking, setTracking] = useState(false);

  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const watchIdRef = useRef(null);
  const safetyTimerRef = useRef(null);
  const endTimerRef = useRef(null);
const responseTimeoutRef = useRef(null);
const popupOpenRef = useRef(false);
  // --- Geoapify Autocomplete ---
  const fetchSuggestions = async (text) => {
    if (!text || text.length < 3) return [];
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&limit=5&apiKey=${GEOAPIFY_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.features || [];
  };
  useEffect(() => {
  if (showSafetyPopup) {
    // clear any existing timeout first
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
      responseTimeoutRef.current = null;
    }
  };
}, [showSafetyPopup]);
useEffect(() => {
  popupOpenRef.current = showSafetyPopup;
}, [showSafetyPopup]);

  // --- Use GPS (reverse geocode with Geoapify) ---
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      const { latitude, longitude } = pos.coords;

      const url = `https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=${GEOAPIFY_KEY}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.features?.[0]) {
        setStartLocation(data.features[0].properties.formatted);
      } else {
        setStartLocation(`Lat: ${latitude.toFixed(5)}, Lng: ${longitude.toFixed(5)}`);
      }
    });
  };

  // --- Live GPS Tracking ---
  const startLiveTracking = (tripId) => {
    if (!navigator.geolocation) return;

    watchIdRef.current = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await axios.post("http://localhost:5050/api/trips/location", {
            tripId,
            lat: latitude,
            lng: longitude,
          });
        } catch (err) {
          console.error("Failed to send location", err);
        }
      },
      (error) => console.warn("GPS warning:", error.message),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );
  };

  const stopLiveTracking = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setTracking(false);
    }
  };
// --- Safety Checks ---
// --- Safety Checks ---
const startSafetyChecks = () => {
  const runCheck = () => {
    setShowSafetyPopup(true);

    safetyTimerRef.current = setTimeout(() => {
      runCheck(); // 🔁 loop again after interval
    }, Number(interval) * 60 * 1000);
  };

  // clear any existing timer
  if (safetyTimerRef.current) {
    clearTimeout(safetyTimerRef.current);
  }

  runCheck(); // start immediately
};
  const stopSafetyChecks = () => {
  if (safetyTimerRef.current) {
    clearTimeout(safetyTimerRef.current);
    safetyTimerRef.current = null;
  }
};

  // --- Estimated Duration Timer ---
  const startEndTimer = () => {
    if (endTimerRef.current) clearTimeout(endTimerRef.current);

    const durationMs = Number(duration) * 60 * 1000;
    endTimerRef.current = setTimeout(() => {
      alert("Estimated trip time is over. Did you reach safely?");
    }, durationMs);
  };

  const stopEndTimer = () => {
    if (endTimerRef.current) {
      clearTimeout(endTimerRef.current);
      endTimerRef.current = null;
    }
  };
const handleSafe = () => {
  setShowSafetyPopup(false);

  if (responseTimeoutRef.current) {
    clearTimeout(responseTimeoutRef.current);
    responseTimeoutRef.current = null;
  }
};
const handleNotSafe = async () => {
  setShowSafetyPopup(false);
  popupOpenRef.current = false;

  if (responseTimeoutRef.current) {
    clearTimeout(responseTimeoutRef.current);
    responseTimeoutRef.current = null;
  }

  clearInterval(safetyTimerRef.current);
  safetyTimerRef.current = null;

  alert("We will alert your guardians.");


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
  // --- Start Trip ---
  const handleStartTrip = async () => {
    if (tracking) return;
    if (!startLocation || !destination) {
      alert("Please enter both starting point and destination.");
      return;
    }

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5050/api/trips/start", {
        startLocation,
        destination,
        estimatedDuration: Number(duration),
        checkInterval: Number(interval),
        nightMode,
      });

      const tripId = res.data.trip.id;
      setActiveTripId(tripId);
      setTracking(true);

      startLiveTracking(tripId);
      startSafetyChecks();
      startEndTimer();

      alert("Trip started. Live tracking and safety checks enabled!");
    } catch (e) {
      alert("Failed to start trip");
    } finally {
      setLoading(false);
    }
  };

  const handleEndTrip = () => {
    stopLiveTracking();
    stopSafetyChecks();
    stopEndTimer();
    setActiveTripId(null);
    alert("Trip ended safely.");
  };

  return (
    <Layout currentPageName="StartTrip">
      <div className="trip-page">
        <header className="trip-header">
          <button className="back-btn" onClick={() => navigate('/')}>
            <ArrowLeft size={22} />
          </button>
          <div>
            <h1>Start Safe Trip</h1>
            <p>We'll watch over your journey</p>
            {tracking && <p style={{ color: "#22c55e", fontWeight: 600 }}>● Live tracking active</p>}
          </div>
        </header>

        <div className="trip-card">
          <div className="input-group">
            <label>Starting Point</label>
            <div className="input-row">
              <MapPin className="green" />
              <input
                placeholder="Enter your current location"
                value={startLocation}
                onChange={async (e) => {
                  const val = e.target.value;
                  setStartLocation(val);
                  setStartSuggestions(await fetchSuggestions(val));
                }}
              />
              <button className="gps" type="button" onClick={handleUseGPS}>
                Use GPS
              </button>
            </div>

            {startSuggestions.map((s) => (
              <div
                key={s.properties.place_id}
                className="suggestion-item"
                onClick={() => {
                  setStartLocation(s.properties.formatted);
                  setStartSuggestions([]);
                }}
              >
                {s.properties.formatted}
              </div>
            ))}
          </div>

          <div className="divider" />

          <div className="input-group">
            <label>Destination</label>
            <div className="input-row">
              <Send className="red" />
              <input
                placeholder="Where are you going?"
                value={destination}
                onChange={async (e) => {
                  const val = e.target.value;
                  setDestination(val);
                  setDestSuggestions(await fetchSuggestions(val));
                }}
              />
            </div>

            {destSuggestions.map((s) => (
              <div
                key={s.properties.place_id}
                className="suggestion-item"
                onClick={() => {
                  setDestination(s.properties.formatted);
                  setDestSuggestions([]);
                }}
              >
                {s.properties.formatted}
              </div>
            ))}
          </div>
        </div>

        {/* Timers, Night Mode, Guardians UI remain unchanged */}
                {/* Estimated Duration */}
        <div className="trip-card">
          <div className="slider-header">
            <Clock className="blue" />
            <div>
              <strong>Estimated Duration</strong>
              <p>How long will your trip take?</p>
            </div>
            <span className="time">{duration}m</span>
          </div>

          <input
            type="range"
            min="10"
            max="180"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />

          <div className="slider-labels">
            <span>10 min</span>
            <span>3 hours</span>
          </div>
        </div>

        {/* Safety Interval */}
        <div className="trip-card">
          <div className="slider-header">
            <Shield className="violet" />
            <div>
              <strong>Safety Check Interval</strong>
              <p>We'll ask if you're safe</p>
            </div>
            <span className="time">{interval}m</span>
          </div>

          <input
            type="range"
            min="1"
            max="60"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
          />

          <div className="slider-labels">
            <span>1 min</span>
            <span>60 min</span>
          </div>
        </div>

        {/* Night Mode */}
        <div className="night-card">
          <Moon />
          <div>
            <strong>Night Shift Mode</strong>
            <p>More frequent checks (every 5 min)</p>
          </div>

          <label className="switch">
            <input
              type="checkbox"
              checked={nightMode}
              onChange={(e) => setNightMode(e.target.checked)}
            />
            <span className="slider" />
          </label>
        </div>

        {/* Guardians */}
        <div className="trip-card">
          <div className="notify">
            <Users className="red" />
            <div>
              <strong>2 Guardians will be notified</strong>
              <p>They'll receive your trip details</p>
            </div>
          </div>
        </div>


        {!tracking ? (
          <button className="start-btn" onClick={handleStartTrip} disabled={loading}>
            {loading ? "Starting..." : "Start Safe Trip"}
          </button>
        ) : (
          <button className="start-btn" style={{ background: "#ef4444" }} onClick={handleEndTrip}>
            End Trip
          </button>
        )}
        {showSafetyPopup === true && (
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
      <h3>Are you safe?</h3>

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
