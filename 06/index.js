// template function
function solvePuzzle(inputFile, callback) {
  const fr = new FileReader();
  fr.addEventListener('load', () => {
    const solution = callback( fr.result );

    console.log("SOLUTION => ", solution);
    solutionSpan.textContent = solution;
  });

  fr.readAsText(inputFile);
}

const fileInput = document.getElementById('input');
const solutionSpan = document.getElementById('solution');

// puzzle 1
document.getElementById("puzzle-1").addEventListener("click", e => {
  const inputFile = fileInput.files[0];

  function solve( inputString ) {
    return getStartOfPacketIndex(inputString);
  }

  solvePuzzle(inputFile, solve);
});

// puzzle 2
document.getElementById("puzzle-2").addEventListener("click", e => {
  const inputFile = fileInput.files[0];

  function solve( inputString ) {
    return getStartOfMessageIndex(inputString);
  }

  solvePuzzle(inputFile, solve);
})

// helpers
function getStartOfPacketIndex(string) {
  return getMarkerGivenLength(string, 4);
}

function getStartOfMessageIndex(string) {
  return getMarkerGivenLength(string, 14);
}

function getMarkerGivenLength(str, len) {
  for (let i = len; i < str.length; i++) {
    const lastXReceived = str.substring(i - len, i);
    const keyObject = {};
    
    lastXReceived.split("").forEach(
      char => {
        keyObject[char] = true;
      }
    )

    console.log(keyObject);

    if (Object.keys(keyObject).length === len) {
      return i;
    }
  }
}