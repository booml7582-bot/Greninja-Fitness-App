# 🏋️ Fitness Warrior - Gamified Fitness App

A React-based gamified fitness application where users can train their character through exercise tasks and battle NPCs in a combat arena.

## Features

### 🎮 Character System
- **5 Core Stats**: Attack, Defense, Speed, HP, and Agility
- **Level Progression**: Gain experience through completing tasks and winning battles
- **Visual Progress**: Beautiful stat bars and progress indicators
- **Character Avatar**: Changes based on level (💪 → 👑)

### 📋 Exercise Tasks
- **8 Different Exercises**: Push-ups, Squats, Jumping Jacks, Plank, Burpees, Pull-ups, Wall Sit, High Knees
- **Stat Targeting**: Each exercise increases specific character stats
- **Difficulty Levels**: Easy, Medium, and Hard tasks
- **Filtering System**: Filter tasks by target stat
- **Progress Tracking**: Visual feedback for completed tasks

### ⚔️ Combat Arena
- **4 Unique NPCs**: Lazy Goblin, Couch Potato, Gym Rat, Fitness Master
- **Turn-based Combat**: Strategic battles with damage calculation
- **Power Requirements**: Must train enough to fight stronger opponents
- **Experience Rewards**: Gain XP and level up through victories
- **Combat Log**: Detailed battle history and damage tracking

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the files locally, navigate to the project directory
   cd gamified-fitness-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   - The app will automatically open at `http://localhost:3000`
   - If it doesn't open automatically, manually navigate to the URL

## How to Play

### 1. Character Tab 👤
- View your character's current stats and level
- Monitor experience progress towards next level
- See total power and stat distributions

### 2. Tasks Tab 📋
- Browse available exercise tasks
- Filter by specific stats you want to improve
- Complete tasks to increase your character's stats
- Watch your progress bars fill up as you train

### 3. Combat Tab ⚔️
- Choose opponents based on your current power level
- Engage in turn-based combat
- Win battles to gain experience and level up
- Unlock stronger opponents as you progress

## Game Mechanics

### Stat System
- **Attack**: Increases damage dealt in combat
- **Defense**: Reduces damage taken from enemies
- **Speed**: Affects combat turn order and evasion
- **HP**: Maximum health points for battles
- **Agility**: Improves critical hit chance and dodge rate

### Experience & Leveling
- Complete tasks: +10 XP each
- Win battles: +20-100 XP (based on opponent difficulty)
- Level up: Increases all stats slightly
- Experience requirements increase with each level

### Combat System
- Turn-based attacks with damage calculation
- Random damage variation (80-120% of base damage)
- Defense reduces incoming damage
- Victory rewards experience and "gold"

## Technical Details

### Built With
- **React 18**: Modern React with hooks
- **CSS3**: Custom styling with gradients and animations
- **JavaScript ES6+**: Modern JavaScript features
- **Responsive Design**: Works on desktop and mobile devices

### Project Structure
```
src/
├── components/
│   ├── CharacterTab.js    # Character stats and info
│   ├── TasksTab.js        # Exercise tasks interface
│   └── CombatTab.js       # Combat arena and battles
├── App.js                 # Main app component
├── App.css               # App-specific styles
├── index.js              # React entry point
└── index.css             # Global styles
```

### Key Features
- **State Management**: React hooks for local state
- **Responsive UI**: Mobile-friendly design
- **Smooth Animations**: CSS transitions and hover effects
- **Gaming Aesthetics**: Modern gradient design with gaming elements

## Future Enhancements

Potential features that could be added:
- **Equipment System**: Gear that provides stat bonuses
- **Achievement System**: Unlockable achievements for milestones
- **Daily Challenges**: Special daily tasks with bonus rewards
- **Character Customization**: Different character classes and appearances
- **Multiplayer**: PvP battles with other players
- **Sound Effects**: Audio feedback for actions and combat
- **Save System**: Local storage for progress persistence

## Contributing

This is a frontend-only demonstration. To extend the app:
1. Add backend integration for data persistence
2. Implement user authentication
3. Add more exercises and NPCs
4. Create additional game mechanics
5. Enhance the UI/UX with more animations

## License

This project is open source and available under the MIT License.

---

**Enjoy your fitness journey! 💪🎮** 