import React, { useState } from 'react';
import AshGreninjaImage from '../media/AshGreninja.png';

const CharacterTab = ({ character, onUpdateName, onUpdatePassword, darkMode }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(character.name);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [tempPassword, setTempPassword] = useState(character.password);

  const handleNameSave = () => {
    if (tempName.trim()) {
      onUpdateName(tempName.trim());
      setIsEditingName(false);
    }
  };

  const handleNameCancel = () => {
    setTempName(character.name);
    setIsEditingName(false);
  };

  const handlePasswordSave = () => {
    onUpdatePassword(tempPassword);
    setIsEditingPassword(false);
  };

  const handlePasswordCancel = () => {
    setTempPassword(character.password);
    setIsEditingPassword(false);
  };

  const getTypeColor = (type) => {
    const colors = {
      'Water': '#74b9ff',
      'Fire': '#ff6b6b',
      'Electric': '#fdcb6e',
      'Normal': '#a8a8a8',
      'Flying': '#87ceeb',
      'Psychic': '#fd79a8',
      'Dark': '#2d3436',
      'Ghost': '#a29bfe'
    };
    return colors[type] || '#667eea';
  };

  // Calculate pentagon points for stats visualization
  const calculatePentagonPoints = () => {
    const centerX = 150;
    const centerY = 150;
    const radius = 100;
    const stats = ['attack', 'defense', 'speed', 'hp', 'agility'];
    const maxStats = character.maxStats;
    
    const points = stats.map((stat, index) => {
      const angle = (index * 72 - 90) * (Math.PI / 180); // 72 degrees per point, start from top
      const statValue = character.stats[stat];
      const maxValue = maxStats[stat];
      const currentRadius = (statValue / maxValue) * radius;
      
      const x = centerX + currentRadius * Math.cos(angle);
      const y = centerY + currentRadius * Math.sin(angle);
      
      return { x, y, stat, value: statValue, maxValue };
    });

    // Create polygon points string
    const polygonPoints = points.map(point => `${point.x},${point.y}`).join(' ');
    
    return { points, polygonPoints };
  };

  const { points, polygonPoints } = calculatePentagonPoints();

  return (
    <div className="card">
      <h2>Character Stats</h2>
      
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div className="character-avatar">
          <img 
            src={AshGreninjaImage} 
            alt="Character" 
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'contain',
              borderRadius: '50%'
            }}
          />
        </div>
        
        <div style={{ marginTop: '15px' }}>
          {isEditingName ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                style={{
                  background: 'white',
                  color: '#333',
                  border: '2px solid #667eea',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  fontFamily: 'VT323, monospace',
                  fontSize: '1rem'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleNameSave()}
                autoFocus
              />
              <button className="btn" onClick={handleNameSave} style={{ fontSize: '0.6rem', padding: '5px 10px' }}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={handleNameCancel} style={{ fontSize: '0.6rem', padding: '5px 10px' }}>
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <h3 style={{ margin: 0, color: darkMode ? '#ffffff' : '#333' }}>{character.name}</h3>
              <button 
                onClick={() => setIsEditingName(true)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  color: darkMode ? '#ffffff' : '#667eea'
                }}
              >
                ✏️
              </button>
            </div>
          )}
        </div>

        <div style={{ marginTop: '10px' }}>
          {isEditingPassword ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <input
                type="password"
                value={tempPassword}
                onChange={(e) => setTempPassword(e.target.value)}
                placeholder="Enter password (optional)"
                style={{
                  background: 'white',
                  color: '#333',
                  border: '2px solid #667eea',
                  borderRadius: '5px',
                  padding: '5px 10px',
                  fontFamily: 'VT323, monospace',
                  fontSize: '0.9rem'
                }}
                onKeyPress={(e) => e.key === 'Enter' && handlePasswordSave()}
                autoFocus
              />
              <button className="btn" onClick={handlePasswordSave} style={{ fontSize: '0.6rem', padding: '5px 10px' }}>
                Save
              </button>
              <button className="btn btn-secondary" onClick={handlePasswordCancel} style={{ fontSize: '0.6rem', padding: '5px 10px' }}>
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
              <span style={{ fontSize: '0.7rem', color: darkMode ? '#ffffff' : (character.password ? '#00b894' : '#666') }}>
                {character.password ? '🔒 Password Protected' : '🔓 No Password'}
              </span>
              <button 
                onClick={() => setIsEditingPassword(true)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  cursor: 'pointer',
                  fontSize: '0.8rem',
                  color: darkMode ? '#ffffff' : '#667eea'
                }}
              >
                {character.password ? '✏️' : '➕'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
        <div>
          <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Level & Experience</h3>
          <div style={{ marginBottom: '15px' }}>
            <span className="level-badge">Level {character.level}</span>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(character.experience / character.experienceToNext) * 100}%` }}
            ></div>
          </div>
          <p style={{ fontSize: '0.7rem', marginTop: '5px', color: darkMode ? '#ffffff' : '#333' }}>
            {character.experience} / {character.experienceToNext} XP
          </p>
        </div>

        <div>
          <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Current HP</h3>
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${(character.currentHp / character.stats.hp) * 100}%` }}
            ></div>
          </div>
          <p style={{ fontSize: '0.7rem', marginTop: '5px', color: darkMode ? '#ffffff' : '#333' }}>
            {character.currentHp} / {character.stats.hp} HP
          </p>
        </div>
      </div>

      {/* Stats Pentagon */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Stats Overview</h3>
        <div className="stats-pentagon">
          <svg width="300" height="300" viewBox="0 0 300 300">
            {/* Background pentagon */}
            <polygon
              points="150,50 218,118 200,200 100,200 82,118"
              fill="none"
              stroke={darkMode ? "#ffffff" : "#ddd"}
              strokeWidth="2"
            />
            
            {/* Stats pentagon */}
            <polygon
              points={polygonPoints}
              fill="rgba(116, 185, 255, 0.3)"
              stroke="#74b9ff"
              strokeWidth="2"
            />
            
            {/* Stat labels and values */}
            {points.map((point, index) => (
              <g key={point.stat}>
                <text
                  x={point.x}
                  y={point.y - 10}
                  className="stat-label"
                  fill={darkMode ? "#ffffff" : "#333"}
                >
                  {point.stat.toUpperCase()}
                </text>
                <text
                  x={point.x}
                  y={point.y + 5}
                  className="stat-value"
                  fill={darkMode ? "#ffffff" : "#666"}
                >
                  {point.value}/{point.maxValue}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </div>

      {/* Individual Stats */}
      <div style={{ marginBottom: '30px' }}>
        <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Detailed Stats</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {Object.entries(character.stats).map(([stat, value]) => (
            <div key={stat} style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '15px', 
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ 
                  textTransform: 'capitalize', 
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  color: darkMode ? '#ffffff' : '#333'
                }}>
                  {stat}
                </span>
                <span style={{ 
                  fontSize: '0.8rem',
                  color: '#00b894'
                }}>
                  {value} / {character.maxStats[stat]}
                </span>
              </div>
              <div className="stat-bar">
                <div 
                  className="stat-fill"
                  style={{ width: `${(value / character.maxStats[stat]) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Moves */}
      <div>
        <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Moves</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {character.moves.map((move, index) => (
            <div key={index} style={{ 
              background: 'rgba(255, 255, 255, 0.1)', 
              padding: '15px', 
              borderRadius: '10px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ 
                  fontWeight: 'bold',
                  fontSize: '0.8rem',
                  color: darkMode ? '#ffffff' : '#333'
                }}>
                  {move.name}
                </span>
                <span style={{ 
                  padding: '2px 8px',
                  borderRadius: '10px',
                  fontSize: '0.6rem',
                  fontWeight: 'bold',
                  color: 'white',
                  backgroundColor: getTypeColor(move.type)
                }}>
                  {move.type}
                </span>
              </div>
              <p style={{ 
                fontSize: '0.6rem',
                color: darkMode ? '#ffffff' : '#666',
                marginBottom: '8px'
              }}>
                {move.description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: darkMode ? '#ffffff' : '#333' }}>
                <span>Power: {move.power}</span>
                <span>Accuracy: {move.accuracy}%</span>
                <span>PP: {move.pp}/{move.maxPp}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CharacterTab; 