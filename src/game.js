// Game - this file controls the flow of the Game

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


export class Game {
    constructor(app) {
      this.players = [];
    }

    connect() {
      
    }
       

}