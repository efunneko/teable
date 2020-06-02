import {jst}     from "jayesstee";
import css       from "./cssCommon";
import rules     from "./rules";
import {Board}   from "./board";



//
// Tile
//
export class Tile extends jst.Component {
  constructor(letter, size, opts = {}) {
    super();
    this.letter         = letter;
    this.shadow         = opts.shadow || false;
    this.jitter         = opts.jitter || false;
    this.clickCallback  = opts.clickCallback;
    this.leftMargin     = opts.jitter ? this.rand(this.edgeSize/20) : 0;
    this.topMargin      = opts.jitter ? this.rand(this.edgeSize/20) : 0;
    this.rotation       = opts.jitter ? this.rand(3) : 0;
    this.disabled        = false;
    this.isSelected     = false;
    this.resize(size);
  }

  cssLocal() {
    return {
        tile$c: {
          position: "relative",
          textAlign: "left",
          borderColor: jst.rgba(0,0,0,0.6),
          borderStyle: "solid",
          //backgroundColor: this.disabled ? "grey" : "#fcfdd7",
          zIndex: 10
        },
        subScript$c: {
          position: "absolute",
        },
        letter$c: {
        },
        selected$c: {
          borderColor: "blue"
        }
    };
  }
  
  cssInstance() {
    return {
      tile$c: {
        fontFamily: "'DM Mono', monospace",
        borderWidth$px: this.borderSize,
        borderRadius$px: this.size/20,
        height$px: this.edgeSize,
        width$px: this.edgeSize,
        //margin$px: [this.topMargin, 0, 0, this.leftMargin],
        transform: `rotate(${this.rotation}deg)`,
        boxShadow$px: this.shadow ? [2, 2, 5, jst.rgba(0, 0, 0, 0.3)] : 0,
        cursor: "pointer",
        backgroundColor: this.disabled ? "gainsboro" : "#fcfdd7",
        borderColor: this.disabled ? "grey" : ""
      },
      subScript$c: {
        right$px: this.edgeSize*0.05,
        bottom$px: this.edgeSize*0.05,
        fontSize$px: this.edgeSize*0.3,
        marginRight$px: this.edgeSize/7,
        color: this.disabled ? "grey" : "black"
      },
      letter$c: {
        marginLeft$px: this.edgeSize/6,
        fontSize$px: this.edgeSize*0.7,
        color: this.disabled ? "grey" : "black"
      }
  };
}
  
  render() {
    return jst.$div(
      {
        cn: `-tile --tile ${this.isSelected ? "-selected" : ""}`,
        events: {click: e => this.clicked(e)}
      },
      jst.$div(
        {
            cn: "-letter --letter"
        },
        this.letter
      ),
      jst.$div(
          {
              cn: "-subScript --subScript"
          },
          rules.points[this.letter]
      )
    );
  }

  clicked(e) {
    if(this.clickCallback && !this.disabled) {
      this.clickCallback(this);
    }
  }

  setSelected(isSelected) {
    this.isSelected = isSelected;
    this.refresh();
  }

  setDisabled(disabled) {
    this.disabled = disabled;
    this.refresh();
  }

  resize(size) {
    this.size       = size;
    this.borderSize = size/14;
    this.edgeSize   = size - this.borderSize*2;
    this.refresh();
  }

  rand(amount, onlyPos) {
    if (!onlyPos) {
      return Math.random() * amount * 2 - amount;
    }
    else {
      return Math.random() * amount;
    }
  }
}