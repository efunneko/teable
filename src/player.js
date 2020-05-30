import {jst}     from "jayesstee";
import css       from "./cssCommon";



//
// Player
//
export class Player extends jst.Component {
  constructor(app, width, height, opts = {}) {
    super();
    this.app          = app;
    this.height       = height;
    this.width        = width;
    this.name         = opts.name;
    this.score        = opts.score;
    this.tiles        = opts.numTiles;
  }

  cssLocal() {
    return {
      playerInfo$c: {
        marginTop$px: this.height / 30
      },
      playerName$c: {
        fontWeight: "bold",
        //marginTop$px: this.height / 50
      }
    };
  }
  
  
  render() {
    return jst.$div(
      {cn: "-playerInfo"},
      jst.$div(
        {cn: "-playerName"},
        this.name
      ),
      jst.$div(
        {cn: "-playerScore"},
        "Score: ",
        this.score
      ),
      jst.$div(
        {cn: "-playerTiles"},
        "Tiles: ",
        this.tiles
      )
    );
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.refresh();
  }
}
