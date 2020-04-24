'use strict';

import {
  setupTests,
} from "./tests.js"

import { 
  originalState, 
  saveState, 
  loadState, 
  newGame,
  calculateNewState,
} from "./state.js";

import { 
  generalUpdate,
  updateCorporateOffices,
  updateMonopoly,
  updateMailware,
  updateBigNet,
  updatePostOffices,
  updateMailmen, 
  updateRecruiters,
  updatePigeons,
  updateJets,
  updateMailDrones,
  updateEmail,
  updateMailTruck,
  updateMailboxes,
  updateAutoReader,
  updateFactories,
  updateLetters,
} from "./tick.js";

import { 
  buy,
  buyScientificManagement,
  buyMailware,
  buyAds,
  buyMonopoly,
  buyCorporateOffices,
  buyAutoReader,
  buyMaxAutoReader,
  buySegway,
  buyJet,
  buyPigeons,
  buyBoxMod,
  buyDogTreats,
  buyMailDrones,
  buySelfReliance,
  buyMailbox, 
  buyRecruiter,
  buyMailTruck,
  buyCaffeine,
  buyBigNet,
  buyInflation,
  buyEmail,
  buyLittleHelp,
  buyTwoHands,
  buyMailman,
  buySpontaneousGeneration,
  buyFactory,
  buyBootstrap,
  buyOneTime,
  buyPostOffice,
  buyMax,
  buyTwoForOne,
} from "./buy.js";

Vue.component("timed-event", {
  props: ["title", "seconds", "description"],

  template: `
  <div>
    <div class="event-name">{{ title }}</div>
    <div class="event-timer">{{ seconds }} seconds</div>
    <div class="event-description">{{ description }}</div>
  </div>
  `
});

Vue.component("stat", {
  props: ["value", "name"],
  
  template: `
    <div class="column stat">
      <div class="stat-value">{{ value }}</div>
      <div class="stat-name">{{ name }}</div>
    </div>
  `
});

Vue.component('buy-button', {
  props:[
    'title', 
    'price', 
    'description', 
    'maxBuy',
    'owned',
    'curiosity',
    'chosen',
    'choose',
  ],
  
  data() {
    return {
      isChosen: Boolean(this.chosen),
    }
  },

  methods: {
    buy: function() {
      this.$emit("buy");
    },

    setChosen: function() {
      this.isChosen = !this.isChosen;
      this.$emit("chosen");
    },

    action: function() {
      if(this.choose) {
        this.setChosen();
      } else {
        this.buy();
      }
    },

    buyMax: function() {
      this.$emit("buy-max");
    }
  },

  template: `
    <div class="button column" :class="isChosen ? 'chosen' : ''"  @click='action'>
      <div class="button-name">
        <div>{{ title }}</div>
        <div v-if="!owned && !curiosity">(\${{ price }})</div>
        <div v-else-if="curiosity">({{ price }} curiosity)</div>
        <div v-else>(owned)</div>
      </div>
      <div class="button-description">
        {{ description }}
      </div>
      <div v-show="maxBuy" class="buy-max" @click="buyMax">
        (buy max)
      </div>
    </div>
  `
});

const vw = new Vue({
  el:"#app",
  
  data: Object.assign({scrolled: false}, originalState), 
 
  computed: {
    autoreaderDescription: function() {
      return `Auto reads letters.`;
    },

    mailmanDescription: function() {
      return `Mailmen deliver ${this.mailmanDelivery} ${this.mailmanDelivery > 1 ? 'letters' : 'letter'} per mailman automatically every ${this.round(this.getMailmanDelay / 1000)} seconds.`;
    },
   
    mailboxDescription: function() {
      return `Generates ${this.getMailboxLettersInc} letter per mailbox every ${this.getMailboxDelay / 1000} seconds.`
    },

    bootstrapDescription: function() {
      return `Increases letters per click by ${this.bootstrapInc}. If you don't have enough funds, then an amount of letters equal to your letters per click will be generated instead.`;
    },

    recruiterDescription: function() {
      return `Hires ${this.recruiterHire} mailmen per recruiter every ${this.getRecruiterDelay / 1000} seconds. Hiring does not cost money.`;
    },

    factoryDescription: function() {
      return `Generates ${this.factoryGenerate} ${this.factoryGenerate == 1 ? 'mailbox' : 'mailboxes'} per factory every ${this.getFactoryDelay / 1000} seconds. These mailboxes do not cost anything.`;
    },

    segwayDescription: function() {
      return `Increases mailman efficiency by ${this.segwayMailmanBoost * 100}%.`
    },

    scientificManagementDescription: function() {
      return "Reduces the time it take for factories to generate mailboxes by 50%.";
    },

    twoHandsDescription: function() {
      return `Each delivery click has a ${this.twoHandsChance * 100}% chance of delivering ${this.twoHandsMultiplier}x the amount of letters.`
    },

    postOfficeDescription: function() {
      return `Generates ${this.postOfficeInc} letters every ${this.getPostOfficeDelay / 1000} seconds.`;
    },

    mailTruckDescription: function() {
      return `Automatically delivers ${this.mailTruckInc} letters every ${this.getMailTruckDelay / 1000} seconds`;
    },

    emailDescription: function() {
      return `Accept letters via the internet. Generates ${this.emailInc} letters every ${this.getEmailDelay / 1000} seconds`;
    },

    littleHelpDescription: function() {
      return `${this.littleHelpChance * 100}% chance of hiring ${this.littleHelpIncrease} mailmen every delivery click.`;
    },

    bigNetDescription: function() {
      return `Capture all the messages in bottles that are floating around the ocean. Generates ${this.bigNetInc} letters every ${this.getBigNetDelay / 1000} seconds.`;
    },

    selfRelianceDescription: function() {
      return `Increases bootstrap increment by ${this.selfRelianceInc}.`;
    },

    inflationDescription: function() {
      return `Increases the price per letter by ${this.inflationIncrease * 100}%.`;
    },

    mailwareDescription: function() {
      return `Infect people's computers and phones with 'mailware' capturing letters before they are even sent! Generates ${this.mailwareInc} letters per tick.`;
    },

    mailDronesDescription: function() {
      return `Unleash a swarm of mail delivering drones. Delivers ${this.mailDronesDelivery} letters every ${this.getMailDronesDelay / 1000} seconds.`;
    },

    jetsDescription: function() {
      return `Jets deliver ${this.jetDelivery} letters every ${this.getJetDelay / 1000} seconds.`;
    },

    spontaneousGenerationDescription: function() {
      return `${this.spontaneousGenerationChance * 100}% chance that clicking to deliver a letter will multiply your letters per click by ${this.spontaneousGenerationMult} for that click.`;
    },

    postOfficDescription: function() {
      return `Generates two letters every ${this.getPostOfficeDelay / 1000} seconds.`;
    },

    caffeineDescription: function() {
      return `Every mailman gets put on a madatory drip of high octane espresso. Decreases mailman delivery delay by ${this.caffeineBoost * 100}%`
    },

    pigeonsDescription: function() {
      return `Pigeons deliver ${this.getPigeonsDelivery} letters every ${this.getPigeonsDelay / 1000} seconds.`; 
    },

    dogTreatsDescription: function() {
      return `Use to stave off the angry dogs on the block. Decreases mailman delivery delay by ${this.dogTreatsBoost * 100}%`;
    },

    boxModDescription: function() {
      return `Increase the number of letters per second produced by a mailbox by ${this.boxModBoost}.`; 
    },

    monopolyDescription: function() {
      return `Establishes ${this.monopolyIncrease} Corporate Office every ${this.getMonopolyDelay / 1000} seconds.`;
    },

    getMonopolyDelay: function() {
      return this.monopolyDelay;
    },

    monopolyPrice: function() {
      return this.round(this.monopolyBasePrice + (this.monopoly ** 1.9));
    },

    corporateOfficesDescription: function() {
      return `Automatically creates ${this.getCorporateOfficesIncrease} Recruiters and Factories per Corporate Office every ${this.corporateOfficesDelay / 1000} seconds.`; 
    },

    corporateOfficesPrice: function() {
      return this.round(this.corporateOfficesBasePrice + (this.corporateOffices ** 2));
    },

    getCorporateOfficesDelay: function() {
      return this.corporateOfficesDelay;
    },

    getCorporateOfficesIncrease: function() {
      return this.corporateOfficesIncrease;
    },

    adsDescription: function() {
      return `Generates ${this.format(this.getAdsLettersInc)} letters per click.`
    },

    getAdsLettersInc: function() {
      return this.adsLettersInc;
    },

    getPigeonsDelivery: function() {
      return this.pigeonsDelivery;
    },

    getPigeonsDelay: function() {
      return this.pigeonsDelay;
    },

    getLettersDelay: function() {
      return this.lettersDelay;
    },

    getPricePerLetter: function() {
      const inflation = this.inflation ? this.inflationIncrease : 0;
      const increase = this.pricePerLetter * inflation;
      return this.pricePerLetter + increase;
    },

    getMailboxLettersInc: function() {
      const boxMod = this.boxMod ? this.boxModBoost : 0;
      return this.mailboxLettersInc + boxMod;
    },

    getMailboxDelay: function() {
      return this.mailboxDelay;
    },

    getBigNetDelay: function() {
      return this.bigNetDelay;
    },

    getMailDronesDelay: function() {
      return this.mailDronesDelay;
    },

    getMailwareDelay: function() {
      return this.mailwareDelay;
    },

    getEmailDelay: function() {
      return this.emailDelay;
    },

    getMailTruckDelay: function() {
      return this.mailTruckDelay;
    },

    getPostOfficeDelay: function() {
      return this.postOfficeDelay;
    },

    getMailmanDelay: function() {
      const caffeineDecrease = this.caffeine ? this.mailmanDelay * this.caffeineBoost : 0;
      const segwayDecrease = this.segway ? this.mailmanDelay * this.segwayMailmanBoost : 0;
      const dogTreatsDecrease = this.dogTreats ? this.mailmanDelay * this.dogTreatsBoost : 0;
      
      const delay = this.mailmanDelay - caffeineDecrease - segwayDecrease - dogTreatsDecrease;

      return delay;
    },

    getFactoryDelay: function() {
      const delay = this.factoryDelay / (this.scientificManagement ? 2 : 1);

      return delay;
    },

    getJetDelay: function() {
      return this.jetDelay;
    },

    getRecruiterDelay: function() {
      return this.recruiterDelay;
    },

    bootstrapInc: function() {
      let inc = this.bootstrapDelivery * this.multiplier * (this.twoForOne ? 2 : 1);
      if(this.selfReliance)
        inc += this.selfRelianceInc;

      return inc;
    },

    multiplier: function() {
      if(this.phase == 0)
        return 1;

      return Math.floor(1.8 ** (this.phase - 1)); 
    },

    pigeonsPrice: function() {
      return this.round(this.pigeonsBasePrice + (this.pigeons ** 1.1));
    },

    jetPrice: function() {
      return this.round(this.jetBasePrice + (this.jets ** 1.7));
    },

    postOfficePrice: function() {
      return this.round(this.postOfficeBasePrice + (this.postOffices ** 2.3));
    },

    bootstrapPrice: function() {
      return this.round(this.bootstrapBasePrice + (this.bootstrap ** 1.5))
    },

    mailTruckPrice: function() {
      return this.round(this.mailTruckBasePrice + (this.mailTrucks ** 1.8));
    },

    recruiterPrice: function() {
      return this.round(this.recruiterBasePrice + (this.recruiters ** 3));
    },

    factoryPrice: function() {
      return this.round(this.factoryBasePrice + (this.factories ** 2.5));
    },

    mailmanPrice: function() {
      return this.round(this.mailmanBasePrice + (this.mailmen ** 1.5));
    },

    mailboxPrice: function() {
      return this.round(this.mailboxBasePrice + (this.mailboxes ** 1.8));
    },

    autoreaderPrice: function() {
      return this.round(this.autoreaderBasePrice + ((this.autoreader / 10) ** 1.05)); 
    },

    nextPhaseAt: function() {
      switch(this.phase) {
        case 0:
          return this.phase1;
        case 1:
          return this.phase2;
        case 2:
          return this.phase3;
        case 3:
          return this.phase4;
        case 4:
          return this.phase5;
        case 5:
          return this.phase6;
        case 6:
          return this.phase7;
        case 7:
          return this.phase8;
        case 8:
          return this.phase8; // Phase 8 is a read so it is the same upper bound as 7
        case 9:
          return this.phase10;
        default:
          return Infinity;
      }
    },

    nextPhaseAvailable: function() {
      return this.lettersDelivered >= this.nextPhaseAt;
    }
  },

  methods: {
    updateLettersPerSecond: function() {
      if(this.lastLettersPs < 1000) {
        this.lastLettersPs += this.delta;
      } else {
        this.prevLettersPs = this.lettersPs;
        this.lastLettersPs = 0;
        this.lettersPs = 0;
      }
    },

    updateDeliveriesPerSecond: function() {
      if(this.lastDeliveryPs <= 1000) {
        this.lastDeliveryPs += this.delta;
      } else {
        this.prevDeliveryPs = this.deliveryPs;
        this.lastDeliveryPs = 0;
        this.deliveryPs = 0;
      }
    },
    
    handleScrolled: function() {
      this.scrolled = window.scrollY > 100;
    },

    nextPhase: function() {
      if(this.phase != 9) {
        this.choosePowerups = true;
      } else {
        this.prestige();
      }
    }, 
  
    getLetter: function() {
      fetch(`/letters/${this.letterOn}.txt`)
        .then(resp => resp.text())
        .then(text => {
          this.letter = text;
        });
    },

    choose: function(name) {
      const chosen = this.powerups[name];
      if(chosen) {
        delete this.powerups[name];
        this.numChosen -= 1;
        if(this.numChosen < 0) {
          this.numChosen = 0;
        }
      } else {
        this.powerups[name] = true;
        this.numChosen += 1;
      }

      if(this.numChosen >= 2) {
        this.prestige();
      }
    },

    getFormatted: function(number, divisor) {
      const result = (number / divisor).toString().match(/[0-9]+\.?[0-9]?[0-9]?/g);
      if(result == null)
        return 0;
      return result[0];
    },
  
    floor: Math.floor,
    ceil: Math.ceil,

    format: function(number) {
      if(number < 10**3)
        return number;

      if (number < 10**6) {
        return this.getFormatted(number, 10**3) + "k";
      } else if (number < 10**9) {
        return this.getFormatted(number, 10**6) + "m";
      } else if (number < 10**12) {
        return this.getFormatted(number, 10**9) + "b";
      } else if (number < 10**15) {
        return this.getFormatted(number, 10**12) + "t";
      } else if (number < 10**18) {
        return this.getFormatted(number, 10**15) + "s";
      } else if (number == Infinity) {
        return "Infinity";
      }

      return this.getFormatted(number, 10**15) + "q";
    },

    round: function(number) {
      number *= 100;
      return Math.floor(number) / 100;
    },
   
    prestige: function() {
      if(!this.nextPhaseAvailable)
        return;

      this.choosePowerups = false;
      this.numChosen = 0;

      const lettersDelivered = this.lettersDelivered;
      const phase = this.phase;
      const day = this.day;
      const powerups = this.powerups;
      const letterOn = this.letterOn;

      for(const key in originalState) {
        this.$data[key] = originalState[key];
      }
  
      this.powerups = powerups;
      this.day = day;
      this.phase = phase + 1;
      this.lettersDelivered = lettersDelivered;
      this.letterOn = letterOn;

      if(this.phase == 10 && this.letterOn < 4) {
        this.getLetter();
        this.readLetters = this.phase8; // Set letters to read to 1T otherwise it could get too big
        this.letterOn += 1;
        this.read = true;
      }
    },
 
    clickRead: function(amount) {
      if(this.readLetters <= 0)
        return;

      const inc = (amount && amount > 0 ? amount : 1);

      this.readLetters -= inc;
      this.curiosity += inc;

      if(this.readLetters < 0)
        this.readLetters = 0;
    },

    clickDeliver: function() {
      if(this.letters == 0)
        return;
     

      const twoHandsMult = this.twoHands && Math.random() < this.twoHandsChance ? this.twoHandsMultiplier : 1;
      const spontGen = this.spontaneousGeneration && Math.random() < this.spontaneousGenerationChance ? this.spontaneousGenerationMult : 1;
     
      if(this.littleHelp && this.powerups.Mailman) {
        const littleHelp = Math.random();
        if(littleHelp < this.littleHelpChance) {
          this.mailmen += this.littleHelpIncrease;
        }
      }
      
      this.deliverLetter(Math.ceil(this.clickInc) * twoHandsMult * spontGen);
      this.clickDelivery += 1;

    },

    deliverLetter: function(amount) {
      /*
       * Delivers N amount of letters if possible
       */

      if(this.letters < amount) {
        amount = this.letters;
      }
      
      this.deliveryPs += amount;
      this.letters -= amount;
      this.money += ((this.getPricePerLetter) * this.multiplier) * amount;
      this.lettersDelivered += amount;

    },

    handleDebug: function() {
      this.lettersDelivered = 10 ** 50;
      this.money = 10 ** 50;
      this.readLetters = 1;
    },

    update: function() {
      const now = new Date();
      this.delta = now - new Date(this.lastTick);
      this.lastTick = now;

      if(!this.read) {
        this.updateLetters();
        this.updateMailboxes();
        this.updateMonopoly();
        this.updateJets();
        this.updateEmail();
        this.updateMailDrones(),
        this.updateMailware();
        this.updateBigNet();
        this.updateCorporateOffices();
        this.updatePostOffices();
        this.updatePigeons();
        this.updateMailmen();
        this.updateMailTruck();
        this.updateRecruiters();
        this.updateFactories();
        this.updateLettersPerSecond();
        this.updateDeliveriesPerSecond(); 
      } else {
        this.updateAutoReader();
      }
      this.saveState();
    },

    generalUpdate,
    updateFactories,
    updateLetters,
    updateRecruiters,
    updateMailmen,
    updateCorporateOffices,
    updateEmail,
    updateMonopoly,
    updateAutoReader,
    updateMailware,
    updatePigeons,
    updateBigNet,
    updateMailTruck,
    updateJets,
    updateMailDrones,
    updateMailboxes,
    updatePostOffices,
    saveState,
    loadState,
    calculateNewState,
    newGame,
    buyScientificManagement,
    buyMailman,
    buyMailDrones,
    buyJet,
    buyAds,
    buyCorporateOffices,
    buyMailTruck,
    buyMailbox,
    buyInflation,
    buyRecruiter,
    buyFactory,
    buyPostOffice,
    buySegway,
    buyBigNet,
    buyMonopoly,
    buySpontaneousGeneration,
    buyBootstrap,
    buyTwoHands,
    buyTwoForOne,
    buyLittleHelp,
    buyMaxAutoReader,
    buyCaffeine,
    buyAutoReader,
    buySelfReliance,
    buyEmail,
    buyBoxMod,
    buyPigeons,
    buyDogTreats,
    buyMailware,
    buyOneTime,
    buy,
    buyMax,
    setupTests,
  },

  created: function() {
    document.addEventListener("scroll", this.handleScrolled);
    document.addEventListener("debug", this.handleDebug);

    this.setupTests(),
    this.loadState();
    setInterval(this.update, 0);
  }

});

