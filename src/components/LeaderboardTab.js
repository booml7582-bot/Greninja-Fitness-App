import React, { useState, useEffect } from 'react';
import OpponentGreninjaImage from '../media/OpponentGreninja.png';
import BattleAshGreninjaImage from '../media/BattleAshGreninja.png';
import HitEffectImage from '../media/HitEffect.png';
import BackgroundImage from '../media/Background.jpg';
import { loadAllTrainersData } from '../services/dataService';

const LeaderboardTab = ({ currentTrainer, character, onCombatStart, onCombatEnd, darkMode }) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [combatState, setCombatState] = useState('leaderboard'); // leaderboard, fighting, result
  const [selectedOpponent, setSelectedOpponent] = useState(null);
  const [combatLog, setCombatLog] = useState([]);
  const [playerHp, setPlayerHp] = useState(character.currentHp);
  const [opponentHp, setOpponentHp] = useState(0);
  const [showHitEffect, setShowHitEffect] = useState({ player: false, opponent: false });
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [currentLogMessage, setCurrentLogMessage] = useState('');
  const [combatAction, setCombatAction] = useState('main');

  const trainers = [
    { id: 'ced', name: 'Trainer Ced', avatar: '👨‍🦰' },
    { id: 'naz', name: 'Trainer Naz', avatar: '👩‍🦱' },
    { id: 'theo', name: 'Trainer Theo', avatar: '👨‍🦳' },
    { id: 'krys', name: 'Trainer Krys', avatar: '👩‍🦲' },
    { id: 'jesmer', name: 'Trainer Jesmer', avatar: '👨‍🦱' }
  ];

  useEffect(() => {
    loadLeaderboard();
  }, [character, currentTrainer]); // Reload when character or currentTrainer changes

  // Add a refresh function that can be called manually
  const refreshLeaderboard = () => {
    loadLeaderboard();
  };

  const loadLeaderboard = async () => {
    try {
      // Load all trainers data from cloud
      const allTrainersData = await loadAllTrainersData();
      
      const trainersData = [];
      trainers.forEach(trainer => {
        let trainerCharacter;
        
        // If this is the current trainer, use the current character data
        if (trainer.id === currentTrainer?.id) {
          trainerCharacter = character;
        } else {
          // Load from cloud data for other trainers
          const trainerData = allTrainersData[trainer.id];
          if (trainerData && trainerData.character) {
            trainerCharacter = trainerData.character;
          }
        }
        
        // If no character data found, use default
        if (!trainerCharacter) {
          trainerCharacter = {
            name: 'Ash-Greninja',
            level: 1,
            stats: { attack: 10, defense: 8, speed: 12, hp: 100, agility: 15 }
          };
        }
        
        const totalPower = Object.values(trainerCharacter.stats).reduce((sum, stat) => sum + stat, 0);
        trainersData.push({
          ...trainer,
          character: trainerCharacter,
          totalPower
        });
      });

      // Sort by total power (descending)
      trainersData.sort((a, b) => b.totalPower - a.totalPower);
      setLeaderboard(trainersData);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      // Fallback to local storage method
      const trainersData = [];
      trainers.forEach(trainer => {
        let trainerCharacter;
        
        if (trainer.id === currentTrainer?.id) {
          trainerCharacter = character;
        } else {
          const trainerData = localStorage.getItem(`trainer_${trainer.id}`);
          if (trainerData) {
            const data = JSON.parse(trainerData);
            if (data.character) {
              trainerCharacter = data.character;
            }
          }
        }
        
        if (!trainerCharacter) {
          trainerCharacter = {
            name: 'Ash-Greninja',
            level: 1,
            stats: { attack: 10, defense: 8, speed: 12, hp: 100, agility: 15 }
          };
        }
        
        const totalPower = Object.values(trainerCharacter.stats).reduce((sum, stat) => sum + stat, 0);
        trainersData.push({
          ...trainer,
          character: trainerCharacter,
          totalPower
        });
      });

      trainersData.sort((a, b) => b.totalPower - a.totalPower);
      setLeaderboard(trainersData);
    }
  };

  const startPvPCombat = (opponent) => {
    setSelectedOpponent(opponent);
    setPlayerHp(character.currentHp);
    setOpponentHp(opponent.character.stats.hp);
    setCombatState('fighting');
    setCombatAction('main');
    setCombatLog([`${opponent.name} challenges you to a battle!`]);
    setCurrentLogMessage(`${opponent.name} challenges you to a battle!`);
    setIsPlayerTurn(true);
    setButtonsDisabled(false);
    onCombatStart();
  };

  const calculateDamage = (attacker, defender, move) => {
    const baseDamage = move.power;
    const attack = attacker.stats.attack;
    const defense = defender.stats.defense;
    const randomFactor = 0.85 + Math.random() * 0.3;
    const levelFactor = attacker.level / 50;
    
    return Math.max(1, Math.round((baseDamage * attack / defense * levelFactor * randomFactor)));
  };

  const checkAccuracy = (move) => {
    return Math.random() * 100 <= move.accuracy;
  };

  const showHitEffectOn = (target) => {
    setShowHitEffect(prev => ({ ...prev, [target]: true }));
    setTimeout(() => {
      setShowHitEffect(prev => ({ ...prev, [target]: false }));
    }, 100);
  };

  const useMove = (move) => {
    if (combatState !== 'fighting' || move.pp <= 0 || !isPlayerTurn || buttonsDisabled) return;

    setButtonsDisabled(true);
    setIsPlayerTurn(false);

    const updatedMoves = character.moves.map(m => 
      m.name === move.name ? { ...m, pp: m.pp - 1 } : m
    );

    setCurrentLogMessage(`${character.name} used ${move.name}!`);

    if (!checkAccuracy(move)) {
      setTimeout(() => opponentTurn(), 1500);
      return;
    }

    const damage = calculateDamage(character, selectedOpponent.character, move);
    const newOpponentHp = Math.max(0, opponentHp - damage);
    setOpponentHp(newOpponentHp);
    
    showHitEffectOn('opponent');

    if (newOpponentHp <= 0) {
      setTimeout(() => handleVictory(), 1500);
      return;
    }

    setTimeout(() => opponentTurn(), 1500);
  };

  const opponentTurn = () => {
    if (combatState !== 'fighting') return;

    const availableMoves = character.moves.filter(move => move.pp > 0);
    if (availableMoves.length === 0) {
      setCurrentLogMessage(`${selectedOpponent.name} has no moves left!`);
      setIsPlayerTurn(true);
      setButtonsDisabled(false);
      return;
    }

    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    setCurrentLogMessage(`${selectedOpponent.name} used ${randomMove.name}!`);
    
    if (!checkAccuracy(randomMove)) {
      setTimeout(() => {
        setIsPlayerTurn(true);
        setButtonsDisabled(false);
      }, 1500);
      return;
    }

    const damage = calculateDamage(selectedOpponent.character, character, randomMove);
    const newPlayerHp = Math.max(0, playerHp - damage);
    setPlayerHp(newPlayerHp);
    
    showHitEffectOn('player');

    if (newPlayerHp <= 0) {
      setTimeout(() => handleDefeat(), 1500);
    } else {
      setTimeout(() => {
        setIsPlayerTurn(true);
        setButtonsDisabled(false);
      }, 1500);
    }
  };

  const handleVictory = () => {
    setCombatState('result');
    setCurrentLogMessage(`You defeated ${selectedOpponent.name}!`);
    onCombatEnd();
  };

  const handleDefeat = () => {
    setCombatState('result');
    setCurrentLogMessage(`You were defeated by ${selectedOpponent.name}!`);
    onCombatEnd();
  };

  const resetCombat = () => {
    setCombatState('leaderboard');
    setSelectedOpponent(null);
    setCombatLog([]);
    setCurrentLogMessage('');
    setPlayerHp(character.currentHp);
    setOpponentHp(0);
    setCombatAction('main');
    setIsPlayerTurn(true);
    setButtonsDisabled(false);
  };

  const renderCombatActions = () => {
    if (!isPlayerTurn || buttonsDisabled) {
      return (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p style={{ color: darkMode ? '#ffffff' : '#333' }}>Waiting for opponent...</p>
        </div>
      );
    }

    switch (combatAction) {
      case 'moves':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Choose a move:</h3>
              <button 
                className="btn btn-secondary" 
                onClick={() => setCombatAction('main')}
                style={{ fontSize: '12px', padding: '8px 16px' }}
              >
                ← Back
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {character.moves.map((move, index) => (
                <button
                  key={index}
                  className={`btn ${move.pp <= 0 ? 'btn-secondary' : 'btn'}`}
                  onClick={() => useMove(move)}
                  disabled={move.pp <= 0}
                  style={{ fontSize: '12px', padding: '8px' }}
                >
                  <div style={{ fontWeight: 'bold' }}>{move.name}</div>
                  <div style={{ fontSize: '10px' }}>
                    PP: {move.pp}/{move.maxPp}
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      default:
        return (
          <div>
            <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>What will {character.name} do?</h3>
            <div className="combat-actions">
              <button 
                className="combat-action-btn fight"
                onClick={() => setCombatAction('moves')}
              >
                Fight
              </button>
              <button 
                className="combat-action-btn run"
                onClick={resetCombat}
              >
                Run
              </button>
            </div>
          </div>
        );
    }
  };

  if (combatState === 'fighting') {
    return (
      <div className="combat-container">
        <h2 style={{ color: darkMode ? '#ffffff' : '#333' }}>PvP Battle!</h2>
        
        <div className="combat-arena" style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          height: '400px',
          marginBottom: '20px'
        }}>
          {/* Opponent Pokémon (Upper Right) */}
          <div style={{ 
            position: 'absolute', 
            top: '80px', 
            right: '40px',
            width: '100px',
            height: '100px',
            zIndex: 1
          }}>
            <img 
              src={OpponentGreninjaImage} 
              alt="Opponent"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain'
              }}
            />
            {showHitEffect.opponent && (
              <div className="hit-effect">
                <img 
                  src={HitEffectImage} 
                  alt="Hit Effect"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>

          {/* Opponent Info (Top Left) */}
          <div style={{ 
            position: 'absolute', 
            top: '20px', 
            left: '20px',
            background: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '2px solid #333',
            zIndex: 2,
            minWidth: '180px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 'bold', color: darkMode ? '#fff' : '#333', fontSize: '14px' }}>{selectedOpponent.name}</span>
              <span style={{ color: darkMode ? '#fff' : '#333', fontSize: '12px' }}>♂</span>
              <span style={{ color: darkMode ? '#fff' : '#333', fontSize: '12px' }}>Lv.{selectedOpponent.character.level}</span>
            </div>
            <div className="progress-bar" style={{ marginTop: '4px', height: '12px' }}>
              <div 
                className="progress-fill"
                style={{ width: `${(opponentHp / selectedOpponent.character.stats.hp) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Player Pokémon (Lower Left) */}
          <div style={{ 
            position: 'absolute', 
            bottom: '40px', 
            left: '40px',
            width: '200px',
            height: '200px',
            zIndex: 1
          }}>
            <img 
              src={BattleAshGreninjaImage} 
              alt="Ash-Greninja"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain'
              }}
            />
            {showHitEffect.player && (
              <div className="hit-effect">
                <img 
                  src={HitEffectImage} 
                  alt="Hit Effect"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              </div>
            )}
          </div>

          {/* Player Info (Lower Right) */}
          <div style={{ 
            position: 'absolute', 
            bottom: '100px', 
            right: '20px',
            background: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            padding: '8px 12px',
            borderRadius: '8px',
            border: '2px solid #333',
            zIndex: 2,
            minWidth: '180px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 'bold', color: darkMode ? '#fff' : '#333', fontSize: '14px' }}>{character.name}</span>
              <span style={{ color: darkMode ? '#fff' : '#333', fontSize: '12px' }}>♀</span>
              <span style={{ color: darkMode ? '#fff' : '#333', fontSize: '12px' }}>Lv.{character.level}</span>
            </div>
            <div className="progress-bar" style={{ marginTop: '4px', height: '12px' }}>
              <div 
                className="progress-fill"
                style={{ width: `${(playerHp / character.stats.hp) * 100}%` }}
              ></div>
            </div>
            <div style={{ fontSize: '11px', marginTop: '2px', color: darkMode ? '#fff' : '#333' }}>
              {playerHp} / {character.stats.hp} HP
            </div>
          </div>
        </div>

        {/* Battle Log */}
        <div className="battle-log" style={{ marginBottom: '20px', minHeight: '60px', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            {isPlayerTurn && !buttonsDisabled ? (
              <p style={{ margin: '0', fontSize: '16px', color: '#00b894', fontWeight: 'bold' }}>
                Waiting for action...
              </p>
            ) : (
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold' }}>
                {currentLogMessage}
              </p>
            )}
          </div>
        </div>

        {/* Action Menu */}
        <div className="card" style={{ marginBottom: '20px' }}>
          {renderCombatActions()}
        </div>
      </div>
    );
  }

  if (combatState === 'result') {
    return (
      <div className="combat-container">
        <h2>Battle Result</h2>
        
        <div className="combat-arena" style={{
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          height: '400px'
        }}>
          {/* Player Pokémon */}
          <div style={{ 
            position: 'absolute', 
            bottom: '40px', 
            left: '40px',
            width: '200px',
            height: '200px'
          }}>
            <img 
              src={BattleAshGreninjaImage} 
              alt="Ash-Greninja"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain'
              }}
            />
          </div>

          <div className="vs">
            {playerHp > 0 ? '🎉' : '💀'}
          </div>

          {/* Opponent Pokémon */}
          <div style={{ 
            position: 'absolute', 
            top: '80px', 
            right: '40px',
            width: '100px',
            height: '100px'
          }}>
            <img 
              src={OpponentGreninjaImage} 
              alt="Opponent"
              style={{ 
                width: '100%', 
                height: '100%', 
                objectFit: 'contain'
              }}
            />
          </div>
        </div>

        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Battle Summary</h3>
          <p style={{ color: darkMode ? '#ffffff' : '#333' }}>{currentLogMessage}</p>
        </div>

        <button className="btn" onClick={resetCombat}>
          Return to Leaderboard
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ color: darkMode ? '#ffffff' : '#333' }}>🏆 Leaderboard</h2>
        <button 
          className="btn btn-secondary" 
          onClick={refreshLeaderboard}
          style={{ fontSize: '12px', padding: '8px 16px' }}
        >
          🔄 Refresh
        </button>
      </div>
      <p style={{ marginBottom: '20px', color: darkMode ? '#ffffff' : '#666' }}>
        Challenge other trainers to PvP battles! Rankings are based on total power.
      </p>

      <div>
        {leaderboard.map((trainer, index) => (
          <div key={trainer.id} className="leaderboard-item">
            <div className="leaderboard-rank">#{index + 1}</div>
            <div className="leaderboard-name">
              {trainer.name} - {trainer.character.name}
            </div>
            <div className="leaderboard-power">
              Power: {trainer.totalPower}
            </div>
            {trainer.id !== currentTrainer?.id && (
              <button 
                className="btn" 
                onClick={() => startPvPCombat(trainer)}
                style={{ marginLeft: '10px' }}
              >
                Battle
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Your Ranking</h3>
        <p style={{ color: darkMode ? '#ffffff' : '#333' }}>Current Power: {Object.values(character.stats).reduce((sum, stat) => sum + stat, 0)}</p>
        <p style={{ color: darkMode ? '#ffffff' : '#333' }}>Keep training to climb the leaderboard!</p>
      </div>
    </div>
  );
};

export default LeaderboardTab; 