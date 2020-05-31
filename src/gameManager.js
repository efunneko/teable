// Game - this file controls the flow of the Game
import { Communicator } from "./communicator";
import { StateMachine } from "./stateMachine";

const States = {
  NoGame: {
    val: 0,
    text: "No game selected"
  }

};


export class GameManager {
  constructor(app) {
    this.app = app;

    if (window.localStorage) {
      this.storage = window.localStorage;
    }
    else {
      console.error("No localstorage available");
    }

    this.communicator = new Communicator(this,
      {
        callbacks:
        {
          onServerInfo: info => this.onServerInfo(info),
          onServerMessage: (topic, msg) => this.onServerMessage(topic, msg),
          onClientMessage: (topic, msg) => this.onClientMessage(topic, msg)
        }
      }
    );

    this.states = {
      start:          new StartState(this),
      connect:        new ConnectState(this),
      chooseGame:     new ChooseGameState(this),
      waitForPlayers: new WaitForPlayersState(this),
      playing:        new PlayingState(this),
      endGame:        new EndGameState(this)
    };

    this.stateMachine = new StateMachine(this.states, "start", {});

  }

  event(name, params) {
    this.sm.invokeEvent(name, params);
  }

  // Takes in a "name" or ["array", "of", "names"] to choose the property to set
  // plus a value which can be an object or scalar
  setProp(names, val) {
    let name = names;
    if (Array.isArray(names)) {
      name = names.shift();
      if (names.length) {
        let obj = this._getRawProp(name);
        let origObj = obj;
        if (!obj || typeof(obj) === "object") {
          obj = {};
        }
        let key;
        while (names.length) {
          key = names.shift();
          if (typeof (obj) !== "object" || typeof (obj[key]) === "undefined") {
            obj[key] = {};
          }

          if (names.length) {
            obj = obj[key]; 
          }
        }
        obj[key] = val;
        val = origObj;
      }
    }

    this._setRawProp(name, val);

  }

  getProp(names) {
    if (Array.isArray(names)) {
      let name = names.shift();
      let val = this._getRawProp(name);
      if (typeof (val) !== "object" && names.length) {
        console.log("Expecting localstorage to contain object for ", name);
        return undefined;
      }
      let obj = val;
      while (names.length) {
        let key = names.shift();
        if (typeof (obj) !== "object" || typeof (obj[key]) === "undefined") {
          return undefined;
        }
        obj = obj[key];
      }
      return obj;
    }

    return this._getRawProp(names);
  }

  _setRawProp(name, val) {
    if (typeof (val) === "object") {
      val = JSON.stringify(val);
    }
    this.storage.setItem(name, val);
  }

  _getRawProp(name) {
    let val = this.storage.getItem(name);
    if (val && val.match(/^\s*{/) && val.match(/}\s*$/)) {
      let obj;
      try {
        obj = JSON.parse(val);
      }
      catch (e) {
        console.log("Failed to parse localstorage item", name);
        return {};
      }
      return obj;
    }
    return val;
  }

  createNewGame(opts) {
    let gameName    = opts.name;
    let useVowelBag = opts.useVowelBag;

    this.gameState  = new GameState(gameName, useVowelBag, this.app.playerMe);    

  }

}

class State {
  constructor(game) {
    this.game = game;
    this.sm   = game.stateMachine;
    this.comm = game.communicator;
  }
}

class StartState extends State {
  constructor(game) {
    super(game);
  }
  enterState(lastState) {
    // If we have a login password, then just skip to connect
    // otherwise prompt for a password
    if (this.game.getProp(["brokerInfo", "password"])) {
      this.sm.changeState("connect");
    }
    else {
      this.promptForPassword()
        .then(password => {
          this.game.setProp(["brokerInfo", "password"], password);
          this.sm.changeState("connect");
        });
    }
  }
}

class ConnectState extends State {
  constructor(game) {
    super(game);
  }

  enterState(lastState) {
    let brokerInfo = this.game.getProp("brokerInfo");
    if (!brokerInfo.password) {
      this.sm.changeState("start");
    }
    else {
      this.communicator.connect(brokerInfo);
    }
  }

}

class ChooseGameState extends State {
  constructor(game) {
    super(game);
  }

}

class WaitForPlayersState extends State {
  constructor(game) {
    super(game);
  }

}

class PlayingState extends State {
  constructor(game) {
    super(game);
  }

}

class EndGameState extends State {
  constructor(game) {
    super(game);
  }

}

