const SoundLog = require('log-sound');

const log = new SoundLog();

// Basic logging
log.info('Application started');

try {
  // Some risky operation
  throw new Error('Connection failed');
} catch (error) {
  log.error('Failed to connect', error);
}

// Debug information
log.debug('Request payload:', { userId: 123 });

// Warning
log.warn('API rate limit approaching');

// Chainable calls
log.info('Processing started')
   .debug('Step 1 complete')
   .debug('Step 2 complete')
   .info('Processing finished'); 