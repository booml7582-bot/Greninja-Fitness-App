import React, { useState } from 'react';
import { User, Edit3, Zap, Shield, Target, TrendingUp } from 'lucide-react';

const CharacterTab = ({ character, onUpdateName, onUpdatePassword, darkMode }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newName, setNewName] = useState(character.name);
  const [newPassword, setNewPassword] = useState(character.password);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      onUpdateName(newName.trim());
      setIsEditingName(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (newPassword.trim()) {
      onUpdatePassword(newPassword.trim());
      setIsEditingPassword(false);
    }
  };

  const calculateExperienceProgress = (experience, experienceToNext) => {
    if (experienceToNext <= experience) return 0;
    const experienceInCurrentLevel = experience % experienceToNext;
    return (experienceInCurrentLevel / experienceToNext) * 100;
  };

  const level = character.level || 1;
  const experienceToNext = character.experienceToNext || 100;
  const experienceProgress = calculateExperienceProgress(character.experience, experienceToNext);

  const calculateStatPercentage = (current, max) => {
    return Math.min((current / max) * 100, 100);
  };

  return (
    <div className="character-tab">
      {/* Profile Card */}
      <div className="profile-card">
        <div className="profile-content">
          <div className="profile-avatar">
            <img 
              src={require('../media/AshGreninja.png')} 
              alt="Ash Greninja" 
              style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '50%',
                objectFit: 'cover'
              }} 
            />
          </div>
          <div className="profile-info">
            <div className="profile-name">{character.name}</div>
            <div className="profile-badges">
              <span className="profile-badge">Level {level}</span>
              <span className="profile-badge">Greninja Trainer</span>
            </div>
            <div className="xp-progress">
              <span className="xp-text">XP: {character.experience}</span>
              <div className="xp-bar-container">
                <div 
                  className="xp-bar-fill" 
                  style={{ width: `${experienceProgress}%` }}
                ></div>
              </div>
              <span className="xp-target">{experienceToNext}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Combat Stats Card */}
      <div className="stats-card">
        <div className="stats-title">Combat Stats</div>
        <div className="stat-row">
          <span className="stat-label">HP</span>
          <div className="stat-bar-container">
            <div 
              className="stat-bar-fill" 
              style={{ width: `${calculateStatPercentage(character.stats.hp, character.maxStats.hp)}%` }}
            ></div>
          </div>
          <span className="stat-value hp">{character.stats.hp}/{character.maxStats.hp}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Attack</span>
          <div className="stat-bar-container">
            <div 
              className="stat-bar-fill" 
              style={{ width: `${calculateStatPercentage(character.stats.attack, character.maxStats.attack)}%` }}
            ></div>
          </div>
          <span className="stat-value">{character.stats.attack}/{character.maxStats.attack}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Defense</span>
          <div className="stat-bar-container">
            <div 
              className="stat-bar-fill" 
              style={{ width: `${calculateStatPercentage(character.stats.defense, character.maxStats.defense)}%` }}
            ></div>
          </div>
          <span className="stat-value">{character.stats.defense}/{character.maxStats.defense}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Speed</span>
          <div className="stat-bar-container">
            <div 
              className="stat-bar-fill" 
              style={{ width: `${calculateStatPercentage(character.stats.speed, character.maxStats.speed)}%` }}
            ></div>
          </div>
          <span className="stat-value">{character.stats.speed}/{character.maxStats.speed}</span>
        </div>
        <div className="stat-row">
          <span className="stat-label">Agility</span>
          <div className="stat-bar-container">
            <div 
              className="stat-bar-fill" 
              style={{ width: `${calculateStatPercentage(character.stats.agility, character.maxStats.agility)}%` }}
            ></div>
          </div>
          <span className="stat-value">{character.stats.agility}/{character.maxStats.agility}</span>
        </div>
      </div>

      {/* Achievements Card */}
      <div className="achievements-card">
        <div className="achievements-title">Achievements</div>
        <div className="achievements-content">
          <div className="achievement-item">
            <div className="achievement-number">{character.completedTasks || 0}</div>
            <div className="achievement-label">Workouts Completed</div>
          </div>
          <div className="achievement-divider"></div>
          <div className="achievement-item">
            <div className="achievement-number">{character.workoutStreak || 0}</div>
            <div className="achievement-label">Day Streak</div>
          </div>
        </div>
      </div>

      {/* Current HP Section */}
      <div className="card">
        <h3>Current HP</h3>
        <div className="stat-row">
          <span className="stat-label">Health Points</span>
          <div className="stat-bar-container">
            <div 
              className="stat-bar-fill" 
              style={{ 
                width: `${calculateStatPercentage(character.stats.hp, character.maxStats.hp)}%`,
                backgroundColor: character.stats.hp < character.maxStats.hp * 0.3 ? '#E53E3E' : 
                               character.stats.hp < character.maxStats.hp * 0.6 ? '#D69E2E' : '#48BB78'
              }}
            ></div>
          </div>
          <span className="stat-value hp">{character.stats.hp}/{character.maxStats.hp}</span>
        </div>
      </div>
    </div>
  );
};

export default CharacterTab;
