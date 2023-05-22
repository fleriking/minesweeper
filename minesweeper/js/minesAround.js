export function minesAround(matrix) {
  // throw new NotImplementedError('Not implemented');
  // remove line with error and write your code here
  const myarr= [];
  for (let i = 0; i< matrix.length; i++) {
    myarr.push([]);
    for (let j = 0; j < matrix[0].length; j++) {
      let count = 0;
      if(i > 0 && j > 0 && matrix[i-1][j-1]) count++;
      if(j > 0 && matrix[i][j-1]) count++;
      if(j > 0 && i < matrix.length-1 && matrix[i+1][j-1]) count++;
      if(i > 0 && matrix[i-1][j]) count++;
      if(i < matrix.length-1 && matrix[i+1][j]) count++;
      if(i > 0 && j < matrix[0].length-1 && matrix[i-1][j+1]) count++;
      if(j < matrix[0].length-1 && matrix[i][j+1]) count++;
      if(i < matrix.length-1 && j < matrix[0].length-1 && matrix[i+1][j+1]) count++;
      myarr[i].push(count);
      }
    }
    return myarr;
  }