const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { exec } = require('child_process');
const path = require('path');

// Chemin et période du PWM
const PERIOD = 2000000; // 2 ms
const PWM_PATH = path.join(__dirname, 'pwm_control');

// Initialisation du serveur Express
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Compiler le programme C une seule fois au démarrage
exec(`gcc -o pwm_control pwm_control.c`, (compileError, stdout, stderr) => {
    if (compileError) {
        console.error('Erreur de compilation :', stderr);
        process.exit(1); // Arrêter le serveur si la compilation échoue
    }
    console.log('Programme C compilé avec succès.');
});

// Servir les fichiers statiques (pour la page HTML et le slider)
app.use(express.static(path.join(__dirname, 'public')));

// Gérer les connexions WebSocket
io.on('connection', (socket) => {
    console.log('Un utilisateur s\'est connecté');

    // Limiter les mises à jour à un intervalle de 100 ms
    let lastUpdateTime = 0;
    const updateInterval = 100; // Intervalle en ms

    socket.on('update-pwm', (pwmValue) => {
        const currentTime = Date.now();
        if (currentTime - lastUpdateTime < updateInterval) {
            return; // Ignorer les mises à jour trop rapprochées
        }
        lastUpdateTime = currentTime;

        console.log('Valeur PWM reçue :', pwmValue);
        const dutyCycle = Math.round((PERIOD * pwmValue) / 100);

        // Exécuter le programme C compilé
        exec(`./pwm_control ${PERIOD} ${dutyCycle}`, (execError, execStdout, ex>
            if (execError) {
                console.error('Erreur d\'exécution :', execStderr);
                socket.emit('error', 'Erreur lors de l\'exécution du programme >
                return;
            }
            console.log('Résultat du programme :', execStdout);
            socket.emit('success', 'PWM mis à jour avec succès');
        });
    });

    socket.on('disconnect', () => {
        console.log('Un utilisateur s\'est déconnecté');
    });
});

// Démarrer le serveur
const PORT = 4000;
server.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});



