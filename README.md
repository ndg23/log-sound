# 🔊 log-sound

A powerful and customizable logging library with sound notifications for Node.js applications.

[![npm version](https://badge.fury.io/js/log-sound.svg)](https://badge.fury.io/js/log-sound)
[![CI](https://github.com/ndg23/log-sound/workflows/CI/badge.svg)](https://github.com/ndg23/log-sound/actions)
[![codecov](https://codecov.io/gh/ndg23/log-sound/branch/main/graph/badge.svg)](https://codecov.io/gh/ndg23/log-sound)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎵 Sound notifications for different log levels
- 🎨 Customizable log levels with colors and emojis
- ⚡ Promise-based sound playback
- 🔗 Chainable logging methods
- 🎮 Cross-platform support (Windows, macOS, Linux)
- 🛠️ Extensible with custom log levels
- 🎯 Error type-specific sounds

## Installation

```bash
npm install log-sounds --save
yarn add log-sounds
pnpm add log-sounds
```

## Quick Start

```javascript
const SoundLog = require('log-sounds');
const log = new SoundLog();

// Basic logging
log.info('Application started');
log.warn('Low memory warning');
log.error('Connection failed');

// Chainable calls
log.info('Starting process')
   .debug('Step 1')
   .success('Process completed');

// Custom log levels
log.addLogLevel('http', {
  sound: 'http.mp3',
  emoji: '🌐',
  color: '\x1b[36m'
});

log.http('GET /api/users');
```

## Documentation

### Log Levels

- `error(message, error?)` - ❌ For errors
- `warn(message)` - ⚠️ For warnings
- `info(message)` - ℹ️ For information
- `debug(message)` - 🔍 For debug information
- `trace(message)` - 📍 For detailed tracing
- `success(message)` - ✅ For success messages
- `fatal(message, error?)` - 💀 For fatal errors

### Custom Log Levels

```javascript
log.addLogLevel('database', {
  sound: 'db.mp3',
  emoji: '🗄️',
  color: '\x1b[35m'
});
```

### Configuration

```javascript
const log = new SoundLog({
  enabled: true,
  soundsDir: './sounds',
  defaultSound: 'default.mp3',
  logLevels: {
    // Custom sound mappings
  }
});
```

### Browser Usage

When using in the browser, you'll need to provide sound URLs:

```javascript
const log = new SoundLog({
  logLevels: {
    error: '/sounds/error.mp3',
    warn: '/sounds/warn.mp3',
    // ...
  }
});

// Usage remains the same
log.info('Application started');
log.warn('Low memory');
```

Note: Browser version uses the Web Audio API for sound playback.

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Anto]

## Examples

### Basic Node.js Usage

```javascript
const LogSound = require('log-sounds');

const log = new LogSound({
  soundsDir: './sounds', // Directory containing your sound files
});

// Basic logging with sounds
log.info('Application started')
   .debug('Loading configuration')
   .warn('Disk space low')
   .error('Connection failed')
   .success('Operation completed')
   .fatal('Critical error');

// Error handling
try {
  throw new Error('Database connection failed');
} catch (error) {
  log.error('Failed to connect to database', error);
}

// Custom log levels
log.addLogLevel('database', {
  sound: 'db.mp3',
  emoji: '🗄️',
  color: '\x1b[35m'  // Magenta
});

log.database('Executing query...');
```

### Express.js Middleware

```javascript
const express = require('express');
const LogSound = require('log-sounds');

const app = express();
const log = new LogSound();

// Request logging middleware
app.use((req, res, next) => {
  log.info(`${req.method} ${req.url}`);
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  log.error('Server error:', err);
  res.status(500).send('Something broke!');
});

app.get('/', (req, res) => {
  log.debug('Processing request');
  res.send('Hello World!');
});

app.listen(3000, () => {
  log.success('Server started on port 3000');
});
```

### React Component

```javascript
import LogSound from 'log-sounds';

// Initialize once
const log = new LogSound({
  logLevels: {
    error: '/sounds/error.mp3',
    warn: '/sounds/warn.mp3',
    info: '/sounds/info.mp3'
  }
});

function UserProfile() {
  useEffect(() => {
    log.info('Component mounted');

    fetchUserData()
      .then(data => {
        log.success('Data loaded successfully');
      })
      .catch(error => {
        log.error('Failed to load user data', error);
      });

    return () => {
      log.debug('Component unmounting');
    };
  }, []);

  return <div>User Profile</div>;
}
```

### Next.js Global Error Handling

```javascript
// pages/_app.js
import LogSound from 'log-sounds';

const log = new LogSound({
  logLevels: {
    error: '/public/sounds/error.mp3',
    warn: '/public/sounds/warn.mp3',
    info: '/public/sounds/info.mp3'
  }
});

// Global error handler
if (typeof window !== 'undefined') {
  window.onerror = (message, source, lineno, colno, error) => {
    log.error('Global error:', error);
  };
}

export default function App({ Component, pageProps }) {
  useEffect(() => {
    log.info('App initialized');
  }, []);

  return <Component {...pageProps} />;
}
```

### Browser Usage with CDN

```html
<!DOCTYPE html>
<html>
<head>
  <title>Log-Sounds Demo</title>
  <script src="https://unpkg.com/log-sounds"></script>
</head>
<body>
  <button onclick="testLogs()">Test Logs</button>

  <script>
    const log = new LogSound({
      logLevels: {
        error: '/sounds/error.mp3',
        warn: '/sounds/warn.mp3',
        info: '/sounds/info.mp3'
      }
    });

    function testLogs() {
      log.info('Starting test')
         .warn('This is a warning')
         .error('This is an error')
         .success('Test completed');
    }
  </script>
</body>
</html>
```

### Custom Error Types

```javascript
const LogSound = require('log-sounds');
const log = new LogSound();

// Define custom errors
class DatabaseError extends Error {
  constructor(message) {
    super(message);
    this.name = 'DatabaseError';
  }
}

class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Map custom errors to specific sounds
log.mapErrorToSound('DatabaseError', 'db-error.mp3');
log.mapErrorToSound('ValidationError', 'validation-error.mp3');

// Usage
try {
  throw new DatabaseError('Connection failed');
} catch (error) {
  log.error('Database operation failed', error);
}
```
