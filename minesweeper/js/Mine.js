export default class Mine {

  constructor(posX, posY) {
    this.posX = posX;
    this.posY = posY;
    this.flag = false;
    this.open = false;
    this.around = null;
  }
}