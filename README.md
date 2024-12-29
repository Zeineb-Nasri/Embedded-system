# Embedded-system

# Projet :  Contrôle en Temps Réel d’un Moteur à courant continu via Serveur Web sur BeagleBone Black


## Description
Ce projet consiste à contrôler la valeur du **Duty Cycle PWM** en temps réel via une interface web pour controler un moteur a courant continu . Deux solutions ont été implémentées pour cette tâche, chacune ayant ses spécificités et son efficacité.

---

## Méthodes Implémentées

### 1ère Méthode : Utilisation d'un Script Shell
- **Description** : Cette méthode utilise un script `update_pwm.sh` pour accéder directement au chemin système du Duty Cycle et le modifier via une interface web.
- **Composants** :
  - **`update_pwm.sh`** : Modifie directement le Duty Cycle.
  - **`server.js`** : Héberge le serveur pour l’interface web.
  - **`index.html`** : Interface utilisateur permettant de changer la valeur via un *Slider* .
- **Limitation** :
  - Selon les observations sur l'oscilloscope, le changement de valeur n'est pas effectué en temps réel si l'utilisateur tente de modifier rapidement le Duty Cycle.
  - Cela peut entraîner un bug avec le *Slider*.

**Arborescence :**
sys_embarque/result_sh ├── index.html # Interface utilisateur 
                       ├── server.js # Serveur Node.js 
                       └── update_pwm.sh # Script Shell pour modifier le Duty Cycle


---

### 2ème Méthode : Utilisation d'un Programme en C et Node.js
- **Description** : Cette méthode utilise un programme en C pour contrôler le Duty Cycle, qui est compilé et exécuté depuis le fichier `server.js` grâce à l’utilisation du module **`child_process`** dans Node.js.
- **Fonction de `child_process`** :
  - La commande `const { exec } = require('child_process');` permet d’exécuter des commandes système directement depuis un script Node.js, en appelant et exécutant des processus enfants.
  - Cela permet de compiler et exécuter dynamiquement le code en C à chaque demande de modification de la valeur PWM.
- **Avantage** :
  - Cette méthode est beaucoup plus efficace. Les modifications du Duty Cycle se font rapidement et en temps réel, comme le montre la vidéo démonstrative.
- **Composants** :
  - **`pwm_control.c`** : Programme en C pour modifier le Duty Cycle.
  - **`server.js`** : Serveur Node.js qui compile et exécute le programme en C.
  - **`index.html`** : Interface utilisateur située dans le dossier `public`.

**Arborescence :**
sys_embarque/update_pwm ├── public/
                                  │ └── index.html # Interface utilisateur
                        ├── server.js # Serveur Node.js
                        └── pwm_control.c # Programme en C pour modifier le Duty Cycle

**Utilisation :**
-Pour la 1ère Méthode :
      Lancez le serveur :
bash:  node server.js
Puis Ouvrez votre navigateur et entrez l'URL suivante :
http://168.6.2:3000
Modifiez la valeur du Duty Cycle via l’interface.

-Pour la 2ème Méthode :
      Compilez et lancez le programme C depuis le serveur :
      bash:  node server.js
Accédez à l’interface utilisateur Ouvrez votre navigateur et entrez l'URL suivante :
http://168.6.2:4000
Modifiez la valeur du Duty Cycle via l’interface.
