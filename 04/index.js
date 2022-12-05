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

  function solve(input) {
    const listOfPairs = getListOfPairArrays(input);
    
    let totalSurroundingPairs = 0;
    listOfPairs.forEach(
      pair => {
        if ((pair[0] <= pair[2] && pair[1] >= pair[3]) || (pair[2] <= pair[0] && pair[3] >= pair[1]))
          totalSurroundingPairs++;
      }
    );
    return totalSurroundingPairs;
  }

  solvePuzzle(inputFile, solve);
});

// puzzle 2
document.getElementById("puzzle-2").addEventListener("click", e => {
  const inputFile = fileInput.files[0];

  function solve(input) {
    const listOfPairs = getListOfPairArrays(input);

    let totalOverlappingPairs = 0;
    listOfPairs.forEach(
      pair => {
        if ((pair[0] >= pair[2] && pair[0] <= pair[3]) || (pair[1] >= pair[2] && pair[1] <= pair[3]) ||
        (pair[0] <= pair[2] && pair[1] >= pair[3]) || (pair[2] <= pair[0] && pair[3] >= pair[1]))
          totalOverlappingPairs++;
      }
    );

    return totalOverlappingPairs;
  }

  solvePuzzle(inputFile, solve);
})

// helpers
function getListOfPairArrays(input) {
  const listOfPairStrings = input.split('\r\n');
  const listOfPairs = listOfPairStrings.map(
    pairs => pairs.split(/[-,]/).map(num => parseInt(num))
  );
  return listOfPairs;
}