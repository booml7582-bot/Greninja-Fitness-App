import React, { useState, useEffect, useRef } from 'react';
import GreninjaAniImage from '../media/GreninjaAni.gif';
import OpponentPikachuAniImage from '../media/OpponentPikachuAni.gif';
import OpponentCharizardAniImage from '../media/OpponentCharizardAni.gif';
import OpponentBlastoiseAniImage from '../media/OpponentBlastoiseAni.gif';
import OpponentMewtwoAniImage from '../media/OpponentMewtwoAni.gif';
import HitEffectImage from '../media/HitEffect.png';
import BackgroundImage from '../media/Background.jpg';

const CombatTab = ({ character, npcs, setCharacter, onUpdateHp, onUpdateMoves, darkMode, onCombatStart, onCombatEnd, selectedTrainerNpc, setSelectedTrainerNpc }) => {
  const [selectedNpc, setSelectedNpc] = useState(null);
  const [combatState, setCombatState] = useState('map'); // map, fighting, result
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
  const [defeatedNpcs, setDefeatedNpcs] = useState([]);
  const [effectivenessMessage, setEffectivenessMessage] = useState('');

  // Sound effect refs
  const normalSoundRef = useRef(null);
  const superEffectiveSoundRef = useRef(null);
  const notVeryEffectiveSoundRef = useRef(null);

  // Function to play sound effects
  const playSoundEffect = (effectiveness) => {
    let soundRef = null;
    switch (effectiveness) {
      case 'super effective':
        soundRef = superEffectiveSoundRef;
        break;
      case 'not very effective':
        soundRef = notVeryEffectiveSoundRef;
        break;
      default:
        soundRef = normalSoundRef;
        break;
    }
    
    if (soundRef.current) {
      soundRef.current.currentTime = 0;
      soundRef.current.play().catch(e => console.log('Sound effect play failed:', e));
    }
  };

  // Load defeated NPCs from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`defeated_npcs_${character.name}`);
    if (saved) {
      setDefeatedNpcs(JSON.parse(saved));
    }
  }, [character.name]);

  // Handle trainer battles
  useEffect(() => {
    if (selectedTrainerNpc && combatState === 'map') {
      startCombat(selectedTrainerNpc);
      setSelectedTrainerNpc(null); // Clear the selected trainer
    }
  }, [selectedTrainerNpc, combatState]);

  // Save defeated NPCs to localStorage
  const saveDefeatedNpcs = (newDefeatedNpcs) => {
    setDefeatedNpcs(newDefeatedNpcs);
    localStorage.setItem(`defeated_npcs_${character.name}`, JSON.stringify(newDefeatedNpcs));
  };

  // Type effectiveness chart
  const typeEffectiveness = {
    Normal: { Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 1, Rock: 0.5, Ghost: 0, Steel: 0.5, Dark: 1, Fairy: 1 },
    Fire: { Normal: 1, Fire: 0.5, Water: 0.5, Electric: 1, Grass: 2, Ice: 2, Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 2, Rock: 0.5, Ghost: 1, Steel: 2, Dark: 1, Fairy: 1 },
    Water: { Normal: 1, Fire: 2, Water: 0.5, Electric: 1, Grass: 0.5, Ice: 1, Fighting: 1, Poison: 1, Ground: 2, Flying: 1, Psychic: 1, Bug: 1, Rock: 2, Ghost: 1, Steel: 1, Dark: 1, Fairy: 1 },
    Electric: { Normal: 1, Fire: 1, Water: 2, Electric: 0.5, Grass: 0.5, Ice: 1, Fighting: 1, Poison: 1, Ground: 0, Flying: 2, Psychic: 1, Bug: 1, Rock: 1, Ghost: 1, Steel: 1, Dark: 1, Fairy: 1 },
    Grass: { Normal: 1, Fire: 0.5, Water: 2, Electric: 1, Grass: 0.5, Ice: 1, Fighting: 1, Poison: 0.5, Ground: 2, Flying: 0.5, Psychic: 1, Bug: 0.5, Rock: 2, Ghost: 1, Steel: 0.5, Dark: 1, Fairy: 1 },
    Ice: { Normal: 1, Fire: 0.5, Water: 0.5, Electric: 1, Grass: 2, Ice: 0.5, Fighting: 1, Poison: 1, Ground: 2, Flying: 2, Psychic: 1, Bug: 1, Rock: 1, Ghost: 1, Steel: 0.5, Dark: 1, Fairy: 1 },
    Fighting: { Normal: 2, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 2, Fighting: 1, Poison: 0.5, Ground: 1, Flying: 0.5, Psychic: 0.5, Bug: 0.5, Rock: 2, Ghost: 0, Steel: 2, Dark: 2, Fairy: 0.5 },
    Poison: { Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 2, Ice: 1, Fighting: 1, Poison: 0.5, Ground: 0.5, Flying: 1, Psychic: 1, Bug: 1, Rock: 0.5, Ghost: 0.5, Steel: 0, Dark: 1, Fairy: 2 },
    Ground: { Normal: 1, Fire: 2, Water: 1, Electric: 2, Grass: 0.5, Ice: 1, Fighting: 1, Poison: 2, Ground: 1, Flying: 0, Psychic: 1, Bug: 0.5, Rock: 2, Ghost: 1, Steel: 2, Dark: 1, Fairy: 1 },
    Flying: { Normal: 1, Fire: 1, Water: 1, Electric: 0.5, Grass: 2, Ice: 1, Fighting: 2, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 2, Rock: 0.5, Ghost: 1, Steel: 0.5, Dark: 1, Fairy: 1 },
    Psychic: { Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 2, Poison: 2, Ground: 1, Flying: 1, Psychic: 0.5, Bug: 1, Rock: 1, Ghost: 1, Steel: 0.5, Dark: 0, Fairy: 1 },
    Bug: { Normal: 1, Fire: 0.5, Water: 1, Electric: 1, Grass: 2, Ice: 1, Fighting: 0.5, Poison: 0.5, Ground: 1, Flying: 0.5, Psychic: 2, Bug: 1, Rock: 1, Ghost: 0.5, Steel: 0.5, Dark: 2, Fairy: 0.5 },
    Rock: { Normal: 1, Fire: 2, Water: 1, Electric: 1, Grass: 1, Ice: 2, Fighting: 0.5, Poison: 1, Ground: 0.5, Flying: 2, Psychic: 1, Bug: 2, Rock: 1, Ghost: 1, Steel: 0.5, Dark: 1, Fairy: 1 },
    Ghost: { Normal: 0, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 2, Bug: 1, Rock: 1, Ghost: 2, Steel: 1, Dark: 0.5, Fairy: 1 },
    Steel: { Normal: 1, Fire: 0.5, Water: 0.5, Electric: 0.5, Grass: 1, Ice: 2, Fighting: 1, Poison: 1, Ground: 1, Flying: 1, Psychic: 1, Bug: 1, Rock: 2, Ghost: 1, Steel: 0.5, Dark: 1, Fairy: 2 },
    Dark: { Normal: 1, Fire: 1, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 0.5, Poison: 1, Ground: 1, Flying: 1, Psychic: 2, Bug: 1, Rock: 1, Ghost: 2, Steel: 1, Dark: 0.5, Fairy: 0.5 },
    Fairy: { Normal: 1, Fire: 0.5, Water: 1, Electric: 1, Grass: 1, Ice: 1, Fighting: 2, Poison: 0.5, Ground: 1, Flying: 1, Psychic: 1, Bug: 1, Rock: 1, Ghost: 1, Steel: 0.5, Dark: 2, Fairy: 1 }
  };

  const getEnemySprite = (enemyName, enemyImage = null) => {
    // If enemy has a specific image, use it
    if (enemyImage) {
      return enemyImage;
    }
    
    // Otherwise use the default sprite logic
    switch (enemyName) {
      case 'Pikachu':
        return OpponentPikachuAniImage;
      case 'Charizard':
        return OpponentCharizardAniImage;
      case 'Blastoise':
        return OpponentBlastoiseAniImage;
      case 'Mewtwo':
        return OpponentMewtwoAniImage;
      default:
        return GreninjaAniImage; // Default to Greninja for unknown enemies
    }
  };

  const isNpcUnlocked = (npcId) => {
    if (npcId === 1) return true; // First NPC is always unlocked
    return defeatedNpcs.includes(npcId - 1); // Previous NPC must be defeated
  };

  const isNpcDefeated = (npcId) => {
    return defeatedNpcs.includes(npcId);
  };

  const startCombat = (npc) => {
    setSelectedNpc(npc);
    setCurrentEnemy(npc);
    setPlayerHp(character.currentHp);
    setEnemyHp(npc.stats.hp);
    setCombatState('fighting');
    setCombatAction('main');
    
    // Different messages for trainer vs wild battles
    const battleMessage = npc.isTrainer 
      ? `Trainer ${npc.name} wants to battle!` 
      : `A wild ${npc.name} appeared!`;
    
    setCombatLog([battleMessage]);
    setCurrentLogMessage(battleMessage);
    setIsPlayerTurn(true);
    setButtonsDisabled(false);
    setEffectivenessMessage('');
    onCombatStart();
  };

  const calculateTypeEffectiveness = (moveType, defenderType) => {
    // Use the actual defender type, fallback to Normal if not specified
    const type = defenderType || 'Normal';
    const effectiveness = typeEffectiveness[moveType]?.[type] || 1;
    return effectiveness;
  };

  const getEffectivenessMessage = (effectiveness) => {
    if (effectiveness === 0) return "It had no effect...";
    if (effectiveness < 1) return "It's not very effective...";
    if (effectiveness > 1) return "It's super effective!";
    return "";
  };

  const calculateDamage = (attacker, defender, move) => {
    const baseDamage = move.power;
    const attack = attacker.stats.attack;
    const defense = defender.stats.defense;
    const randomFactor = 0.85 + Math.random() * 0.3; // 0.85 to 1.15
    const levelFactor = attacker.level / 50;
    
    // Calculate type effectiveness
    const typeEffectiveness = calculateTypeEffectiveness(move.type, defender.type);
    
    return Math.max(1, Math.round((baseDamage * attack / defense * levelFactor * randomFactor * typeEffectiveness)));
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

  const executeMove = (move) => {
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
      setCurrentLogMessage(`${character.name} used ${move.name}, but it missed!`);
      setTimeout(() => enemyTurn(), 1500);
      return;
    }

    // Calculate and apply damage
    const damage = calculateDamage(character, currentEnemy, move);
    const newEnemyHp = Math.max(0, enemyHp - damage);
    setEnemyHp(newEnemyHp);
    
    // Calculate type effectiveness for sound effect
    const typeEffectiveness = calculateTypeEffectiveness(move.type, currentEnemy.type);
    
    // Show hit effect on enemy and play sound effect
    showHitEffectOn('enemy');
    
    // Play sound effect based on effectiveness
    if (typeEffectiveness > 1) {
      playSoundEffect('super effective');
    } else if (typeEffectiveness < 1 && typeEffectiveness > 0) {
      playSoundEffect('not very effective');
    } else {
      playSoundEffect('normal');
    }

    // Show effectiveness message after 1.5 seconds
    const effectivenessMsg = getEffectivenessMessage(typeEffectiveness);
    
    setTimeout(() => {
      if (effectivenessMsg) {
        setEffectivenessMessage(effectivenessMsg);
        setTimeout(() => {
          setEffectivenessMessage('');
        }, 1500);
      }
    }, 1500);

    if (newEnemyHp <= 0) {
      setTimeout(() => handleVictory(), 3000); // Wait for effectiveness message
      return;
    }

    // Enemy turn after delay
    setTimeout(() => enemyTurn(), 3000); // Wait for effectiveness message
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
      setCurrentLogMessage(`${currentEnemy.name} used ${randomMove.name}, but it missed!`);
      setTimeout(() => {
        setIsPlayerTurn(true);
        setButtonsDisabled(false);
      }, 1500);
      return;
    }

    const damage = calculateDamage(currentEnemy, character, randomMove);
    const newPlayerHp = Math.max(0, playerHp - damage);
    setPlayerHp(newPlayerHp);
    
    // Calculate type effectiveness for sound effect
    const typeEffectiveness = calculateTypeEffectiveness(randomMove.type, character.type);
    
    // Show hit effect on player and play sound effect
    showHitEffectOn('player');
    
    // Play sound effect based on effectiveness
    if (typeEffectiveness > 1) {
      playSoundEffect('super effective');
    } else if (typeEffectiveness < 1 && typeEffectiveness > 0) {
      playSoundEffect('not very effective');
    } else {
      playSoundEffect('normal');
    }

    // Show effectiveness message after 1.5 seconds
    const effectivenessMsg = getEffectivenessMessage(typeEffectiveness);
    
    setTimeout(() => {
      if (effectivenessMsg) {
        setEffectivenessMessage(effectivenessMsg);
        setTimeout(() => {
          setEffectivenessMessage('');
        }, 1500);
      }
    }, 1500);

    if (newPlayerHp <= 0) {
      setTimeout(() => handleDefeat(), 3000); // Wait for effectiveness message
    } else {
      // Player's turn again after delay
      setTimeout(() => {
        setIsPlayerTurn(true);
        setButtonsDisabled(false);
      }, 3000); // Wait for effectiveness message
    }
  };

  const executeItem = (item) => {
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
      setTimeout(() => {
        resetCombat();
        onCombatEnd(); // Stop battle music and return to menu music
      }, 1500);
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
    
    // Mark NPC as defeated (only for wild battles, not trainer battles)
    if (!currentEnemy.isTrainer && !defeatedNpcs.includes(currentEnemy.id)) {
      const newDefeatedNpcs = [...defeatedNpcs, currentEnemy.id];
      saveDefeatedNpcs(newDefeatedNpcs);
    }
    
    // Award experience
    const experienceGained = currentEnemy.reward.experience;
    setCharacter(prev => {
      const newExperience = prev.experience + experienceGained;
      let newLevel = prev.level;
      let newExperienceToNext = prev.experienceToNext;
      let newMaxStats = { ...prev.maxStats }; // Always define newMaxStats

      if (newExperience >= prev.experienceToNext) {
        newLevel += 1;
        newExperienceToNext = prev.experienceToNext * 1.5;
        
        // Increase max stats on level up
        const statIncrease = newLevel % 5 === 0 ? 2 : 1; // +2 every 5 levels, +1 otherwise
        const hpIncrease = newLevel % 5 === 0 ? 3 : 2; // +3 HP every 5 levels, +2 otherwise
        
        newMaxStats.attack += statIncrease;
        newMaxStats.defense += statIncrease;
        newMaxStats.speed += statIncrease;
        newMaxStats.hp += hpIncrease;
        newMaxStats.agility += statIncrease;
      }

      return {
        ...prev,
        experience: newExperience,
        level: newLevel,
        experienceToNext: newExperienceToNext,
        maxStats: newLevel > prev.level ? newMaxStats : prev.maxStats
      };
    });
    
    onCombatEnd();
  };

  const handleDefeat = () => {
    setCombatState('result');
    setCurrentLogMessage(`${character.name} fainted!`);
    
    // Update character's current HP (set to 0)
    onUpdateHp(0);
    onCombatEnd();
  };

  const resetCombat = () => {
    setCombatState('map');
    setSelectedNpc(null);
    setCurrentEnemy(null);
    setCombatLog([]);
    setCurrentLogMessage('');
    setPlayerHp(character.currentHp);
    setEnemyHp(0);
    setCombatAction('main');
    setIsPlayerTurn(true);
    setButtonsDisabled(false);
    setEffectivenessMessage('');
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': '#00b894',
      'Medium': '#fdcb6e',
      'Hard': '#ff6b6b'
    };
    return colors[difficulty] || '#667eea';
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
                  onClick={() => executeMove(move)}
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
                  onClick={() => executeItem(item)}
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

  // Render the horizontal map
  const renderMap = () => {
    return (
      <div className="card">
        <h2 style={{ color: darkMode ? '#ffffff' : '#333' }}>🗺️ Adventure Map</h2>
        <p style={{ marginBottom: '20px', color: darkMode ? '#ffffff' : '#666' }}>
          Defeat Pokémon in order to unlock the next challenge! Your progress: {defeatedNpcs.length}/{npcs.length} completed.
        </p>

        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Your Status</h3>
          <p style={{ color: darkMode ? '#ffffff' : '#333' }}>Current Power: {Object.values(character.stats).reduce((sum, stat) => sum + stat, 0)}</p>
          <p style={{ color: darkMode ? '#ffffff' : '#333' }}>Current HP: {character.currentHp} / {character.stats.hp}</p>
        </div>

                  {/* Horizontal Map */}
          <div className="combat-map-container" style={{
            background: 'linear-gradient(90deg, #87CEEB 0%, #98FB98 50%, #FFB6C1 100%)',
            borderRadius: '15px',
            padding: '20px',
            marginBottom: '20px',
            position: 'relative',
            overflow: 'hidden',
            minHeight: '200px', // Ensure minimum height for mobile
            touchAction: 'pan-x' // Enable horizontal scrolling on touch devices
          }}>
          {/* Scroll indicator for mobile */}
          <div className="combat-map-scroll-indicator" style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '12px',
            fontSize: '10px',
            zIndex: 10,
            display: 'none' // Hidden by default, can be shown with CSS media queries
          }}>
            ← Scroll →
          </div>
          
          {/* Mobile scroll hint */}
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'rgba(0,0,0,0.7)',
            color: 'white',
            padding: '6px 12px',
            borderRadius: '16px',
            fontSize: '12px',
            zIndex: 10,
            display: 'none' // Will be shown via CSS media query
          }} className="mobile-scroll-hint">
            Swipe to see more Pokémon →
          </div>
          {/* Path */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '0',
            right: '0',
            height: '8px',
            background: 'linear-gradient(90deg, #8B4513, #A0522D)',
            transform: 'translateY(-50%)',
            zIndex: 1
          }} />

          {/* NPC Nodes */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'relative',
            zIndex: 2,
            padding: '0 20px',
            minWidth: 'max-content', // Ensure content doesn't wrap
            overflowX: 'auto', // Make scrollable on mobile
            WebkitOverflowScrolling: 'touch', // Smooth scrolling on iOS
            touchAction: 'pan-x', // Enable horizontal scrolling on touch devices
            scrollbarWidth: 'none', // Hide scrollbar on Firefox
            msOverflowStyle: 'none' // Hide scrollbar on IE/Edge
          }}>
            {npcs.map((npc, index) => {
              const isUnlocked = isNpcUnlocked(npc.id);
              const isDefeated = isNpcDefeated(npc.id);
              const canFight = isUnlocked && !isDefeated;
              
              return (
                <div key={npc.id} className="combat-node" style={{ 
                  textAlign: 'center',
                  minWidth: '120px', // Ensure minimum width for touch targets
                  margin: '0 10px' // Add spacing between nodes
                }}>
                  {/* Node */}
                  <div style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: isDefeated ? '#00b894' : isUnlocked ? '#74b9ff' : '#b2bec3',
                    border: '4px solid',
                    borderColor: isDefeated ? '#00b894' : isUnlocked ? '#0984e3' : '#636e72',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px',
                    cursor: canFight ? 'pointer' : 'default',
                    transition: 'all 0.3s ease',
                    boxShadow: isUnlocked ? '0 4px 8px rgba(0,0,0,0.3)' : 'none',
                    touchAction: 'manipulation' // Optimize for touch
                  }}
                  onClick={() => canFight && startCombat(npc)}
                  >
                    {isDefeated ? (
                      <span style={{ fontSize: '24px' }}>✅</span>
                    ) : isUnlocked ? (
                      npc.image ? (
                        <img 
                          src={npc.image} 
                          alt={npc.name}
                          style={{ 
                            width: '48px', 
                            height: '48px', 
                            objectFit: 'cover',
                            borderRadius: '8px'
                          }} 
                        />
                      ) : (
                        <span style={{ fontSize: '24px' }}>{npc.avatar}</span>
                      )
                    ) : (
                      <span style={{ fontSize: '24px' }}>🔒</span>
                    )}
                  </div>
                  
                  {/* Node Label */}
                  <div style={{
                    fontSize: '12px',
                    fontWeight: 'bold',
                    color: darkMode ? '#ffffff' : '#333',
                    marginBottom: '5px'
                  }}>
                    {isUnlocked ? `Level ${npc.level}` : '???'}
                  </div>
                  
                  {/* NPC Info (only if unlocked) */}
                  {isUnlocked && (
                    <div style={{
                      background: darkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.9)',
                      borderRadius: '8px',
                      padding: '8px',
                      marginTop: '5px',
                      minWidth: '120px',
                      border: '2px solid #333'
                    }}>
                      <div style={{
                        fontSize: '10px',
                        fontWeight: 'bold',
                        color: darkMode ? '#ffffff' : '#333',
                        marginBottom: '4px'
                      }}>
                        {npc.name}
                      </div>
                      
                      {!isDefeated && (
                        <>
                          <div style={{
                            fontSize: '8px',
                            color: darkMode ? '#ffffff' : '#666',
                            marginBottom: '4px'
                          }}>
                            Power: {Object.values(npc.stats).reduce((sum, stat) => sum + stat, 0)}
                          </div>
                          
                          <div style={{
                            fontSize: '8px',
                            color: darkMode ? '#ffffff' : '#666',
                            marginBottom: '4px'
                          }}>
                            <span style={{
                              backgroundColor: getDifficultyColor(npc.difficulty),
                              color: 'white',
                              padding: '2px 6px',
                              borderRadius: '10px',
                              fontSize: '8px'
                            }}>
                              {npc.difficulty}
                            </span>
                          </div>
                          
                          <button
                            className="btn"
                            style={{
                              fontSize: '10px',
                              padding: '4px 8px',
                              width: '100%'
                            }}
                            onClick={() => startCombat(npc)}
                          >
                            Battle!
                          </button>
                        </>
                      )}
                      
                      {isDefeated && (
                        <div style={{
                          fontSize: '8px',
                          color: '#00b894',
                          fontWeight: 'bold'
                        }}>
                          Defeated! ✅
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Trainer Battles Section */}
        <div className="card" style={{ marginBottom: '20px' }}>
          <h3 style={{ color: darkMode ? '#ffffff' : '#333', marginBottom: '16px' }}>
            🏆 Trainer Battles
          </h3>
          <p style={{ color: darkMode ? '#ffffff' : '#666', marginBottom: '16px' }}>
            Challenge other trainers from the leaderboard! These battles don't unlock new areas but provide great rewards.
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '12px'
          }}>
            {/* This will be populated when trainers are selected from leaderboard */}
            <div style={{
              background: 'linear-gradient(135deg, #2D3748 0%, #553C9A 100%)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center',
              border: '1px solid #553C9A'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
              <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                Select from Leaderboard
              </div>
              <div style={{ color: '#A0AEC0', fontSize: '12px' }}>
                Go to Leaderboard tab to challenge trainers
              </div>
            </div>
          </div>
        </div>

        {/* Progress Info */}
        <div className="card">
          <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Progress</h3>
          <div className="progress-bar" style={{ marginBottom: '10px' }}>
            <div 
              className="progress-fill"
              style={{ width: `${(defeatedNpcs.length / npcs.length) * 100}%` }}
            ></div>
          </div>
          <p style={{ color: darkMode ? '#ffffff' : '#333', fontSize: '14px' }}>
            {defeatedNpcs.length} of {npcs.length} Pokémon defeated
          </p>
        </div>
      </div>
    );
  };

  if (combatState === 'fighting') {
    return (
      <>
        {/* Audio elements for sound effects */}
        <audio ref={normalSoundRef} src={require('../media/Normal.mp3')} preload="auto" />
        <audio ref={superEffectiveSoundRef} src={require('../media/SuperEffective.mp3')} preload="auto" />
        <audio ref={notVeryEffectiveSoundRef} src={require('../media/NotVeryEffective.mp3')} preload="auto" />
        
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
              src={getEnemySprite(currentEnemy.name, currentEnemy.image)} 
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
              src={GreninjaAniImage} 
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
                style={{ width: `${(playerHp / character.maxStats.hp) * 100}%` }}
              ></div>
            </div>
            <div style={{ fontSize: '11px', marginTop: '2px', color: darkMode ? '#fff' : '#333' }}>
              {playerHp} / {character.maxStats.hp} HP
            </div>
          </div>
        </div>

        {/* Battle Log - Above action buttons */}
        <div className="battle-log" style={{ marginBottom: '20px', minHeight: '60px', display: 'flex', alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            {effectivenessMessage ? (
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: effectivenessMessage.includes('super effective') ? '#00b894' : effectivenessMessage.includes('not very effective') ? '#fdcb6e' : '#ff6b6b' }}>
                {effectivenessMessage}
              </p>
            ) : isPlayerTurn && !buttonsDisabled ? (
              <p style={{ margin: '0', fontSize: '16px', color: '#00b894', fontWeight: 'bold' }}>
                Waiting for action...
              </p>
            ) : (
              <p style={{ margin: '0', fontSize: '16px', fontWeight: 'bold', color: '#FFFFFF' }}>
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
      </>
    );
  }

  if (combatState === 'result') {
    return (
      <>
        {/* Audio elements for sound effects */}
        <audio ref={normalSoundRef} src={require('../media/Normal.mp3')} preload="auto" />
        <audio ref={superEffectiveSoundRef} src={require('../media/SuperEffective.mp3')} preload="auto" />
        <audio ref={notVeryEffectiveSoundRef} src={require('../media/NotVeryEffective.mp3')} preload="auto" />
        
        <div className="combat-container">
        <h2 style={{ color: '#FFFFFF' }}>Battle Result</h2>
        
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
              src={GreninjaAniImage} 
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
              src={getEnemySprite(currentEnemy.name, currentEnemy.image)} 
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
          <h3 style={{ color: '#FFFFFF' }}>Battle Summary</h3>
          {combatLog.slice(-5).map((log, index) => (
            <p key={index} style={{ margin: '5px 0', fontSize: '14px', color: '#FFFFFF' }}>
              {log}
            </p>
          ))}
        </div>

        {playerHp > 0 && (
          <div className="card" style={{ marginBottom: '20px', backgroundColor: '#00b894', color: 'white' }}>
            <h3 style={{ color: 'white' }}>Victory Rewards!</h3>
            <p style={{ color: 'white' }}>Experience gained: +{currentEnemy.reward.experience} XP</p>
            <p style={{ color: 'white' }}>Gold gained: +{currentEnemy.reward.gold} Gold</p>
            {!currentEnemy.isTrainer && !defeatedNpcs.includes(currentEnemy.id) && (
              <p style={{ color: 'white', fontWeight: 'bold' }}>🎉 New area unlocked!</p>
            )}
            {currentEnemy.isTrainer && (
              <p style={{ color: 'white', fontWeight: 'bold' }}>🏆 Trainer defeated!</p>
            )}
          </div>
        )}

        <button className="btn" onClick={resetCombat}>
          Return to Map
        </button>
      </div>
      </>
    );
  }

  return (
    <>
      {/* Audio elements for sound effects */}
      <audio ref={normalSoundRef} src={require('../media/Normal.mp3')} preload="auto" />
      <audio ref={superEffectiveSoundRef} src={require('../media/SuperEffective.mp3')} preload="auto" />
      <audio ref={notVeryEffectiveSoundRef} src={require('../media/NotVeryEffective.mp3')} preload="auto" />
      
      {renderMap()}
    </>
  );
};

export default CombatTab; 