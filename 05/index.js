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
    return getCrateRearrangementCode( carryOutOperation9000, input );
  }

  solvePuzzle(inputFile, solve);
});

// puzzle 2
document.getElementById("puzzle-2").addEventListener("click", e => {
  const inputFile = fileInput.files[0];

  function solve(input) {
    return getCrateRearrangementCode( carryOutOperation9001, input );
  }

  solvePuzzle(inputFile, solve);
})

// helpers
function getCrateRearrangementCode( craneModelCallback, input ) {
  const cratesString = input.substring(0, input.indexOf(" 1"));
  const operationsString = input.substring(input.indexOf('m'));
  // console.log(cratesString);
  console.log(operationsString);
  const crates = toCratesArray(cratesString);
  const operations = getOperations(operationsString);

  operations.forEach(operation => {
    craneModelCallback(crates, operation);
  });

  return getTopCrateStr(crates);
}

function toCratesArray(input) {
  const charArray = toCratesCharArray(input);
  const numOfStacks = charArray[0].length;
  const cratesArray = [];

  for (let i = 0; i < numOfStacks; i++) {
    cratesArray.push([]);
  }

  // console.table(charArray);

  for (let rowIndex = charArray.length - 1; rowIndex >= 0; rowIndex--) {
    for (let stackIndex = 0; stackIndex < numOfStacks; stackIndex++) {
      const crateStr = charArray[rowIndex][stackIndex]
      if ((/[A-Z]/).test(crateStr)) {
        // console.log(crateStr);
        cratesArray[stackIndex].push(crateStr[1]);
      }
    }
  }

  // console.table(cratesArray);

  return cratesArray;
}

function toCratesCharArray(input) {
  const cratesCharArray = [];

  while(hasNextLine(input)) {
    const lineArr = [];
    const lineBreak = input.indexOf('\r\n');
    const line = input.substring(0, lineBreak);
    input = input.substring(lineBreak + 2);
    // console.log(line);

    for (let i = 0; i < line.length; i += 4) {
      const crate = line.substring(i, Math.min(i + 3, line.length));
      // console.log(crate);
      lineArr.push(crate);
    }
    // console.log(lineArr);
    cratesCharArray.push(lineArr);
  }

  // console.table(cratesCharArray);

  return cratesCharArray;
}

function hasNextLine(input) {
  return input.indexOf('\n') !== -1;
}

function getOperations(input) {
  input = input + "\r\n";
  const operations = [];
  let hasNextLine = true;
  let lineStartIndex = 0

  while(hasNextLine) {
    const line = input.substring(lineStartIndex, input.indexOf('\r\n', lineStartIndex));
    lineStartIndex = input.indexOf('m', input.indexOf('\r\n', lineStartIndex));
    // console.log(line);
    const operationObj = {
      howMany: parseInt(line.substring(5, line.indexOf('f'))),
      fromStack: parseInt(line.substring(line.indexOf('om') + 2, line.indexOf('t'))),
      toStack: parseInt(line.substring(line.indexOf('to') + 2)),
    };
    operations.push(operationObj);
    // console.log(operationObj);
    // console.log(lineStartIndex);
    if (lineStartIndex === -1) {
      hasNextLine = false;
    }
  }

  return operations;
}

function carryOutOperation9000(crates, operation) {
  const { howMany, fromStack, toStack } = operation;

  for (let i = 0; i < howMany; i++) {
    crates[toStack - 1].push(crates[fromStack - 1].pop());
  }
}

function carryOutOperation9001(crates, operation) {
  const { howMany, fromStack, toStack } = operation;
  const carrying = [];

  for (let i = 0; i < howMany; i++) {
    carrying.push(crates[fromStack - 1].pop());
  }

  for (let i = 0; i < howMany; i++) {
    crates[toStack - 1].push(carrying.pop());
  }
}

function getTopCrateStr(crateStacks) {
  return crateStacks.map(crateStack => crateStack.pop()).join('');
}