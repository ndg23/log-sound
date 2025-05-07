const express = require('express');
const SoundLog = require('sound-log');

const app = express();
const soundLog = new SoundLog();

// Middleware de gestion d'erreur personnalisé
app.use((err, req, res, next) => {
  // Jouer un son en fonction du type d'erreur
  soundLog.playErrorSound(err);
  
  res.status(500).json({ error: err.message });
});

app.get('/api/users', (req, res) => {
  // Simuler une erreur de base de données
  throw new DatabaseError('Impossible de récupérer les utilisateurs');
}); 