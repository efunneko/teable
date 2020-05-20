import {jst}     from "jayesstee";
import css       from "./cssCommon";
import rules     from "./rules";



const cellValToClass = {
  '-3': '-tripleWord',
  '-2': '-doubleWord',
  '1':  '-normal',
  '2':  '-doubleLetter',
  '3':  '-tripleLetter'
};


//
// Board - Renders and manages the playing surface
//
export class Board extends jst.Component {
  constructor(app) {
    super();
    this.app          = app;
  }

  cssLocal() {

    let cellSide = 30;
    return {
      boardCell$c: {
        height$px: cellSide,
        width$px:  cellSide
      },
      normal$c: {
        backgroundColor: "#cec7aa"
      },
      doubleLetter$c: {
        backgroundColor: "#bfd8d3"
      },
      tripleLetter$c: {
        backgroundColor: "#389eb5"
      },
      doubleWord$c: {
        backgroundColor: "#f1b8a6"
      },
      tripleWord$c: {
        backgroundColor: "#fc6852"
      },
      tripleWord$c$before: {
        backgroundColor: "#fc6852"
      },
    };
  }
  
  
  render() {
    return jst.$div(
      {
        cn: "-board",
        events: {
        },
      },
      jst.$div(
        {cn: "-leftBar"},

        ["T", "E", "A", "B", "L", "E"].map(
          l => jst.$div({cn: "-sideTitle"}, l)
        ),
        ["LETTER", "DISTRIBUTION"].map(
          l => jst.$div({cn: "-sideDistribution"}, l)
        ),
        jst.$table(
          {cn: "-letterDistributionTable"},
          new Array(9).fill().map(
            (entry, i) => jst.$tr(
              jst.$td(`${String.fromCharCode(65+i)} - ${rules.distribution[String.fromCharCode(65+i)]}`),
              jst.$td(`${String.fromCharCode(74+i)} - ${rules.distribution[String.fromCharCode(74+i)]}`),
              jst.if(i != 8, jst.$td(`${String.fromCharCode(83+i)} - ${rules.distribution[String.fromCharCode(83+i)]}`))
            ))
        ),
        jst.$div(
          {id: "-letterDistributionBlanks"},
          "Blanks - 2"
        )
      ),
      jst.$div(
        {cn: "-mainBoard"},
        jst.$table(
          {cn: "-mainBoardTable"},
          rules.board.map(
            row => jst.$tr(row.map(
              cell => jst.$td({cn: cellValToClass[cell] + " -boardCell"})
            ))
          )
        )
      )
    );
  }

  
}
