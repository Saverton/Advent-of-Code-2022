// Star 1 Pseudocode
// 1. Create a large nested object representing the entire file heirarchy. This must store the names of each folder/file, the type of the item (directory or file) and the size of each.
// 2. Recursively parse the object to create a list of all directories and their size.
// 3. sum all directories with a size <= 1000000, this is the returned solution.

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

  function solve( commands ) {
    const allDirSizes = getArrayOfDirSizes(commands);

    const solution = allDirSizes.reduce((sum, element) => sum + ((element <= 100000) ? element : 0), 0);

    return solution;
  }

  solvePuzzle(inputFile, solve);
});

// puzzle 2
document.getElementById("puzzle-2").addEventListener("click", e => {
  const inputFile = fileInput.files[0];

  function solve( commands ) {
    const allDirSizes = getArrayOfDirSizes(commands);
    const neededSpace = 30000000 - (70000000 - Math.max(...allDirSizes));

    const solution = getSmallestElementGreaterThan(allDirSizes, neededSpace);

    return solution;
  }

  solvePuzzle(inputFile, solve);
})

// helpers
function getArrayOfDirSizes(commands) {
  const commandArr = commands.split("\r\n");
  const dirObj = createHeirarchyObject(commandArr);
  const allDirSizes = [];
  getDirSizes(dirObj, allDirSizes);

  return allDirSizes;
}

function createHeirarchyObject(inputArr) {
  const dirObj = {
    "/": {
      type: "dir",
    }
  };
  let currentPath = '/';

  inputArr.slice(1, inputArr.length).forEach(
    command => {
      // console.log(command);
      if (command[0] === '$') {
        const commandType = command.substring(2, 4);
        if (commandType === 'cd') {
          // manipulate the current path
          if (command.substring(5, 7) === '..') {
            currentPath = currentPath.split('/').slice(0, -2).join('/') + '/';
          } else {
            currentPath += `${command.substring(5)}/`
          }
          // console.log({ currentPath });
        } else {
          // ls command, do nothing and continue to next line.
        }
      } else {
        console.log({ currentPath });
        const workingDir = getWorkingDirectory(dirObj, currentPath);
        if (command.substring(0, 3) === 'dir') {
          // create directory in current directory
          workingDir[command.substring(4)] = {
            type: 'dir',
          };
        } else {
          // create file in current directory
          workingDir[command.substring(command.indexOf(" ") + 1)] = {
            type: 'file',
            size: parseInt(command.substring(0, command.indexOf(" "))),
          }
        }
      }
    }
  );

  return dirObj;
}

function getWorkingDirectory(dirObj, path) {
  let workingDirectory = dirObj['/'];
  const pathSteps = path.split('/');
  // console.log('getWorkingDirectory');

  pathSteps.forEach(
    step => {
      if (step.length > 0) {
        workingDirectory = workingDirectory[step];
      }
      // console.log({ workingDirectory });
    }
  );

  // console.log('return working directory');
  return workingDirectory;
}

function getDirSizes(dirObj, allDirSizes) {
  let size = 0;

  if (dirObj.type === 'file') {
    size = dirObj.size;
  } else {
    const children = Object.keys(dirObj);
    children.forEach(
      child => {
        if (child !== 'type') {
          size += getDirSizes(dirObj[child], allDirSizes);
        }
      }
    );
    allDirSizes.push(size);
  }

  return size;
}

function getSmallestElementGreaterThan(arr, num) {
  let result = Math.max(...arr);
  arr.sort((a, b) => a - b);
  console.log({ arr });
  console.log({ num });

  
  arr.forEach(
    element => {
      if (element >= num && element < result) {
        result = element;
        console.log({ result });
      }
    }
  );

  return result;
}