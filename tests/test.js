const assert = require('assert');
const path = require('path');
const fs = require('fs');
const SoundLog = require('../error.js');

// Increase max listeners to avoid warning
process.setMaxListeners(20);

describe('SoundLog', () => {
  let soundLog;
  const TEST_SOUNDS_DIR = path.join(__dirname, 'sounds');

  // Setup test environment
  before(() => {
    // Create test sounds directory if it doesn't exist
    if (!fs.existsSync(TEST_SOUNDS_DIR)) {
      fs.mkdirSync(TEST_SOUNDS_DIR, { recursive: true });
    }
  });

  beforeEach(() => {
    // Create a fresh instance before each test with test sounds directory
    soundLog = new SoundLog({
      soundsDir: TEST_SOUNDS_DIR,
      enabled: true
    });
  });

  afterEach(() => {
    // Cleanup after each test
    soundLog.disable();
  });

  describe('Configuration', () => {
    it('should initialize with default settings', () => {
      assert.strictEqual(soundLog.config.enabled, true);
      assert.strictEqual(typeof soundLog.config.soundMap, 'object');
    });

    it('should allow enabling/disabling sound playback', () => {
      soundLog.disable();
      assert.strictEqual(soundLog.config.enabled, false);
      
      soundLog.enable();
      assert.strictEqual(soundLog.config.enabled, true);
    });
  });

  describe('Error Mapping', () => {
    it('should map new error types to sounds', () => {
      soundLog.mapErrorToSound('CustomError', 'custom-error.mp3');
      assert.strictEqual(soundLog.config.soundMap.CustomError, 'custom-error.mp3');
    });

    it('should override existing error mappings', () => {
      soundLog.mapErrorToSound('TypeError', 'new-type-error.mp3');
      assert.strictEqual(soundLog.config.soundMap.TypeError, 'new-type-error.mp3');
    });
  });

  describe('Sound Playback', () => {
    it('should attempt to play sounds for mapped errors', (done) => {
      let playedSound = false;
      
      // Mock the playSound method
      soundLog.playSound = () => {
        playedSound = true;
        return true;
      };

      soundLog.playErrorSound(new TypeError('Test error'));
      
      assert.strictEqual(playedSound, true);
      done();
    });

    it('should use default sound for unmapped error types', (done) => {
      let playedSoundFile = '';
      
      // Mock the playSound method
      soundLog.playSound = (soundFile) => {
        playedSoundFile = soundFile;
        return true;
      };

      class UnknownError extends Error {
        constructor(message) {
          super(message);
          this.name = 'UnknownError';
        }
      }

      soundLog.playErrorSound(new UnknownError('Test error'));
      
      assert.strictEqual(playedSoundFile, soundLog.config.defaultSound);
      done();
    });
  });

  describe('Error Handler', () => {
    it('should install global error handler when enabled', () => {
      const listeners = process.listeners('uncaughtException');
      const hasErrorSoundHandler = listeners.some(listener => 
        listener.toString().includes('playErrorSound')
      );
      
      assert.strictEqual(hasErrorSoundHandler, true);
    });
  });

  describe('Advanced Features', () => {
    it('should handle custom sound directories', () => {
      const customDir = './custom-sounds';
      const customErrorSounds = new SoundLog({ 
        soundsDir: customDir,
        enabled: false // Disable to avoid adding more listeners
      });
      assert.strictEqual(customErrorSounds.config.soundsDir, customDir);
    });

    it('should handle multiple error types simultaneously', () => {
      soundLog.mapErrorToSound('Error1', 'sound1.mp3');
      soundLog.mapErrorToSound('Error2', 'sound2.mp3');
      
      assert.strictEqual(soundLog.config.soundMap.Error1, 'sound1.mp3');
      assert.strictEqual(soundLog.config.soundMap.Error2, 'sound2.mp3');
    });

    it('should handle invalid sound files gracefully', () => {
      const result = soundLog.playSound('non-existent.mp3');
      assert.strictEqual(result, false);
    });

    it('should handle errors without crashing', () => {
      // Test various error scenarios
      assert.doesNotThrow(() => {
        soundLog.playSound(null);
        soundLog.playSound(undefined);
        soundLog.playSound('');
        soundLog.mapErrorToSound(null, 'sound.mp3');
      });
    });

    it('should handle invalid inputs gracefully', () => {
      // Test invalid sound files
      assert.strictEqual(soundLog.playSound(null), false);
      assert.strictEqual(soundLog.playSound(undefined), false);
      assert.strictEqual(soundLog.playSound(''), false);
      
      // Test invalid error mappings
      const originalMapping = { ...soundLog.config.soundMap };
      
      soundLog.mapErrorToSound(null, 'sound.mp3');
      soundLog.mapErrorToSound(undefined, 'sound.mp3');
      soundLog.mapErrorToSound('', '');
      
      // Verify the mappings weren't changed by invalid inputs
      assert.deepStrictEqual(soundLog.config.soundMap, originalMapping);
    });

    it('should handle edge cases properly', () => {
      // Test with special characters
      soundLog.mapErrorToSound('Special$Error', 'special.mp3');
      assert.strictEqual(soundLog.config.soundMap['Special$Error'], 'special.mp3');
      
      // Test with very long names
      const longName = 'A'.repeat(100);
      soundLog.mapErrorToSound(longName, 'long.mp3');
      assert.strictEqual(soundLog.config.soundMap[longName], 'long.mp3');
    });
  });

  describe('Sound System Tests', () => {
    let testSoundFile;

    before(() => {
      // Create a test sound file
      testSoundFile = path.join(TEST_SOUNDS_DIR, 'test-error.mp3');
      // Copy a real sound file from the main sounds directory
      fs.copyFileSync(
        path.join(__dirname, '../sounds/database-error.mp3'),
        testSoundFile
      );
    });

    after(() => {
      // Cleanup test sound file
      if (fs.existsSync(testSoundFile)) {
        fs.unlinkSync(testSoundFile);
      }
    });

    it('should play sound files correctly', (done) => {
      let soundPlayed = false;
      
      // Create a custom error with the test sound
      class TestError extends Error {
        constructor(message) {
          super(message);
          this.name = 'TestError';
        }
      }

      // Map test error to test sound
      soundLog.mapErrorToSound('TestError', 'test-error.mp3');

      // Override exec to track sound playback
      const originalExec = soundLog.config.player;
      soundLog.config.player = 'echo "Playing sound:"';

      // Test sound playback
      soundLog.playErrorSound(new TestError('Test error'))
        .then(() => {
          soundPlayed = true;
          assert.strictEqual(soundPlayed, true);
          // Restore original player
          soundLog.config.player = originalExec;
          done();
        })
        .catch(done);
    });

    it('should handle different audio formats', () => {
      // Test MP3
      assert.strictEqual(soundLog.playSound('test-error.mp3'), true);
      
      // Test non-existent WAV
      assert.strictEqual(soundLog.playSound('non-existent.wav'), false);
    });

    it('should respect enabled/disabled state for sound playback', () => {
      soundLog.disable();
      assert.strictEqual(soundLog.playSound('test-error.mp3'), false);
      
      soundLog.enable();
      assert.strictEqual(soundLog.playSound('test-error.mp3'), true);
    });

    it('should handle concurrent sound playback', (done) => {
      let playCount = 0;
      const originalExec = soundLog.config.player;
      
      // Override exec to count plays
      soundLog.config.player = 'echo "Playing sound:"';
      
      // Play multiple sounds
      Promise.all([
        soundLog.playSound('test-error.mp3').then(() => playCount++),
        soundLog.playSound('test-error.mp3').then(() => playCount++),
        soundLog.playSound('test-error.mp3').then(() => playCount++)
      ]).then(() => {
        assert.strictEqual(playCount, 3);
        soundLog.config.player = originalExec;
        done();
      }).catch(done);
    });
  });

  describe('Error-Specific Sound Tests', () => {
    before(() => {
      // Create different test sound files for different errors
      const soundLogs = {
        'TypeError': 'type-error.mp3',
        'ReferenceError': 'reference-error.mp3',
        'SyntaxError': 'syntax-error.mp3',
        'RangeError': 'range-error.mp3',
        'CustomError': 'custom-error.mp3'
      };

      // Create each test sound file
      Object.entries(soundLogs).forEach(([errorType, soundFile]) => {
        const testSoundPath = path.join(TEST_SOUNDS_DIR, soundFile);
        // Create a dummy sound file
        fs.writeFileSync(testSoundPath, 'dummy sound data');
      });
    });

    after(() => {
      // Cleanup all test sound files
      fs.readdirSync(TEST_SOUNDS_DIR).forEach(file => {
        fs.unlinkSync(path.join(TEST_SOUNDS_DIR, file));
      });
    });

    it('should play different sounds for different error types', async () => {
      let playedSounds = [];
      
      // Override the exec command to track which sounds are played
      const originalExec = soundLog.config.player;
      soundLog.config.player = (soundPath) => {
        playedSounds.push(path.basename(soundPath));
        return 'echo "Playing sound:"';
      };

      // Map different errors to different sounds
      soundLog.mapErrorToSound('TypeError', 'type-error.mp3');
      soundLog.mapErrorToSound('ReferenceError', 'reference-error.mp3');
      soundLog.mapErrorToSound('SyntaxError', 'syntax-error.mp3');
      soundLog.mapErrorToSound('RangeError', 'range-error.mp3');
      soundLog.mapErrorToSound('CustomError', 'custom-error.mp3');

      // Test each error type
      await Promise.all([
        soundLog.playErrorSound(new TypeError('Type error test')),
        soundLog.playErrorSound(new ReferenceError('Reference error test')),
        soundLog.playErrorSound(new SyntaxError('Syntax error test')),
        soundLog.playErrorSound(new RangeError('Range error test'))
      ]);

      // Verify each error played its specific sound
      assert.strictEqual(playedSounds.includes('type-error.mp3'), true);
      assert.strictEqual(playedSounds.includes('reference-error.mp3'), true);
      assert.strictEqual(playedSounds.includes('syntax-error.mp3'), true);
      assert.strictEqual(playedSounds.includes('range-error.mp3'), true);

      // Restore original player
      soundLog.config.player = originalExec;
    });

    it('should play custom error sounds', async () => {
      let playedSound = '';
      
      // Override the exec command
      const originalExec = soundLog.config.player;
      soundLog.config.player = (soundPath) => {
        playedSound = path.basename(soundPath);
        return 'echo "Playing sound:"';
      };

      // Create and test a custom error
      class DatabaseError extends Error {
        constructor(message) {
          super(message);
          this.name = 'DatabaseError';
        }
      }

      // Map custom error to specific sound
      soundLog.mapErrorToSound('DatabaseError', 'custom-error.mp3');

      // Test custom error sound
      await soundLog.playErrorSound(new DatabaseError('Database connection failed'));

      // Verify correct sound was played
      assert.strictEqual(playedSound, 'custom-error.mp3');

      // Restore original player
      soundLog.config.player = originalExec;
    });

    it('should fallback to default sound for unmapped errors', async () => {
      let playedSound = '';
      
      // Override the exec command
      const originalExec = soundLog.config.player;
      soundLog.config.player = (soundPath) => {
        playedSound = path.basename(soundPath);
        return 'echo "Playing sound:"';
      };

      // Create an unmapped error
      class UnmappedError extends Error {
        constructor(message) {
          super(message);
          this.name = 'UnmappedError';
        }
      }

      // Test unmapped error sound
      await soundLog.playErrorSound(new UnmappedError('Unknown error occurred'));

      // Verify default sound was played
      assert.strictEqual(playedSound, soundLog.config.defaultSound);

      // Restore original player
      soundLog.config.player = originalExec;
    });

    it('should handle error inheritance correctly', async () => {
      let playedSound = '';
      
      // Override the exec command
      const originalExec = soundLog.config.player;
      soundLog.config.player = (soundPath) => {
        playedSound = path.basename(soundPath);
        return 'echo "Playing sound:"';
      };

      // Create an error hierarchy
      class BaseError extends Error {
        constructor(message) {
          super(message);
          this.name = 'BaseError';
        }
      }

      class SpecificError extends BaseError {
        constructor(message) {
          super(message);
          this.name = 'SpecificError';
        }
      }

      // Map both error types
      soundLog.mapErrorToSound('BaseError', 'base-error.mp3');
      soundLog.mapErrorToSound('SpecificError', 'specific-error.mp3');

      // Test specific error sound
      await soundLog.playErrorSound(new SpecificError('Specific error occurred'));

      // Verify specific error sound was played
      assert.strictEqual(playedSound, 'specific-error.mp3');

      // Restore original player
      soundLog.config.player = originalExec;
    });
  });
}); 