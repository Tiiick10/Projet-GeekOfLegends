// Création des classes Boss et Hero

class Hero {

  constructor(name, hp, attack, role, posture, maxRessource) {

    this.name = name 
    this.health = hp 
    this.maxHp = hp 
    this.attack = attack 
    this.role = role 
    this.posture = posture 
    this.maxResource = maxRessource
    this.rage = 0  // Guerrier
    this.mana = 7  // Mage
    this.arrows = 6  // Archer
  }

  attackBoss(boss) {

    let damage = this.attack 

    if (this.posture === "attaque") damage *= 1.2 
    if (this.posture === "défense") damage *= 0.5 

    // Guerrier : Gagner 25% de dégâts s'il a 4 points de rage

    if (this.role === "guerrier" && this.rage >= 4) {
      damage *= 1.25 
      this.rage = 0  // Réinitialiser la rage après utilisation
    }

    // Attaque critique de l'archer

    if (this.role === "archer" && this.arrows >= 2) {
      this.arrows -= 2 
      if (Math.random() < 0.25) {
        damage *= 1.5 
      }
    }

    // Vérification de l'attaque du Mage avec mana

    if (this.role === "mage") {
      if (this.mana >= 2) {
        this.mana -= 2 
      } else {
        this.mana += 7  // Récupère 7 points de mana s'il n'a pas assez de mana

        return `<div>${this.name} n'a pas assez de mana pour attaquer et récupère 7 points de mana.</div>` 
      }
    }

    boss.health = Math.max(0, boss.health - damage)  // Réduit les PV du boss

    return `<div>${this.name} attaque ${boss.name} et inflige ${damage.toFixed(
      2
    )} dégâts.</div>` 
  }

  // Augmenter la rage du Guerrier à la fin du tour

  increaseRage() {
    if (this.role === "guerrier" && this.rage < 4) {
      this.rage += 1  // Augmente de 1 point de rage chaque tour
    }
  }
}

// Fonction pour mettre à jour les barres de ressources

function updateResourceBar(resourceValue, maxResource, resourceBarId) {
    let resourceBar = document.getElementById(resourceBarId) 
    
    if (!resourceBar) {
        console.error(`Élément introuvable : ${resourceBarId}`) 
        return 
    }

    let resourcePercentage = (resourceValue / maxResource) * 100 
    resourceBar.style.width = `${resourcePercentage}%` 
    resourceBar.textContent = `${resourceValue}/${maxResource}` 
}

// Mise à jour des barres de ressources spécifiques des héros

function updateHeroResourceBars(heroes) {
    updateResourceBar(heroes.guerrier.rage, heroes.guerrier.maxResource, "guerrier-rage-bar") 
    updateResourceBar(heroes.mage.mana, heroes.mage.maxResource, "mage-mana-bar") 
    updateResourceBar(heroes.archer.arrows, heroes.archer.maxResource, "archer-arrows-bar") 
}

class Boss {

  constructor(name, hp, attack, element) {

    this.name = name 
    this.health = hp 
    this.maxHp = hp  // Stocke les PV max pour la barre
    this.attack = attack 
    this.element = element 
  }

  attackHeroRandomly(heroes) {
    let aliveHeroes = Object.values(heroes).filter((hero) => hero.health > 0) 

    if (aliveHeroes.length === 0)
      return `<div>Il n'y a plus de héros à attaquer.</div>` 

    let targetHero =
      aliveHeroes[Math.floor(Math.random() * aliveHeroes.length)] 
    targetHero.health = Math.max(0, targetHero.health - this.attack) 

    return `<div>${this.name} attaque ${targetHero.name} et inflige ${this.attack} dégâts.</div>` 
  }
}

// Fonction pour mettre à jour les barres de santé

function updateHealthBars(entity, healthBarId) {
  let healthBar = document.getElementById(healthBarId) 

  if (!healthBar) {
    console.error(`Élément introuvable : ${healthBarId}`) 

    return 
  }

  // Si les PV sont à 0, la barre de vie doit être à 0

  let healthPercentage =
    entity.health === 0 ? 0 : Math.max(0, (entity.health / entity.maxHp) * 100) 
  healthBar.style.width = `${healthPercentage}%` 
  healthBar.textContent = `${Math.ceil(entity.health)}/${entity.maxHp}` 
}

// Fonction pour créer un boss

function createBoss() {

  let bossNames = ["Le Dragon", "Le Géant", "L'Archimage"] 
  let bossHealth = Math.floor(Math.random() * 1000) + 50 
  let bossAttack = Math.floor(Math.random() * 20) + 10 
  let bossElement = ["Feu", "Glace", "Terre"][Math.floor(Math.random() * 3)] 

  return new Boss(

    bossNames[Math.floor(Math.random() * bossNames.length)],
    bossHealth,
    bossAttack,
    bossElement
  ) 
}

// Randomisation des statistiques des héros

function randomizeHeroStats() {

  let minHealth = 1 
  let maxHealth = 50 
  let minAttack = 1 
  let maxAttack = 40 

  let totalMaxAttack = 120 
  let totalMaxHealth = 150 

  let randomStats = () => ({

    health: Math.floor(Math.random() * (maxHealth - minHealth + 1)) + minHealth,
    attack: Math.floor(Math.random() * (maxAttack - minAttack + 1)) + minAttack,
  }) 

  let guerrierStats = randomStats() 
  let mageStats = randomStats() 
  let archerStats = randomStats() 

  // Vérifier que la somme des attaques et des PV ne dépasse pas les limites

  while (
    guerrierStats.attack + mageStats.attack + archerStats.attack >
      totalMaxAttack ||
    guerrierStats.health + mageStats.health + archerStats.health >
      totalMaxHealth
  ) {
    guerrierStats = randomStats() 
    mageStats = randomStats() 
    archerStats = randomStats() 
  }

  document.getElementById("guerrier-hp").value = guerrierStats.health 
  document.getElementById("guerrier-attack").value = guerrierStats.attack 

  document.getElementById("mage-hp").value = mageStats.health 
  document.getElementById("mage-attack").value = mageStats.attack 

  document.getElementById("archer-hp").value = archerStats.health 
  document.getElementById("archer-attack").value = archerStats.attack 
}

// Fonction pour randomiser les noms des héros

function randomizeHeroNames() {

  let getRandomName = (role) => {

    let names = {

      guerrier: ["Thorgal", "Bjorn", "Ragnar", "Ulf", "Einar"],
      mage: ["Merlin", "Gandalf", "Morgane", "Saroumane", "Radagast"],
      archer: ["Robin", "Legolas", "Sylvain", "Hawkeye", "Artemis"],
    } 

    let roleNames = names[role] 

    return roleNames[Math.floor(Math.random() * roleNames.length)] 
  } 

  document.getElementById("guerrier-name").value = getRandomName("guerrier") 
  document.getElementById("mage-name").value = getRandomName("mage") 
  document.getElementById("archer-name").value = getRandomName("archer") 
}

// Bouton de randomisation des noms

document.getElementById("randomize-names").addEventListener("click", randomizeHeroNames) 

// Randomiser les statistiques des héros

document.getElementById("randomize-stats").addEventListener("click", randomizeHeroStats) 

// Initialisation du jeu

document.getElementById("start-game").addEventListener("click", () => {
  if (
    !document.getElementById("guerrier-name").value ||
    !document.getElementById("mage-name").value ||
    !document.getElementById("archer-name").value
  ) {
    alert("Veuillez remplir tous les champs des héros.") 
    return 
  }

  let heroes = {

    guerrier: new Hero(

      document.getElementById("guerrier-name").value,
      parseInt(document.getElementById("guerrier-hp").value),
      parseInt(document.getElementById("guerrier-attack").value),
      "guerrier",
      document.getElementById("guerrier-posture").value
    ),

    mage: new Hero(

      document.getElementById("mage-name").value,
      parseInt(document.getElementById("mage-hp").value),
      parseInt(document.getElementById("mage-attack").value),
      "mage",
      document.getElementById("mage-posture").value
    ),

    archer: new Hero(

      document.getElementById("archer-name").value,
      parseInt(document.getElementById("archer-hp").value),
      parseInt(document.getElementById("archer-attack").value),
      "archer",
      document.getElementById("archer-posture").value
    ),
  } 

  let boss = createBoss() 

  // Afficher la section de combat

  document.getElementById("game-board").style.display = "block" 

  // Mettre à jour l'affichage initial des barres de santé

  updateHealthBars(heroes.guerrier, "guerrier-health-bar") 
  updateHealthBars(heroes.mage, "mage-health-bar") 
  updateHealthBars(heroes.archer, "archer-health-bar") 
  updateHealthBars(boss, "boss-health-bar") 

  let combatLog = document.getElementById("combat-log") 
  let nextRoundButton = document.getElementById("next-round") 
  let round = 1 

  // Gestion des tours

nextRoundButton.addEventListener("click", function nextRound() {
    combatLog.innerHTML = `<div>--- Tour ${round} ---</div>` 

    // Attaque des héros
    for (let hero of Object.values(heroes)) {
        if (hero.health > 0) {
            combatLog.innerHTML += hero.attackBoss(boss) 
        }
    }

    // Vérifier si le boss est vaincu
    if (boss.health <= 0) {
        combatLog.innerHTML += `<div>${boss.name} est vaincu ! Les héros gagnent !</div>` 
        boss.health = 0  // S'assurer que la santé du boss est à 0 après sa défaite
        updateHealthBars(boss, "boss-health-bar") 
        nextRoundButton.disabled = true 

        // Afficher le bouton pour rejouer
        let replayButton = document.createElement("button") 
        replayButton.textContent = "Rejouer" 
        replayButton.addEventListener("click", () => {
            let confirmMessage = confirm("Voulez-vous rejouer ?") 

            if (confirmMessage) {
                location.reload() 
            } else {
                window.location.href = "./index.html" 
            }
        }) 

        document.getElementById("game-board").appendChild(replayButton) 
        return 
    }

    // Attaque du boss sur un héros aléatoire
    combatLog.innerHTML += boss.attackHeroRandomly(heroes) 

    // Vérifier si tous les héros sont morts
const allHeroesDead = Object.values(heroes).every(hero => hero.health <= 0);

if (allHeroesDead) {
    combatLog.innerHTML += `<div>Tous les héros sont morts. ${boss.name} a gagné !</div>` 
    nextRoundButton.disabled = true 

    // Mettre à jour toutes les barres de santé des héros à 0
    for (let heroKey in heroes) {
        updateHealthBars(heroes[heroKey], `${heroKey}-health-bar`) 
    }

    // Afficher le bouton pour rejouer
    let replayButton = document.createElement("button") 
    replayButton.textContent = "Rejouer" 
    replayButton.addEventListener("click", () => {
        let confirmMessage = confirm("Voulez-vous rejouer ?") 

        if (confirmMessage) {
            location.reload() 
        } else {
            window.location.href = "./index.html" 
        }
    }) 

    document.getElementById("game-board").appendChild(replayButton) 
    return 
    
    }


    // Mise à jour des barres de santé
    updateHealthBars(heroes.guerrier, "guerrier-health-bar") 
    updateHealthBars(heroes.mage, "mage-health-bar") 
    updateHealthBars(heroes.archer, "archer-health-bar") 
    updateHealthBars(boss, "boss-health-bar") 

    // Mise à jour des barres de ressources après chaque tour
    updateHeroResourceBars(heroes) 

    // Augmenter la rage du Guerrier après chaque tour
    heroes.guerrier.increaseRage() 

    round++ 
})
})
