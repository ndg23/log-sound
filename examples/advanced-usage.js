const SoundLog = require('sound-log');
const log = new SoundLog();

// Ajouter des niveaux personnalisés
log.addLogLevel('http', {
  sound: 'http.mp3',
  emoji: '🌐',
  color: '\x1b[36m'  // Cyan
});

log.addLogLevel('database', {
  sound: 'db.mp3',
  emoji: '🗄️',
  color: '\x1b[35m'  // Magenta
});

// Utilisation
log.info('Starting server...')
   .http('GET /api/users')
   .database('Executing query')
   .success('Server started successfully!')
   .warn('CPU usage high')
   .error('Failed to connect to database')
   .fatal('System crash!');

// Avec chaînage et données
log.info('Processing order #123')
   .debug({ orderId: 123, items: ['item1', 'item2'] })
   .database('Saving to database...')
   .success('Order processed successfully!');

// Gestion d'erreurs avancée
try {
  throw new Error('Critical system failure');
} catch (error) {
  log.fatal('System crashed', error)
     .warn('Attempting recovery...')
     .info('Notifying admin...');
} 