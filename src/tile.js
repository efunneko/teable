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
          borderWidth$px: 3,
          borderRadius$px: this.size/40,
          borderColor: "black",
          borderStyle: "solid",
          height$px: this.size,
          width$px: this.size
        },
        subScript$c: {
          position: "absolute",
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
        cn: "-tile"
      },
      jst.$div(
        {
            cn: "-letter"
        },
        this.letter
      ),
      jst.$div(
          {
              cn: "-subScript"
          },
          rules.points[this.letter]
      )
    );
  }

  
}
