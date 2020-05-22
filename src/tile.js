import {jst}     from "jayesstee";
import css       from "./cssCommon";
import rules     from "./rules";



//
// Tile
//
export class Tile extends jst.Component {
  constructor(letter, size) {
    super();
    this.letter         = letter;
    this.size           = size;
  }

  cssLocal() {
    return {
        tile$c: {
          position: "relative",
          textAlign: "left",
          borderColor: "black",
          borderStyle: "solid",
          backgroundColor: "#fcfdd7"
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
        borderWidth$px: 3,
        borderRadius$px: this.size/20,
        height$px: this.size,
        width$px: this.size
      },
      subScript$c: {
        right$px: this.size*0.05,
        bottom$px: this.size*0.05,
        fontSize$px: this.size*0.3,
        marginRight$px: this.size/6
      },
      letter$c: {
        marginLeft$px: this.size/6,
        fontSize$px: this.size*0.7
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
    this.size = size;
    this.refresh();
  }
  
}
