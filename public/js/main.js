// Héros

class Hero {

  constructor(name, role, attack, health, posture = 'attaque') {

      this.name = name
      this.role = role
      this.attack = attack
      this.health = health
      this.posture = posture
      this.rage = 0 // Guerrier
      this.mana = 7 // Mage
      this.arrows = 6 // Archer

  }

  attackBoss() {

      let damage = this.attack

      if (this.role === 'guerrier') {
          if (this.rage >= 4) {
              damage *= 1.25
              this.rage = 0
          } else {
              this.rage += 1;
          }
      } else if (this.role === 'mage') {
          if (this.mana >= 2) {
              this.mana -= 2;
          } else {
              this.mana += 7;
              damage = 0;
          }
      } else if (this.role === 'archer') {
          if (this.arrows >= 2) {
              this.arrows -= 2;
          } else {
              this.arrows += 6;
              damage = 0;
          }
      }
      return damage;
  }
}

// Boss
class Boss {
  constructor(name, attack, health) {
      this.name = name;
      this.attack = attack;
      this.health = health;
  }

  attackHero(hero) {
      let damage = this.attack;
      hero.health -= damage;
      return damage;
  }
}

// Bosses
let bosses = [
  new Boss('Sauron', 30 + Math.floor(Math.random() * 20), 200 + Math.floor(Math.random() * 100)),
  new Boss('Chronos', 25 + Math.floor(Math.random() * 20), 180 + Math.floor(Math.random() * 100)),
  new Boss('Lilith', 35 + Math.floor(Math.random() * 20), 220 + Math.floor(Math.random() * 100)),
];

// Héros
let heroes = [
  new Hero('Guerrier', 'guerrier', 30, 50),
  new Hero('Mage', 'mage', 25, 40),
  new Hero('Archer', 'archer', 20, 40)
];

let currentBoss;
let isGameRunning = false;

function startGame() {
  isGameRunning = true;
  currentBoss = bosses[Math.floor(Math.random() * bosses.length)];
  updateGameLog(`Le boss ${currentBoss.name} est apparu !`);
  displayHeroes();
  displayBoss();

  document.getElementById('hero-setup').innerHTML = '<button id="next-turn">Prochain tour</button>';
  document.getElementById('next-turn').addEventListener('click', nextTurn);
}

function displayHeroes() {
  let gameLog = document.getElementById('game-log');
  gameLog.innerHTML += '<h2>Héros :</h2>';
  heroes.forEach(hero => {
    gameLog.innerHTML += `<p>${hero.name} (${hero.role}) - Santé: ${hero.health} - Attaque: ${hero.attack}</p>`;
  });
}

function displayBoss() {
  let bossDiv = document.getElementById('boss-info');
  bossDiv.innerHTML = `<p>${currentBoss.name} - Santé: ${currentBoss.health}</p>`;
}

function updateGameLog(message) {
  let gameLog = document.getElementById('game-log');
  gameLog.innerHTML += `<p>${message}</p>`;
}

function nextTurn() {
  if (!isGameRunning) return;

  heroes.forEach(hero => {
    if (hero.health > 0) {
      let damage = hero.attackBoss();
      if (damage > 0) {
        currentBoss.health -= damage;
        updateGameLog(`${hero.name} attaque ${currentBoss.name} et inflige ${damage} dégâts.`);
      } else {
        updateGameLog(`${hero.name} ne peut pas attaquer ce tour (pas de ressources).`);
      }
    }
  });

  if (currentBoss.health <= 0) {
    updateGameLog(`Le boss ${currentBoss.name} est vaincu ! Vous avez gagné !`);
    isGameRunning = false;
    return;
  }

  attackHero();
  checkGameStatus();
  checkBossRiddle();
  updateStatusBars();
}

function attackHero() {
  let livingHeroes = heroes.filter(hero => hero.health > 0);
  let randomHero = livingHeroes[Math.floor(Math.random() * livingHeroes.length)];
  let damage = currentBoss.attackHero(randomHero);
  updateGameLog(`${currentBoss.name} attaque ${randomHero.name} et inflige ${damage} dégâts.`);

  if (randomHero.health <= 0) {
    updateGameLog(`${randomHero.name} est mort.`);
  }
}

function checkGameStatus() {
  let livingHeroes = heroes.filter(hero => hero.health > 0);
  if (livingHeroes.length === 0) {
    updateGameLog("Tous les héros sont morts. Vous avez perdu.");
    isGameRunning = false;
    return;
  }
}

function checkBossRiddle() {
  if (currentBoss.health <= currentBoss.health * 0.2) {
    askBossRiddle();
  }
}

function askBossRiddle() {
  let riddles = [
    { question: "Quel est le plus grand océan de la Terre?", answer: "Pacifique" },
    { question: "Quel est le plus grand pays du monde?", answer: "Russie" },
    { question: "Qui a écrit 'Les Misérables'?", answer: "Victor Hugo" }
  ];
  let randomRiddle = riddles[Math.floor(Math.random() * riddles.length)]
  let answer = prompt(randomRiddle.question)
  if (answer && answer.toLowerCase() === randomRiddle.answer.toLowerCase()) {
    updateGameLog("Bravo ! Vous avez vaincu le boss avec l'énigme !")
    isGameRunning = false
  } else {
    updateGameLog("Mauvaise réponse. Vous avez perdu.")
    isGameRunning = false
  }
}

// Mise à jour des barres de santé, mana, et rage

function updateStatusBars() {

  // Héros

  heroes.forEach(hero => {

    document.getElementById(`health-bar-${hero.name}`).style.width = `${hero.health}%`
    document.getElementById(`mana-bar-${hero.name}`).style.width = `${hero.mana}%`
    document.getElementById(`rage-bar-${hero.name}`).style.width = `${hero.rage * 25}%`

  })

  // Boss

  document.getElementById('health-bar-boss').style.width = `${(currentBoss.health / (200 + Math.floor(Math.random() * 100))) * 100}%`

}

// Lancement du jeu

document.getElementById('start-game').addEventListener('click', startGame)
