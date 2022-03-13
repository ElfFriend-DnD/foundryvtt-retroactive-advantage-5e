export class RetroAdvantage5e {
  static MODULE_NAME = "retroactive-advantage-5e";
  static MODULE_TITLE = "Retroactive Advantage DnD5e";

  static log(...args) {
    if (game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.MODULE_NAME)) {
      console.log(this.MODULE_TITLE, '|', ...args);
    }
  }

  /**
   * Helper method to grab a new d20 result
   * @returns 
   */
  static async _rollExtraD20() {
    return new Roll('1d20').evaluate({async: true});
  }
  
  /**
   * Handles creating a new D20Roll instance with the updated roll method and totals based on a given one
   * @param {D20Roll} d20Roll - the original instance
   * @param {AdvantageMode} newAdvMode - CONFIG.Dice.D20Roll.ADV_MODE
   * @returns {D20Roll} - a new D20Roll instance with the updated details
   */
  static async _makeNewRoll(d20Roll, newAdvMode) {
    if (newAdvMode === undefined) {
      throw new Error('you must provide what the New Advantage mode is')
    }
  
    if (!(d20Roll instanceof CONFIG.Dice.D20Roll)) {
      throw new Error('provided roll was not an instance of D20Roll');
    }
  
    if (d20Roll.options.advantageMode === newAdvMode) {
      throw new Error('provided roll is already that kind of roll');
    }
  
    if (d20Roll.terms[0]?.faces !== 20) {
      throw new Error("provided roll does not look like a typical d20 roll");
    }
  
    const {
      DISADVANTAGE,
      NORMAL,
      ADVANTAGE
    } = CONFIG.Dice.D20Roll.ADV_MODE;
  
    // DIY Roll.clone because we want to be able to change things without mutating the original
    // Core's clone method preserves the references to the options and data objects
    let newD20Roll = new d20Roll.constructor(d20Roll._formula, { ...d20Roll.data }, { ...d20Roll.options });
  
    newD20Roll.options.advantageMode = newAdvMode;
  
    this.log('duplicating', {
      d20Roll,
      newD20Roll
    });
  
    // mutate new terms to look like old ones
    newD20Roll.terms = [...d20Roll.terms];
  
    let d20Term = newD20Roll.terms[0];
  
    // do stuff to the terms and modifiers
    switch (newAdvMode) {
      case (NORMAL): {
        d20Term.modifiers = [];
        d20Term.results = [d20Term.results.shift()]; // keep only the result of the first element of the array
        break;
      }
  
      case (ADVANTAGE): {
        d20Term.modifiers = ['kh'];
  
        // if this d20Term doesn't already have more than 1 rolled value, add a new one
        if (d20Term.number === 1) {
          const newD20 = await this._rollExtraD20();
          d20Term.results.push(...newD20.terms[0].results);
        }
        break;
      }
  
      case (DISADVANTAGE): {
        d20Term.modifiers = ['kl'];
  
        // if this d20Term doesn't already have more than 1 rolled value, add a new one
        if (d20Term.number === 1) {
          const newD20 = await this._rollExtraD20();
          d20Term.results.push(...newD20.terms[0].results);
        }
        break;
      }
    }
  
    // set the number of dice correctly with the new terms length
    d20Term.number = d20Term.results.length;
  
    // mutate each term to reset to pre-evaluateModifiers state
    d20Term.results.forEach((term) => {
      term.active = true; // all terms start as active
      delete term.discarded; // no terms start as discarded
    })
  
    // handle new terms based on the roll modifiers
    d20Term._evaluateModifiers();
  
    // reconstruct the formula after adjusting the terms
    newD20Roll._formula = newD20Roll.constructor.getFormula(newD20Roll.terms);
  
    // re-evaluate total after adjusting the terms
    newD20Roll._total = newD20Roll._evaluateTotal();
  
    return newD20Roll;
  }
  
  /**
   * Handles our button clicks from the chat log
   * @param {string} action 
   * @param {string} messageId 
   */
  static async _handleButtonClick(action, messageId) {
    try {
      const {
        DISADVANTAGE,
        NORMAL,
        ADVANTAGE
      } = CONFIG.Dice.D20Roll.ADV_MODE;
  
      const chatMessage = game.messages.get(messageId);
  
      if (!messageId || !action || !chatMessage) {
        throw new Error('Missing Information')
      }
  
      let newD20Roll;
  
      switch (action) {
        case 'dis': {
          newD20Roll = await this._makeNewRoll(chatMessage.roll, DISADVANTAGE);
          break;
        }
        case 'norm': {
          newD20Roll = await this._makeNewRoll(chatMessage.roll, NORMAL);
          break;
        }
        case 'adv': {
          newD20Roll = await this._makeNewRoll(chatMessage.roll, ADVANTAGE);
          break;
        }
      }
  
      const newMessageData = await newD20Roll.toMessage({}, { create: false });
      delete newMessageData.timestamp;
  
      const messageUpdate = foundry.utils.mergeObject(
        chatMessage.toJSON(),
        newMessageData,
      );
  
      this.log('New stuff d20 roll', { roll: chatMessage.roll, newD20Roll }, {
        chatMessage,
        newMessageData,
        messageUpdate
      });
  
      return chatMessage.update(messageUpdate);
    } catch (err) {
      console.error('A problem occurred with Retroactive Advantage 5e:', err);
    }
  }
  
  static init() {
    console.log(`${RetroAdvantage5e.MODULE_NAME} | Initializing ${RetroAdvantage5e.MODULE_TITLE}`);

    /**
     * Set up one listener for the whole chat log
     */
    Hooks.on('renderChatLog', async (_chatLog, html) => {
      html.on('click', 'button[data-retro-action]', async (event) => {
        event.preventDefault();
        event.stopPropagation();

        const action = event.currentTarget.dataset?.retroAction;

        const messageId = event.currentTarget.closest('[data-message-id]')?.dataset?.messageId;

        if (!messageId || !action) {
          return;
        }

        RetroAdvantage5e._handleButtonClick(action, messageId);
      });
    });

    /**
     * Adorn any chat message with a d20 roll with our buttons
     */
    Hooks.on('renderChatMessage', async (chatMessage, [html]) => {
      if (!chatMessage.isRoll || !(chatMessage.roll instanceof CONFIG.Dice.D20Roll)) {
        return;
      }

      const {
        DISADVANTAGE,
        NORMAL,
        ADVANTAGE
      } = CONFIG.Dice.D20Roll.ADV_MODE;

      const advantageMode = chatMessage.roll?.options?.advantageMode;

      const diceElement = html.querySelector('.dice-roll');
      const messageContent = html.querySelector('.message-content');

      const buttonNode = document.createRange().createContextualFragment(`
      <small class="flexrow retroactive-advantage-buttons">
        <button data-retro-action="dis" ${advantageMode === DISADVANTAGE ? 'disabled' : ''}>${game.i18n.localize('DND5E.Disadvantage')}</button>
        <button data-retro-action="norm" ${advantageMode === NORMAL ? 'disabled' : ''}>${game.i18n.localize('DND5E.Normal')}</button>
        <button data-retro-action="adv" ${advantageMode === ADVANTAGE ? 'disabled' : ''}>${game.i18n.localize('DND5E.Advantage')}</button>
      </small>
      `);

      messageContent.insertBefore(buttonNode, diceElement);
    });
  }
}

Hooks.on("init", RetroAdvantage5e.init);

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
  registerPackageDebugFlag(RetroAdvantage5e.MODULE_NAME);
});
