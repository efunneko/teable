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
        backgroundColor: cssCommon.bodyBackground,
        padding$px:      0,
        margin$px:       0
      },
      table: {
        padding$px: 5
      },

      th: {
        padding$px: 5,
        backgroundColor: cssCommon.darkPrimary,
        color: cssCommon.textOnDark
      },

      td: {
        padding$px: 5,
        backgroundColor: cssCommon.veryLightPrimary,
        color: cssCommon.textOnLight
      },

      body$i: {
        marginTop$px: 40,
        height:       'calc(100vh - 32pt - 28px)',
        overflowY:    'scroll'
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
        {cn: ""},
        this.board
      )
    );
  }

  onServerMessage(topic, msg) {
    let match = topic.match(/server\/([^\/]+)\/pkt/);
  }

  onClientMessage(topic, msg) {
    let match = topic.match(/client\/([^\/]+)\/pkt/);
  }


}
