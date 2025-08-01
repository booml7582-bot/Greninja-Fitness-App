import React, { useState } from 'react';

const TasksTab = ({ tasks, character, onCompleteTask, darkMode }) => {
  const [selectedStat, setSelectedStat] = useState('all');
  const [completedTasks, setCompletedTasks] = useState([]);

  const stats = [
    { key: 'all', label: 'All Tasks', icon: '📋' },
    { key: 'attack', label: 'Attack', icon: '⚔️' },
    { key: 'defense', label: 'Defense', icon: '🛡️' },
    { key: 'speed', label: 'Speed', icon: '🏃' },
    { key: 'hp', label: 'HP', icon: '❤️' },
    { key: 'agility', label: 'Agility', icon: '⚡' }
  ];

  const filteredTasks = selectedStat === 'all' 
    ? tasks 
    : tasks.filter(task => task.targetStat === selectedStat);

  const handleCompleteTask = (taskId) => {
    if (completedTasks.includes(taskId)) return;
    
    setCompletedTasks(prev => [...prev, taskId]);
    onCompleteTask(taskId);
    
    // Reset completed status after 3 seconds
    setTimeout(() => {
      setCompletedTasks(prev => prev.filter(id => id !== taskId));
    }, 3000);
  };

  const getDifficultyColor = (difficulty) => {
    const colors = {
      'Easy': '#00b894',
      'Medium': '#fdcb6e',
      'Hard': '#ff6b6b'
    };
    return colors[difficulty] || '#667eea';
  };

  const getStatColor = (statName) => {
    const colors = {
      attack: '#ff6b6b',
      defense: '#74b9ff',
      speed: '#00b894',
      hp: '#fd79a8',
      agility: '#fdcb6e'
    };
    return colors[statName] || '#667eea';
  };

  return (
    <div className="card">
      <h2 style={{ color: darkMode ? '#ffffff' : '#333' }}>Training Tasks</h2>
      <p style={{ marginBottom: '20px', color: darkMode ? '#ffffff' : '#666' }}>
        Complete exercises to increase your character's stats and prepare for combat!
      </p>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>Filter by Stat</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {stats.map(stat => (
            <button
              key={stat.key}
              className={`btn ${selectedStat === stat.key ? 'btn-success' : 'btn-secondary'}`}
              style={{ fontSize: '14px', padding: '8px 16px' }}
              onClick={() => setSelectedStat(stat.key)}
            >
              <span style={{ marginRight: '5px' }}>{stat.icon}</span>
              {stat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-3">
        {filteredTasks.map(task => {
          const isCompleted = completedTasks.includes(task.id);
          const currentStat = character.stats[task.targetStat];
          const maxStat = character.maxStats[task.targetStat];
          const canImprove = task.isHealing || currentStat < maxStat;

          return (
            <div key={task.id} className="task-card">
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                <div className="exercise-icon">
                  {task.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: '0 0 5px 0', color: darkMode ? '#ffffff' : '#333' }}>{task.name}</h3>
                  <span 
                    style={{ 
                      backgroundColor: getDifficultyColor(task.difficulty),
                      color: 'white',
                      padding: '2px 8px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}
                  >
                    {task.difficulty}
                  </span>
                </div>
              </div>

              <p style={{ marginBottom: '15px', color: darkMode ? '#ffffff' : '#666' }}>
                {task.description}
              </p>

              {!task.isHealing && (
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '14px', color: darkMode ? '#ffffff' : '#666' }}>
                      {task.targetStat.charAt(0).toUpperCase() + task.targetStat.slice(1)} +{task.statIncrease}
                    </span>
                    <span style={{ fontSize: '14px', color: darkMode ? '#ffffff' : '#666' }}>
                      {currentStat} / {maxStat}
                    </span>
                  </div>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill"
                      style={{ 
                        width: `${Math.round((currentStat / maxStat) * 100)}%`,
                        background: getStatColor(task.targetStat)
                      }}
                    ></div>
                  </div>
                </div>
              )}

              {task.isHealing && (
                <div style={{ marginBottom: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '14px', color: '#00b894', fontWeight: 'bold' }}>
                      Restore HP & PP
                    </span>
                    <span style={{ fontSize: '14px', color: darkMode ? '#ffffff' : '#666' }}>
                      {character.currentHp} / {character.stats.hp} HP
                    </span>
                  </div>
                  <div className="stat-bar">
                    <div 
                      className="stat-fill"
                      style={{ 
                        width: `${Math.round((character.currentHp / character.stats.hp) * 100)}%`,
                        background: getStatColor('hp')
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <button
                className={`btn ${isCompleted ? 'btn-success' : 'btn'}`}
                onClick={() => handleCompleteTask(task.id)}
                disabled={isCompleted}
                style={{ width: '100%' }}
              >
                {isCompleted ? '✅ Completed!' : 
                 task.isHealing ? 'Eat & Restore' : 'Complete Task'}
              </button>

              {task.isHealing && (
                <p style={{ 
                  textAlign: 'center', 
                  marginTop: '10px', 
                  fontSize: '12px', 
                  color: '#00b894',
                  fontWeight: 'bold'
                }}>
                  Restores all HP and PP!
                </p>
              )}
            </div>
          );
        })}
      </div>

      {filteredTasks.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: darkMode ? '#ffffff' : '#666' }}>
          <h3 style={{ color: darkMode ? '#ffffff' : '#333' }}>No tasks available for this stat</h3>
          <p>Try selecting a different stat or check back later for new challenges!</p>
        </div>
      )}
    </div>
  );
};

export default TasksTab; 