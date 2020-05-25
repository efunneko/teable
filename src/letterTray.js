import {jst}     from "jayesstee";
import css       from "./cssCommon";
import {Tile}    from "./tile";



//
// letter tray
//
export class Tray extends jst.Component {
  constructor(app) {
    super();
    this.app          = app;
    this.width        = 10;
    this.height       = 10;
    this.slots        = new Array(9).fill();
    this.slots[2]     = new Tile("H", 10, {jitter: false, shadow: true});
    this.slots[3]     = new Tile("E", 10, {jitter: false, shadow: true});
    this.slots[4]     = new Tile("L", 10, {jitter: false, shadow: true});
    this.slots[5]     = new Tile("L", 10, {jitter: false, shadow: true});
    this.slots[6]     = new Tile("O", 10, {jitter: false, shadow: true});
  }

  cssLocal() {
    return {
      tray$c: {
        borderStyle: "solid",
        borderColor: "#D2B48C #8B4513 #8B4513 #D2B48C",
        borderWidth$px: 3,
        height$px: this.height,
        width$px: this.width,
        display: "grid",
        gridTemplateColumns: `repeat(9, ${this.cellSize}px)`,
        gridTemplateRows: `repeat(9, ${this.cellSize}px)`,
        position: "inline-block",
        margin: "auto",
        gridColumnGap$px: this.cellSize * 0.12,
        padding$px: this.cellSize * 0.12,
        backgroundColor: "#DEB887"
      },
      slot$c: {
        borderStyle: "solid",
        borderColor: "#8B4513 #D2B48C #D2B48C #8B4513"
        //boxShadow$px: [5, 5, 10]
      }
    };
  }
  
  
  render() {
    return jst.$div(
      {cn: "-tray"},
      this.slots.map(slot => jst.$div({cn: "-slot"}, slot))
    );
  }

  resize(width, height, cellSize) {
    this.width = width;
    this.height = height;
    this.cellSize = cellSize;
    this.slots.forEach(slot => {
        if(slot) {
            slot.resize(this.cellSize)
        }
    })
    this.refresh();
  }
}