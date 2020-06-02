import {jst}     from "jayesstee";
import css       from "./cssCommon";



//
// Player
//
export class Player extends jst.Component {
  constructor(app, game, width, height, opts) {
    super();
    this.app          = app;
    this.game         = game;
    this.height       = height;
    this.width        = width;
    this.isMe         = opts.isMe ? true : false;

    if (this.isMe) {
      this._loadMyPlayer();
    }
    else {
      this.name = opts.name;
      this.score = opts.score || 0;
      this.numTiles = opts.numTiles;
    }
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

  _loadMyPlayer() {
    this.myPlayer = this.game.getProp("myPlayer");

    if (!this.myPlayer) {
      // Need to get some input
      this.app.dialog({
        title: "Player Information",
        fields: {
          name: name,
          label: "Your Display Name"
        }
      }).then(
        result => {
          this.name = result.name;
          this.stats = Object.assign(this.stats, result.stats);
          this.uuid = uuidv4("teable");
        }
      );

    }

  }

  _saveMyPlayer() {
    this.game.setProp("myPlayer", {
      name: this.name,
      stats: this.stats,
      uuid: this.uuid,
    });    
  }

}
