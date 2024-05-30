const board = document.querySelector(".board");
const message = document.querySelector(".message");
const restart = document.querySelector(".restart");
let turn = 1;
const player1 = "X";
const player2 = "O";

const winCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

let playedCells = ["", "", "", "", "", "", "", "", ""];

for (let i = 0; i < 9; i++) {
  const elem = document.createElement("div");
  elem.classList.add("cell");
  elem.setAttribute("id", i);
  elem.addEventListener("click", onClick);
  board.appendChild(elem);
}
restart.addEventListener("click", resetGame);

let cells = document.querySelectorAll(".cell");

function onClick(e) {
  if (e.target.innerText === "") {
    e.target.innerText = turn % 2 === 0 ? player2 : player1;
    e.target.classList.add(turn % 2 === 0 ? "blue" : "red");
    const index = e.target.getAttribute("id");
    playedCells[index] = turn % 2 === 0 ? player2 : player1;
    turn++;
  } else {
    alert("Someone clicked this cell already");
  }
  let gameState = checkIfGameWon();
  if (turn > 9 || gameState > 0) {
    gameOver(gameState);
  }
}

function gameOver(gameState) {
  let endMsg = "Gamer over.";
  switch (gameState) {
    case 0:
      endMsg += "\nNo player won.";
      break;
    case 1:
      endMsg += "\nPlayer 1 won.";
      break;
    case 2:
      endMsg += "\nPlayer 2 won.";
      break;
  }
  message.innerText = endMsg;
  disableCells();
}

function disableCells() {
  cells.forEach((cell) => cell.removeEventListener("click", onClick));
}

function checkIfGameWon() {
  const player1Plays = [];
  const player2Plays = [];
  playedCells.forEach((play, i) => {
    if (play === "X") {
      player1Plays.push(i);
    } else if (play === "O") {
      player2Plays.push(i);
    }
  });
  let gameState = 0;
  if (win(player1Plays)) gameState = 1;
  else if (win(player2Plays)) gameState = 2;
  return gameState;
}

function win(plays) {
  let retval = false;
  for (let i = 0; i < winCombinations.length; i++) {
    let counter = 0;
    for (let j = 0; j < plays.length; j++) {
      if (winCombinations[i].includes(plays[j])) counter++;
    }
    if (counter === 3) return true;
  }
  return retval;
}

function resetGame() {
  turn = 1;
  playedCells = ["", "", "", "", "", "", "", "", ""];
  resetCells();
  message.innerText = "Message here";
}

function resetCells() {
  cells.forEach((cell) => {
    cell.innerText = "";
    cell.classList.remove("blue");
    cell.classList.remove("red");
    cell.addEventListener("click", onClick);
  });
}
