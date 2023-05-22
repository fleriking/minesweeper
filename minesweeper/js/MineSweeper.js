import Mine from "./Mine.js";
import { minesAround } from "./minesAround.js";
export default class MineSweeper {
  constructor(minesMartix,mines,USERSTATE = false, CLICKS = 0, CELLSOPEN = 0) {
    // this.time = time;
    this.clicks = CLICKS;

    this.mines = mines;
    this.cellsOpen = CELLSOPEN;
    this.minesMartix = minesMartix;
    this.size = minesMartix.length;
    this.minesAroundMatrix = minesAround(minesMartix);
    this.userState = USERSTATE ? USERSTATE : this.initUserState(minesMartix.length);
  }
  initUserState(size) {
    const result = [];
    for (let i = 0; i < size; i++) {
      result.push([]);
      for (let j = 0; j < size; j++) {
        result[i].push(new Mine(i, j));
      }
    }
    return result;
  }
  clickLeftCell(x, y) {
    x = Number(x);
    y = Number(y);
    const mine = this.userState[x][y];
    if (!mine.flag && !mine.open) {
      mine.open = true;
      this.cellsOpen++;
      if (this.minesMartix[x][y]) {
        console.log('mina');
        return -1; // mina
      } else {
        const minesAround = this.minesAroundMatrix[x][y];
        mine.around = minesAround;
        if (!minesAround) {
          this.recurseZeroMineAround(x,y);
          // return this.minesAroundMatrix[x][y];
        }
        // console.log(this.userState);
      }
    } else {
      return -2; //uje otcryta ili pod flagom
    }
  }
  recurseZeroMineAround(i, j) {
    i = Number(i);
    j = Number(j);
    // console.log('recurse',i,j,this.userState[i][j].open);
    // console.log(this.minesAroundMatrix);
    // console.log(this.userState);
    
      if (i > 0 && j > 0  && this.userState[i-1][j-1].open === false)  this.clickLeftCell(i-1, j-1);
      if (j > 0 && this.userState[i][j-1].open === false)  this.clickLeftCell(i, j-1);
      if (j > 0 && (i < this.minesAroundMatrix.length - 1) && this.userState[i+1][j-1].open === false)  this.clickLeftCell(i+1, j-1);
      if (i > 0 && this.userState[i-1][j].open === false)  this.clickLeftCell(i-1, j);
      if ((i < this.minesAroundMatrix.length - 1)  && this.userState[i+1][j].open === false)  this.clickLeftCell(i+1, j);
      if (i > 0 && (j < this.minesAroundMatrix[0].length - 1) && this.userState[i-1][j+1].open === false)  this.clickLeftCell(i-1, j+1);
      if ((j < this.minesAroundMatrix[0].length - 1)  && this.userState[i][j+1].open === false) this.clickLeftCell(i, j+1);
      if ((i < this.minesAroundMatrix.length - 1) && (j < this.minesAroundMatrix[0].length - 1) && this.userState[i+1][j+1].open === false) this.clickLeftCell(i+1, j+1);
    
  }


}