import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { 
  ArrowLeft, Wind, Smile, Heart, Sun, Music, BookOpen, MessageCircle, 
  Moon, Zap, Star, Play, Coffee, Headphones, Volume2
} from "lucide-react";
import ReactAudioPlayer from "react-audio-player";
import "./Wellness.css";

// ------------------- AudioPlayer Component -------------------
function AudioPlayer({ track }) {
  // Construct the full audio URL
  const audioUrl = `http://localhost:5050${track.audioUrl}`;
  
  return (
    <div className="audio-player-wrapper">
      <ReactAudioPlayer
        src={audioUrl}
        controls
        autoPlay={false}
        preload="metadata"
        className="custom-audio-player"
      />
    </div>
  );
}

// Map display categories to API categories
const categoryData = [
  { 
    displayName: "Calm & Peaceful", 
    apiCategory: "Calm",
    icon: Wind,
    colorClass: "calm",
    description: "Soothing sounds for relaxation"
  },
  { 
    displayName: "Empowerment Anthems", 
    apiCategory: "Motivational",
    icon: Zap,
    colorClass: "empowerment",
    description: "Uplifting tracks to boost confidence"
  },
  { 
    displayName: "Morning Energy", 
    apiCategory: "Happy",
    icon: Coffee,
    colorClass: "morning",
    description: "Start your day with positivity"
  },
  { 
    displayName: "Gentle Sleep", 
    apiCategory: "Sleep",
    icon: Moon,
    colorClass: "sleep",
    description: "Peaceful melodies for deep sleep"
  },
];

// ------------------- Wellness Page -------------------
export default function Wellness() {
  const navigate = useNavigate();
  const [tracks, setTracks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(categoryData[0]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [nowPlaying, setNowPlaying] = useState(null);

  // Fetch tracks for selected category
  useEffect(() => {
    fetchTracks(selectedCategory.apiCategory);
  }, [selectedCategory]);

  const fetchTracks = async (apiCategory) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:5050/api/playlists/${apiCategory}`);
      if (!response.ok) throw new Error("Failed to fetch tracks");
      const data = await response.json();
      setTracks(data);
    } catch (err) {
      console.error("Error fetching tracks:", err);
      setError("Could not load tracks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handlePlayTrack = (track) => {
    setNowPlaying(track);
  };

  return (
    <Layout currentPageName="Wellness">
      <div className="wellness-page">
        {/* Header */}
        <header className="wellness-header">
          <button className="back-btn" onClick={() => navigate("/")}>
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1>Wellness Hub</h1>
            <p className="header-subtitle">Nurture your mind and soul</p>
          </div>
        </header>

        {/* Daily Affirmation */}
        <div className="affirmation-card">
          <div className="affirmation-title">✨ Daily Affirmation</div>
          <p className="affirmation-text">"You have the power to create positive change."</p>
        </div>

        {/* Quick Activities */}
        <h3 className="section-title">Quick Activities</h3>
        <div className="quick-activities">
          <div className="activity-card mint">
            <Wind size={28} />
            <span>Breathe</span>
          </div>
          <div className="activity-card yellow">
            <Smile size={28} />
            <span>Affirmations</span>
          </div>
          <div className="activity-card pink">
            <Heart size={28} />
            <span>Gratitude</span>
          </div>
          <div className="activity-card peach">
            <Sun size={28} />
            <span>Meditate</span>
          </div>
        </div>

        {/* Wellness Tools */}
        <h3 className="section-title">Wellness Tools</h3>
        <div
          className="tool-card pink-tool"
          onClick={() => navigate("/journal")}
        >
          <div className="tool-card-content">
            <BookOpen size={28} />
            <div className="tool-text">
              <strong>Personal Journal</strong>
              <p>Express your thoughts and feelings</p>
            </div>
          </div>
        </div>

        <div
          className="tool-card violet-tool"
          onClick={() => navigate("/ai-companion")}
        >
          <div className="tool-card-content">
            <MessageCircle size={28} />
            <div className="tool-text">
              <strong>AI Companion</strong>
              <p>Talk to your supportive AI friend</p>
            </div>
          </div>
        </div>

        {/* Recommended for You - Category Cards */}
        <h3 className="section-title">
          <Music size={20} />
          Recommended for You
        </h3>
        
        {/* Category Cards */}
        <div className="category-cards">
          {categoryData.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory.apiCategory === category.apiCategory;
            
            return (
              <div
                key={category.apiCategory}
                className={`category-card ${category.colorClass} ${isSelected ? 'selected' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                <div className="category-card-content">
                  <div className="category-icon">
                    <Icon size={24} />
                  </div>
                  <div className="category-info">
                    <span className="category-name">{category.displayName}</span>
                    <span className="category-description">{category.description}</span>
                  </div>
                  <div className="category-arrow">
                    <Play size={16} />
                  </div>
                </div>
                {!loading && tracks.length > 0 && isSelected && (
                  <div className="category-tracks-count">
                    {tracks.length} tracks
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Currently Playing Bar */}
        {nowPlaying && (
          <div className="now-playing-bar">
            <div className="now-playing-info">
              <Volume2 size={20} className="playing-icon" />
              <div className="now-playing-text">
                <span className="now-playing-title">Now Playing:</span>
                <strong>{nowPlaying.title}</strong>
              </div>
            </div>
            <button className="close-now-playing" onClick={() => setNowPlaying(null)}>×</button>
          </div>
        )}

        {/* Tracks for selected category */}
        <div className="tracks-section">
          <div className="tracks-header">
            <h4 className="sub-section-title">{selectedCategory.displayName}</h4>
            <span className="track-count">{tracks.length} songs</span>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <p>Loading tracks...</p>
            </div>
          ) : error ? (
            <div className="error-container">
              <p className="error-message">{error}</p>
              <button 
                className="retry-button"
                onClick={() => fetchTracks(selectedCategory.apiCategory)}
              >
                Try Again
              </button>
            </div>
          ) : tracks.length === 0 ? (
            <div className="empty-state">
              <Headphones size={48} className="empty-icon" />
              <p className="empty-message">No tracks available for this category</p>
              <p className="empty-submessage">Check back later for new music</p>
            </div>
          ) : (
            <div className="tracks-container">
              {tracks.map((track, index) => (
                <div className="track-card" key={track._id || index}>
                  <div className="track-info">
                    <div className="track-number">{index + 1}</div>
                    <div 
                      className="track-icon"
                      style={{ backgroundColor: getCategoryColor(selectedCategory.apiCategory) }}
                    >
                      {React.createElement(selectedCategory.icon, { size: 20, color: "white" })}
                    </div>
                    <div className="track-details">
                      <strong className="track-title">{track.title}</strong>
                      <div className="track-meta">
                        {track.artist && <span className="track-artist">{track.artist}</span>}
                        <span className="track-duration">{track.duration || "3:30"}</span>
                      </div>
                    </div>
                    <button 
                      className="play-track-btn"
                      onClick={() => handlePlayTrack(track)}
                    >
                      <Play size={18} />
                    </button>
                  </div>
                  <div className="track-player">
                    <AudioPlayer track={track} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}

// Helper function for category colors
function getCategoryColor(apiCategory) {
  const colors = {
    "Calm": "#2bb0a1",
    "Motivational": "#f97316",
    "Happy": "#fbbf24",
    "Sleep": "#8b5cf6"
  };
  return colors[apiCategory] || "#4caf50";
}