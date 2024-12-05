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

  // Attaque

  attackBoss() {

      let damage = this.attack;
      
      if (this.role === 'guerrier') {

          // Le Guerrier utilise la rage

          if (this.rage >= 4) {

              damage *= 1.25 // Augmenter les dégâts de 25%
              this.rage = 0 // Réinitialiser la rage

          } else {

              this.rage += 1 // +1 rage à chaque tour

          }

      } else if (this.role === 'mage') {

          // Le Mage utilise des points de mana

          if (this.mana >= 2) {
              this.mana -= 2 // Réduire le mana

          } else {

              this.mana += 7 // Récupérer du mana
              damage = 0 // Le Mage ne fait pas de dégâts s'il n'a pas assez de mana

          }

      } else if (this.role === 'archer') {

          // L'archer utilise des flèches

          if (this.arrows >= 2) {
              this.arrows -= 2 // Réduire les flèches

          } else {

              this.arrows += 6 // Récupérer des flèches
              damage = 0
          }
      }
      
      return damage

  }

}

// Boss

class Boss {

  constructor(name, attack, health) {
      this.name = name
      this.attack = attack
      this.health = health

  }

  // Le Boss attaque un Héro

  attackHero(hero) {

      let damage = this.attack
      hero.health -= damage
      return damage

  }

}

// Les Boss

let bosses = [

  new Boss('Sauron', 30 + Math.floor(Math.random() * 20), 200 + Math.floor(Math.random() * 100)),
  new Boss('Chronos', 25 + Math.floor(Math.random() * 20), 180 + Math.floor(Math.random() * 100)),
  new Boss('Lilith', 35 + Math.floor(Math.random() * 20), 220 + Math.floor(Math.random() * 100)),

]

// Les Héros

let heroes = [

  new Hero('Guerrier', 'guerrier', 30, 50),
  new Hero('Mage', 'mage', 25, 40),
  new Hero('Archer', 'archer', 20, 40)

]

// Variables

let currentBoss
let isGameRunning = false

// Démarrer le jeu

function startGame() {

  isGameRunning = true
  currentBoss = bosses[Math.floor(Math.random() * bosses.length)]

  updateGameLog(`Le boss ${currentBoss.name} est apparu !`)
  displayHeroes()
  document.getElementById('hero-setup').innerHTML = '<button id="next-turn">Prochain tour</button>'

  document.getElementById('next-turn').addEventListener('click', nextTurn)

}

// Afficher les héros

function displayHeroes() {

  let gameLog = document.getElementById('game-log')
  gameLog.innerHTML += '<h2>Héros : </h2>'

  heroes.forEach(hero => {

      gameLog.innerHTML += `<p>${hero.name} (${hero.role}) - Santé: ${hero.health} - Attaque: ${hero.attack}</p>`

  })

}

// Mettre à jour les logs du jeu

function updateGameLog(message) {

  let gameLog = document.getElementById('game-log')
  gameLog.innerHTML += `<p>${message}</p>`

}





