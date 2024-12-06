// Création des classes Boss et Hero

class Hero {

    constructor(name, hp, attack, role, posture) {
        this.name = name
        this.health = hp
        this.attack = attack
        this.role = role
        this.posture = posture

    }

    attackBoss(boss) {

        let damage = this.attack 
        if (this.posture === 'attaque') damage *= 1.2 
        if (this.posture === 'défense') damage *= 0.5
        
        // Attaque critique de l'archer

        if (this.role === 'archer' && this.arrows >= 2) {
            this.arrows -= 2 
            if (Math.random() < 0.25) { 
                damage *= 1.5 
            }
        }

        //

        boss.health = Math.max(0, boss.health - damage) 
        return `<div>${this.name} attaque ${boss.name} et inflige ${damage.toFixed(2)} dégâts.</div>` 

    }
}

class Boss {

    constructor(name, hp, attack, element) {
        this.name = name 
        this.health = hp 
        this.attack = attack 
        this.element = element 

    }

    attackHero(hero) {

        if (hero.health <= 0) return `<div>${hero.name} est déjà hors combat.</div>` 
        
        hero.health = Math.max(0, hero.health - this.attack) 
        return `<div>${this.name} attaque ${hero.name} et inflige ${this.attack} dégâts.</div>` 

    }
}

// Fonction pour créer un boss

function createBoss() {

    let bossNames = ['Le Dragon', 'Le Géant', 'L\'Archimage'] 
    let bossHealth = Math.floor(Math.random() * 1000) + 50 
    let bossAttack = Math.floor(Math.random() * 20) + 10 
    let bossElement = ['Feu', 'Glace', 'Terre'][Math.floor(Math.random() * 3)] 
    return new Boss(bossNames[Math.floor(Math.random() * bossNames.length)], bossHealth, bossAttack, bossElement) 

}

// Mise à jour des barres de vie avec vérification

function updateHealthBars(hero, elementId) {

    console.log(`Mise à jour de la barre de vie pour ${elementId}`) 
    let healthBar = document.getElementById(elementId) 
    if (!healthBar) {
        console.error(`Élément introuvable : ${elementId}`) 
        return 
    }
    healthBar.style.width = `${Math.max(0, hero.health)}%`

}

// Fonction pour répartir les points de vie et d'attaque

function distributeStats() {
    let totalHealth = 150 
    let totalAttack = 120 
    
    // Obtenir les valeurs entrées par l'utilisateur
  
    let hero1Health = parseInt(document.getElementById('hero1-health').value) 
    let hero2Health = parseInt(document.getElementById('hero2-health').value) 
    let hero3Health = parseInt(document.getElementById('hero3-health').value) 
  
    let hero1Attack = parseInt(document.getElementById('hero1-attack').value) 
    let hero2Attack = parseInt(document.getElementById('hero2-attack').value) 
    let hero3Attack = parseInt(document.getElementById('hero3-attack').value) 
  
    // Vérification que la somme des points de vie et attaque est correcte
  
    if (hero1Health + hero2Health + hero3Health === totalHealth &&
        hero1Attack + hero2Attack + hero3Attack === totalAttack) {
  
        // Créer les héros avec les attributs donnés par l'utilisateur
  
        heroes = [
            new Hero(document.getElementById('hero1-name').value, 'guerrier', hero1Attack, hero1Health),
            new Hero(document.getElementById('hero2-name').value, 'mage', hero2Attack, hero2Health),
            new Hero(document.getElementById('hero3-name').value, 'archer', hero3Attack, hero3Health)
        ] 
  
        // Lancer le jeu après la création des héros
  
        document.getElementById('start-game').style.display = 'inline' 
        document.getElementById('create-heroes-form').style.display = 'none' 
    } else {
        alert('Les points de vie et d\'attaque doivent être répartis correctement.') 
    }
  }

// Mise à jour des statuts

function updateStatus(heroes, boss) {

    try {
        document.getElementById('guerrier-status').innerHTML = `${heroes.guerrier.name} (HP: ${heroes.guerrier.health})` 
        document.getElementById('mage-status').innerHTML = `${heroes.mage.name} (HP: ${heroes.mage.health})` 
        document.getElementById('archer-status').innerHTML = `${heroes.archer.name} (HP: ${heroes.archer.health})` 
        document.getElementById('boss-name').innerHTML = `${boss.name} (HP: ${boss.health})` 

        updateHealthBars(heroes.guerrier, 'guerrier-health-bar') 
        updateHealthBars(heroes.mage, 'mage-health-bar') 
        updateHealthBars(heroes.archer, 'archer-health-bar') 

    } catch (error) {

        console.error('Erreur dans updateStatus:', error) 

    }

}

// Initialisation du jeu

document.getElementById('start-game').addEventListener('click', () => {

    // Vérification des champs remplis

    if (!document.getElementById('guerrier-name').value || 
        !document.getElementById('mage-name').value || 
        !document.getElementById('archer-name').value) {
        alert('Veuillez remplir tous les champs des héros.') 
        return 
    }

    let heroes = {

        guerrier: new Hero(

            document.getElementById('guerrier-name').value,
            parseInt(document.getElementById('guerrier-hp').value),
            parseInt(document.getElementById('guerrier-attack').value),
            'guerrier',
            document.getElementById('guerrier-posture').value

        ),

        mage: new Hero(

            document.getElementById('mage-name').value,
            parseInt(document.getElementById('mage-hp').value),
            parseInt(document.getElementById('mage-attack').value),
            'mage',
            document.getElementById('mage-posture').value

        ),

        archer: new Hero(

            document.getElementById('archer-name').value,
            parseInt(document.getElementById('archer-hp').value),
            parseInt(document.getElementById('archer-attack').value),
            'archer',
            document.getElementById('archer-posture').value

        ),
    } 

    let boss = createBoss() 

    document.getElementById('game-board').style.display = 'block' // Affiche la section du combat

    let combatLog = document.getElementById('combat-log') 
    let nextRoundButton = document.getElementById('next-round') 

    nextRoundButton.addEventListener('click', function nextRound() {

        combatLog.innerHTML = `<div>--- Tour ${round} ---</div>` 

        // Attaque des héros

        for (let hero of Object.values(heroes)) {

            if (hero.health > 0) combatLog.innerHTML += hero.attackBoss(boss) 

        }

        // Vérifier si le boss est vaincu

        if (boss.health <= 0) {

            combatLog.innerHTML += `<div>${boss.name} est vaincu ! Les héros gagnent !</div>` 
            nextRoundButton.disabled = true 

            return 

        }

        // Le boss attaque

        for (let hero of Object.values(heroes)) {
            
            if (hero.health > 0) combatLog.innerHTML += boss.attackHero(hero) 

        }

        // Vérifier si tous les héros sont morts

        if (Object.values(heroes).every((hero) => hero.health <= 0)) {

            combatLog.innerHTML += `<div>Tous les héros sont morts... Le boss gagne !</div>` 

            nextRoundButton.disabled = true 

            return 

        }

        // Mise à jour des points de vie

        updateStatus(heroes, boss)

        round++ 

    })

})