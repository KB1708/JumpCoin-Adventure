// Platformer Game Starter Code
// Uses Canvas API, vanilla JS
// Jumpcoin Adventure
// --- Canvas Setup ---
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// --- HUD Elements ---
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const livesEl = document.getElementById('lives');

// --- Input Handling ---
const keys = { left: false, right: false, up: false };
window.addEventListener('keydown', function(e) {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = true;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = true;
  if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keys.up = true;
});
window.addEventListener('keyup', function(e) {
  if (e.code === 'ArrowLeft' || e.code === 'KeyA') keys.left = false;
  if (e.code === 'ArrowRight' || e.code === 'KeyD') keys.right = false;
  if (e.code === 'ArrowUp' || e.code === 'Space' || e.code === 'KeyW') keys.up = false;
});

// --- Game Constants ---
const GRAVITY = 1200; // px/s^2
const JUMP_VELOCITY = -520; // px/s
const PLAYER_SPEED = 200; // px/s

// --- Utility: Collision Detection (AABB) ---
function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

// --- Player Class ---
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 50;
    this.vx = 0;
    this.vy = 0;
    this.onGround = false;
  }
  update(dt, platforms) {
    // Horizontal movement
    if (keys.left) this.vx = -PLAYER_SPEED;
    else if (keys.right) this.vx = PLAYER_SPEED;
    else this.vx = 0;

    // Jumping
    if (keys.up && this.onGround) {
      this.vy = JUMP_VELOCITY;
      this.onGround = false;
    }

    // Gravity
    this.vy += GRAVITY * dt;

    // Move horizontally
    this.x += this.vx * dt;
    // Prevent moving outside canvas horizontally
    if (this.x < 0) this.x = 0;
    if (this.x + this.width > canvas.width) this.x = canvas.width - this.width;
    // Horizontal collision with platforms
    for (let plat of platforms) {
      if (isColliding(this, plat)) {
        if (this.vx > 0) this.x = plat.x - this.width;
        else if (this.vx < 0) this.x = plat.x + plat.width;
      }
    }

    // Move vertically
    this.y += this.vy * dt;
    this.onGround = false;
    for (let plat of platforms) {
      if (isColliding(this, plat)) {
        if (this.vy > 0) { // falling
          this.y = plat.y - this.height;
          this.vy = 0;
          this.onGround = true;
        } else if (this.vy < 0) { // jumping up
          this.y = plat.y + plat.height;
          this.vy = 0;
        }
      }
    }

    // Prevent falling below ground
    if (this.y + this.height > canvas.height) {
      this.y = canvas.height - this.height;
      this.vy = 0;
      this.onGround = true;
    }
  }
  draw(ctx) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// --- Level Data Structure ---
const levels = [
  {
    platforms: [
      { x: 0, y: 400, width: 800, height: 50 },
      { x: 180, y: 300, width: 120, height: 20 },
      { x: 450, y: 250, width: 100, height: 20 }
    ],
    coins: [
      { x: 190, y: 270, width: 20, height: 20, collected: false },
      { x: 490, y: 220, width: 20, height: 20, collected: false },
      { x: 600, y: 370, width: 20, height: 20, collected: false }
    ],
    enemies: [
      { x: 500, y: 370, width: 40, height: 30, vx: 50, dir: 1, minX: 400, maxX: 760 }
    ],
    spikes: [
      { x: 380, y: 380, width: 40, height: 20 },
      { x: 680, y: 380, width: 40, height: 20 }
    ],
    destination: { x: 750, y: 350, width: 40, height: 50 },
    minCoins: 2
  },
  // Level 2
  {
    platforms: [
      { x: 0, y: 400, width: 800, height: 50 },
      { x: 100, y: 320, width: 120, height: 20 },
      { x: 300, y: 260, width: 100, height: 20 },
      { x: 500, y: 200, width: 150, height: 20 },
      { x: 650, y: 340, width: 80, height: 20 }
    ],
    coins: [
      { x: 100, y: 290, width: 20, height: 20, collected: false },
      { x: 380, y: 230, width: 20, height: 20, collected: false },
      { x: 560, y: 170, width: 20, height: 20, collected: false },
      { x: 680, y: 310, width: 20, height: 20, collected: false }
    ],
    enemies: [
      { x: 120, y: 370, width: 40, height: 30, vx: 60, dir: 1, minX: 150, maxX: 600 },
      { x: 520, y: 170, width: 40, height: 30, vx: 80, dir: 1, minX: 500, maxX: 650 }
    ],
    spikes: [
      { x: 400, y: 380, width: 40, height: 20 },
      { x: 135, y: 300, width: 40, height: 20 },
      { x: 330, y: 240, width: 40, height: 20 }
    ],
    destination: { x: 750, y: 150, width: 40, height: 50 },
    minCoins: 3
  },
  // Level 3
  {
    platforms: [
      { x: 0, y: 400, width: 800, height: 50 },
      { x: 80, y: 320, width: 80, height: 20 },
      { x: 220, y: 260, width: 100, height: 20 },
      { x: 400, y: 200, width: 120, height: 20 },
      { x: 600, y: 140, width: 100, height: 20 }
    ],
    coins: [
      { x: 115, y: 290, width: 20, height: 20, collected: false },
      { x: 260, y: 230, width: 20, height: 20, collected: false },
      { x: 420, y: 170, width: 20, height: 20, collected: false },
      { x: 650, y: 110, width: 20, height: 20, collected: false },
      { x: 720, y: 370, width: 20, height: 20, collected: false }
    ],
    enemies: [
      { x: 100, y: 370, width: 40, height: 30, vx: 90, dir: 1, minX: 150, maxX: 650 },
      { x: 420, y: 170, width: 40, height: 30, vx: 100, dir: 1, minX: 400, maxX: 520 }
    ],
    spikes: [
      { x: 400, y: 380, width: 40, height: 20 },
      { x: 600, y: 380, width: 40, height: 20 }
    ],
    destination: { x: 750, y: 90, width: 40, height: 50 },
    minCoins: 5
  }
];

// --- Overlay Elements ---
const levelCompleteOverlay = document.getElementById('levelCompleteOverlay');
const levelCompleteMsg = document.getElementById('levelCompleteMsg');
const nextLevelBtn = document.getElementById('nextLevelBtn');
const gameOverOverlay = document.getElementById('gameOverOverlay');
const restartBtn = document.getElementById('restartBtn');
const gameWinOverlay = document.getElementById('gameWinOverlay');
const playAgainBtn = document.getElementById('playAgainBtn');

let gamePaused = false;

function showOverlay(overlay) {
  overlay.style.display = 'flex';
  gamePaused = true;
}
function hideAllOverlays() {
  levelCompleteOverlay.style.display = 'none';
  gameOverOverlay.style.display = 'none';
  gameWinOverlay.style.display = 'none';
  gamePaused = false;
}

// --- Game State ---
let currentLevel = 0;
let coinsCollected = 0;
let lives = 3;
let player;
let levelState;

function deepCloneLevel(level) {
  // Deep clone platforms, coins, enemies, spikes, and destination
  return {
    platforms: level.platforms.map(p => ({ ...p })),
    coins: level.coins.map(c => ({ ...c })),
    enemies: level.enemies.map(e => ({ ...e })),
    spikes: (level.spikes || []).map(s => ({ ...s })),
    destination: { ...level.destination },
    minCoins: level.minCoins
  };
}

function resetLevel() {
  // Deep clone the level so enemy state is not shared
  levelState = deepCloneLevel(levels[currentLevel]);
  // Ensure all enemies are moving and placed correctly
  for (let enemy of levelState.enemies) {
    if (enemy.dir !== 1 && enemy.dir !== -1) enemy.dir = 1;
    // Fix: Always set vx to the original value from the level definition
    const origEnemy = (levels[currentLevel].enemies || []).find(e => e.x === enemy.x && e.y === enemy.y && e.width === enemy.width && e.height === enemy.height);
    enemy.vx = origEnemy && origEnemy.vx ? origEnemy.vx : 50;
    if (enemy.x < enemy.minX) enemy.x = enemy.minX;
    if (enemy.x > enemy.maxX - enemy.width) enemy.x = enemy.maxX - enemy.width;
  }
  player = new Player(50, 350);
  for (let coin of levelState.coins) coin.collected = false;
  coinsCollected = 0;
  updateHUD();
}

function nextLevel() {
  if (currentLevel === levels.length - 1) {
    // Finished last level
    showOverlay(gameWinOverlay);
    return;
  }
  currentLevel++;
  showLevelComplete(currentLevel);
}

function showLevelComplete(levelIdx) {
  levelCompleteMsg.textContent = `Level ${levelIdx} completed successfully!`;
  showOverlay(levelCompleteOverlay);
}

function loseLife() {
  lives--;
  if (lives <= 0) {
    showOverlay(gameOverOverlay);
    currentLevel = 0;
    lives = 3;
    return;
  }
  resetLevel();
}

// --- HUD Update ---
function updateHUD() {
  scoreEl.textContent = `Score: ${coinsCollected}`;
  levelEl.textContent = `Level: ${currentLevel + 1}`;
  // Display hearts for lives
  let hearts = '';
  for (let i = 0; i < lives; i++) hearts += '❤️';
  livesEl.textContent = `Lives: ${hearts}`;
  // Display minimum coins message
  const minCoinsMsg = document.getElementById('minCoinsMsg');
  if (minCoinsMsg && levelState && typeof levelState.minCoins === 'number') {
    minCoinsMsg.innerHTML = `Collect At least <b>${levelState.minCoins}</b> coins 🪙`;
  }
}

// --- Game Loop ---
let lastTime = 0;
function gameLoop(timestamp) {
  if (gamePaused) {
    requestAnimationFrame(gameLoop);
    return;
  }
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  update(dt);
  render();
  requestAnimationFrame(gameLoop);
}

function update(dt) {
  const level = levelState;
  player.update(dt, level.platforms);

  // Coin collection
  for (let coin of level.coins) {
    if (!coin.collected && isColliding(player, coin)) {
      coin.collected = true;
      coinsCollected++;
      updateHUD();
    }
  }

  // Enemy movement and collision
  for (let enemy of level.enemies) {
    enemy.x += enemy.vx * enemy.dir * dt;
    if (enemy.x < enemy.minX || enemy.x + enemy.width > enemy.maxX) enemy.dir *= -1;
    if (isColliding(player, enemy)) loseLife();
  }

  // Spike collision
  for (let spike of (level.spikes || [])) {
    if (isColliding(player, spike)) loseLife();
  }

  // Destination check
  if (
    isColliding(player, level.destination) &&
    coinsCollected >= level.minCoins
  ) {
    nextLevel();
  }
}

function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const level = levelState;

  // Draw platforms
  ctx.fillStyle = '#654321';
  for (let plat of level.platforms) {
    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
  }

  // Draw spikes
  for (let spike of (level.spikes || [])) {
    ctx.fillStyle = 'gray';
    ctx.beginPath();
    ctx.moveTo(spike.x, spike.y + spike.height);
    ctx.lineTo(spike.x + spike.width / 2, spike.y);
    ctx.lineTo(spike.x + spike.width, spike.y + spike.height);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#222';
    ctx.stroke();
  }

  // Draw coins
  for (let coin of level.coins) {
    if (!coin.collected) {
      ctx.fillStyle = 'gold';
      ctx.beginPath();
      ctx.arc(coin.x + 10, coin.y + 10, 10, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw enemies
  for (let enemy of level.enemies) {
    ctx.fillStyle = 'purple';
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
  }

  // Draw destination as a door
  const dest = level.destination;
  ctx.save();
  ctx.lineWidth = 4;
  ctx.strokeStyle = 'green';
  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.rect(dest.x, dest.y, dest.width, dest.height);
  ctx.fill();
  ctx.stroke();
  ctx.restore();

  // Draw player
  player.draw(ctx);
}

// --- Overlay Button Events ---
function triggerButton(btn) {
  if (btn && typeof btn.click === 'function') btn.click();
}
nextLevelBtn.onclick = function() {
  hideAllOverlays();
  resetLevel();
};
restartBtn.onclick = function() {
  hideAllOverlays();
  currentLevel = 0;
  lives = 3;
  resetLevel();
};
playAgainBtn.onclick = function() {
  hideAllOverlays();
  currentLevel = 0;
  lives = 3;
  resetLevel();
};
// Keyboard support for overlays
window.addEventListener('keydown', function(e) {
  if (gamePaused && (e.key === 'Enter' || e.code === 'Enter')) {
    if (levelCompleteOverlay.style.display === 'flex') triggerButton(nextLevelBtn);
    if (gameOverOverlay.style.display === 'flex') triggerButton(restartBtn);
    if (gameWinOverlay.style.display === 'flex') triggerButton(playAgainBtn);
  }
});

// --- Start Game ---
window.onload = function() {
  resetLevel();
  requestAnimationFrame(gameLoop);
};

// Add spikes on top of some platforms for all levels
levels[0].spikes.push({ x: 220, y: 280, width: 40, height: 20 });
levels[1].spikes = levels[1].spikes.filter(s => !(s.x === 500 && s.y === 180) && !(s.x === 600 && s.y === 180));
levels[2].spikes = [
  { x: 400, y: 380, width: 40, height: 20 },
  { x: 600, y: 380, width: 40, height: 20 }
];
levels[2].coins = [
  { x: 120, y: 290, width: 20, height: 20, collected: false },
  { x: 260, y: 230, width: 20, height: 20, collected: false },
  { x: 420, y: 170, width: 20, height: 20, collected: false },
  { x: 640, y: 110, width: 20, height: 20, collected: false },
  { x: 720, y: 370, width: 20, height: 20, collected: false }
]; 