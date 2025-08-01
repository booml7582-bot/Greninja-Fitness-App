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
    level: 1,
    experience: 0,
    experienceToNext: 100,
    currentHp: 100,
    stats: {
      attack: 10,
      defense: 8,
      speed: 12,
      hp: 100,
      agility: 15
    },
    maxStats: {
      attack: 100,
      defense: 100,
      speed: 100,
      hp: 200,
      agility: 100
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
      description: 'Hold plank for 30 seconds to increase HP',
      targetStat: 'hp',
      statIncrease: 5,
      difficulty: 'Medium',
      icon: '🧘',
      completed: false
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
      level: 1,
      stats: { attack: 5, defense: 3, speed: 8, hp: 50, agility: 6 },
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
      level: 2,
      stats: { attack: 8, defense: 6, speed: 5, hp: 80, agility: 4 },
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
      level: 3,
      stats: { attack: 15, defense: 12, speed: 10, hp: 120, agility: 8 },
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
      level: 5,
      stats: { attack: 25, defense: 20, speed: 18, hp: 200, agility: 15 },
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

      if (task.isHealing) {
        newCurrentHp = prev.stats.hp;
        newMoves = prev.moves.map(move => ({
          ...move,
          pp: move.maxPp
        }));
      } else {
        newStats[task.targetStat] = Math.min(
          newStats[task.targetStat] + task.statIncrease,
          prev.maxStats[task.targetStat]
        );
      }

      const newExperience = prev.experience + 10;
      let newLevel = prev.level;
      let newExperienceToNext = prev.experienceToNext;

      if (newExperience >= prev.experienceToNext) {
        newLevel += 1;
        newExperienceToNext = prev.experienceToNext * 1.5;
      }

      const newCharacter = {
        ...prev,
        stats: newStats,
        currentHp: newCurrentHp,
        moves: newMoves,
        experience: newExperience,
        level: newLevel,
        experienceToNext: newExperienceToNext
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

  const handleCombatStart = () => {
    setIsInCombat(true);
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
    <div className={`App ${darkMode ? 'dark-mode' : ''}`}>
      {/* Audio Elements */}
      <audio ref={menuMusicRef} src={MenuMusic} loop />
      <audio ref={battleMusicRef} src={BattleMusic} loop />
      <audio ref={buttonSoundRef} src={ButtonA} />
      
      <div className="container">
        <header className="app-header">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div>
              <h1>🏋️ Fitness Warrior</h1>
              <p>Trainer: {currentTrainer?.name} | Level up your character through exercise!</p>
            </div>
            <button 
              onClick={toggleDarkMode}
              className="dark-mode-toggle"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>
        </header>

        <div className="tab-container">
          {tabs.map(tab => (
            <div
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => handleTabChange(tab.id)}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </div>
          ))}
        </div>

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
          />
        )}

        {activeTab === 'leaderboard' && (
          <LeaderboardTab 
            currentTrainer={currentTrainer}
            character={character}
            onCombatStart={handleCombatStart}
            onCombatEnd={handleCombatEnd}
            darkMode={darkMode}
          />
        )}

        {activeTab === 'options' && (
          <OptionsTab 
            audioSettings={audioSettings}
            onUpdateAudioSettings={updateAudioSettings}
            onResetCharacter={resetCharacter}
            darkMode={darkMode}
          />
        )}
      </div>
    </div>
  );
}

export default App; 