import React, { useState } from 'react';
import { Target, Star, Zap, Shield, TrendingUp, CheckCircle } from 'lucide-react';

const TasksTab = ({ tasks, character, onCompleteTask, darkMode }) => {
  const [completedTaskId, setCompletedTaskId] = useState(null);

  const handleCompleteTask = (taskId) => {
    onCompleteTask(taskId);
    setCompletedTaskId(taskId);
    
    // Reset the feedback after 2 seconds
    setTimeout(() => {
      setCompletedTaskId(null);
    }, 2000);
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return '#48BB78';
      case 'medium':
        return '#ED8936';
      case 'hard':
        return '#E53E3E';
      default:
        return '#48BB78';
    }
  };

  const getDifficultyLabel = (difficulty) => {
    return difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
  };

  const getTaskIcon = (taskType) => {
    switch (taskType.toLowerCase()) {
      case 'attack':
        return <Zap size={20} />;
      case 'defense':
        return <Shield size={20} />;
      case 'speed':
        return <TrendingUp size={20} />;
      case 'hp':
        return <Target size={20} />;
      case 'agility':
        return <Zap size={20} />;
      default:
        return <Target size={20} />;
    }
  };

  const getXpReward = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 15;
      case 'medium':
        return 25;
      case 'hard':
        return 40;
      default:
        return 15;
    }
  };

  return (
    <div className="tasks-tab">
      {/* Success Notification */}
      {completedTaskId && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#48BB78',
          color: 'white',
          padding: '12px 24px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          zIndex: 1000,
          boxShadow: '0 4px 12px rgba(72, 187, 120, 0.4)',
          animation: 'slideDown 0.3s ease-out'
        }}>
          ✅ Task completed successfully!
        </div>
      )}
      {/* Weekly Challenge Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #2D3748 0%, #553C9A 100%)',
        border: '1px solid #553C9A',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Star size={20} color="#F6E05E" />
          <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', margin: 0 }}>Weekly Challenge</h3>
        </div>
        <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>Master of Disguise</h4>
        <p style={{ color: '#E2E8F0', fontSize: '14px', marginBottom: '16px' }}>Complete all daily tasks for 5 days</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <span style={{ color: '#E2E8F0', fontSize: '14px' }}>Progress: 3/5 days</span>
          <div style={{ flex: 1, height: '8px', background: '#4A5568', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ width: '60%', height: '100%', background: '#553C9A', borderRadius: '4px' }}></div>
          </div>
          <span style={{ color: '#F6E05E', fontSize: '14px', fontWeight: '600' }}>+500 XP</span>
        </div>
        <p style={{ color: '#A0AEC0', fontSize: '12px', margin: 0 }}>Reward: Greninja Evolution Boost</p>
      </div>

      {/* Daily Tasks Section */}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
          <Target size={20} color="#63B3ED" />
          <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', margin: 0 }}>Daily Tasks</h3>
        </div>
      </div>

      {/* Individual Task Cards */}
      {tasks.map((task) => (
        <div key={task.id} className="card" style={{
          background: task.completed ? '#4A5568' : '#2D3748',
          border: '1px solid #4A5568',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <div style={{ color: '#F6E05E' }}>
                {getTaskIcon(task.targetStat)}
              </div>
              <div style={{ flex: 1 }}>
                <h4 style={{ color: '#FFFFFF', fontSize: '16px', fontWeight: '600', margin: '0 0 4px 0' }}>
                  {task.name}
                </h4>
                <p style={{ color: '#A0AEC0', fontSize: '14px', margin: 0 }}>
                  {task.description}
                </p>
              </div>
            </div>
            <span style={{
              background: getDifficultyColor(task.difficulty),
              color: '#FFFFFF',
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: '600'
            }}>
              {getDifficultyLabel(task.difficulty)}
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '12px' }}>
              <span style={{ color: '#F6E05E', fontSize: '14px', fontWeight: '600' }}>
                +{task.isBonusTask ? '50' : getXpReward(task.difficulty)} XP
              </span>
              {!task.isHealing && !task.isBonusTask && (
                <span style={{ color: '#FFFFFF', fontSize: '14px' }}>
                  {task.targetStat.charAt(0).toUpperCase() + task.targetStat.slice(1)} +{task.statIncrease}
                </span>
              )}
              {task.isBonusTask && (
                <span style={{ color: '#F6E05E', fontSize: '14px' }}>
                  +10 Coins
                </span>
              )}
              {task.isHealing && (
                <span style={{ color: '#48BB78', fontSize: '14px' }}>
                  Restore HP & PP
                </span>
              )}
            </div>
            
            {task.completed ? (
              <button 
                className="btn" 
                style={{ 
                  background: '#48BB78',
                  color: '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'default'
                }}
                disabled
              >
                <CheckCircle size={16} style={{ marginRight: '4px' }} />
                Completed
              </button>
            ) : (
              <button 
                className="btn"
                onClick={() => handleCompleteTask(task.id)}
                style={{ 
                  background: completedTaskId === task.id ? '#48BB78' : '#3182CE',
                  color: '#FFFFFF',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  fontSize: '12px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  transform: completedTaskId === task.id ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: completedTaskId === task.id ? '0 4px 12px rgba(72, 187, 120, 0.4)' : '0 2px 8px rgba(49, 130, 206, 0.3)'
                }}
              >
                {completedTaskId === task.id ? (
                  <>
                    <CheckCircle size={16} style={{ marginRight: '4px' }} />
                    Completed!
                  </>
                ) : (
                  task.isHealing ? 'Eat & Restore' : 'Complete Task'
                )}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TasksTab; 