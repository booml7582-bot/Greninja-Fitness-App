import React, { useState, useEffect } from 'react';
import BattleAshGreninjaImage from '../media/BattleAshGreninja.png';
import OpponentPikachuImage from '../media/OpponentPikachu.png';
import OpponentCharizardImage from '../media/OpponentCharizard.png';
import HitEffectImage from '../media/HitEffect.png';
import BackgroundImage from '../media/Background.jpg';

const CombatTab = ({ character, npcs, setCharacter, onUpdateHp, onUpdateMoves, darkMode }) => {
  const [selectedNpc, setSelectedNpc] = useState(null);
  const [combatState, setCombatState] = useState('selection'); // selection, fighting, result
  const [combatLog, setCombatLog] = useState([]);
  const [playerHp, setPlayerHp] = useState(character.currentHp);
  const [enemyHp, setEnemyHp] = useState(0);
  const [currentEnemy, setCurrentEnemy] = useState(null);
  const [combatAction, setCombatAction] = useState('main'); // main, moves, items
  const [playerItems] = useState([
    { name: 'Potion', effect: 'heal', value: 20, quantity: 3 },
    { name: 'Super Potion', effect: 'heal', value: 50, quantity: 1 },
    { name: 'Ether', effect: 'pp', value: 10, quantity: 2 }
  ]);
  const [showHitEffect, setShowHitEffect] = useState({ player: false, enemy: false });
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [currentLogMessage, setCurrentLogMessage] = useState('');

  const getEnemySprite = (enemyName) => {
    switch (enemyName) {
      case 'Pikachu':
        return OpponentPikachuImage;
      case 'Charizard':
        return OpponentCharizardImage;
      default:
        return null;
    }
  };

  const startCombat = (npc) => {
    setSelectedNpc(npc);
    setCurrentEnemy(npc);
    setPlayerHp(character.currentHp);
    setEnemyHp(npc.stats.hp);
    setCombatState('fighting');
    setCombatAction('main');
    setCombatLog([`A wild ${npc.name} appeared!`]);
    setCurrentLogMessage(`A wild ${npc.name} appeared!`);
    setIsPlayerTurn(true);
    setButtonsDisabled(false);
  };

  const calculateDamage = (attacker, defender, move) => {
    const baseDamage = move.power;
    const attack = attacker.stats.attack;
    const defense = defender.stats.defense;
    const randomFactor = 0.85 + Math.random() * 0.3; // 0.85 to 1.15
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

    // Disable buttons and start turn
    setButtonsDisabled(true);
    setIsPlayerTurn(false);

    // Use PP regardless of hit/miss
    const updatedMoves = character.moves.map(m => 
      m.name === move.name ? { ...m, pp: m.pp - 1 } : m
    );
    onUpdateMoves(updatedMoves);

    // Show player's attack message
    setCurrentLogMessage(`${character.name} used ${move.name}!`);

    // Check accuracy
    if (!checkAccuracy(move)) {
      setTimeout(() => enemyTurn(), 1500);
      return;
    }

    // Calculate and apply damage
    const damage = calculateDamage(character, currentEnemy, move);
    const newEnemyHp = Math.max(0, enemyHp - damage);
    setEnemyHp(newEnemyHp);
    
    // Show hit effect on enemy
    showHitEffectOn('enemy');

    if (newEnemyHp <= 0) {
      setTimeout(() => handleVictory(), 1500);
      return;
    }

    // Enemy turn after delay
    setTimeout(() => enemyTurn(), 1500);
  };

  const enemyTurn = () => {
    if (combatState !== 'fighting') return;

    const availableMoves = currentEnemy.moves.filter(move => move.pp > 0);
    if (availableMoves.length === 0) {
      setCurrentLogMessage(`${currentEnemy.name} has no moves left!`);
      setIsPlayerTurn(true);
      setButtonsDisabled(false);
      return;
    }

    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    
    // Show enemy's attack message
    setCurrentLogMessage(`${currentEnemy.name} used ${randomMove.name}!`);
    
    if (!checkAccuracy(randomMove)) {
      setTimeout(() => {
        setIsPlayerTurn(true);
        setButtonsDisabled(false);
      }, 1500);
      return;
    }

    const damage = calculateDamage(currentEnemy, character, randomMove);
    const newPlayerHp = Math.max(0, playerHp - damage);
    setPlayerHp(newPlayerHp);
    
    // Show hit effect on player
    showHitEffectOn('player');

    if (newPlayerHp <= 0) {
      setTimeout(() => handleDefeat(), 1500);
    } else {
      // Player's turn again after delay
      setTimeout(() => {
        setIsPlayerTurn(true);
        setButtonsDisabled(false);
      }, 1500);
    }
  };

  const useItem = (item) => {
    if (item.quantity <= 0 || !isPlayerTurn || buttonsDisabled) return;

    // Disable buttons and start turn
    setButtonsDisabled(true);
    setIsPlayerTurn(false);

    // Show item usage message
    setCurrentLogMessage(`${character.name} used ${item.name}!`);

    if (item.effect === 'heal') {
      const newHp = Math.min(character.stats.hp, playerHp + item.value);
      setPlayerHp(newHp);
    } else if (item.effect === 'pp') {
      // Restore PP for all moves
      const updatedMoves = character.moves.map(move => ({
        ...move,
        pp: Math.min(move.maxPp, move.pp + item.value)
      }));
      onUpdateMoves(updatedMoves);
    }

    // Decrease item quantity
    item.quantity--;
    setCombatAction('main');
    
    // Enemy turn after delay
    setTimeout(() => enemyTurn(), 1500);
  };

  const runFromBattle = () => {
    if (!isPlayerTurn || buttonsDisabled) return;

    setButtonsDisabled(true);
    const runChance = 0.5; // 50% chance to run
    if (Math.random() < runChance) {
      setCurrentLogMessage(`${character.name} got away safely!`);
      setTimeout(() => resetCombat(), 1500);
    } else {
      setCurrentLogMessage(`${character.name} couldn't escape!`);
      setTimeout(() => enemyTurn(), 1500);
    }
  };

  const handleVictory = () => {
    setCombatState('result');
    setCurrentLogMessage(`${currentEnemy.name} fainted!`);
    
    // Update character's current HP
    onUpdateHp(playerHp);
    
    // Award experience
    const experienceGained = currentEnemy.reward.experience;
    setCharacter(prev => {
      const newExperience = prev.experience + experienceGained;
      let newLevel = prev.level;
      let newExperienceToNext = prev.experienceToNext;

      if (newExperience >= prev.experienceToNext) {
        newLevel += 1;
        newExperienceToNext = prev.experienceToNext * 1.5;
      }

      return {
        ...prev,
        experience: newExperience,
        level: newLevel,
        experienceToNext: newExperienceToNext
      };
    });
  };

  const handleDefeat = () => {
    setCombatState('result');
    setCurrentLogMessage(`${character.name} fainted!`);
    
    // Update character's current HP (set to 0)
    onUpdateHp(0);
  };

  const resetCombat = () => {
    setCombatState('selection');
    setSelectedNpc(null);
    setCurrentEnemy(null);
    setCombatLog([]);
    setCurrentLogMessage('');
    setPlayerHp(character.currentHp);
    setEnemyHp(0);
    setCombatAction('main');
    setIsPlayerTurn(true);
    setButtonsDisabled(false);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': '#00b894',
      'Medium': '#fdcb6e',
      'Hard': '#ff6b6b'
    };
    return colors[difficulty] || '#667eea';
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

  const canFightNpc = (npc) => {
    const playerPower = Object.values(character.stats).reduce((sum, stat) => sum + stat, 0);
    const npcPower = Object.values(npc.stats).reduce((sum, stat) => sum + stat, 0);
    return playerPower >= npcPower * 0.7;
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

      case 'items':
        return (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
              <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Choose an item:</h3>
              <button 
                className="btn btn-secondary" 
                onClick={() => setCombatAction('main')}
                style={{ fontSize: '12px', padding: '8px 16px' }}
              >
                ← Back
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
              {playerItems.map((item, index) => (
                <button
                  key={index}
                  className={`btn ${item.quantity <= 0 ? 'btn-secondary' : 'btn'}`}
                  onClick={() => useItem(item)}
                  disabled={item.quantity <= 0}
                  style={{ fontSize: '12px', padding: '8px' }}
                >
                  <div style={{ fontWeight: 'bold' }}>{item.name}</div>
                  <div style={{ fontSize: '10px' }}>
                    x{item.quantity}
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
                className="combat-action-btn bag"
                onClick={() => setCombatAction('items')}
              >
                Bag
              </button>
              <button 
                className="combat-action-btn pokemon"
                disabled
              >
                Pokémon
              </button>
              <button 
                className="combat-action-btn run"
                onClick={runFromBattle}
              >
                Run
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="card">
      <h2 style={{ color: darkMode ? '#ffffff' : '#333' }}>Pokémon Battle Arena</h2>
      <p style={{ marginBottom: '20px', color: darkMode ? '#ffffff' : '#666' }}>
        Test your training against wild Pokémon! Use your moves strategically.
      </p>

      {combatState === 'selection' && (
        <div>
          <div className="card" style={{ marginBottom: '20px' }}>
            <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Wild Pokémon</h3>
            <p style={{ color: darkMode ? '#ffffff' : '#333' }}>Your current power: {Object.values(character.stats).reduce((sum, stat) => sum + stat, 0)}</p>
            <p style={{ color: darkMode ? '#ffffff' : '#333' }}>Current HP: {character.currentHp} / {character.stats.hp}</p>
          </div>

          <div className="grid grid-3">
            {npcs.map(npc => {
              const canFight = canFightNpc(npc);
              const npcPower = Object.values(npc.stats).reduce((sum, stat) => sum + stat, 0);
              
              return (
                <div key={npc.id} className="npc-card">
                  <div className="npc-avatar">
                    {npc.avatar}
                  </div>
                  <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>{npc.name}</h3>
                  <span className="level-badge">Level {npc.level}</span>
                  <p style={{ margin: '10px 0', color: darkMode ? '#ffffff' : '#666' }}>
                    Power: {npcPower}
                  </p>
                  <div style={{ marginBottom: '15px' }}>
                    <span 
                      style={{ 
                        backgroundColor: getDifficultyColor(npc.difficulty),
                        color: 'white',
                        padding: '4px 12px',
                        borderRadius: '15px',
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}
                    >
                      {npc.difficulty}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: darkMode ? '#ffffff' : '#666', marginBottom: '15px' }}>
                    <div>⚔️ Attack: {npc.stats.attack}</div>
                    <div>🛡️ Defense: {npc.stats.defense}</div>
                    <div>🏃 Speed: {npc.stats.speed}</div>
                    <div>❤️ HP: {npc.stats.hp}</div>
                    <div>⚡ Agility: {npc.stats.agility}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#00b894', marginBottom: '15px' }}>
                    <div>🎯 Reward: {npc.reward.experience} XP</div>
                  </div>
                  <button
                    className={`btn ${canFight ? 'btn' : 'btn-secondary'}`}
                    onClick={() => canFight && startCombat(npc)}
                    disabled={!canFight}
                    style={{ width: '100%' }}
                  >
                    {canFight ? 'Battle!' : 'Too Strong'}
                  </button>
                  {!canFight && (
                    <p style={{ 
                      textAlign: 'center', 
                      marginTop: '10px', 
                      fontSize: '12px', 
                      color: '#ff6b6b'
                    }}>
                      Train more to battle this Pokémon!
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {combatState === 'fighting' && (
        <div className="combat-container">
          <h2>Battle in Progress!</h2>
          
          <div className="combat-arena" style={{
            backgroundImage: `url(${BackgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative',
            height: '400px',
            marginBottom: '20px'
          }}>
            {/* Enemy Pokémon (Upper Right) - Behind info box */}
            <div style={{ 
              position: 'absolute', 
              top: '80px', 
              right: '40px',
              width: '100px',
              height: '100px',
              zIndex: 1
            }}>
              <img 
                src={getEnemySprite(currentEnemy.name)} 
                alt={currentEnemy.name}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'contain'
                }}
              />
              {showHitEffect.enemy && (
                <div className="hit-effect">
                  <img 
                    src={HitEffectImage} 
                    alt="Hit Effect"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </div>
              )}
            </div>

            {/* Enemy Info (Top Left) - In front of Pokémon */}
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
                <span style={{ fontWeight: 'bold', color: darkMode ? '#fff' : '#333', fontSize: '14px' }}>{currentEnemy.name}</span>
                <span style={{ color: darkMode ? '#fff' : '#333', fontSize: '12px' }}>♂</span>
                <span style={{ color: darkMode ? '#fff' : '#333', fontSize: '12px' }}>Lv.{currentEnemy.level}</span>
              </div>
              <div className="progress-bar" style={{ marginTop: '4px', height: '12px' }}>
                <div 
                  className="progress-fill"
                  style={{ width: `${(enemyHp / currentEnemy.stats.hp) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Player Pokémon (Lower Left) - Behind info box */}
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

            {/* Player Info (Lower Right) - In front of Pokémon */}
            <div style={{ 
              position: 'absolute', 
              bottom: '140px', 
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

          {/* Battle Log - Above action buttons */}
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

          {/* Action Menu (Bottom) */}
          <div className="card" style={{ marginBottom: '20px' }}>
            {renderCombatActions()}
          </div>
        </div>
      )}

      {combatState === 'result' && (
        <div className="combat-container">
          <h2 style={{ color: darkMode ? '#ffffff' : '#333' }}>Battle Result</h2>
          
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

            {/* Enemy Pokémon */}
            <div style={{ 
              position: 'absolute', 
              top: '80px', 
              right: '40px',
              width: '100px',
              height: '100px'
            }}>
              <img 
                src={getEnemySprite(currentEnemy.name)} 
                alt={currentEnemy.name}
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
            {combatLog.slice(-5).map((log, index) => (
              <p key={index} style={{ margin: '5px 0', fontSize: '14px', color: darkMode ? '#ffffff' : '#333' }}>
                {log}
              </p>
            ))}
          </div>

          {playerHp > 0 && (
            <div className="card" style={{ marginBottom: '20px', backgroundColor: '#00b894', color: 'white' }}>
              <h3 style={{ color: 'white' }}>Victory Rewards!</h3>
              <p style={{ color: 'white' }}>Experience gained: +{currentEnemy.reward.experience} XP</p>
              <p style={{ color: 'white' }}>Gold gained: +{currentEnemy.reward.gold} Gold</p>
            </div>
          )}

          <button className="btn" onClick={resetCombat}>
            Return to Arena
          </button>
        </div>
      )}
    </div>
  );
};

export default CombatTab; 