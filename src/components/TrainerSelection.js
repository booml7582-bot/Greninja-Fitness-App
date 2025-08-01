import React from 'react';

const TrainerSelection = ({ onTrainerSelect }) => {
  const trainers = [
    { id: 'ced', name: 'Trainer Ced', avatar: '👨‍🦰' },
    { id: 'naz', name: 'Trainer Naz', avatar: '👩‍🦱' },
    { id: 'theo', name: 'Trainer Theo', avatar: '👨‍🦳' },
    { id: 'krys', name: 'Trainer Krys', avatar: '👩‍🦲' },
    { id: 'jesmer', name: 'Trainer Jesmer', avatar: '👨‍🦱' }
  ];

  return (
    <div className="trainer-selection">
      <h1>🏋️ Fitness Warrior</h1>
      <p>Choose your trainer to begin your fitness journey!</p>
      
      <div className="trainer-grid">
        {trainers.map(trainer => (
          <div
            key={trainer.id}
            className="trainer-card"
            onClick={() => onTrainerSelect(trainer)}
          >
            <div className="trainer-avatar">
              {trainer.avatar}
            </div>
            <h3>{trainer.name}</h3>
            <p>Click to select this trainer</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainerSelection; 