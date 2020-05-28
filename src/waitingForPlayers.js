import { jst } from "jayesstee";
import css from "./cssCommon";

//
// WaitingForPlayers - Full screen that show the progress of players joining a game
//
export class WaitingForPlayers extends jst.Object {
  constructor(app) {
    super();
    this.app = app;
    this.players = ["Charlotte", "Eduard"];
  }

  cssLocal() {
    return {
      body$c: {
        position: "fixed",
        top$px: 0,
        left$px: 0,
        right$px: 0,
        bottom$px: 0,
        backgroundColor: css.darkPrimary,
        fontWeight: "bold",
        color: css.textOnDark,
        padding$px: 5
      },
      bodyInner$c: {
        paddingTop$vh: 25,
        width$px: 600,
        margin: "auto"
      },
      title$c: {
        fontFamily: ["Helvetica,", "Arial,", "sans-serif"],
        fontSize$px: 40,
        fontWeight: "normal",
        color: css.textOnDark
      },
      titleSmall$c: {
        fontFamily: ["Helvetica,", "Arial,", "sans-serif"],
        fontSize$px: 30,
        fontWeight: "normal",
        color: css.textOnDark
      },
      button$c: {
        width$px: 300,
        height$px: 25,
        backgroundColor: css.solaceGreen,
        color: css.textOnDark,
        padding$px: 10,
        textAlign: "center",
        fontSize$px: 22,
        borderRadius$px: 20,
        margin$px: [30, 0, 0, 80],
        cursor: "pointer"
      },
      smallButton$c: {
        display: "inline-block",
        width$px: 150,
        height$px: 20,
        backgroundColor: css.solaceGreen,
        color: css.textOnDark,
        padding$px: 10,
        textAlign: "center",
        fontSize$px: 18,
        borderRadius$px: 20,
        margin: "auto",
        margin$px: [20, 20],
        cursor: "pointer"
      },
      button$c$hover: {
        border$px: [1, 'solid', jst.rgba(0, 0, 0, 0.3)],
        boxShadow$px: [0, 5, 8, 0, jst.rgba(0, 0, 0, 0.2)]
      },
      disabled$c: {
        backgroundColor: "#666",
      },

    };
  }


  render() {
    return jst.$div(
      {cn: "-body"},
      jst.$div(
        {cn: "-bodyInner"},
        jst.$div(
          {cn: "-title"},
          "Waiting For Players"
        ),
        jst.$div(
          {cn: "-titleSmall"},
          "Current Players"
        ),
       jst.$div(
         {cn: "-playerList"},
         this.players.map(player => jst.$div(player))
       ),
       jst.$div(
         { cn: `-smallButton`, events: { click: e => this.startGame(e) } },
         "Start"
       ),
       jst.$div(
         { cn: `-smallButton`, events: { click: e => this.cancel(e) } },
         "Cancel"
       )
      )
    );
  }

  cancel() {
    this.app.cancelStart();
  }

  startGame() {
    this.app.startGame();
  }

}
