# 🔊 log-sound

A powerful and customizable logging library with sound notifications for Node.js applications.

[![npm version](https://badge.fury.io/js/log-sound.svg)](https://badge.fury.io/js/log-sound)
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
npm install log-sound
```

## Quick Start

```javascript
const SoundLog = require('log-sound');
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

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

MIT © [Anto]
