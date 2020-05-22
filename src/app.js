import {jst}            from "jayesstee";
import {Header}         from "./header";
import {Body}           from "./body";
import {Splash}         from "./splash";
import {Game}           from "./game";


export class App extends jst.Component {
  constructor(specs) {
    super();
    
    this.title        = "Teable";
    this.alerts       = [];
    this.brokerInfo   = undefined;
    
    this.width        = window.innerWidth;
    this.height       = window.innerHeight;

    this.header       = new Header(this, this.width, 150);
    this.body         = new Body(this, this.width, this.height - 150);
    this.splash       = new Splash(this);
    this.game         = new Game(this);

    this.currDialog   = undefined;

  }

  render() {
    return jst.$div(
      {id: "app"},
      jst.if(this.brokerInfo) && [
        this.header,
        this.body,
        this.currDialog,
        this.alerts
      ] ||
        this.splash
    );
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
    this.game.connect(brokerInfo);
  }

  alert(message) {
    this.alerts.addAlert(message);
  }

  setBrokerInfo(brokerInfo) {
    this.brokerInfo = brokerInfo;
    this.refresh();
  }

  
}

