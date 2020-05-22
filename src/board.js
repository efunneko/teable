import {jst}     from "jayesstee";
import css       from "./cssCommon";
import rules     from "./rules";
import {Tile}    from "./tile";



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

const subScript = [1, 3];

//
// Board - Renders and manages the playing surface
//
export class Board extends jst.Component {
  constructor(app, width, height) {
    super();
    this.app          = app;
    this.tiles        = new Array(15).fill().map(col => new Array(15).fill());

    this.tiles[5][5]  = new Tile("C", 10);
    this.tiles[6][5]  = new Tile("H", 10);
    this.tiles[7][5]  = new Tile("A", 10);
    this.tiles[8][5]  = new Tile("R", 10);
    this.tiles[9][5]  = new Tile("L", 10);
    this.tiles[10][5] = new Tile("O", 10);
    this.tiles[11][5] = new Tile("T", 10);
    this.tiles[12][5] = new Tile("T", 10);
    this.tiles[13][5] = new Tile("E", 10);
    this.resize(width, height);
  }

  cssLocal() {
    
    return {
      board$c: {
        fontFamily: "'DM Mono', monospace",
        display: "grid",
        gridTemplateColumns: `${this.leftWidth}px ${this.boardWidth}px`
      },
      leftBar$c: {
        textAlign: "center"
      },
      teable$c: {
        display: "inline-block"
      },
      mainBoard$c: {
        display: "grid",
        gridTemplateColumns: `repeat(15, ${this.cellSize + 2}px)`,
        gridRowGap$px: 2,
        gridAutoRows: 'minmax(min-content, max-content)',
      },
      boardCellTd$c: {
        padding$px: 0
      },
      boardCell$c: {
        position: "relative",
        padding$px: 0,
        height$px: this.cellSize,
        width$px:  this.cellSize,
        maxHeight$px: this.cellSize,
        minHeight$px: this.cellSize,
        overflow:  "hidden",
        fontSize$px: this.cellSize*0.22,
        textAlign: "center",
        fontWeight: "bold"
      },
      boardCellText$c: {
        verticalAlign: 'middle',
      },
      boardTile$c: {
        position: "absolute",
        left$px: 0,
        top$px: 0
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
      subScript$c: {
        fontSize: "30%"
      }
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

        jst.$div(
          {cn: "-teable"},
          ["T", "E", "A", "B", "L", "E"].map(
            letter => new Tile(letter, this.leftWidth/7)
          )
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
          (row, rowIndex) => row.map(
            (cell, colIndex) => jst.$div(
              {cn: cellValToClass[cell] + " -boardCell"},
              cellValToText[cell],
              jst.$div({cn: "-boardTile"}, this.tiles[colIndex][rowIndex])
            )
          )
        )
      )
    );
  }

  resize(width, height) {
    this.width        = width;
    this.height       = height;
    this.leftWidth    = Math.max(width * 0.2, 200);
    this.boardWidth   = width - this.leftWidth;
    this.boardHeight  = height;
    this.cellSize     = Math.min(this.boardWidth/15, this.boardHeight/15);

    this.tiles.map(col => col.map(tile => tile && tile.resize(this.cellSize-6)));

    this.refresh();
  }

  
}
