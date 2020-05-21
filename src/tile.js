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
            borderWidth$px: 3,
            borderColor: "black",
            borderStyle: "solid",
            height$px: this.size,
            width$px: this.size
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
