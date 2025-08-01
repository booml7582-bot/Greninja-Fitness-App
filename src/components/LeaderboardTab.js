import React, { useState, useEffect } from 'react';
import { Trophy, Crown, Medal, Flame } from 'lucide-react';
import { loadAllTrainersData } from '../services/dataService';

const LeaderboardTab = ({ currentTrainer, character, onCombatStart, onCombatEnd, onTabChange, darkMode }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, [character, currentTrainer]);

  const loadLeaderboard = async () => {
    try {
      const allTrainersData = await loadAllTrainersData();
      
      // Create leaderboard entries from actual trainer data
      const trainers = [
        { id: 'ced', name: 'Trainer Ced', avatar: '👨‍🦰' },
        { id: 'naz', name: 'Trainer Naz', avatar: '👩‍🦱' },
        { id: 'theo', name: 'Trainer Theo', avatar: '👨‍🦳' },
        { id: 'krys', name: 'Trainer Krys', avatar: '👩‍🦲' },
        { id: 'jesmer', name: 'Trainer Jesmer', avatar: '👨‍🦱' },
        { id: 'gerimagne', name: 'Trainer Gerimagne', avatar: '👨‍💼' },
        { id: 'gelo', name: 'Trainer Gelo', avatar: '👨‍🎓' },
        { id: 'raszoul', name: 'Trainer Raszoul', avatar: '👨‍🔬' },
        { id: 'ben', name: 'Trainer Ben', avatar: '👨‍🚀' },
        { id: 'wacky', name: 'Trainer Wacky', avatar: '🤡' },
        { id: 'ecat', name: 'Trainer Ecat', avatar: '🐱' }
      ];

      const leaderboardEntries = [];
      
      trainers.forEach((trainer, index) => {
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
            experience: 0,
            stats: { attack: 10, defense: 8, speed: 12, hp: 100, agility: 15 },
            completedTasks: 0,
            workoutStreak: 0
          };
        }
        
        const totalPower = Object.values(trainerCharacter.stats).reduce((sum, stat) => sum + stat, 0);
        
        leaderboardEntries.push({
          rank: index + 1,
          name: trainer.name,
          level: trainerCharacter.level || 1,
          xp: trainerCharacter.experience || 0,
          dayStreak: trainerCharacter.workoutStreak || 0,
          avatar: trainer.avatar,
          isCurrentUser: trainer.id === currentTrainer?.id,
          totalPower,
          trainerCharacter // Store the actual character data
        });
      });

      // Sort by total power (descending)
      leaderboardEntries.sort((a, b) => b.totalPower - a.totalPower);
      
      // Update ranks after sorting
      leaderboardEntries.forEach((entry, index) => {
        entry.rank = index + 1;
      });

      setLeaderboardData(leaderboardEntries);
      setLoading(false);
    } catch (error) {
      console.error('Error loading leaderboard:', error);
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Crown size={20} color="#F6E05E" />;
      case 2:
        return <Medal size={20} color="#A0AEC0" />;
      case 3:
        return <Medal size={20} color="#D69E2E" />;
      default:
        return <span style={{ color: '#A0AEC0', fontSize: '14px', fontWeight: '600' }}>#{rank}</span>;
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-tab">
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ color: '#A0AEC0' }}>Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-tab">
      {/* Global Leaderboard Card */}
      <div className="card" style={{
        background: 'linear-gradient(135deg, #2D3748 0%, #553C9A 100%)',
        border: '1px solid #553C9A',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
        textAlign: 'center',
        padding: '32px 24px'
      }}>
        <div style={{ marginBottom: '16px' }}>
          <Trophy size={32} color="#F6E05E" />
        </div>
        <h2 style={{ color: '#FFFFFF', fontSize: '24px', fontWeight: '700', marginBottom: '8px' }}>
          Global Leaderboard
        </h2>
        <p style={{ color: '#E2E8F0', fontSize: '16px', margin: 0 }}>
          Compete with trainers worldwide!
        </p>
      </div>

      {/* Weekly Champion Card */}
      {leaderboardData.length > 0 && (
        <div className="card" style={{
          background: 'linear-gradient(135deg, #744210 0%, #D69E2E 100%)',
          border: '1px solid #D69E2E',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Crown size={24} color="#F6E05E" />
            <div>
              <h3 style={{ color: '#F6E05E', fontSize: '20px', fontWeight: '700', margin: '0 0 4px 0' }}>
                Weekly Champion
              </h3>
              <p style={{ color: '#F6E05E', fontSize: '14px', margin: 0 }}>
                {leaderboardData[0]?.name} - {leaderboardData[0]?.dayStreak} day streak!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Leaderboard Entries */}
      {leaderboardData.map((player, index) => (
        <div key={index} className="card" style={{
          background: player.isCurrentUser ? '#4A5568' : '#2D3748',
          border: player.isCurrentUser ? '2px solid #3182CE' : '1px solid #4A5568',
          marginBottom: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Rank Icon */}
            <div style={{ width: '24px', display: 'flex', justifyContent: 'center' }}>
              {getRankIcon(player.rank)}
            </div>

            {/* Avatar */}
            <div style={{
              width: '40px',
              height: '40px',
              background: '#3182CE',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              {player.avatar}
            </div>

            {/* Player Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ 
                  color: '#FFFFFF', 
                  fontSize: '16px', 
                  fontWeight: '600' 
                }}>
                  {player.name}
                </span>
                {player.isCurrentUser && (
                  <span style={{
                    background: '#3182CE',
                    color: '#FFFFFF',
                    padding: '2px 6px',
                    borderRadius: '8px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    You
                  </span>
                )}
              </div>
              <div style={{ color: '#A0AEC0', fontSize: '12px' }}>
                Level {player.level} • {player.totalPower} power
              </div>
            </div>

            {/* Stats */}
            <div style={{ textAlign: 'right' }}>
              <div style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600', marginBottom: '4px' }}>
                {player.totalPower} power
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ED8936', fontSize: '12px' }}>
                <Flame size={12} />
                <span>{player.dayStreak} day streak</span>
              </div>
              {!player.isCurrentUser && (
                <button
                  className="btn"
                  onClick={() => {
                    // Create a trainer NPC from the player data using actual stats
                    const trainerNpc = {
                      id: `trainer_${player.name}`,
                      name: player.trainerCharacter.name, // Use character name instead of trainer name
                      type: player.trainerCharacter.type || 'Normal', // Use actual character type
                      level: player.level,
                      stats: player.trainerCharacter.stats, // Use actual stats
                      avatar: player.avatar,
                      difficulty: 'Trainer',
                      reward: { experience: player.level * 10, gold: player.level * 5 },
                      moves: player.trainerCharacter.moves || [
                        { name: 'Tackle', type: 'Normal', power: 40, accuracy: 100, pp: 30, maxPp: 30 },
                        { name: 'Quick Attack', type: 'Normal', power: 40, accuracy: 100, pp: 30, maxPp: 30 },
                        { name: 'Body Slam', type: 'Normal', power: 85, accuracy: 100, pp: 15, maxPp: 15 },
                        { name: 'Hyper Beam', type: 'Normal', power: 150, accuracy: 90, pp: 5, maxPp: 5 }
                      ],
                      isTrainer: true,
                      image: require('../media/OpponentGreninjaAni.gif')
                    };
                    
                    // Pass the trainer NPC to combat
                    onCombatStart(trainerNpc);
                    onTabChange('combat');
                  }}
                  style={{
                    background: '#E53E3E',
                    color: '#FFFFFF',
                    padding: '6px 12px',
                    borderRadius: '6px',
                    border: 'none',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    marginTop: '4px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Battle
                </button>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Your Stats This Week Section */}
      <div style={{ marginTop: '24px' }}>
        <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>
          Your Stats This Week
        </h3>
        <div className="card" style={{ background: '#2D3748', border: '1px solid #4A5568' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <span style={{ color: '#FFFFFF', fontSize: '16px' }}>Total Power</span>
            <span style={{ color: '#F6E05E', fontSize: '18px', fontWeight: '600' }}>
              {Object.values(character.stats).reduce((sum, stat) => sum + stat, 0)}
            </span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: '#A0AEC0', fontSize: '14px' }}>Current Rank</span>
            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: '600' }}>
              #{leaderboardData.find(p => p.isCurrentUser)?.rank || 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardTab;
