// Game - this file controls the flow of the Game
import { Communicator } from "./communicator";

const States = {
  NoGame: {
    val: 0,
    text: "No game selected"
  }

};


export class GameManager {
  constructor(app) {
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

  }

  connect(brokerInfo) {
    this.communicator.connect(brokerInfo);
  }

  onBrokerConnection() {
    this.communicator.doServerRequest("info", 2000, 3, response => {
    });
  }

  onServerInfo(info) {
    this.body.setServerInfo(info);
  }

  onServerMessage(topic, msg) {
    this.body.onServerMessage(topic, msg);
  }

  onClientMessage(topic, msg) {
    this.body.onClientMessage(topic, msg);
  }


}