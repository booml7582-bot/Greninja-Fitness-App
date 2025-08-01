import React, { useState, useEffect, useRef } from 'react';
import CharacterTab from './components/CharacterTab';
import TasksTab from './components/TasksTab';
import CombatTab from './components/CombatTab';
import OptionsTab from './components/OptionsTab';
import LeaderboardTab from './components/LeaderboardTab';
import TrainerSelection from './components/TrainerSelection';
import { Moon, Sun } from 'lucide-react';
import MenuMusic from './media/MenuMusic.mp3';
import BattleMusic from './media/BattleMusic.mp3';
import ButtonA from './media/ButtonA.mp3';
import { saveTrainerData, loadTrainerData, saveAppSettings, loadAppSettings } from './services/dataService';
import './App.css';

function App() {
  const [currentTrainer, setCurrentTrainer] = useState(null);
  const [showTrainerSelection, setShowTrainerSelection] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [activeTab, setActiveTab] = useState('character');
  const [darkMode, setDarkMode] = useState(false);
  const [isInCombat, setIsInCombat] = useState(false);
  const [selectedTrainerNpc, setSelectedTrainerNpc] = useState(null);
  
  // Audio refs
  const menuMusicRef = useRef(null);
  const battleMusicRef = useRef(null);
  const buttonSoundRef = useRef(null);
  
  // Audio settings
  const [audioSettings, setAudioSettings] = useState({
    volume: 0.5,
    menuMusicEnabled: true,
    battleMusicEnabled: true,
    buttonSoundEnabled: true
  });

  // Default character data
  const defaultCharacter = {
    name: 'Ash-Greninja',
    type: 'Water',
    level: 1,
    experience: 0,
    experienceToNext: 100,
    currentHp: 100,
    currency: 100, // Starting currency
    workoutStreak: 0, // Current workout streak
    lastWorkoutDate: null, // Track last workout date
    stats: {
      attack: 25,
      defense: 20,
      speed: 30,
      hp: 100,
      agility: 25
    },
    maxStats: {
      attack: 25,
      defense: 20,
      speed: 30,
      hp: 100,
      agility: 25
    },
    moves: [
      {
        name: 'Water Shuriken',
        type: 'Water',
        power: 15,
        accuracy: 100,
        pp: 20,
        maxPp: 20,
        description: 'Hits 2-5 times in one turn'
      },
      {
        name: 'Cut',
        type: 'Normal',
        power: 50,
        accuracy: 95,
        pp: 30,
        maxPp: 30,
        description: 'A basic cutting attack'
      },
      {
        name: 'Aerial Ace',
        type: 'Flying',
        power: 60,
        accuracy: 100,
        pp: 20,
        maxPp: 20,
        description: 'An attack that never misses'
      },
      {
        name: 'Hydro Pump',
        type: 'Water',
        power: 110,
        accuracy: 80,
        pp: 5,
        maxPp: 5,
        description: 'A powerful water attack'
      }
    ],
    password: ''
  };

  const [character, setCharacter] = useState(defaultCharacter);

  // Default tasks
  const [tasks] = useState([
    {
      id: 1,
      name: 'Push-ups',
      description: 'Do 10 push-ups to increase attack power',
      targetStat: 'attack',
      statIncrease: 2,
      difficulty: 'Easy',
      icon: '💪',
      completed: false
    },
    {
      id: 2,
      name: 'Squats',
      description: 'Do 15 squats to increase defense',
      targetStat: 'defense',
      statIncrease: 2,
      difficulty: 'Easy',
      icon: '🦵',
      completed: false
    },
    {
      id: 3,
      name: 'Jumping Jacks',
      description: 'Do 20 jumping jacks to increase speed',
      targetStat: 'speed',
      statIncrease: 3,
      difficulty: 'Medium',
      icon: '🏃',
      completed: false
    },
    {
      id: 4,
      name: 'Plank',
      description: 'Hold plank for 30 seconds for bonus XP and coins',
      targetStat: 'hp',
      statIncrease: 0,
      difficulty: 'Medium',
      icon: '🧘',
      completed: false,
      isBonusTask: true
    },
    {
      id: 5,
      name: 'Burpees',
      description: 'Do 5 burpees to increase agility',
      targetStat: 'agility',
      statIncrease: 3,
      difficulty: 'Hard',
      icon: '⚡',
      completed: false
    },
    {
      id: 6,
      name: 'Pull-ups',
      description: 'Do 3 pull-ups to increase attack power',
      targetStat: 'attack',
      statIncrease: 4,
      difficulty: 'Hard',
      icon: '🏋️',
      completed: false
    },
    {
      id: 7,
      name: 'Wall Sit',
      description: 'Hold wall sit for 45 seconds to increase defense',
      targetStat: 'defense',
      statIncrease: 3,
      difficulty: 'Medium',
      icon: '🪑',
      completed: false
    },
    {
      id: 8,
      name: 'High Knees',
      description: 'Do 30 high knees to increase speed',
      targetStat: 'speed',
      statIncrease: 4,
      difficulty: 'Medium',
      icon: '🦿',
      completed: false
    },
    {
      id: 9,
      name: 'Eating',
      description: 'Have a healthy meal to restore HP and PP',
      targetStat: 'hp',
      statIncrease: 0,
      difficulty: 'Easy',
      icon: '🍎',
      completed: false,
      isHealing: true
    }
  ]);

  // NPCs for wild battles
  const [npcs] = useState([
    {
      id: 1,
      name: 'Pikachu',
      type: 'Electric',
      level: 1,
      stats: { attack: 20, defense: 15, speed: 35, hp: 80, agility: 30 },
      avatar: '⚡',
      difficulty: 'Easy',
      reward: { experience: 20, gold: 10 },
      moves: [
        { name: 'Thunder Shock', type: 'Electric', power: 40, accuracy: 100, pp: 30, maxPp: 30 },
        { name: 'Quick Attack', type: 'Normal', power: 40, accuracy: 100, pp: 30, maxPp: 30 },
        { name: 'Tackle', type: 'Normal', power: 40, accuracy: 100, pp: 35, maxPp: 35 },
        { name: 'Thunderbolt', type: 'Electric', power: 90, accuracy: 100, pp: 15, maxPp: 15 }
      ]
    },
    {
      id: 2,
      name: 'Charizard',
      type: 'Fire',
      level: 2,
      stats: { attack: 30, defense: 25, speed: 25, hp: 100, agility: 20 },
      avatar: '🔥',
      difficulty: 'Easy',
      reward: { experience: 30, gold: 15 },
      moves: [
        { name: 'Ember', type: 'Fire', power: 40, accuracy: 100, pp: 25, maxPp: 25 },
        { name: 'Scratch', type: 'Normal', power: 40, accuracy: 100, pp: 35, maxPp: 35 },
        { name: 'Fire Fang', type: 'Fire', power: 65, accuracy: 95, pp: 15, maxPp: 15 },
        { name: 'Flamethrower', type: 'Fire', power: 90, accuracy: 100, pp: 15, maxPp: 15 }
      ]
    },
    {
      id: 3,
      name: 'Blastoise',
      type: 'Water',
      level: 3,
      stats: { attack: 35, defense: 40, speed: 20, hp: 140, agility: 15 },
      avatar: '🌊',
      difficulty: 'Medium',
      reward: { experience: 50, gold: 25 },
      moves: [
        { name: 'Water Gun', type: 'Water', power: 40, accuracy: 100, pp: 25, maxPp: 25 },
        { name: 'Bite', type: 'Dark', power: 60, accuracy: 100, pp: 25, maxPp: 25 },
        { name: 'Aqua Tail', type: 'Water', power: 90, accuracy: 90, pp: 10, maxPp: 10 },
        { name: 'Hydro Cannon', type: 'Water', power: 150, accuracy: 90, pp: 5, maxPp: 5 }
      ]
    },
    {
      id: 4,
      name: 'Mewtwo',
      type: 'Psychic',
      level: 5,
      stats: { attack: 50, defense: 45, speed: 40, hp: 200, agility: 35 },
      avatar: '🧬',
      difficulty: 'Hard',
      reward: { experience: 100, gold: 50 },
      moves: [
        { name: 'Confusion', type: 'Psychic', power: 50, accuracy: 100, pp: 25, maxPp: 25 },
        { name: 'Psychic', type: 'Psychic', power: 90, accuracy: 100, pp: 10, maxPp: 10 },
        { name: 'Shadow Ball', type: 'Ghost', power: 80, accuracy: 100, pp: 15, maxPp: 15 },
        { name: 'Psystrike', type: 'Psychic', power: 100, accuracy: 100, pp: 10, maxPp: 10 }
      ]
    }
  ]);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, []);

  // Audio management
  useEffect(() => {
    if (menuMusicRef.current) {
      menuMusicRef.current.volume = audioSettings.volume;
    }
    if (battleMusicRef.current) {
      battleMusicRef.current.volume = audioSettings.volume;
    }
    if (buttonSoundRef.current) {
      buttonSoundRef.current.volume = audioSettings.volume;
    }
  }, [audioSettings.volume]);

  useEffect(() => {
    if (isInCombat) {
      if (audioSettings.battleMusicEnabled) {
        if (menuMusicRef.current) menuMusicRef.current.pause();
        if (battleMusicRef.current) {
          battleMusicRef.current.currentTime = 0;
          battleMusicRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
      } else {
        if (battleMusicRef.current) battleMusicRef.current.pause();
      }
    } else {
      if (audioSettings.menuMusicEnabled) {
        if (battleMusicRef.current) battleMusicRef.current.pause();
        if (menuMusicRef.current) {
          menuMusicRef.current.currentTime = 0;
          menuMusicRef.current.play().catch(e => console.log('Audio play failed:', e));
        }
      } else {
        if (menuMusicRef.current) menuMusicRef.current.pause();
      }
    }
  }, [isInCombat, audioSettings.menuMusicEnabled, audioSettings.battleMusicEnabled]);

  const loadData = async () => {
    try {
      const savedSettings = await loadAppSettings();
      if (savedSettings) {
        setAudioSettings(savedSettings.audioSettings || audioSettings);
        setDarkMode(savedSettings.darkMode || false);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const saveData = async () => {
    try {
      const data = {
        audioSettings,
        darkMode
      };
      await saveAppSettings(data);
    } catch (error) {
      console.error('Error saving data:', error);
    }
  };

  const saveTrainerDataToCloud = async (trainerId, data) => {
    console.log('saveTrainerDataToCloud called with:', trainerId, data);
    try {
      await saveTrainerData(trainerId, data);
      await saveData();
      console.log('saveTrainerDataToCloud completed successfully');
    } catch (error) {
      console.error('Error saving trainer data:', error);
    }
  };

  const loadTrainerDataFromCloud = async (trainerId) => {
    try {
      return await loadTrainerData(trainerId);
    } catch (error) {
      console.error('Error loading trainer data:', error);
      return null;
    }
  };

  const handleTrainerSelect = async (trainer) => {
    setCurrentTrainer(trainer);
    
    // Load trainer data from cloud
    const trainerData = await loadTrainerDataFromCloud(trainer.id);
    if (trainerData) {
      setCharacter(trainerData.character);
      if (trainerData.character.password) {
        setShowPasswordModal(true);
        setShowTrainerSelection(false);
        return;
      }
    } else {
      // New trainer - save default data
      await saveTrainerDataToCloud(trainer.id, { character: defaultCharacter });
    }
    
    setShowTrainerSelection(false);
  };

  const handlePasswordSubmit = () => {
    if (passwordInput === character.password) {
      setShowPasswordModal(false);
      setPasswordInput('');
      setShowTrainerSelection(false);
    } else {
      alert('Incorrect password!');
      setPasswordInput('');
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPasswordInput('');
    setShowTrainerSelection(true);
  };

  const completeTask = async (taskId) => {
    playButtonSound();
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    setCharacter(prev => {
      let newStats = { ...prev.stats };
      let newCurrentHp = prev.currentHp;
      let newMoves = [...prev.moves];
      let newCurrency = prev.currency;
      let newWorkoutStreak = prev.workoutStreak;
      let newLastWorkoutDate = prev.lastWorkoutDate;

      // Add currency reward for completing task
      newCurrency += 15; // Base currency reward

      // Handle workout streak
      const today = new Date().toDateString();
      if (newLastWorkoutDate !== today) {
        if (newLastWorkoutDate === new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString()) {
          // Consecutive day
          newWorkoutStreak += 1;
        } else {
          // Break in streak
          newWorkoutStreak = 1;
        }
        newLastWorkoutDate = today;
      }

      // Bonus currency for maintaining streak
      if (newWorkoutStreak >= 3) {
        newCurrency += Math.floor(newWorkoutStreak / 3) * 10; // Bonus currency every 3 days
      }

      if (task.isHealing) {
        newCurrentHp = prev.maxStats.hp; // Use maxStats.hp instead of stats.hp
        newMoves = prev.moves.map(move => ({
          ...move,
          pp: move.maxPp
        }));
      } else if (task.isBonusTask) {
        // For bonus tasks, give bonus XP and coins instead of stat increase
        newCurrency += 10; // 10 coins for bonus tasks (Plank)
        // No stat increase for bonus tasks
      } else {
        // Increase only the current stat by the task's stat increase (max stats increase through leveling)
        newStats[task.targetStat] = Math.min(
          newStats[task.targetStat] + task.statIncrease,
          prev.maxStats[task.targetStat]
        );
      }

      const newExperience = prev.experience + (task.isBonusTask ? 50 : 10); // 50 XP for bonus tasks (Plank), 10 for regular tasks
      let newLevel = prev.level;
      let newExperienceToNext = prev.experienceToNext;

      let newMaxStats = { ...prev.maxStats };
      
      if (newExperience >= prev.experienceToNext) {
        newLevel += 1;
        newExperienceToNext = prev.experienceToNext * 1.5;
        
        // Increase HP and max stats on level up
        const hpIncrease = 3; // +3 HP every level
        const statIncrease = newLevel % 5 === 0 ? 2 : 1; // +2 every 5 levels, +1 otherwise
        
        newMaxStats.hp += hpIncrease;
        newMaxStats.attack += statIncrease;
        newMaxStats.defense += statIncrease;
        newMaxStats.speed += statIncrease;
        newMaxStats.agility += statIncrease;
        
        // Also increase current HP to match new max if it was at max
        if (newStats.hp >= prev.maxStats.hp) newStats.hp = newMaxStats.hp;
        
        // Restore HP on level up
        newCurrentHp = newMaxStats.hp;
      }

      const newCharacter = {
        ...prev,
        stats: newStats,
        currentHp: newCurrentHp,
        moves: newMoves,
        currency: newCurrency,
        workoutStreak: newWorkoutStreak,
        lastWorkoutDate: newLastWorkoutDate,
        experience: newExperience,
        level: newLevel,
        experienceToNext: newExperienceToNext,
        maxStats: newMaxStats
      };

      // Save updated character data
      if (currentTrainer) {
        saveTrainerDataToCloud(currentTrainer.id, { character: newCharacter });
      }

      return newCharacter;
    });
  };

  const updateCharacterName = async (newName) => {
    setCharacter(prev => {
      const newCharacter = { ...prev, name: newName };
      if (currentTrainer) {
        saveTrainerDataToCloud(currentTrainer.id, { character: newCharacter });
      }
      return newCharacter;
    });
  };

  const updateCharacterHp = async (newHp) => {
    setCharacter(prev => {
      const newCharacter = { ...prev, currentHp: newHp };
      if (currentTrainer) {
        saveTrainerDataToCloud(currentTrainer.id, { character: newCharacter });
      }
      return newCharacter;
    });
  };

  const updateCharacterMoves = async (newMoves) => {
    setCharacter(prev => {
      const newCharacter = { ...prev, moves: newMoves };
      if (currentTrainer) {
        saveTrainerDataToCloud(currentTrainer.id, { character: newCharacter });
      }
      return newCharacter;
    });
  };

  const updateCharacterPassword = async (newPassword) => {
    setCharacter(prev => {
      const newCharacter = { ...prev, password: newPassword };
      if (currentTrainer) {
        saveTrainerDataToCloud(currentTrainer.id, { character: newCharacter });
      }
      return newCharacter;
    });
  };

  const resetCharacter = async () => {
    if (window.confirm('Are you sure you want to reset your character? This will reset all stats and progress.')) {
      const newCharacter = { ...defaultCharacter, name: character.name, password: character.password };
      setCharacter(newCharacter);
      if (currentTrainer) {
        await saveTrainerDataToCloud(currentTrainer.id, { character: newCharacter });
      }
    }
  };

  const toggleDarkMode = async () => {
    playButtonSound();
    setDarkMode(!darkMode);
    await saveData();
  };

  const updateAudioSettings = async (newSettings) => {
    setAudioSettings(newSettings);
    await saveData();
  };

  const playButtonSound = () => {
    if (audioSettings.buttonSoundEnabled && buttonSoundRef.current) {
      buttonSoundRef.current.currentTime = 0;
      buttonSoundRef.current.play();
    }
  };

  const handleTabChange = (tabId) => {
    playButtonSound();
    setActiveTab(tabId);
  };

  const handleCombatStart = (trainerNpc = null) => {
    setIsInCombat(true);
    // If a trainer NPC is provided, we'll need to pass it to the combat system
    if (trainerNpc) {
      // We'll handle this in the CombatTab component
      setSelectedTrainerNpc(trainerNpc);
    }
  };

  const handleCombatEnd = () => {
    setIsInCombat(false);
  };

  const tabs = [
    { id: 'character', label: 'Character', icon: '👤' },
    { id: 'tasks', label: 'Tasks', icon: '📋' },
    { id: 'combat', label: 'Combat', icon: '⚔️' },
    { id: 'leaderboard', label: 'Leaderboard', icon: '🏆' },
    { id: 'options', label: 'Options', icon: '⚙️' }
  ];

  if (showTrainerSelection) {
    return <TrainerSelection onTrainerSelect={handleTrainerSelect} />;
  }

  if (showPasswordModal) {
    return (
      <div className="password-modal">
        <div className="password-content">
          <h2>Enter Password</h2>
          <p>This trainer is password protected.</p>
          <input
            type="password"
            className="password-input"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder="Enter password"
            onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            autoFocus
          />
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px' }}>
            <button className="btn" onClick={handlePasswordSubmit}>
              Enter
            </button>
            <button className="btn btn-secondary" onClick={handlePasswordCancel}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Audio Elements */}
      <audio ref={menuMusicRef} src={MenuMusic} loop />
      <audio ref={battleMusicRef} src={BattleMusic} loop />
      <audio ref={buttonSoundRef} src={ButtonA} />
      
      <div className="mobile-container">
        {/* Header */}
        <header className="mobile-header">
          <div className="header-content">
            <div className="header-left">
              <img 
                src={require('./media/logo.png')} 
                alt="Logo" 
                style={{ 
                  width: '128px', 
                  height: '48px', 
                  objectFit: 'contain'
                }} 
              />
            </div>
            <div className="header-right">
              <div className="xp-display">
                <span className="xp-icon">⭐</span>
                <span>{character.experience} XP</span>
              </div>
              <div className="currency-display">
                <span className="currency-icon">💰</span>
                <span>{character.currency}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="main-content">
          {activeTab === 'character' && (
            <CharacterTab
              character={character}
              onUpdateName={updateCharacterName}
              onUpdatePassword={updateCharacterPassword}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksTab
              tasks={tasks}
              character={character}
              onCompleteTask={completeTask}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'combat' && (
            <CombatTab
              character={character}
              npcs={npcs}
              setCharacter={setCharacter}
              onUpdateHp={updateCharacterHp}
              onUpdateMoves={updateCharacterMoves}
              darkMode={darkMode}
              onCombatStart={handleCombatStart}
              onCombatEnd={handleCombatEnd}
              currentTrainer={currentTrainer}
              selectedTrainerNpc={selectedTrainerNpc}
              setSelectedTrainerNpc={setSelectedTrainerNpc}
            />
          )}

          {activeTab === 'leaderboard' && (
            <LeaderboardTab
              currentTrainer={currentTrainer}
              character={character}
              onCombatStart={handleCombatStart}
              onCombatEnd={handleCombatEnd}
              onTabChange={handleTabChange}
              darkMode={darkMode}
            />
          )}

          {activeTab === 'options' && (
            <OptionsTab
              character={character}
              audioSettings={audioSettings}
              onUpdateAudioSettings={updateAudioSettings}
              onResetCharacter={resetCharacter}
              onUpdateName={updateCharacterName}
              onUpdatePassword={updateCharacterPassword}
              darkMode={darkMode}
            />
          )}
        </main>
      </div>

      {/* Bottom Navigation Tabs - Fixed Position */}
      <nav className="bottom-nav">
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span className="nav-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

export default App; 