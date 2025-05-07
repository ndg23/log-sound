class SoundLog {
  constructor(options = {}) {
    this.config = {
      enabled: true,
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
      ...options
    };

    // Create Audio context for browser
    this.audioContext = typeof AudioContext !== 'undefined' 
      ? new AudioContext() 
      : typeof webkitAudioContext !== 'undefined'
        ? new webkitAudioContext()
        : null;
  }

  playSound(soundFile) {
    if (!this.config.enabled || !this.audioContext) {
      return Promise.resolve(false);
    }

    // In browser, soundFile should be a URL or base64 string
    return new Promise((resolve) => {
      const audio = new Audio(soundFile);
      audio.onended = () => resolve(true);
      audio.onerror = () => {
        console.warn(`Failed to play sound: ${soundFile}`);
        resolve(false);
      };
      audio.play().catch(err => {
        console.warn(`Failed to play sound: ${err.message}`);
        resolve(false);
      });
    });
  }

  // Rest of the methods remain the same
  error(message, error = null) {
    if (error) {
      console.error('❌', message, error);
    } else {
      console.error('❌', message);
    }
    return this;
  }

  warn(message) {
    console.warn('⚠️', message);
    return this;
  }

  info(message) {
    console.info('ℹ️', message);
    return this;
  }

  debug(message) {
    console.debug('🔍', message);
    return this;
  }

  trace(message) {
    console.trace('📍', message);
    return this;
  }

  success(message) {
    console.log('\x1b[32m', '✅', message, '\x1b[0m');
    return this;
  }

  fatal(message, error = null) {
    if (error) {
      console.error('\x1b[31m', '💀', message, error, '\x1b[0m');
    } else {
      console.error('\x1b[31m', '💀', message, '\x1b[0m');
    }
    return this;
  }

  addLogLevel(name, options = {}) {
    const { emoji = '📝', color = '\x1b[0m' } = options;
    
    this.config.logLevels.custom[name] = { emoji, color };
    
    this[name] = (message) => {
      console.log(color, emoji, message, '\x1b[0m');
      return this;
    };

    return this;
  }
}

module.exports = SoundLog; 