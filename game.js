// Platformer Game Starter Code
// Uses Canvas API, vanilla JS

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
      { x: 200, y: 300, width: 100, height: 20 },
      { x: 400, y: 250, width: 120, height: 20 }
    ],
    coins: [
      { x: 220, y: 270, width: 20, height: 20, collected: false },
      { x: 420, y: 220, width: 20, height: 20, collected: false },
      { x: 600, y: 370, width: 20, height: 20, collected: false }
    ],
    enemies: [
      { x: 500, y: 370, width: 40, height: 30, vx: 50, dir: 1 }
    ],
    destination: { x: 750, y: 350, width: 40, height: 50 },
    minCoins: 2
  },
  // Add more levels for progression
];

// --- Game State ---
let currentLevel = 0;
let coinsCollected = 0;
let lives = 3;
let player;

function resetLevel() {
  const level = levels[currentLevel];
  player = new Player(50, 350);
  for (let coin of level.coins) coin.collected = false;
  coinsCollected = 0;
  updateHUD();
}

function nextLevel() {
  currentLevel++;
  if (currentLevel >= levels.length) {
    alert('You win!');
    currentLevel = 0;
    lives = 3;
  }
  resetLevel();
}

function loseLife() {
  lives--;
  if (lives <= 0) {
    alert('Game Over!');
    currentLevel = 0;
    lives = 3;
  }
  resetLevel();
}

// --- HUD Update ---
function updateHUD() {
  scoreEl.textContent = `Score: ${coinsCollected}`;
  levelEl.textContent = `Level: ${currentLevel + 1}`;
  livesEl.textContent = `Lives: ${lives}`;
}

// --- Game Loop ---
let lastTime = 0;
function gameLoop(timestamp) {
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;
  update(dt);
  render();
  requestAnimationFrame(gameLoop);
}

function update(dt) {
  const level = levels[currentLevel];
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
    // Bounce enemy between platform edges
    if (enemy.x < 400 || enemy.x + enemy.width > 760) enemy.dir *= -1;
    if (isColliding(player, enemy)) loseLife();
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
  const level = levels[currentLevel];

  // Draw platforms
  ctx.fillStyle = '#654321';
  for (let plat of level.platforms) {
    ctx.fillRect(plat.x, plat.y, plat.width, plat.height);
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

  // Draw destination
  ctx.fillStyle = 'green';
  const dest = level.destination;
  ctx.fillRect(dest.x, dest.y, dest.width, dest.height);

  // Draw player
  player.draw(ctx);
}

// --- Start Game ---
window.onload = function() {
  resetLevel();
  requestAnimationFrame(gameLoop);
}; 