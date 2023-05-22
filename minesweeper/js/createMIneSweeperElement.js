import Mine from "./Mine.js";
import MineSweeper from "./MineSweeper.js";
import { generatorMines } from "./generatorMine.js";
import { minesAround } from "./minesAround.js";


export function createMineSweeperElement(size, mines,STYLE = false, ISTARTED = false, MINEMATRIX = null,
   MINEOBJ = null, CLICKS = 0, SECONDS = 0, FLAGSOPEN = 0, FLAGMATRIX = [], GAMEOVER = 0) {
  let isStarted = ISTARTED;
  let mineMatrix = MINEMATRIX;
  let mineSweeperObj = MINEOBJ ? new MineSweeper(mineMatrix,mines,MINEOBJ.userState,CLICKS,MINEOBJ.cellsOpen) : null;
  let clicks = CLICKS;
  let seconsd = SECONDS;
  let mySetInterval = null;
  let flagsOpen = FLAGSOPEN;
  let isGameOver = GAMEOVER; //lose: 1, win:-1, game: 0;
  let flagMatrix = FLAGMATRIX;
  if (!flagMatrix.length) {
    for (let i = 0; i < size; i++) {
      flagMatrix.push([]);
      for (let j = 0; j < size; j++) {
        flagMatrix[i].push(false);
      }
    }

  }


  

  const audioClick = new Audio('./audio/click.wav');
  const audioLose = new Audio('./audio/fatality.mp3');
  const audioWin = new Audio('./audio/victory.mp3');




  function creatMineCells(contnet = '') {
    let innerMineSweeper = '';
    if (contnet === '') {
      for (let i = 0; i < size; i++) {
        let innerRoad = '';
        for (let j = 0; j < size; j++) {
          const style = STYLE ? 'mine-sweeper__element--light' : '';
          innerRoad += `<div data-x="${i}" data-y="${j}" class="mine-sweeper__element ${style}"></div>`
        }
        innerMineSweeper += `<div class="mine-sweeper__road">` + innerRoad + `</div>`;
      }
      return innerMineSweeper;
    } else {
      for (let i = 0; i < size; i++) {
        let innerRoad = '';
        for (let j = 0; j < size; j++) {
          let textCell ='';
          let textStyle = '';
          if (contnet[i][j].open) {
            textCell = contnet[i][j].around != 0 ? contnet[i][j].around : '';

            textStyle = `mine-sweeper__color-cell-${contnet[i][j].around}`;
          } else {
            textCell = '';
            if (contnet[i][j].flag) {
              textStyle = `mine-sweeper__flag`;
            } 
            // else {
            //   textStyle = `mine-sweeper__color-cell-null`;
            // }
          }
          const style = STYLE ? 'mine-sweeper__element--light' : '';
          const styleCell = (STYLE && contnet[i][j].open) ? 'mine-sweeper__cell--light' : '';
          innerRoad += `<div data-x="${i}" data-y="${j}" class="mine-sweeper__element ${textStyle} ${style} ${styleCell}">${textCell}</div>`
        }
        innerMineSweeper += `<div class="mine-sweeper__road">` + innerRoad + `</div>`;
      }
      return innerMineSweeper;
    }
  }

  const mineSweeper = document.createElement('div');
  mineSweeper.classList.add('mine-sweeper__board');
  const content = mineSweeperObj ? mineSweeperObj.userState : '';
  mineSweeper.innerHTML = creatMineCells(content);
  const mineInfo = document.createElement('div');
  mineInfo.classList.add('mine-sweeper__info');
  mineInfo.innerHTML = `
  <div class="mine-sweeper__timer">${seconsd}s</div>
  <div class="mine-sweeper__clicks">0 clicks</div>
  <div class="mine-sweeper__flag-info">0 flags</div>`;
  document.body.append(mineInfo);
  const resultGame = document.createElement('div');
  resultGame.classList.add('mine-sweeper__result');
  document.body.append(resultGame, audioClick, audioLose, audioWin);



  const timer = document.querySelector('.mine-sweeper__timer');
  const clicksElement = document.querySelector('.mine-sweeper__clicks');
  const flagInfo = document.querySelector('.mine-sweeper__flag-info');

  if (isStarted) {
    mySetInterval = setInterval(() => {
      seconsd++;
      timer.textContent = seconsd + 's';
    }, 1000);
    clicksElement.textContent = clicks;
    flagInfo.textContent = `${flagsOpen} flags`;
  }


  function getElement(x, y) {
    return mineSweeper.querySelector(`[data-x="${x}"][data-y="${y}"]`);
  }

  mineSweeper.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if (event.target.closest(".mine-sweeper__element") && !isGameOver) {
      const x = Number(event.target.dataset.x);
      const y = Number(event.target.dataset.y);

      // clicks++;
      // clicksElement.textContent = clicks;
      audioClick.play();
      if (isStarted && mineSweeperObj.userState[x][y].open === false) {
        event.target.classList.toggle("mine-sweeper__flag");
        flagMatrix[x][y] = !flagMatrix[x][y];
        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            mineSweeperObj.userState[i][j].flag = flagMatrix[i][j];
          }
        }

      }
      if (!isStarted) {
        event.target.classList.toggle("mine-sweeper__flag");
        flagMatrix[x][y] = !flagMatrix[x][y];
        if (!mySetInterval) {
          mySetInterval = setInterval(() => {
            seconsd++;
            timer.textContent = seconsd + 's';
          }, 1000);
        }
      }
      flagsOpen = mineSweeper.querySelectorAll('.mine-sweeper__flag').length;
      flagInfo.textContent = `${flagsOpen} flags`;
    }
  })
  mineSweeper.addEventListener('click', leftClick)
  function leftClick(event) {
    if (event.target.closest(".mine-sweeper__element") && !isGameOver) {
      audioClick.play();
      clicks++;
      clicksElement.textContent = clicks;
      const x = Number(event.target.dataset.x);
      const y = Number(event.target.dataset.y);
      if (getElement(x, y).classList.contains("mine-sweeper__flag")) return;

      if (!isStarted) {
        mineMatrix = generatorMines(x, y, size, mines);
        isStarted = true;
        mineSweeperObj = new MineSweeper(mineMatrix, mines);
        console.log(mineMatrix);
        console.log(mineSweeperObj.minesAroundMatrix);

        for (let i = 0; i < size; i++) {
          for (let j = 0; j < size; j++) {
            mineSweeperObj.userState[i][j].flag = flagMatrix[i][j];
          }
        }

        if (!mySetInterval) {
          mySetInterval = setInterval(() => {
            seconsd++;
            timer.textContent = seconsd + 's';
          }, 1000);
        }
      }
      const clickResult = mineSweeperObj.clickLeftCell(x, y);
      if (clickResult === -1) {
        resultGame.textContent = `Game over. Try again`;
        audioLose.play();
        mineSweeper.removeEventListener('click', leftClick);
        mineSweeperObj.userState[x][y].around = ':(';
        isGameOver = 1;
        clearInterval(mySetInterval);
        document.body.dispatchEvent(new CustomEvent('gameOver', {
          detail: {result: 1, clicks: clicks, time: seconsd,size: size}
        }));
      } else {
        if (mineSweeperObj.cellsOpen === (size * size - mines)) {
          audioWin.play();
          resultGame.textContent = `Hooray! You found all mines in ${seconsd} seconds and ${clicks} moves!`;
          mineSweeper.removeEventListener('click', leftClick);
          clearInterval(mySetInterval);
          isGameOver = -1;
          document.body.dispatchEvent(new CustomEvent('gameOver', {
            detail: {result: 0, clicks: clicks, time: seconsd,size: size}
          }));
        }
      }
      mineSweeper.innerHTML = creatMineCells(mineSweeperObj.userState);


    }
  }
  function saveState() {
    return {
      size,
      mines,
      isStarted,
      mineMatrix,
      mineSweeperObj,
      clicks,
      seconsd,
      flagsOpen,
      flagMatrix,
      isGameOver
    }
  }


  return {
    mineSweeper,
    mineInfo,
    resultGame,
    getElement,
    mineSweeperObj,
    mySetInterval,
    saveState,
  }
}

export function newGame(size, mines) {
  return createMineSweeperElement(size, mines);
}