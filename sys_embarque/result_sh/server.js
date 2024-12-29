/ Chargement des modules nécessaires
var app = require('http').createServer(handler);
const io = require('socket.io')(app);
var fs = require('fs');
const exec = require("child_process").exec;

// Fichier HTML utilisé pour l'interface
var htmlPage = 'index.html';

// Initialisation du serveur sur le port 3000
app.listen(3000, () => {
    console.log("Serveur en cours d'exécution sur http://localhost:3000/");
});

// Fonction pour gérer les requêtes HTTP
function handler(req, res) {
    fs.readFile(htmlPage, function (err, data) {
        if (err) {
            res.writeHead(404);
            return res.end('Erreur de chargement du fichier : ' + htmlPage);
        }
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.end(data);
    });
}

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
    console.log("Client connecté.");

    // Réception de la commande pour mettre à jour le PWM
    socket.on('update-pwm', (data) => {
        const pwmValue = parseInt(data);

        if (pwmValue >= 0 && pwmValue <= 100) {
            console.log(`Nouvelle valeur PWM reçue : ${pwmValue}`);

            // Appeler le script Bash pour mettre à jour le PWM
            const command = `./update_pwm.sh ${pwmValue}`;
            exec(command, (err, stdout, stderr) => {
                if (err) {
                    console.error("Erreur lors de l'exécution du script : ", err);
                    socket.emit('error', 'Erreur lors de la mise à jour du PWM.');
                } else {
                    console.log("PWM mis à jour avec succès :", stdout);
                    socket.emit('success', `PWM mis à jour avec ${pwmValue}.`);
                }
            });
        } else {
      console.error("Valeur PWM invalide :", pwmValue);
            socket.emit('error', "Valeur invalide. Doit être entre 0 et 100.");
        }
    });

    socket.on('disconnect', () => {
        console.log("Client déconnecté.");
    });
});

