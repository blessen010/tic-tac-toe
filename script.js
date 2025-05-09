var orginBoard;
const huPlayer = "0";
const aiPlayer = "X";
const winCombos = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  orginBoard = Array.from(Array(9).keys());
  cells.forEach(cell => {
    cell.innerText = "";
    cell.style.removeProperty("background-color");
    cell.style.color = "#222";
    cell.addEventListener("click", turnClick, false);
  });
}

function turnClick(square) {
  if (typeof orginBoard[square.target.id] === "number") {
    turn(square.target.id, huPlayer);
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}

function turn(squareId, player) {
  orginBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(orginBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.includes(elem))) {
      gameWon = { index, player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  cells.forEach(cell => {
    cell.removeEventListener("click", turnClick, false);
    cell.style.color = "#fff";
  });
  declareWinner(gameWon.player === huPlayer ? "You Win 🎉" : "You Lose 😢");
}

function declareWinner(who) {
  const endgame = document.querySelector(".endgame");
  endgame.style.display = "flex";
  endgame.querySelector(".message").innerText = who;
}

function emptySquares(board) {
  return board.filter(s => typeof s === "number");
}

function bestSpot() {
  return minimax(orginBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquares(orginBoard).length === 0) {
    cells.forEach(cell => cell.removeEventListener("click", turnClick, false));
    declareWinner("It's a Tie 🤝");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);

  if (checkWin(newBoard, aiPlayer)) return { score: 10 };
  if (checkWin(newBoard, huPlayer)) return { score: -10 };
  if (availSpots.length === 0) return { score: 0 };

  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    let result = minimax(newBoard, player === aiPlayer ? huPlayer : aiPlayer);
    move.score = result.score;

    newBoard[availSpots[i]] = move.index;
    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    let bestScore = -Infinity;
    moves.forEach((move, i) => {
      if (move.score > bestScore) {
        bestScore = move.score;
        bestMove = i;
      }
    });
  } else {
    let bestScore = Infinity;
    moves.forEach((move, i) => {
      if (move.score < bestScore) {
        bestScore = move.score;
        bestMove = i;
      }
    });
  }

  return moves[bestMove];
}
