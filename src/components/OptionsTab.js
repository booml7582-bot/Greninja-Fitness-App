import React, { useState } from 'react';
import { User, Volume2, VolumeX, RotateCcw, Edit3, Lock } from 'lucide-react';

const OptionsTab = ({ character, audioSettings, onUpdateAudioSettings, onResetCharacter, onUpdateName, onUpdatePassword, darkMode }) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newName, setNewName] = useState(character.name);
  const [newPassword, setNewPassword] = useState(character.password || '');

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
    <div className="options-tab">
      {/* Profile Card */}
      <div className="card" style={{
        background: '#2D3748',
        border: '1px solid #4A5568',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            width: '60px',
            height: '60px',
            background: '#3182CE',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '24px',
            fontWeight: 'bold',
            overflow: 'hidden'
          }}>
            <img 
              src={require('../media/AshGreninja.png')} 
              alt="Ash Greninja" 
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'cover'
              }} 
            />
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#FFFFFF', fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0' }}>
              {character?.name || 'Ash'}
            </h3>
            <p style={{ color: '#A0AEC0', fontSize: '14px', margin: '0 0 8px 0' }}>
              Greninja Trainer
            </p>
            <span style={{
              background: '#3182CE',
              color: '#FFFFFF',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              Level {character?.level || 1} • Greninja Trainer
            </span>
          </div>
        </div>
      </div>

      {/* Character Management Section */}
      <div className="card" style={{
        background: '#2D3748',
        border: '1px solid #4A5568',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Edit3 size={20} color="#63B3ED" />
          <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', margin: 0 }}>Character Settings</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Name Editing */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500' }}>Character Name</label>
              {!isEditingName && (
                <button
                  onClick={() => setIsEditingName(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#63B3ED',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <Edit3 size={14} />
                </button>
              )}
            </div>
            {isEditingName ? (
              <form onSubmit={handleNameSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #4A5568',
                    background: '#1A202C',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="btn"
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px'
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingName(false);
                    setNewName(character.name);
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    background: '#4A5568',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div style={{ color: '#A0AEC0', fontSize: '14px', padding: '8px 0' }}>
                {character.name}
              </div>
            )}
          </div>

          {/* Password Editing */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <label style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500' }}>Password</label>
              {!isEditingPassword && (
                <button
                  onClick={() => setIsEditingPassword(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#63B3ED',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  <Lock size={14} />
                </button>
              )}
            </div>
            {isEditingPassword ? (
              <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #4A5568',
                    background: '#1A202C',
                    color: '#FFFFFF',
                    fontSize: '14px'
                  }}
                  autoFocus
                />
                <button
                  type="submit"
                  className="btn"
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px'
                  }}
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditingPassword(false);
                    setNewPassword(character.password || '');
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    background: '#4A5568',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <div style={{ color: '#A0AEC0', fontSize: '14px', padding: '8px 0' }}>
                {character.password ? '••••••••' : 'No password set'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Audio Settings Section */}
      <div className="card" style={{
        background: '#2D3748',
        border: '1px solid #4A5568',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Volume2 size={20} color="#63B3ED" />
          <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', margin: 0 }}>Audio Settings</h3>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
              Master Volume: {Math.round(audioSettings.volume * 100)}%
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={audioSettings.volume}
              onChange={handleVolumeChange}
              style={{
                width: '100%',
                height: '8px',
                background: '#4A5568',
                borderRadius: '4px',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                Menu Music
              </div>
              <div style={{ color: '#A0AEC0', fontSize: '14px' }}>
                Background music in menus
              </div>
            </div>
            <div style={{
              width: '44px',
              height: '24px',
              background: audioSettings.menuMusicEnabled ? '#3182CE' : '#4A5568',
              borderRadius: '12px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }} onClick={toggleMenuMusic}>
              <div style={{
                width: '20px',
                height: '20px',
                background: '#FFFFFF',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                left: audioSettings.menuMusicEnabled ? '22px' : '2px',
                transition: 'left 0.2s ease'
              }}></div>
            </div>
            </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                Battle Music
              </div>
              <div style={{ color: '#A0AEC0', fontSize: '14px' }}>
                Music during combat
              </div>
            </div>
            <div style={{
              width: '44px',
              height: '24px',
              background: audioSettings.battleMusicEnabled ? '#3182CE' : '#4A5568',
              borderRadius: '12px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }} onClick={toggleBattleMusic}>
              <div style={{
                width: '20px',
                height: '20px',
                background: '#FFFFFF',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                left: audioSettings.battleMusicEnabled ? '22px' : '2px',
                transition: 'left 0.2s ease'
              }}></div>
            </div>
            </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '500', marginBottom: '4px' }}>
                Button Sounds
              </div>
              <div style={{ color: '#A0AEC0', fontSize: '14px' }}>
                Sound effects for buttons
              </div>
            </div>
            <div style={{
              width: '44px',
              height: '24px',
              background: audioSettings.buttonSoundEnabled ? '#3182CE' : '#4A5568',
              borderRadius: '12px',
              position: 'relative',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease'
            }} onClick={toggleButtonSound}>
              <div style={{
                width: '20px',
                height: '20px',
                background: '#FFFFFF',
                borderRadius: '50%',
                position: 'absolute',
                top: '2px',
                left: audioSettings.buttonSoundEnabled ? '22px' : '2px',
                transition: 'left 0.2s ease'
              }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Character Management Section */}
      <div className="card" style={{
        background: '#2D3748',
        border: '1px solid #4A5568',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <RotateCcw size={20} color="#63B3ED" />
          <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', margin: 0 }}>Character Management</h3>
        </div>

        <div style={{ marginBottom: '16px' }}>
          <p style={{ color: '#A0AEC0', fontSize: '14px', marginBottom: '16px' }}>
            Reset your character to default stats and progress.
          </p>
            <button 
              className="btn" 
              onClick={onResetCharacter}
            style={{ 
              background: '#E53E3E',
              color: '#FFFFFF',
              padding: '12px 24px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            >
              Reset Character
            </button>
        </div>
      </div>
    </div>
  );
};

export default OptionsTab; 