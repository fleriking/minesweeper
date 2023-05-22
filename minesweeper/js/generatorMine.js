export function generatorMines(clickX, clickY, sizeArea, countMines) {
  let countNotGeneratorMine = countMines;
  let chanceMine = countNotGeneratorMine / (sizeArea * sizeArea - 1);
  let steps = 0;
  let result = [];

  for (let i = 0; i < sizeArea; i++) {
    result.push([]);
    for (let j = 0; j < sizeArea; j++) {
      result[i].push(false);
    }
  }
  for (let i = 0; i < sizeArea; i++) {
    for (let j = 0; j < sizeArea; j++) {
      if (i == clickX && j == clickY) {     
      } else {
        chanceMine = countNotGeneratorMine / (sizeArea * sizeArea - 1 - steps);
        steps++;
        if (Math.random() <= chanceMine) {
          result[i][j] = true;
          countNotGeneratorMine--;
          if (!countNotGeneratorMine) return result;
        }
      }
    }
  }
  return result;
}
// console.log(generatorMines(2,2,4,3));