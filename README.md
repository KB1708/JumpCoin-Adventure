# Platformer Game (Vanilla JS)

A browser-based platformer game inspired by Super Mario, built with HTML, CSS, and JavaScript (Canvas API).

## Features
- Move, jump, and collect coins
- Avoid spikes and enemies
- Progress through multiple levels
- Score, level, and lives displayed on screen

## Getting Started

1. **Download or clone this repository.**

2. **Open `index.html` in your web browser.**
   - No build tools or server required—just open the file directly.

## Controls
- **Left/Right:** Arrow keys or `A`/`D`
- **Jump:** Up arrow, `W`, or Spacebar

## File Structure
- `index.html` — Main HTML file, sets up the canvas and HUD
- `style.css` — Styles for the game and HUD
- `game.js` — All game logic (game loop, input, player, levels, etc.)

## How to Extend
- **Add more levels:** Edit the `levels` array in `game.js`.
- **Add new enemies or obstacles:** Add to the `enemies` array in each level.
- **Change player/enemy behavior:** Edit the `Player` class or enemy logic in `game.js`.
- **Improve graphics:** Replace shapes with images or add animations.

## Notes
- All code is commented for learning and easy modification.
- Works in any modern browser.

---

Enjoy building your platformer! 🚀 