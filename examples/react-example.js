import SoundLog from 'log-sound';

const soundLog = new SoundLog({
  soundsDir: '/assets/sounds'
});

// Global error handler
window.onerror = (message, source, lineno, colno, error) => {
  soundLog.playErrorSound(error);
};

// Dans un composant React
function UserProfile() {
  useEffect(() => {
    try {
      // Appel API qui peut échouer
      fetchUserData();
    } catch (error) {
      soundLog.playErrorSound(error);
      // Gérer l'erreur normalement...
    }
  }, []);
} 