// Classe de Héros

class Hero {

  constructor(name, role, attack, health, element = null) {
      this.name = name;
      this.role = role;
      this.attack = attack;
      this.health = health;
      this.element = element; // Attribut élémentaire du Mage
      this.rage = 0;
      this.mana = 7;
      this.arrows = 6;
  }

  // Attaque du boss

  attackBoss() {
      let damage = this.attack;
      if (this.role === 'guerrier' && this.rage >= 4) {
          damage *= 1.25; // Attaque critique
          this.rage = 0;
      }
      if (this.role === 'mage' && this.mana >= 2) {
          this.mana -= 2;
      }
      if (this.role === 'archer' && this.arrows >= 2) {
          this.arrows -= 2;
          if (Math.random() < 0.25) { // Attaque critique de l'archer
              damage *= 1.5;
          }
      }
      return damage;
  }
}

// Classe du Boss

class Boss {
  constructor(name, attack, health, element) {
      this.name = name;
      this.attack = attack;
      this.health = health;
      this.element = element; // Attribut élémentaire du Boss
  }

  // Attaque un héro

  attackHero(hero) {
      let damage = this.attack;
      hero.health -= damage;
      return damage;
  }
}

// Fonction pour répartir les points de vie et d'attaque

function distributeStats() {
  let totalHealth = 150;
  let totalAttack = 120;
  
  // Obtenir les valeurs entrées par l'utilisateur

  let hero1Health = parseInt(document.getElementById('hero1-health').value);
  let hero2Health = parseInt(document.getElementById('hero2-health').value);
  let hero3Health = parseInt(document.getElementById('hero3-health').value);

  let hero1Attack = parseInt(document.getElementById('hero1-attack').value);
  let hero2Attack = parseInt(document.getElementById('hero2-attack').value);
  let hero3Attack = parseInt(document.getElementById('hero3-attack').value);

  // Vérification que la somme des points de vie et attaque est correcte

  if (hero1Health + hero2Health + hero3Health === totalHealth &&
      hero1Attack + hero2Attack + hero3Attack === totalAttack) {

      // Créer les héros avec les attributs donnés par l'utilisateur

      heroes = [
          new Hero(document.getElementById('hero1-name').value, 'guerrier', hero1Attack, hero1Health),
          new Hero(document.getElementById('hero2-name').value, 'mage', hero2Attack, hero2Health),
          new Hero(document.getElementById('hero3-name').value, 'archer', hero3Attack, hero3Health)
      ];

      // Lancer le jeu après la création des héros

      document.getElementById('start-game').style.display = 'inline';
      document.getElementById('create-heroes-form').style.display = 'none';
  } else {
      alert('Les points de vie et d\'attaque doivent être répartis correctement.');
  }
}

// Fonction pour démarrer le jeu

function startGame() {
  let bosses = [
      new Boss('Sauron', 30, 200, 'Feu'),
      new Boss('Chronos', 25, 180, 'Terre'),
      new Boss('Lilith', 35, 220, 'Eau')
  ];

  // Choisir un boss aléatoire

  currentBoss = bosses[Math.floor(Math.random() * bosses.length)];
  updateGameLog(`Le boss ${currentBoss.name} est apparu !`);

  // Afficher les informations des héros

  heroes.forEach(hero => {
      updateGameLog(`${hero.name} (${hero.role}) - Vie: ${hero.health}, Attaque: ${hero.attack}`);
  });

  // Commencer le tour

  document.getElementById('start-game').addEventListener('click', nextTurn);
}

// Fonction pour gérer les actions de chaque tour

function nextTurn() {

  // Les héros attaquent le boss

  heroes.forEach(hero => {
      if (hero.health > 0) {
          let damage = hero.attackBoss();
          if (damage > 0) {
              currentBoss.health -= damage;
              updateGameLog(`${hero.name} attaque le boss et inflige ${damage} dégâts.`);
          }
      }
  });

  // Le boss attaque un héro

  if (currentBoss.health > 0) {
      let heroToAttack = heroes.filter(hero => hero.health > 0)[Math.floor(Math.random() * heroes.length)];
      let damage = currentBoss.attackHero(heroToAttack);
      updateGameLog(`Le boss attaque ${heroToAttack.name} et inflige ${damage} dégâts.`);
  }

  // Vérifier la fin du combat

  if (currentBoss.health <= 0) {
      updateGameLog(`Le boss ${currentBoss.name} est vaincu ! Vous avez gagné.`);
      return;
  }

  // Vérification des morts

  heroes.forEach(hero => {
      if (hero.health <= 0) {
          updateGameLog(`${hero.name} est mort.`);
      }
  });

  if (heroes.every(hero => hero.health <= 0)) {
      updateGameLog("Tous vos héros sont morts. Vous avez perdu.");
      return;
  }

  // Gérer l'énigme si le boss a moins de 20% de vie

  if (currentBoss.health <= 0.2 * 200) {
      askRiddle();
  }

  // Mise à jour des barres de vie et ressources

  updateStatusBars();
}

// Fonction pour poser une énigme

function askRiddle() {
  let riddles = [
      { question: "Quel est le plus grand océan ?", answer: "Pacifique" },
      { question: "Quel est l'animal le plus rapide ?", answer: "Guépard" },
      { question: "Combien de continents existent ?", answer: "7" }
  ];

  let randomRiddle = riddles[Math.floor(Math.random() * riddles.length)];
  let answer = prompt(randomRiddle.question);

  if (answer && answer.toLowerCase() === randomRiddle.answer.toLowerCase()) {
      updateGameLog("Bravo ! Vous avez vaincu le boss avec l'énigme !");
  } else {
      updateGameLog("Mauvaise réponse. Vous avez perdu.");
  }
}

// Fonction pour mettre à jour les barres de vie et ressources
function updateStatusBars() {
  heroes.forEach(hero => {
      let healthBar = document.getElementById(`health-bar-${hero.name}`);
      if (healthBar) {
          healthBar.style.width = `${(hero.health / 50) * 100}%`;
      }
      if (hero.role === 'guerrier') {
          let rageBar = document.getElementById(`rage-bar-${hero.name}`);
          if (rageBar) {
              rageBar.style.width = `${(hero.rage / 4) * 100}%`;
          }
      } else if (hero.role === 'mage') {
          let manaBar = document.getElementById(`mana-bar-${hero.name}`);
          if (manaBar) {
              manaBar.style.width = `${(hero.mana / 7) * 100}%`;
          }
      } else if (hero.role === 'archer') {
          let arrowsBar = document.getElementById(`arrows-bar-${hero.name}`);
          if (arrowsBar) {
              arrowsBar.style.width = `${(hero.arrows / 6) * 100}%`;
          }
      }
  });

  let bossHealthBar = document.getElementById('health-bar-boss');
  if (bossHealthBar) {
      bossHealthBar.style.width = `${(currentBoss.health / 200) * 100}%`;
  }
}

function updateGameLog(message) {
  let gameLog = document.getElementById('game-log');
  gameLog.innerHTML += `<p>${message}</p>`;
}

// Attacher l'événement pour la création des héros

document.getElementById('create-heroes-form').addEventListener('submit', function(event) {
  event.preventDefault()
  distributeStats()
})