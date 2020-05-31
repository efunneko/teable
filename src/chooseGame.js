import { jst } from "jayesstee";
import css from "./cssCommon";


const states = {
  CreateOrJoin: 1,
  CreateGame: 2
};

//
// ChooseGame - second screen after connecting to choose game to join
//
export class ChooseGame extends jst.Object {
  constructor(app) {
    super();
    this.app = app;
    this.state = states.CreateOrJoin;
    window.choose = this;
  }

  cssLocal() {
    return {
      splash$c: {
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
      splashInner$c: {
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
      logo$c: {
        display: "inline-block",
        fontFamily: ["Times New Roman,", "Times"],
        fontSize$px: 70,
        color: css.solaceGreen
      },
      form$c: {
        fontSize$px: 17,
        margin$px: [30, 0],
        padding$px: 0,
        width$px: 600,

      },
      fieldset$c: {
        border: "none",
        borderRadius$px: 0,
        padding$px: [6, 0],
        margin$px: 0
      },
      label$c: {
        display: "inline-block",
        width$px: 150,
      },
      input$c: {
        width$px: 300,
        marginLeft$px: 3
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
    if (this.state === states.CreateOrJoin) {
      return this.renderStartOptions();
    }
    else {
      return this.renderGameOptions();
    }
  }

  renderStartOptions() {
    console.log("renderStartOptions");
    return jst.$div(
      { cn: "-splash" },
      jst.$div(
        { cn: "-splashInner" },
        jst.$div(
          { cn: "-title" },
          ""
        ),
        jst.$div(
          { cn: "-dialog" },
          jst.$div(
            { cn: "-button", events: { click: e => this.createSelected(e) } },
            "Create New Game"
          ),
          jst.$div(
            { cn: `-button ${!this.gameSelected ? "-disabled" : ""}`, events: { click: e => this.join(e) } },
            "Join Selected Game"
          )
        )
      )
    );

  }

  renderGameOptions() {
    console.log("renderGameOptions");
    return jst.$div(
      { cn: "-splash" },
      jst.$div(
        { cn: "-splashInner" },
        jst.$div(
          { cn: "-gameOptions" },
          jst.$form(
            { cn: "-form", name: "gameOptions" },
            jst.$fieldset(
              { cn: "-fieldset" },
              jst.$div(
                { cn: "-label" },
                "Game Name"
              ),
              jst.$input({
                cn: "-input",
                type: "text",
                name: "gameName",
                events: {
                  keydown: e => { if (e.keyCode == 13) e.preventDefault() }
                }
              }),
            ),
            jst.$fieldset(
              { cn: "-fieldset" },
              jst.$div(
                { cn: "-label" },
                "Use Vowel Bag"
              ),
              jst.$input({
                cn: "-checkbox",
                type: "checkbox",
                value: "yes",
                name: "useVowelBag",
                events: {
                  change: e => this.setUseVowelBag()
                }
              })
            ),
            jst.$fieldset(
              { cn: "-fieldset" },
              jst.$div(
                { cn: "-label" },
                "Starting number of vowels"
              ),
              jst.$input({
                cn: "-input",
                type: "text",
                name: "numVowels",
                properties: this.useVowelBag ? [] : ["disabled"],
                events: {
                  keydown: e => { if (e.keyCode == 13) e.preventDefault() }
                }
              }),
            ),
            jst.$div(
              { cn: `-smallButton`, events: { click: e => this.createGame(e) } },
              "Create"
            ),
            jst.$div(
              { cn: `-smallButton`, events: { click: e => this.cancelCreate(e) } },
              "Cancel"
            )
          )
        )
      )
    );
  }

  join() {
  }

  createSelected() {
    console.log("create");
    this.state = states.CreateGame;
    this.refresh();
  }

  cancelCreate() {
    this.state = states.CreateOrJoin;
    this.refresh();
  }

  createGame() {
    let vals = this.getFormValues("gameOptions");
    if (vals && vals.gameName) {
      console.log("Game name:", vals);
      this.app.createNewGame(vals);
    }
  }

  setUseVowelBag() {
    let vals = this.getFormValues("gameOptions");
    this.useVowelBag = vals.useVowelBag;
    this.refresh();
  }

}
