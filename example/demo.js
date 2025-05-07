// examples/demo.js - Example usage of the "log-sound" package
// This file demonstrates how to use sounds for different error types

const SoundLog = require('../index.js');
const readline = require('readline');

// Initialize logger
const log = new SoundLog();

// Configure different sounds for different error types
// -------------------------------------------------
log.mapErrorToSound('TypeError', './sounds/type-error.mp3');
log.mapErrorToSound('ReferenceError', './sounds/reference-error.mp3');
log.mapErrorToSound('SyntaxError', './sounds/syntax-error.mp3');
log.mapErrorToSound('RangeError', './sounds/range-error.mp3');

// Custom Database Errors
// --------------------
class DatabaseConnectionError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseConnectionError';
  }
}

class DatabaseQueryError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseQueryError';
  }
}

// Map custom errors to specific sounds
log.mapErrorToSound('DatabaseConnectionError', './sounds/db-connection-error.mp3');
log.mapErrorToSound('DatabaseQueryError', './sounds/db-query-error.mp3');

// API Errors
// ---------
class APIError extends Error {
  constructor(message) {
    super(message);
    this.name = 'APIError';
  }
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

log.mapErrorToSound('APIError', './sounds/database-error.mp3');
log.mapErrorToSound('NetworkError', './sounds/database-error.mp3');

// Create interactive menu
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Demo menu options
const demoOptions = {
  '1': {
    name: 'Error Log Demo',
    run: () => {
      log.error('Something went wrong!');
      
      // With error object
      try {
        throw new Error('Database connection failed');
      } catch (err) {
        log.error('Database error occurred', err);
      }
    }
  },
  '2': {
    name: 'Warning Log Demo',
    run: () => {
      log.warn('Disk space is running low');
    }
  },
  '3': {
    name: 'Info Log Demo',
    run: () => {
      log.info('User logged in successfully');
    }
  },
  '4': {
    name: 'Debug Log Demo',
    run: () => {
      log.debug('Processing request payload...');
    }
  },
  '5': {
    name: 'Trace Log Demo',
    run: () => {
      log.trace('Entering function processData()');
    }
  },
  '6': {
    name: 'Combined Logs Demo',
    run: () => {
      log.info('Starting application...')
         .debug('Loading configuration')
         .warn('Config file is outdated')
         .error('Failed to load module');
    }
  },
  '7': {
    name: 'Success Log Demo',
    run: () => {
      log.success('Operation completed successfully!');
    }
  },
  '8': {
    name: 'Fatal Log Demo',
    run: () => {
      log.fatal('Critical system failure');
    }
  },
  '9': {
    name: 'Custom Logs Demo',
    run: () => {
      log.addLogLevel('http', { 
        sound: 'info.mp3',  // Réutiliser un son existant
        emoji: '🌐',
        color: '\x1b[36m'
      });

      log.http('GET /api/users')
         .http('POST /api/data')
         .success('All requests completed');
    }
  }
};

// Show menu and handle selection
function showMenu() {
  console.clear();
  console.log("📢 log-sound Demonstration");
  console.log("========================\n");
  console.log("Choose an error to trigger:");
  
  Object.entries(demoOptions).forEach(([key, option]) => {
    console.log(`${key}. ${option.name}`);
  });
  
  console.log("\n0. Exit");
  console.log("\n🔊 Each error will play a different sound!");
}

// Handle user selection
function handleSelection(choice) {
  if (choice === '0') {
    console.log("\n👋 Thanks for trying log-sound!");
    rl.close();
    return;
  }

  const option = demoOptions[choice];
  if (!option) {
    console.log("\n❌ Invalid option. Please try again.");
    return;
  }

  console.log(`\n▶️ Running: ${option.name}`);
  try {
    option.run();
  } catch (error) {
    console.error(`❌ ${error.name} caught:`, error.message);
  }

  // Wait for user to continue
  console.log("\nPress Enter to continue...");
}

// Run the interactive demo
function runDemo() {
  showMenu();
  
  rl.on('line', (input) => {
    handleSelection(input);
    if (input !== '0') {
      setTimeout(showMenu, 1000);
    }
  });
}

// Start the demo
console.log("\n🎵 Welcome to log-sound Demo!");
console.log("📝 Try different error types and hear their sounds\n");
runDemo();
