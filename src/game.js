import rules     from "./rules";


const States = {
    WaitingToStart: {
      val: 0,
      text: "Waiting to start"
    },
    Playing: {
      val: 1,
      text: "Game in progess"
    },
    Finished: {
      val: 2,
      text: "Game has ended"
    }
};


// This will hold all the information about the game - it will be sent over the network to other
// players and saved in localstorage
export class Game {
  constructor(name, useVowelBag, playerMe) {
    this.name             = name;
    this.useVowelBag      = useVowelBag;
    this.players          = [playerMe];
    this.letterBag        = [];
    this.vowelBag         = [];

    this.fillBags();

  }

  fillBags() {
    Object.keys(rules.distribution).forEach(letter => {
      if (this.useVowelBag && this.isVowel(letter)) {
        for (let i = 0; i < rules.distribution[letter]; i++) {
          this.vowelBag.push(letter);
        }
      }
      else {
        for (let i = 0; i < rules.distribution[letter]; i++) {
          this.letterBag.push(letter);
        }
      }
    })
  }

  isVowel(letter) {
    return letter==="A" || letter==="E" || letter==="I" || letter==="O" || letter==="U";
  }

  // Called to get a new letter from a bag
  pickLetter(wantVowel) {
    if (wantVowel && this.useVowelBag) {
      return this.getRandomLetter(this.vowelBag);
    }
    else {
      return this.getRandomLetter(this.letterBag);
    }
  }

  // internal method to retrieve a random letter from the appropriate bag and fix 
  // the bag afterwards
  getRandomLetter(bag) {
    if (!bag.length) {
      return undefined;
    }
    let index = (Math.random() * bag.length.toFixed(0));
    let letter = bag[index];
    bag.splice(index, 1);
    return letter;
  }

}      
