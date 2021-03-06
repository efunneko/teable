import {jst}     from "jayesstee";
import css       from "./cssCommon";
import rules     from "./rules";
import {Tile}    from "./tile";
import {Player}  from "./player";
import {Tray}    from "./letterTray";



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
  constructor(app, game, width, height) {
    super();
    this.app          = app;
    this.game         = game;
    this.tiles        = new Array(15).fill().map(col => new Array(15).fill());

    this.tiles[5][5]  = new Tile("C", 10, {jitter: true, shadow: true});
    this.tiles[6][5]  = new Tile("H", 10, {jitter: true, shadow: true});
    this.tiles[7][5]  = new Tile("A", 10, {jitter: true, shadow: true});
    this.tiles[8][5]  = new Tile("R", 10, {jitter: true, shadow: true});
    this.tiles[9][5]  = new Tile("L", 10, {jitter: true, shadow: true});
    this.tiles[10][5] = new Tile("O", 10, {jitter: true, shadow: true});
    this.tiles[11][5] = new Tile("T", 10, {jitter: true, shadow: true});
    this.tiles[12][5] = new Tile("T", 10, {jitter: true, shadow: true});
    this.tiles[13][5] = new Tile("E", 10, {jitter: true, shadow: true});
    this.tiles[13][1] = new Tile("W", 10, {jitter: true, shadow: true});
    this.tiles[13][2] = new Tile("I", 10, {jitter: true, shadow: true});
    this.tiles[13][3] = new Tile("N", 10, {jitter: true, shadow: true});
    this.tiles[13][4] = new Tile("N", 10, {jitter: true, shadow: true});
    this.tiles[13][6] = new Tile("R", 10, {jitter: true, shadow: true});

    this.players = [new Player(this.app, this.game, this.rightWidth, height, {name: "Charlotte", score: 1000, numTiles: 7}),
                    new Player(this.app, this.game, this.rightWidth, height, {name: "Eduard", score: 2, numTiles: 7})];
    this.letterTray = new Tray(this.app, this);
    this.tile = new Tile(this.letter, this.size, {jitter: true, shadow: true})
    this.tilePlacementActive = false;
    this.resize(width, height);
  }

  cssLocal() {
    
    return {
      board$c: {
        fontFamily: "'DM Mono', monospace",
        display: "grid",
        gridTemplateColumns: `${this.leftWidth}px ${this.boardWidth}px ${this.rightWidth}px`,
        textAlign: "center",
        marginTop$px: this.cellSize
      },
      leftBar$c: {
        textAlign: "center",
        marginRight$px: this.cellSize / 2
      },
      rightBar$c: {
        textAlign: "center",
        fontSize$px: this.cellSize / 3,
        marginLeft$px: this.cellSize / 2,
        borderStyle: "solid",
        borderColor: "grey",
        borderWidth$px: this.cellSize / 10,
        borderRadius$px: this.cellSize / 10,
        backgroundColor: "#fcfdd7",
        height$px: this.boardHeight - this.cellSize * 2.5
      },
      teable$c: {
        display: "inline-block",
        fontWeight: "bold"
      },
      mainBoard$c: {
        display: "grid",
        gridTemplateColumns: `repeat(15, ${this.cellSize + 2}px)`,
        gridRowGap$px: 2,
        gridAutoRows: 'minmax(min-content, max-content)',
        textAlign: "center"
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
        //overflow:  "hidden",
        fontSize$px: this.cellSize*0.22,
        textAlign: "center",
        fontWeight: "bold"
      },
      boardCell$c$hover: {
        backgroundColor: this.tilePlacementActive ? "green" : "",
        cursor: this.tilePlacementActive ? "pointer" : ""
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
      },
      sideDistribution$c: {
        marginTop$px: this.cellSize*1.2,
        fontSize$px: this.cellSize/4
      },
      letterDistributionTable$c: {
        marginTop$px: 8,
        display: "inline-block",
        textAlign: "center",
        fontSize$px: this.cellSize*0.25,
        backgroundColor: "white"
      },
      letterDistributionBlanks$c: {
        fontSize$px: this.cellSize*0.25
      },
      '.letterDistributionTable td': {
        whiteSpace: "nowrap",
        padding$px: [0, this.cellSize*0.1]
      },
      letterTray$c: {
        textAlign: "center",
        display: "inline-block",
        margin: "auto",
        marginTop$px: this.cellSize / 2
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

        jst.$div(
          {cn: "-teable"},
          ["T", "E", "A", "B", "L", "E"].map(
            letter => new Tile(letter, this.cellSize)
          )
        ),

        jst.$div(
          {cn: "-sideDistribution"},
        ["LETTER", "DISTRIBUTION"].map(
          l => jst.$div(l)
        )),

        jst.$div(
          {cn: "-letterDistributionTable"},
          jst.$table(
            {cn: "-letterDistribution"},
            new Array(9).fill().map(
              (entry, i) => jst.$tr(
                jst.$td(`${String.fromCharCode(65+i)} - ${rules.distribution[String.fromCharCode(65+i)]}`),
                jst.$td(`${String.fromCharCode(74+i)} - ${rules.distribution[String.fromCharCode(74+i)]}`),
                jst.if(i != 8, jst.$td(`${String.fromCharCode(83+i)} - ${rules.distribution[String.fromCharCode(83+i)]}`))
            ))
        )),
        jst.$div(
          {cn: "-letterDistributionBlanks"},
          "Blanks - 2"
        )
      ),
      jst.$div(
        jst.$div(
          {cn: "-mainBoard"},
          rules.board.map(
            (row, rowIndex) => row.map(
              (cell, colIndex) => jst.$div(
                {
                  cn: cellValToClass[cell] + " -boardCell",
                  events: {click: e => this.tileToBoard(this.letterTray.selectedTile, colIndex, rowIndex, this.letterTray.index)}
                },
                cellValToText[cell],
                jst.$div({cn: "-boardTile"}, this.tiles[colIndex][rowIndex])
              )
            )
          )
        ),
        jst.$div(
          {cn: "-letterTray"},
          this.letterTray
        )
      ),
      jst.$div(
        {cn: "-rightBar"},
        this.players
      )
    );
  }

  setTilePlacementActive(isActive) {
    this.tilePlacementActive = isActive;
    this.refresh();
  }

  tileToBoard(tile, column, row) {
    if(this.tilePlacementActive) {
      this.tiles[column][row] = new Tile(tile.letter, tile.size, {jitter: true, shadow: true});
      //tile.setSelected(true);
      tile.setDisabled(true);
      //this.tilePlacementActive = false;
      this.letterTray.unSelectTile();
    }
    this.refresh();
  }

  resize(width, height) {
    this.width        = width;
    this.height       = height;
    this.boardHeight  = height;
    this.cellSize     = Math.min(width/15*0.55, height/18);
    this.leftWidth    = this.cellSize * 4;
    this.rightWidth   = this.cellSize * 4;
    this.boardWidth   = this.cellSize * 15 + 28;
    this.letterTray.resize(this.cellSize * 10, this.cellSize * 1.03, this.cellSize);

    this.tiles.map(col => col.map(tile => tile && tile.resize(this.cellSize)));

    this.refresh();
  }
}