// template function
function solvePuzzle(inputFile, callback) {
  const fr = new FileReader();
  fr.addEventListener('load', () => {
    const treeArr = getTreeGridArr( fr.result );
    const solution = callback( treeArr );

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

  function solve( treeArr ) {
    const numOfVisibleTrees = countVisibleTrees(treeArr);

    return numOfVisibleTrees;
  }

  solvePuzzle(inputFile, solve);
});

// puzzle 2
document.getElementById("puzzle-2").addEventListener("click", e => {
  const inputFile = fileInput.files[0];

  function solve( treeArr) {
    scenicScoreArray = treeArr.map(
      (row, rowIdx) => {
        return row.map((_, colIdx) => {
          return getScenicScore(treeArr, colIdx, rowIdx);
        })
      }
    );

    console.log(scenicScoreArray);

    const maxScenicScore = Math.max(...scenicScoreArray.map(row => Math.max(...row)));
    
    return maxScenicScore;
  }

  solvePuzzle(inputFile, solve);
})

// consts
const DIRS = [
  {x: 1, y: 0},
  {x: -1, y: 0},
  {x: 0, y: 1},
  {x: 0, y: -1}
];

// helpers
function getTreeGridArr(string) {
  return string.split('\r\n').map(
    row => row.split("").map(
      tree => parseInt(tree)
    )
  );
}

function countVisibleTrees(treeArr) {
  let visibleCount = 0;

  treeArr.forEach((row, rowIdx) => {
    row.forEach((_, colIdx) => visibleCount += (isVisible(treeArr, rowIdx, colIdx)) ? 1 : 0); 
  });

  return visibleCount;
}

function isVisible(treeArr, row, col) {
  if (isOnEdge(treeArr, row, col)) {
    return true;
  } else {
    let isVisible = false;
    const height = treeArr[row][col];

    for (let i = 0; i < DIRS.length && !isVisible; i++) {
      let [ currentRow, currentCol ] = [ row, col ];

      while (true) {
        currentRow += DIRS[i].y;
        currentCol += DIRS[i].x;
        const thisHeight = treeArr[currentRow][currentCol];
        if (thisHeight >= height) {
          break;
        } else if (isOnEdge(treeArr, currentRow, currentCol)) {
          isVisible = true;
          break;
        }
      }
    }

    return isVisible;
  }
}

function isOnEdge(treeArr, row, col) {
  return (row === 0 || col === 0 || row === treeArr.length - 1 || col === treeArr[0].length - 1);
}

function getScenicScore(treeArr, row, col) {
  let scenicScore = 1;
  const height = treeArr[row][col];

  for (let i = 0; i < DIRS.length; i++) {
    let [ currentRow, currentCol ] = [ row, col ];
    let treesVisible = 0;

    while (true) {
      currentRow += DIRS[i].y;
      currentCol += DIRS[i].x;
      if (currentRow < 0 || currentCol < 0 || currentRow >= treeArr.length || currentCol >= treeArr[0].length) {
        break;
      }
      treesVisible++;
      if (treeArr[currentRow][currentCol] >= height || isOnEdge(treeArr, currentRow, currentCol)) {
        break;
      }
    }

    scenicScore *= treesVisible;
  }

  return scenicScore;
}