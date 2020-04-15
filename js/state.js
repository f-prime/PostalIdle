export const originalState = {
  phase:0,

  phase0: 40,
  phase1: 10000,
  phase2: 50000,
  phase3: 100000,
  phase4: 200000,
  phase5: 500000,
  phase6: 1000000,

  phaseType: {},

  isActiveBootstrap: 10,
  isActiveClick: 100,

  lastTick: new Date(),
  delta: 0,

  pricePerLetter: 0.25,

  clickDelivery: 0,
  clickInc: 1,

  money: 0,

  lettersInc: 1,
  lettersDelay: 1000,
  letters: 0,
  lettersDelivered: 10000000,
  lettersLast: 0,

  twoHands: false,
  twoHandsMultiplier: 2,
  twoHandsBasePrice: 3000,
  twoHandsChance: 0.3,

  bootstrap: 0,
  bootstrapBasePrice: 25,
  bootstrapDelivery: 1,
  bootstrapMailmanHit: 0.02,

  mailmen: 0,
  mailmanBasePrice: 10, 
  mailmanDelay: 500,
  mailmanLast: 0,
  mailmanDelivery: 1,

  mailboxBasePrice: 10,
  mailboxes: 0,
  mailboxLettersIncrease: 1,

  recruiterHire: 1,
  recruiterLast: 0,
  recruiterBasePrice: 1000,
  recruiterDelay: 3500,
  recruiters: 0,

  factoryBasePrice: 1500,
  factoryDelay: 5000,
  factories: 0,
  factoryGenerate: 1,
  factoryLast: 0,

  segwayBasePrice: 5000,
  segways: 0,
  segwayMailmanBoost: 0.025,

  scientificManagementBasePrice: 10000000,
  scientificManagement: false,

  lastSave: new Date(),
};


export function saveState() {
  const now = new Date();
  if(now - new Date(this.lastSave) > 1000) {
    localStorage.setItem("state", JSON.stringify(this.$data));
    localStorage.setItem("lastSave", now);
    this.lastSave = now;
  }
}

export function calculateNewState() {
  const lastSave = localStorage.getItem("lastSave");
  if(!lastSave)
    return;

  const now = new Date();
  const lastSaveTime = new Date(lastSave);
  const secondsSince = now - lastSaveTime;

  this.letters += Math.floor((secondsSince / this.lettersDelay));
  this.mailmen += Math.floor((secondsSince / this.recruiterDelay) * this.recruiters * this.multiplier);
  this.mailboxes += Math.floor((secondsSince / this.factoryDelay) * this.factories * this.multiplier);
  this.money += Math.floor((secondsSince / this.mailmanDelay) * this.mailmen * this.pricePerLetter * this.multiplier);

}

export function loadState() {
  const state = localStorage.getItem("state");
  if(!state)
    return;
  
  const json = JSON.parse(state);
  
  for(const key in json) {
    this.$data[key] = json[key];
  } 

  this.calculateNewState();
}

export function newGame() {
  localStorage.removeItem("state");
  window.location.reload();
}
