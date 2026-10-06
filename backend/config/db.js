const fs = require('fs');
const path = require('path');

// Detect Vercel serverless environment
const isVercel = Boolean(process.env.VERCEL);

// On Vercel, the filesystem is read-only except for /tmp
const DATA_DIR = isVercel ? '/tmp' : path.join(__dirname, '../data');
const DATA_FILE = path.join(DATA_DIR, 'players.json');
const INITIAL_SEED_FILE = path.join(__dirname, '../data/players.json');

// In-memory cache for serverless lifecycles
let memoryCache = null;

// Ensure storage file exists
function initDB() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (!fs.existsSync(DATA_FILE)) {
      // If we have an initial seed file, copy it over; otherwise empty array
      let initialData = '[]';
      if (fs.existsSync(INITIAL_SEED_FILE)) {
        initialData = fs.readFileSync(INITIAL_SEED_FILE, 'utf8') || '[]';
      }
      fs.writeFileSync(DATA_FILE, initialData, 'utf8');
    }

    console.log(`[DB] Storage initialized at ${DATA_FILE} (Vercel mode: ${isVercel})`);
  } catch (err) {
    console.warn('[DB] Non-critical warning initializing DB directory:', err.message);
  }
}

function readPlayers() {
  if (memoryCache !== null) {
    return [...memoryCache];
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      memoryCache = JSON.parse(data || '[]');
      return [...memoryCache];
    } else if (fs.existsSync(INITIAL_SEED_FILE)) {
      const data = fs.readFileSync(INITIAL_SEED_FILE, 'utf8');
      memoryCache = JSON.parse(data || '[]');
      return [...memoryCache];
    }
  } catch (err) {
    console.error('[DB] Error reading players:', err.message);
  }

  memoryCache = [];
  return [];
}

function writePlayers(players) {
  memoryCache = [...players];

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(players, null, 2), 'utf8');
    return true;
  } catch (err) {
    // In serverless environments if disk write is blocked, in-memory cache preserves data
    console.warn('[DB] Warning saving to disk, retained in memory:', err.message);
    return true;
  }
}

module.exports = {
  initDB,
  readPlayers,
  writePlayers
};
