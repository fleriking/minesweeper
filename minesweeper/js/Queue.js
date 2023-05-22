export default class Queue {
  constructor(sizeOrObject) {
    if (typeof sizeOrObject =='object'){
      this.size = sizeOrObject.size;
      this.head = sizeOrObject.head;
      this.tail = sizeOrObject.tail;
      this.queue = sizeOrObject.queue;
    } else {
      this.size = sizeOrObject;
      this.head = 0;
      this.tail = 0;
      this.queue = {};
    }
  }
  // preload() {
  //   for (let i = 0; i < this.size; i++) {
  //     this.queue[this.tail] = ''
  //   }
  // }
  add(content) {
    this.queue[this.tail] = content;
    this.tail++;
    if ((this.tail - this.head) > this.size) {
      delete this.queue[this.head];
      this.head++;
    }
  }
  result(){
    const res = [];
    for(let key in this.queue){
      res.push(this.queue[key]);
      // console.log(key,'----',this.queue[key]);
    }
    return res;
  }

}