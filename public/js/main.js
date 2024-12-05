// Héros

class Hero {

  constructor(name, role, attack, health, posture = 'attaque') {

      this.name = name;
      this.role = role;
      this.attack = attack;
      this.health = health;
      this.posture = posture;
      this.rage = 0; // Guerrier
      this.mana = 7; // Mage
      this.arrows = 6; // Archer

  }

}
  
