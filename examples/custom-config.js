const SoundLog = require('sound-log');

// Advanced configuration
const soundLog = new SoundLog({
  enabled: true,
  soundsDir: './my-sounds',
  soundMap: {
    'ValidationError': 'validation.mp3',
    'AuthError': 'auth-error.mp3',
    'APIError': 'api-error.mp3'
  },
  defaultSound: 'default-error.mp3'
});

// Erreurs personnalisées
class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

// Utilisation
function validateUser(user) {
  try {
    if (!user.email) {
      throw new ValidationError('Email requis');
    }
  } catch (error) {
    soundLog.playErrorSound(error);
    // Gérer l'erreur...
  }
} 