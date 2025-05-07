const ErrorSounds = require('error-sounds');
const assert = require('assert');

describe('Mon Application', () => {
  const errorSounds = new ErrorSounds({
    enabled: process.env.NODE_ENV !== 'test' // Désactiver pendant les tests
  });

  it('devrait gérer les erreurs correctement', () => {
    try {
      // Test qui génère une erreur
      throw new Error('Test error');
    } catch (error) {
      errorSounds.playErrorSound(error);
      assert(error.message === 'Test error');
    }
  });
}); 