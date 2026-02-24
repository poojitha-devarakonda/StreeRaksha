// src/pages/StartTrip.jsx
import { useState, useRef } from "react";
import Layout from '../components/Layout';
import { ArrowLeft, MapPin, Send, Clock, Shield, Moon, Users } from 'lucide-react';
import './StartTrip.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const GEOAPIFY_KEY = process.env.REACT_APP_GEOAPIFY_KEY;

export default function StartTrip() {
  const navigate = useNavigate();

  const [startLocation, setStartLocation] = useState("");
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState(30);
  const [interval, setInterval] = useState(15);
  const [nightMode, setNightMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [activeTripId, setActiveTripId] = useState(null);
  const [tracking, setTracking] = useState(false);

  const [startSuggestions, setStartSuggestions] = useState([]);
  const [destSuggestions, setDestSuggestions] = useState([]);

  const watchIdRef = useRef(null);
  const safetyTimerRef = useRef(null);
  const endTimerRef = useRef(null);

  // --- Geoapify Autocomplete ---
  const fetchSuggestions = async (text) => {
    if (!text || text.length < 3) return [];
    const url = `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(text)}&limit=5&apiKey=${GEOAPIFY_KEY}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.features || [];
  };

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

  // --- Safety Checks (Night Mode affects interval) ---
  const startSafetyChecks = () => {
    const effectiveInterval = nightMode ? 5 : interval;
    const intervalMs = Number(effectiveInterval) * 60 * 1000;

    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      clearInterval(safetyTimerRef.current);
      safetyTimerRef.current = null;
    }

    safetyTimerRef.current = setTimeout(() => {
      const askSafety = async () => {
  const isSafe = window.confirm("Safety check: Are you safe right now?");
  if (!isSafe) {
    alert("We will alert your guardians. Stay safe.");

    try {
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;

      await axios.post("http://localhost:5050/api/guardian/sos", {
        location: `https://www.google.com/maps?q=${latitude},${longitude}`,
      });

      console.log("Guardian notified via email");
    } catch (err) {
      console.error("Failed to notify guardian", err);
    }
  }
};

      askSafety();
      safetyTimerRef.current = setInterval(askSafety, intervalMs);
    }, intervalMs);
  };

  const stopSafetyChecks = () => {
    if (safetyTimerRef.current) {
      clearTimeout(safetyTimerRef.current);
      clearInterval(safetyTimerRef.current);
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
            min="5"
            max="60"
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
          />

          <div className="slider-labels">
            <span>5 min</span>
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
      </div>
    </Layout>
  );
}
