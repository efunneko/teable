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

    // Setup the local browser storage
    if (window.localStorage) {
      this.storage = window.localStorage;
    }
    else {
      console.error("No localstorage available");
    }

    // Create the communicator - this will allow communications between players
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

    // TODO - need to put this into a staged env file
    let brokerInfo = this.getProp("brokerInfo") || {};
    brokerInfo.hostname = "mr155kxo97j5y9.messaging.solace.cloud";
    brokerInfo.port = "8000";
    brokerInfo.username = "teable";
    brokerInfo.password = brokerInfo.password || "funwithwill"; // TODO - temp, will be changed
    this.setProp("brokerInfo", brokerInfo);

    // Setup the state machine
    this.states = {
      start:          new StartState(this),
      connect:        new ConnectState(this),
      chooseGame:     new ChooseGameState(this),
      waitForPlayers: new WaitForPlayersState(this),
      playing:        new PlayingState(this),
      endGame:        new EndGameState(this)
    };
    this.stateMachine = new StateMachine(this.states, "start", {});

    // Check for a game in progress
    this._loadGameState();

  }

  event(name, params) {
    console.log("got event:", name, params);
    this.stateMachine.invokeEvent(name, params);
  }

  // Takes in a "name" or ["array", "of", "names"] to choose the property to set
  // plus a value which can be an object or scalar
  setProp(names, val) {
    let name = names;
    if (Array.isArray(names)) {
      name = names.shift();
      if (names.length) {
        let obj = this._getRawProp(name);
        if (!obj || obj === null || typeof(obj) !== "object") {
          obj = {};
        }
        let origObj = obj;
        let key;
        while (names.length) {
          key = names.shift();
          if (typeof (obj[key]) !== "object" || typeof (obj[key]) === "undefined" || obj[key] === null) {
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
        if (obj === undefined || obj === null || 
            typeof (obj) !== "object" || typeof (obj[key]) === "undefined") {
          return undefined;
        }
        obj = obj[key];
      }
      return obj;
    }

    return this._getRawProp(names);
  }

  _loadGameState() {
    this.gameState = this.getProp("gameState");

    if (!this.gameState) {
      this.gameState = {
        gameInProgress: false
      }
    }
    //if (this.gameState && )

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
    if (val === null) {
      val = undefined;
    }
    return val;
  }

  createNewGame(opts) {
    let gameName    = opts.name;
    let useVowelBag = opts.useVowelBag;

    this.gameState  = new GameState(gameName, useVowelBag, this.app.playerMe);    

  }

  promptForPassword() {
    console.log("prompting for password");
    return this.app.dialog({
      title: "Password",
      fields: [
        {
          name: "password",
          label: "password",
          type: "password"
        }
      ]
    }).then(result => result.password);
  }

}

class State {
  constructor(game) {
    this.game = game;
    this.comm = game.communicator;
  }

  init(sm) {
    this.sm = sm;
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
      this.game.promptForPassword()
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
      this.comm.connect(brokerInfo);
    }
  }

  eventconnect() {
    if (this.game.gameState.gameInProgress) {
      this.sm.changeState("playing");
    }
    else {
      this.sm.changeState("chooseGame");
    }
  }

}

class ChooseGameState extends State {
  constructor(game) {
    super(game);
  }

  enterState(lastState) {
    console.log("Choosing game");
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

