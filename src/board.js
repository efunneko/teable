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

const cellValToText = {
  '-3': 'Triple Word Score',
  '-2': 'Double Word Score',
  '1':  '',
  '2':  'Double Letter Score',
  '3':  'Triple Letter Score'
};

//
// Board - Renders and manages the playing surface
//
export class Board extends jst.Component {
  constructor(app, width, height) {
    super();
    this.app          = app;
    this.height       = height;
    this.width        = width;
    this.leftWidth    = Math.max(width * 0.2, 200);
    this.boardWidth   = width - this.leftWidth;
    this.boardHeight  = height;
  }

  cssLocal() {
    
    let cellSide = Math.min(this.boardWidth/15, this.boardHeight/15);
    console.log("side;", cellSide, this.boardHeight, this.boardWidth)
    return {
      board$c: {
        fontFamily: "'DM Mono', monospace",
        display: "grid",
        gridTemplateColumns: `${this.leftWidth}px ${this.boardWidth}px`
      },
      sideTitle$c: {
        margin$px: 4,
        fontSize$px: this.leftWidth/10,
        borderWidth$px: 3,
        borderColor: "black",
        borderStyle: "solid",
        width$px: this.leftWidth/10,
        height$px: this.leftWidth/10,
      },
      mainBoard$c: {
        display: "grid",
        gridTemplateColumns: `repeat(15, ${cellSide + 2}px)`,
        gridRowGap$px: 2
      },
      boardCellTd$c: {
        padding$px: 0
      },
      boardCell$c: {
        padding$px: 0,
        height$px: cellSide,
        width$px:  cellSide,
        maxHeight$px: cellSide,
        minHeight$px: cellSide,
        overflow:  "hidden",
        fontSize$px: 9,
        textAlign: "center",
        fontWeight: "bold"
      },
      boardCellText$c: {
        verticalAlign: 'middle',
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
        rules.board.map(
          row => row.map(
            cell => jst.$div(
              {cn: cellValToClass[cell] + " -boardCell"},
              //jst.$span({cn: "-boardCellText"}, 
              cellValToText[cell]
              //)
            )
          )
        )
      )
    );
  }

  
}
