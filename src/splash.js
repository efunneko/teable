import {jst}    from "jayesstee";
import css      from "./cssCommon";



//
// Splash - Renders and manages the initial splash screen
//
export class Splash extends jst.Object {
  constructor(app) {
    super();
    this.app          = app;
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
        fontSize$px:  40,
        fontWeight: "normal",
        color: css.textOnDark
      },
      titleSmall$c: {
        fontFamily: ["Helvetica,", "Arial,", "sans-serif"],
        fontSize$px:  30,
        fontWeight: "normal",
        color: css.textOnDark
      },
      logo$c: {
        display: "inline-block",
        fontFamily: ["Times New Roman,", "Times"],
        fontSize$px:  70,
        color: css.solaceGreen
      },
      ping$c: {
        display: "inline-block",
        backgroundColor: css.solaceGreen,
        height$px: 25,
        width$px: 25,
        borderRadius$px: 25,
        marginLeft$px: 5,
        // hack
        marginBottom$px: -1
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
        width$px:   150,
      },
      input$c: {
        width$px:   300,
      },
      connectButton$c: {
        width$px:   300,
        height$px:  25,
        backgroundColor: css.solaceGreen,
        color: css.textOnDark,
        padding$px: 10,
        textAlign: "center",
        fontSize$px: 22,
        borderRadius$px: 20,
        margin$px: [30, 0, 0, 80],
        cursor: "pointer"
      },
      connectButton$c$hover: {
        border$px: [1, 'solid', jst.rgba(0,0,0,0.3)],
        boxShadow$px: [0,5,8,0,jst.rgba(0,0,0,0.2)]
      },
      
    };
  }
  
  
  render() {
    return jst.$div(
      {cn: "-splash"},
      jst.$div(
        {cn: "-splashInner"},
        jst.$div(
          {cn: "-title"},
          this.app.title
        ),

        jst.$div(
          {cn: "-dialog"},
          jst.$form(
            {cn: "-form", name: "dialog"},
            jst.$fieldset(
              {cn: "-fieldset"},
              jst.$div(
                {cn: "-label"},
                "Password"
              ),
              jst.$input({cn: "-input",
                          type: "password",
                          name: "password",
                          events: {
                            keydown: e => {if (e.keyCode == 13) e.preventDefault()}
                          }})
            ),
            jst.$div(
              {cn: "-connectButton", events: {click: e => this.connect(e)}},
              "Connect"
            )
          )
        )
      )
    );
  }

  connect(e) {
    console.log("Called splash.connect")
    e.preventDefault();
    let vals = this.getFormValues("dialog");
    if (vals && vals.password) {
      this.app.connect(vals);
    }
  }
  
}
