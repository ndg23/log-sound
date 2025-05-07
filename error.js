// error-sounds.js - Main package

const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

class SoundLog {
  constructor(options = {}) {
    // Default configuration
    this.config = {
      enabled: true,
      soundsDir: path.join(__dirname, 'sounds'),
      defaultSound: 'default.mp3',
      logLevels: {
        error: 'error.mp3',
        warn: 'warn.mp3',
        info: 'info.mp3',
        debug: 'debug.mp3',
        trace: 'trace.mp3',
        success: 'success.mp3',
        fatal: 'fatal.mp3',
        custom: {}
      },
      errorMap: {
        'TypeError': 'type-error.mp3',
        'ReferenceError': 'reference-error.mp3',
        'SyntaxError': 'syntax-error.mp3',
        'RangeError': 'range-error.mp3'
      },
      player: this._detectAudioPlayer(),
      ...options
    };

    // Create sounds directory if it doesn't exist
    if (!fs.existsSync(this.config.soundsDir)) {
      fs.mkdirSync(this.config.soundsDir, { recursive: true });
    }

    // Install global error handler
    if (this.config.enabled) {
      this._installErrorHandler();
    }
  }

  // Detect available audio player on the system
  _detectAudioPlayer() {
    // By default, use 'afplay' for macOS, 'aplay' for Linux and 'powershell' for Windows
    if (process.platform === 'darwin') return 'afplay';
    if (process.platform === 'linux') return 'aplay';
    if (process.platform === 'win32') return 'powershell -c (New-Object Media.SoundPlayer "FILE_PATH").PlaySync();';
    return 'afplay'; // Default fallback
  }

  // Install error handler
  _installErrorHandler() {
    const originalHandler = process.on('uncaughtException', (error) => {
      this.playErrorSound(error);
      // Don't remove default behavior
      process.nextTick(() => { throw error; });
    });

    // Allow chaining with other error handlers
    return originalHandler;
  }

  // Play a specific sound
  playSound(soundFile) {
    // Add validation
    if (!soundFile || typeof soundFile !== 'string') {
      console.warn('Invalid sound file provided');
      return Promise.resolve(false);
    }

    if (!this.config.enabled) {
      return Promise.resolve(false);
    }

    const soundPath = path.resolve(this.config.soundsDir, soundFile);
    
    // Check if file exists
    if (!fs.existsSync(soundPath)) {
      console.warn(`Sound file not found: ${soundPath}`);
      return Promise.resolve(false);
    }

    return new Promise((resolve, reject) => {
      let command;
      if (process.platform === 'win32') {
        command = this.config.player.replace('FILE_PATH', soundPath);
      } else {
        command = `${this.config.player} "${soundPath}"`;
      }

      exec(command, (error) => {
        if (error) {
          console.warn(`Failed to play sound: ${error.message}`);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
  }

  // Play sound based on error type
  playErrorSound(error) {
    const errorType = error.constructor.name;
    const soundFile = this.config.errorMap[errorType] || this.config.defaultSound;
    return this.playSound(soundFile);
  }

  // Add or update sound for an error type
  mapErrorToSound(errorType, soundFile) {
    // Add validation
    if (!errorType || !soundFile) {
      console.warn('Invalid error type or sound file');
      return this;
    }
    if (typeof errorType !== 'string' || typeof soundFile !== 'string') {
      console.warn('Error type and sound file must be strings');
      return this;
    }

    this.config.errorMap[errorType] = soundFile;
    return this;
  }

  // Enable/disable sounds
  enable() {
    this.config.enabled = true;
    this._installErrorHandler();
    return this;
  }

  disable() {
    this.config.enabled = false;
    return this;
  }

  // Log methods
  error(message, error = null) {
    if (error) {
      this.playErrorSound(error);
      console.error('❌', message, error);
    } else {
      this.playSound(this.config.logLevels.error);
      console.error('❌', message);
    }
    return this;
  }

  warn(message) {
    this.playSound(this.config.logLevels.warn);
    console.warn('⚠️', message);
    return this;
  }

  info(message) {
    this.playSound(this.config.logLevels.info);
    console.info('ℹ️', message);
    return this;
  }

  debug(message) {
    this.playSound(this.config.logLevels.debug);
    console.debug('🔍', message);
    return this;
  }

  trace(message) {
    this.playSound(this.config.logLevels.trace);
    console.trace('📍', message);
    return this;
  }

  // Méthode pour ajouter un niveau de log personnalisé
  addLogLevel(name, options = {}) {
    const { sound, emoji = '📝', color = '\x1b[0m' } = options;
    
    // Ajouter le niveau personnalisé
    this.config.logLevels.custom[name] = { sound, emoji, color };
    
    // Créer la méthode dynamiquement
    this[name] = (message) => {
      this.playSound(sound);
      console.log(color, emoji, message, '\x1b[0m');
      return this;
    };

    return this;
  }

  // Nouvelle méthode success
  success(message) {
    this.playSound(this.config.logLevels.success);
    console.log('\x1b[32m', '✅', message, '\x1b[0m');
    return this;
  }

  // Nouvelle méthode fatal
  fatal(message, error = null) {
    if (error) {
      this.playErrorSound(error);
      console.error('\x1b[31m', '💀', message, error, '\x1b[0m');
    } else {
      this.playSound(this.config.logLevels.fatal);
      console.error('\x1b[31m', '💀', message, '\x1b[0m');
    }
    return this;
  }
}

module.exports = SoundLog;
