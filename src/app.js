import {jst}                   from "jayesstee";
import {Body}                  from "./body";
import {Splash}                from "./splash";
import {ChooseGame}            from "./chooseGame";
import {WaitingForPlayers}     from "./waitingForPlayers";
import {GameManager}           from "./gameManager";

const appStates = {
  BeforeConnect:     1,
  ChooseGame:        2,
  WaitingForPlayers: 3,
  Playing:           4
};

export class App extends jst.Component {
  constructor(specs) {
    super();
    
    this.title              = "Teable";
    this.alerts             = [];
    this.brokerInfo         = undefined;
    this.gameSelected       = false;
    this.state              = appStates.BeforeConnect;
          
    this.width              = window.innerWidth;
    this.height             = window.innerHeight;
      
    this.body               = new Body(this, this.width, this.height - 150);
    this.splash             = new Splash(this);
    this.chooseGame         = new ChooseGame(this);
    this.gameManager        = new GameManager(this);
    this.waitingForPlayers  = new WaitingForPlayers(this);

    this.currDialog         = undefined;

    // Listen for window resize events
    window.onresize = e => this.resize();

  }

  render() {
    return jst.$div(
      {id: "app"},
      // Very poor-man's router - consider replaying with proper navigation
      jst.if(this.state === appStates.BeforeConnect, () => this.renderBeforeConnect()),
      jst.if(this.state === appStates.ChooseGame, () => this.renderChooseGame()),
      jst.if(this.state === appStates.WaitingForPlayers, () => this.renderWaitingForPlayers()),
      jst.if(this.state === appStates.Playing, () => this.renderPlaying())
    );
  }

  renderBeforeConnect() {
    return this.splash;
  }

  renderChooseGame() {
    return this.chooseGame;
  }

  renderWaitingForPlayers() {
    return this.waitingForPlayers;
  }

  renderPlaying() {
    return [
      this.body,
      this.currDialog,
      this.alerts
    ];
  }

  resize() {
    this.width        = window.innerWidth;
    this.height       = window.innerHeight;
    this.body.resize(this.width, this.height - 150);
    this.refresh();
  }

  subscribe(topic) {
    this.game.communicator.subscribe(topic);
  }

  getTitle() {
    return this.title;
  }

  dialog(opts) {
    if (this.currDialog) {
      throw new Error("Only one dialog at a time allowed");
    }
    this.currDialog = new DialogInline(opts);

    let promise = this.currDialog.promise
      .then(
        result => {
          this.currDialog = undefined;
          this.refresh();
          return result;
        }
      )
      .catch(err => {
        this.currDialog.destroy();
        this.currDialog = undefined;
        this.refresh();
      });
    this.refresh();
    return promise;
  }

  connect(brokerInfo) {
    brokerInfo.hostname = "mr155kxo97j5y9.messaging.solace.cloud";
    brokerInfo.port     = "8000";
    brokerInfo.username = "teable";
    brokerInfo.password = "funwithwill"; // TODO - temp, will be changed
    this.setBrokerInfo(brokerInfo);
    this.gameManager.connect(brokerInfo);
  }

  alert(message) {
    this.alerts.addAlert(message);
  }

  setBrokerInfo(brokerInfo) {
    this.brokerInfo = brokerInfo;
    this.refresh();
  }

  onBrokerConnection() {
    this.state = appStates.ChooseGame;
    this.refresh();
  }
  
  createNewGame(opts) {
    this.state = appStates.WaitingForPlayers;
    this.gameManager.createNewGame(opts);
    this.refresh();
  }

  startGame(opts) {
    this.state = appStates.Playing;
    this.refesh();
  }

  cancelStart(opts) {
    this.state = appStates.ChooseGame;
    this.refresh();
  }

}

