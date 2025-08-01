import React from 'react';

const OptionsTab = ({ audioSettings, onUpdateAudioSettings, onResetCharacter, darkMode }) => {
  const handleVolumeChange = (e) => {
    onUpdateAudioSettings({
      ...audioSettings,
      volume: parseFloat(e.target.value)
    });
  };

  const toggleMenuMusic = () => {
    onUpdateAudioSettings({
      ...audioSettings,
      menuMusicEnabled: !audioSettings.menuMusicEnabled
    });
  };

  const toggleBattleMusic = () => {
    onUpdateAudioSettings({
      ...audioSettings,
      battleMusicEnabled: !audioSettings.battleMusicEnabled
    });
  };

  const toggleButtonSound = () => {
    onUpdateAudioSettings({
      ...audioSettings,
      buttonSoundEnabled: !audioSettings.buttonSoundEnabled
    });
  };

  return (
    <div className="card">
      <h2 style={{ color: darkMode ? '#ffffff' : '#333' }}>Options</h2>
      
      <div className="options-grid">
        <div className="option-item">
          <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Audio Settings</h3>
          
                      <div style={{ marginBottom: '20px' }}>
              <label style={{ color: darkMode ? '#ffffff' : '#333' }}>Master Volume: {Math.round(audioSettings.volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={audioSettings.volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>

                      <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: darkMode ? '#ffffff' : '#333' }}>
                <input
                  type="checkbox"
                  checked={audioSettings.menuMusicEnabled}
                  onChange={toggleMenuMusic}
                />
                Menu Music
              </label>
            </div>

                      <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: darkMode ? '#ffffff' : '#333' }}>
                <input
                  type="checkbox"
                  checked={audioSettings.battleMusicEnabled}
                  onChange={toggleBattleMusic}
                />
                Battle Music
              </label>
            </div>

                      <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', color: darkMode ? '#ffffff' : '#333' }}>
                <input
                  type="checkbox"
                  checked={audioSettings.buttonSoundEnabled}
                  onChange={toggleButtonSound}
                />
                Button Sounds
              </label>
            </div>
        </div>

        <div className="option-item">
          <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Character Management</h3>
          
                      <div style={{ marginBottom: '20px' }}>
              <p style={{ color: darkMode ? '#ffffff' : '#333' }}>Reset your character to default stats and progress.</p>
            <button 
              className="btn" 
              onClick={onResetCharacter}
              style={{ backgroundColor: '#ff6b6b' }}
            >
              Reset Character
            </button>
          </div>

                      <div style={{ marginBottom: '20px' }}>
              <p style={{ color: darkMode ? '#ffffff' : '#333' }}>Clear all saved data for all trainers.</p>
            <button 
              className="btn" 
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all saved data? This cannot be undone.')) {
                  localStorage.clear();
                  window.location.reload();
                }
              }}
              style={{ backgroundColor: '#e17055' }}
            >
              Clear All Data
            </button>
          </div>
        </div>

        <div className="option-item">
          <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Game Information</h3>
          
                      <div style={{ marginBottom: '15px' }}>
              <h4 style={{ color: darkMode ? '#ffffff' : '#333' }}>How to Play:</h4>
                          <ul style={{ textAlign: 'left', fontSize: '0.6rem', color: darkMode ? '#ffffff' : '#333' }}>
                <li>Complete tasks to increase your stats</li>
                <li>Battle wild Pokémon to gain experience</li>
                <li>Challenge other trainers in the leaderboard</li>
                <li>Use the eating task to restore HP and PP</li>
              </ul>
          </div>

                      <div style={{ marginBottom: '15px' }}>
              <h4 style={{ color: darkMode ? '#ffffff' : '#333' }}>Tips:</h4>
              <ul style={{ textAlign: 'left', fontSize: '0.6rem', color: darkMode ? '#ffffff' : '#333' }}>
                <li>Train regularly to become stronger</li>
                <li>Manage your HP and PP carefully</li>
                <li>Use items strategically in battle</li>
                <li>Set a password to protect your progress</li>
              </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default OptionsTab; 