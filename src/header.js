import {jst}     from "jayesstee";
import css       from "./cssCommon";



//
// Header - Renders and manages the header
//
export class Header extends jst.Component {
  constructor(app) {
    super();
    this.app          = app;
    this.swagger      = undefined;
  }

  cssLocal() {
    return {
      header$i: {
        position: "fixed",
        top$px: 0,
        left$px: 0,
        right$px: 0,
        backgroundColor: css.darkPrimary,
        fontWeight: "normal",
        color: css.textOnDark,
        padding$px: 5,
        height$px: 18,
        borderBottom$px: [css.borderHighlightWidth, "solid", css.lightSecondary],
      },
      
      headerRightArea$i: {
        display: "inline-block",
        float: "right",
        paddingRight$px: 0
      },

      headerLeftArea$i: {
        display: "inline-block",
        float: "left",
      },

      headerUsername$i: {
        cursor: 'pointer'
      },

      headerHost$i: {
        paddingLeft$px: 30,
        cursor: 'pointer'
      },

      headerItem$c: {
        display: "inline-block",
        padding$px: [0, 10]
      }

    };
  }
  
  
  render() {
    return jst.$div(
      {
        id: "-header",
        events: {
        },
      },
      jst.$div(
        {id: "-headerLeftArea"},
        jst.$div(
          {id: "-headerTitle", cn: "-headerItem"},
          this.app.getTitle()),
        jst.$div(
          {id: "-headerHost", cn: "-headerItem", events: {click: e => this.changeHost()}}
        )
      )
    );
  }

  
}
