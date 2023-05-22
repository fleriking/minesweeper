console.log('hello');
import { createMineSweeperElement, newGame } from "./createMIneSweeperElement.js";
import Queue from "./Queue.js";

// console.log(createMIneSweeperElement(3));
let size = 10;
let mines = 10;
let results = new Queue(10);
let style = false;

style = localStorage.getItem('style') == 'false' ? false : true;
console.log(style);

const buttons = document.createElement('div');
buttons.className = 'mine-sweeper__buttons';

const buttonNewGame = document.createElement('button');
buttonNewGame.className = 'mine-sweeper__button';
buttonNewGame.textContent = 'New Game';

const buttonResults = document.createElement('button');
buttonResults.className = 'mine-sweeper__button';
buttonResults.textContent = 'Results';
const buttonStyle = document.createElement('button');
buttonStyle.className = 'mine-sweeper__button';
buttonStyle.textContent = 'Change style';

buttons.append(buttonNewGame, buttonResults,buttonStyle);
const listResult = document.createElement('ol');
listResult.style.display = 'none';

document.body.append(buttons, listResult);


const checkSound = document.createElement('input');
checkSound.type = 'checkbox';
checkSound.id = 'checkSound';
checkSound.name = 'checkSound';
checkSound.checked = true;

const labelSound = document.createElement('label');
labelSound.htmlFor = 'checkSound';
labelSound.textContent = 'sound on/off';
document.body.append(labelSound, checkSound);

const checkEasy = document.createElement('input');
checkEasy.type = 'radio';
checkEasy.id = 'checkEasy';
checkEasy.name = 'checkLevel';
checkEasy.value = '10';
checkEasy.checked = true;
const labelEasy = document.createElement('label');
labelEasy.htmlFor = 'checkEasy';
labelEasy.textContent = 'easy: 10x10';

const checkNormal = document.createElement('input');
checkNormal.type = 'radio';
checkNormal.id = 'checkNormal';
checkNormal.value = '15';
checkNormal.name = 'checkLevel';
const labelNormal = document.createElement('label');
labelNormal.htmlFor = 'checkNormal';
labelNormal.textContent = 'normal: 15x15';

const checkHard = document.createElement('input');
checkHard.type = 'radio';
checkHard.id = 'checkHard';
checkHard.name = 'checkLevel';
checkHard.value = '25';
const labelHard = document.createElement('label');
labelHard.htmlFor = 'checkHard';
labelHard.textContent = 'hard: 25x25';


document.body.append(labelEasy, checkEasy, labelNormal, checkNormal, labelHard, checkHard);

const countMines = document.createElement('input');
countMines.type = 'number';
countMines.min = 10;
countMines.max = 99;
countMines.value = 10;
document.body.append('count mines', countMines);


let mineSweeperElement = null;
let localUserState = localStorage.getItem('userState');
if (localUserState) {
  const parseUserState = JSON.parse(localUserState);
  localStorage.removeItem('userState');
  console.log('localuserstyle',style);
  mineSweeperElement = createMineSweeperElement(parseUserState.size,
    parseUserState.mines,
    style,
    parseUserState.isStarted,
    parseUserState.mineMatrix,
    parseUserState.mineSweeperObj,
    parseUserState.clicks,
    parseUserState.seconsd,
    parseUserState.flagsOpen,
    parseUserState.flagMatrix,
    parseUserState.isGameOver
     ////////////////////////////////
  );
  countMines.value = parseUserState.mines;
  document.body.querySelectorAll('input[name="checkLevel"]').forEach(element => {
    if (element.value == parseUserState.size) element.checked = true;
  })

  document.body.querySelectorAll('audio').forEach(elem => {
    elem.muted = !checkSound.checked;
    // console.log(elem);
  });
} else {
  console.log('lolo',style);
  mineSweeperElement = createMineSweeperElement(size, size,style);
}

document.body.append(mineSweeperElement.mineSweeper);

countMines.addEventListener('change', (event) => {
  mines = Number(countMines.value);
  if (mines > 99) {
    mines = 99;
    countMines.value = 99;
  }
  if (mines < 10) {
    mines = 10;
    countMines.value = 10;
  }
  reload(style);
})
document.body.querySelectorAll('input[name="checkLevel"]').forEach(elem => {
  elem.addEventListener('change', event => {

    size = Number(elem.value);

    console.log('checked size', size);
    reload(style);
  })
})

checkSound.addEventListener('change', (event) => {

  document.body.querySelectorAll('audio').forEach(elem => {
    elem.muted = !checkSound.checked;

  });
  console.log('change');
})

buttonNewGame.addEventListener('click', (event) => {

  reload(style);

})

buttonStyle.addEventListener('click', event =>{
  style = !style;
  localStorage.setItem('style', style);
  const parseUserState = mineSweeperElement.saveState();
  mineSweeperElement.mineSweeper.remove();
  mineSweeperElement.mineInfo.remove();
  mineSweeperElement.resultGame.remove();
  mineSweeperElement = createMineSweeperElement(parseUserState.size,
    parseUserState.mines,
    style,
    parseUserState.isStarted,
    parseUserState.mineMatrix,
    parseUserState.mineSweeperObj,
    parseUserState.clicks,
    parseUserState.seconsd,
    parseUserState.flagsOpen,
    parseUserState.flagMatrix,
    parseUserState.isGameOver
     ////////////////////////////////
  );
  document.body.append(mineSweeperElement.mineSweeper);

  document.body.querySelectorAll('audio').forEach(elem => {
    elem.muted = !checkSound.checked;
    // console.log(elem);
  });
})

window.addEventListener('beforeunload', (event) => {
  localStorage.setItem('userState', JSON.stringify(mineSweeperElement.saveState()));
  localStorage.setItem('results', JSON.stringify(results));
  localStorage.setItem('style', style);
});

document.body.addEventListener('gameOver', event => {
  const winOrLose = event.detail.result ? 'lose' : 'win';
  results.add(`${winOrLose} on board size = ${event.detail.size} for ${event.detail.clicks} clicks and ${event.detail.time} seconds`);

  const arrResults = results.result();
  let innerListResult = '';
  arrResults.forEach(element => {
    innerListResult += `<li>${element}</li>`;
  });
  listResult.innerHTML = innerListResult;
});
buttonResults.addEventListener('click', event => {
  if (listResult.style.display == 'none') {
    const arrResults = results.result();
    let innerListResult = '';
    arrResults.forEach(element => {
      innerListResult += `<li>${element}</li>`;
    });
    listResult.innerHTML = innerListResult;
    listResult.style.display = 'block';
    buttonResults.textContent = 'close results';

  } else {
    listResult.style.display = 'none';
    buttonResults.textContent = 'Results';
  }
});
if (localStorage.getItem('results')) {
  results = new Queue(JSON.parse(localStorage.getItem('results')));
  const arrResults = results.result();
  let innerListResult = '';
  arrResults.forEach(element => {
    innerListResult += `<li>${element}</li>`;
  });
  listResult.innerHTML = innerListResult;
}

function reload(STYLE = false) {
  mineSweeperElement.mineSweeper.remove();
  mineSweeperElement.mineInfo.remove();
  mineSweeperElement.resultGame.remove();
  mineSweeperElement = createMineSweeperElement(size, mines, STYLE);
  document.body.append(mineSweeperElement.mineSweeper);

  document.body.querySelectorAll('audio').forEach(elem => {
    elem.muted = !checkSound.checked;
    // console.log(elem);
  });
}