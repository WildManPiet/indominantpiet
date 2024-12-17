/**
 * Extend the base Actor document by defining a custom roll data structure which is ideal for the Simple system.
 * @extends {Actor}
 */
export class IndominantPietActor extends Actor {
  /** @override */
  prepareData() {
    // Prepare data for the actor. Calling the super version of this executes
    // the following, in order: data reset (to clear active effects),
    // prepareBaseData(), prepareEmbeddedDocuments() (including active effects),
    // prepareDerivedData().
    super.prepareData();
  }

  /** @override */
  prepareBaseData() {
    // Data modifications in this step occur before processing embedded
    // documents or derived data.
  }

  /**
   * @override
   * Augment the actor source data with additional dynamic data. Typically,
   * you'll want to handle most of your calculated/derived data in this step.
   * Data calculated in this step should generally not exist in template.json
   * (such as ability modifiers rather than ability scores) and should be
   * available both inside and outside of character sheets (such as if an actor
   * is queried and has a roll executed directly from it).
   */
  prepareDerivedData() {
    const actorData = this;
    const systemData = actorData.system;
    const flags = actorData.flags.indominantpiet || {};

    // Make separate methods for each Actor type (character, npc, etc.) to keep
    // things organized.
    this._prepareCharacterData(actorData);
    this._prepareNpcData(actorData);
  }

  /**
   * Prepare Character type specific data
   */
  _prepareCharacterData(actorData) {
    if (actorData.type !== 'character') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;

    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(systemData.abilities)) {
      // Calculate the modifier using d20 rules.
      ability.mod = Math.floor((ability.value + ability.bonus ) / 1);
    }
    
    
     //Need to incorporate the same things for abilities to skills.  not sure where it all is pointing and getting is visible on character sheet.  When ready use formula below need to define expertise
    for (let [key, skill] of Object.entries(systemData.skill)) {
      // Calculate the skill modifier using d20 rules.
      if (skill.Echeckbox==true) {
        if (skill.value>=100) {
          skill.mod = (12 + 3) ; //skill.exp
        } else {
          skill.mod = Math.floor((skill.value / 10 ) + 3 ) ; //skill.exp
        }
        
      } else {
        if (skill.value>=100) {
          skill.mod = (12) ;
        } else {
          skill.mod = Math.floor((skill.value / 10 ) + 0 ) ;
        }
        
      }
      
    }
    // Calculation for Combat Action modifiers (no domiance)
    for (let [key, cact] of Object.entries(systemData.cact)) {
      // Calculate the skill modifier using d20 rules.
      cact.mod = Math.floor((cact.value)) ; //no dominance
    }

  }

  /**
   * Prepare NPC type specific data.
   */
  _prepareNpcData(actorData) {
    if (actorData.type !== 'npc') return;

    // Make modifications to data here. For example:
    const systemData = actorData.system;
    //systemData.xp = systemData.cr * systemData.cr * 100;
    // Loop through ability scores, and add their modifiers to our sheet output.
    for (let [key, ability] of Object.entries(systemData.abilities)) {
      // Calculate the modifier using d20 rules.
      ability.mod = Math.floor((ability.value - 0 ) / 1);
    }
    // Calculation for Combat Action modifiers (no domiance)
    for (let [key, cact] of Object.entries(systemData.cact)) {
      // Calculate the skill modifier using d20 rules.
      cact.mod = Math.floor((cact.value)) ; //no dominance
    }
  }

  /**
   * Override getRollData() that's supplied to rolls.
   */
  getRollData() {
    // Starts off by populating the roll data with a shallow copy of `this.system`
    const data = { ...this.system };

    // Prepare character roll data.
    this._getCharacterRollData(data);
    this._getNpcRollData(data);

    return data;
  }

  /**
   * Prepare character roll data.
   */
  _getCharacterRollData(data) {
    if (this.type !== 'character') return;

    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@mgt.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }

  /**
   * Prepare NPC roll data.
   */
  _getNpcRollData(data) {
    if (this.type !== 'npc') return;

    // Process additional NPC data here.
    // Copy the ability scores to the top level, so that rolls can use
    // formulas like `@mgt.mod + 4`.
    if (data.abilities) {
      for (let [k, v] of Object.entries(data.abilities)) {
        data[k] = foundry.utils.deepClone(v);
      }
    }

    // Add level for easier access, or fall back to 0.
    if (data.attributes.level) {
      data.lvl = data.attributes.level.value ?? 0;
    }
  }
}
