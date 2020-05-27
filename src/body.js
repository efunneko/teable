import {jst}        from "jayesstee";
import cssCommon    from "./cssCommon.js";
import {Board}      from "./board.js";
 
//
// Body - Handles all that is the body
//
export class Body extends jst.Component {
  constructor(app, height, width) {
    super();
    this.app          = app;
    this.board        = new Board(app, height, width);
    this.results      = [];
    this.players      = {};
  }

  cssGlobal() {
    return {
      body: {
        fontFamily:      '"Helvetica Neue", Helvetica, Arial, sans-serif',
        color:           cssCommon.textOnLight,
        backgroundColor: "white",
        padding$px:      0,
        margin$px:       0
      },
      
      body$i: {
        //marginTop$px: 40,
        height:       'calc(100vh - 32pt - 28px)',
        overflowY:    'scroll',
        textAlign: "center"
      },

      boardDiv$c: {
        display: "inline-block",
        margin: "auto"
      },

      '#body th': {
        textAlign: "left"
      }

    };
  }

  render() {
    return jst.$div(
      {
        id: "body",
        events: {
        },
      },
      jst.$div(
        {cn: "boardDiv"},
        this.board
      )
    );
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.board.resize(width, height);
    this.refresh();
  }

  onServerMessage(topic, msg) {
    let match = topic.match(/server\/([^\/]+)\/pkt/);
  }

  onClientMessage(topic, msg) {
    let match = topic.match(/client\/([^\/]+)\/pkt/);
  }


}