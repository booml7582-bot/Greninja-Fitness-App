import React, { useState } from 'react';
import { Zap, Shield, TrendingUp, Heart } from 'lucide-react';

const TrainerSelection = ({ onTrainerSelect }) => {
  const [selectedTrainer, setSelectedTrainer] = useState('ced');
  const [currentPage, setCurrentPage] = useState(0);
  
  const trainers = [
    { 
      id: 'ced', 
      name: 'Trainer Ced', 
      avatar: '👨‍🦰',
      stats: {
        attack: 25,
        defense: 20,
        speed: 30,
        hp: 100
      }
    },
    { 
      id: 'naz', 
      name: 'Trainer Naz', 
      avatar: '👩‍🦱',
      stats: {
        attack: 28,
        defense: 22,
        speed: 32,
        hp: 100
      }
    },
    { 
      id: 'theo', 
      name: 'Trainer Theo', 
      avatar: '👨‍🦳',
      stats: {
        attack: 30,
        defense: 18,
        speed: 35,
        hp: 100
      }
    },
    { 
      id: 'krys', 
      name: 'Trainer Krys', 
      avatar: '👩‍🦲',
      stats: {
        attack: 22,
        defense: 25,
        speed: 28,
        hp: 100
      }
    },
    { 
      id: 'jesmer', 
      name: 'Trainer Jesmer', 
      avatar: '👨‍🦱',
      stats: {
        attack: 32,
        defense: 24,
        speed: 33,
        hp: 100
      }
    },
    { 
      id: 'gerimagne', 
      name: 'Trainer Gerimagne', 
      avatar: '👨‍💼',
      stats: {
        attack: 27,
        defense: 23,
        speed: 29,
        hp: 100
      }
    },
    { 
      id: 'gelo', 
      name: 'Trainer Gelo', 
      avatar: '👨‍🎓',
      stats: {
        attack: 26,
        defense: 21,
        speed: 31,
        hp: 100
      }
    },
    { 
      id: 'raszoul', 
      name: 'Trainer Raszoul', 
      avatar: '👨‍🔬',
      stats: {
        attack: 29,
        defense: 26,
        speed: 27,
        hp: 100
      }
    },
    { 
      id: 'ben', 
      name: 'Trainer Ben', 
      avatar: '👨‍🚀',
      stats: {
        attack: 31,
        defense: 19,
        speed: 34,
        hp: 100
      }
    },
    { 
      id: 'wacky', 
      name: 'Trainer Wacky', 
      avatar: '🤡',
      stats: {
        attack: 24,
        defense: 27,
        speed: 26,
        hp: 100
      }
    },
    { 
      id: 'ecat', 
      name: 'Trainer Ecat', 
      avatar: '🐱',
      stats: {
        attack: 33,
        defense: 17,
        speed: 36,
        hp: 100
      }
    }
  ];

  const currentTrainer = trainers.find(t => t.id === selectedTrainer);

  const getStatIcon = (statName) => {
    switch (statName) {
      case 'attack':
        return <Zap size={16} color="#E53E3E" />;
      case 'defense':
        return <Shield size={16} color="#3182CE" />;
      case 'speed':
        return <TrendingUp size={16} color="#D69E2E" />;
      case 'hp':
        return <Heart size={16} color="#48BB78" />;
      default:
        return <Zap size={16} />;
    }
  };

  const getStatColor = (statName) => {
    switch (statName) {
      case 'attack':
        return '#E53E3E';
      case 'defense':
        return '#3182CE';
      case 'speed':
        return '#D69E2E';
      case 'hp':
        return '#48BB78';
      default:
        return '#A0AEC0';
    }
  };

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentPage(prev => Math.min(Math.ceil(trainers.length / 3) - 1, prev + 1));
  };

  const getVisibleTrainers = () => {
    const startIndex = currentPage * 3;
    return trainers.slice(startIndex, startIndex + 3);
  };

  return (
    <div className="trainer-selection" style={{
      height: '100vh',
      background: '#1A202C',
      padding: '20px',
      color: '#FFFFFF',
      overflowY: 'auto',
      WebkitOverflowScrolling: 'touch'
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ 
          fontSize: '28px', 
          fontWeight: '700', 
          color: '#FFFFFF',
          marginBottom: '8px'
        }}>
          Select Your Trainer
        </h1>
        <p style={{ 
          fontSize: '16px', 
          color: '#A0AEC0',
          margin: 0
        }}>
          Choose your fitness companion
        </p>
      </div>

      {/* Available Trainers Card */}
      <div className="card" style={{
        background: '#2D3748',
        border: '1px solid #4A5568',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px'
      }}>
        <h3 style={{ 
          textAlign: 'center',
          fontSize: '20px',
          fontWeight: '600',
          color: '#FFFFFF',
          marginBottom: '20px'
        }}>
          Available Trainers
        </h3>
        
        {/* Trainer Selection Carousel */}
        <div style={{ 
          display: 'flex', 
          gap: '12px', 
          justifyContent: 'center',
          marginBottom: '20px',
          padding: '8px 0',
          minHeight: '120px'
        }}>
          {getVisibleTrainers().map(trainer => (
            <div
              key={trainer.id}
              onClick={() => setSelectedTrainer(trainer.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px',
                borderRadius: '12px',
                border: selectedTrainer === trainer.id ? '2px solid #3182CE' : '2px solid #4A5568',
                background: selectedTrainer === trainer.id ? 'rgba(49, 130, 206, 0.1)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                minWidth: '80px',
                position: 'relative',
                flex: '0 0 auto'
              }}
            >
              {selectedTrainer === trainer.id && (
                <div style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#3182CE',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  color: '#FFFFFF'
                }}>
                  ✓
                </div>
              )}
              <div style={{ 
                fontSize: '32px', 
                marginBottom: '8px'
              }}>
                {trainer.avatar}
              </div>
              <span style={{ 
                fontSize: '12px', 
                fontWeight: '600',
                color: '#FFFFFF',
                textAlign: 'center'
              }}>
                {trainer.name.split(' ')[1]}
              </span>
            </div>
          ))}
        </div>

        {/* Navigation Controls */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          padding: '0 20px'
        }}>
          <button 
            onClick={handlePrevious}
            disabled={currentPage === 0}
            style={{
              background: 'transparent',
              border: 'none',
              color: currentPage === 0 ? '#4A5568' : '#A0AEC0',
              cursor: currentPage === 0 ? 'default' : 'pointer',
              fontSize: '14px',
              padding: '8px 12px',
              opacity: currentPage === 0 ? 0.5 : 1
            }}
          >
            ← Previous
          </button>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {Array.from({ length: Math.ceil(trainers.length / 3) }, (_, index) => (
              <div
                key={index}
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: index === currentPage ? '#3182CE' : '#4A5568'
                }}
              />
            ))}
          </div>
          
          <button 
            onClick={handleNext}
            disabled={currentPage >= Math.ceil(trainers.length / 3) - 1}
            style={{
              background: 'transparent',
              border: 'none',
              color: currentPage >= Math.ceil(trainers.length / 3) - 1 ? '#4A5568' : '#A0AEC0',
              cursor: currentPage >= Math.ceil(trainers.length / 3) - 1 ? 'default' : 'pointer',
              fontSize: '14px',
              padding: '8px 12px',
              opacity: currentPage >= Math.ceil(trainers.length / 3) - 1 ? 0.5 : 1
            }}
          >
            Next →
          </button>
        </div>
      </div>

      {/* Selected Trainer Details Card */}
      <div className="card" style={{
        background: '#2D3748',
        border: '1px solid #4A5568',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '20px'
      }}>
        {/* Selected Trainer Display */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          marginBottom: '24px'
        }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '12px',
            border: '2px solid #3182CE',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '48px',
            marginBottom: '16px'
          }}>
            {currentTrainer.avatar}
          </div>
          <h3 style={{ 
            fontSize: '20px',
            fontWeight: '600',
            color: '#FFFFFF',
            margin: 0
          }}>
            {currentTrainer.name}
          </h3>
        </div>

        {/* Trainer Stats */}
        <div style={{ marginBottom: '24px' }}>
          <h4 style={{ 
            fontSize: '18px',
            fontWeight: '600',
            color: '#FFFFFF',
            marginBottom: '16px'
          }}>
            Trainer Stats
          </h4>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {Object.entries(currentTrainer.stats).map(([statName, value]) => (
              <div key={statName} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: '80px' }}>
                  {getStatIcon(statName)}
                  <span style={{ 
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#FFFFFF',
                    textTransform: 'capitalize'
                  }}>
                    {statName}
                  </span>
                </div>
                
                <div style={{ 
                  flex: 1,
                  height: '8px',
                  background: '#4A5568',
                  borderRadius: '4px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.min((value / 50) * 100, 100)}%`,
                    height: '100%',
                    background: getStatColor(statName),
                    borderRadius: '4px'
                  }} />
                </div>
                
                <span style={{ 
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#FFFFFF',
                  minWidth: '30px',
                  textAlign: 'right'
                }}>
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={() => onTrainerSelect(currentTrainer)}
          style={{
            width: '100%',
            background: '#3182CE',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          Choose {currentTrainer.name.split(' ')[1]}
        </button>
      </div>
    </div>
  );
};

export default TrainerSelection;
