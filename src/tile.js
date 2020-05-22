import {jst}     from "jayesstee";
import css       from "./cssCommon";
import rules     from "./rules";



//
// Tile
//
export class Tile extends jst.Component {
  constructor(letter, size, opts = {}) {
    super();
    this.letter         = letter;
    this.shadow         = opts.shadow || false;
    this.jitter         = opts.jitter || false;
    this.resize(size);
  }

  cssLocal() {
    return {
        tile$c: {
          position: "relative",
          textAlign: "left",
          borderColor: jst.rgba(0,0,0,0.6),
          borderStyle: "solid",
          backgroundColor: "#fcfdd7",
          zIndex: 10
        },
        subScript$c: {
          position: "absolute",
        },
        letter$c: {
        }
    };
  }
  
  cssInstance() {
    return {
      tile$c: {
        borderWidth$px: this.borderSize,
        borderRadius$px: this.size/20,
        height$px: this.edgeSize,
        width$px: this.edgeSize,
        margin$px: [this.jitter ? this.rand(this.edgeSize/20):0, 0, 0, this.jitter ? this.rand(this.edgeSize/20):0],
        transform: `rotate(${this.jitter ? this.rand(3):0}deg)`,
        boxShadow$px: this.shadow ? [2, 2, 5, jst.rgba(0, 0, 0, 0.3)] : 0
      },
      subScript$c: {
        right$px: this.edgeSize*0.05,
        bottom$px: this.edgeSize*0.05,
        fontSize$px: this.edgeSize*0.3,
        marginRight$px: this.edgeSize/7
      },
      letter$c: {
        marginLeft$px: this.edgeSize/6,
        fontSize$px: this.edgeSize*0.7
      }
  };
}
  
  render() {
    return jst.$div(
      {
        cn: "-tile --tile"
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
