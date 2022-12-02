// template function
function solvePuzzle(inputFile, callback) {
  const fr = new FileReader();
  fr.addEventListener('load', () => {
    const gameLog = fr.result;
    const rpsGames = gameLog.split('\r\n').map(game => game.split(' '));

    console.log("SOLUTION => ", callback(rpsGames));
    solutionSpan.textContent = solution;
  });

  fr.readAsText(inputFile);
}

const fileInput = document.getElementById('input');
const solutionSpan = document.getElementById('solution');

// puzzle 1
document.getElementById("puzzle-1").addEventListener("click", e => {
  const inputFile = fileInput.files[0];

  function solve(rpsGames) {
    return rpsGames.map(rpsGame => scoreRockPaperScissorsWithCodes(rpsGame[1], rpsGame[0])).reduce((sum, element) => sum + element, 0);
  };

  solvePuzzle(inputFile, solve);
});

// puzzle 2
document.getElementById("puzzle-2").addEventListener("click", e => {
  const inputFile = fileInput.files[0];

  function solve(rpsGames) {
    return rpsGames.map(rpsGame => achieveDesiredOutcome(rpsGame[1], rpsGame[0])).reduce((sum, element) => sum + element, 0);
  };

  solvePuzzle(inputFile, solve);
})

// helpers
const OPPONENT_MOVES = {
  A: 1,
  B: 2,
  C: 3
};

const YOUR_MOVES = {
  X: 1,
  Y: 2,
  Z: 3
};

const OUTCOMES = {
  X: 2,
  Y: 0,
  Z: 1
};

function achieveDesiredOutcome(desiredOutcome, opponentMoveCode) {
  const opponentMove = OPPONENT_MOVES[opponentMoveCode];
  let yourMove = (opponentMove + OUTCOMES[desiredOutcome]) % 3;
  yourMove = (yourMove === 0) ? 3 : yourMove;
  return scoreRockPaperScissors(yourMove, opponentMove);
}

function scoreRockPaperScissorsWithCodes(yourMoveCode, OpponentMoveCode) {
  const [ yourMove, opponentMove ] = [YOUR_MOVES[yourMoveCode], OPPONENT_MOVES[OpponentMoveCode]];
  return scoreRockPaperScissors(yourMove, opponentMove);
}

function scoreRockPaperScissors(yourMove, opponentMove) {
  if (yourMove === opponentMove) {
    return 3 + yourMove;
  } else if (yourMove - (opponentMove % 3) === 1) {
    return 6 + yourMove;
  } else {
    return yourMove;
  }
} 