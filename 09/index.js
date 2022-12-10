// template function
function solvePuzzle(inputFile, callback) {
  const fr = new FileReader();
  fr.addEventListener('load', () => {
    const solution = callback( fr.result.split('\r\n') );

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

  function solve(stepArr) {
    const tailHistory = getTailPosHistory(stepArr, 2);
    return tailHistory.length;
  }

  solvePuzzle(inputFile, solve);
});

// puzzle 2
document.getElementById("puzzle-2").addEventListener("click", e => {
  const inputFile = fileInput.files[0];

  function solve(stepArr) {
    const tailHistory = getTailPosHistory(stepArr, 10);
    return tailHistory.length;
  }

  solvePuzzle(inputFile, solve);
})

// helpers
const DIRS = {
  U: [0, 1],
  D: [0, -1],
  R: [1, 0],
  L: [-1, 0]
}

async function getTailPosHistory(steps, ropeLength) {
  let rope = [];
  for (let i = 0; i < ropeLength; i++) {
    rope.push({
      x: 0, y: 0
    });
  }
  const historyArr = [];

  for (let k = 0; k < steps.length; k++) {
    const step = steps[k];
    const [ hor, ver ] = DIRS[step[0]];
    const stepAmt = step.slice(2);
    for (let i = 0; i < stepAmt; i++) {
      rope[0].x += hor;
      rope[0].y += ver;
      rope = moveTail(rope);
      const tailStr = `${rope[rope.length - 1].x}-${rope[rope.length - 1].y}`;
      printRope(rope);
      if (!historyArr.includes(tailStr)) {
        historyArr.push(tailStr);
      }
      await new Promise(resolve => {
        setTimeout(() => resolve(1), 100);
      });
    }
  }

  return historyArr;
}

function moveTail(rope) {
  for (let i = 1; i < rope.length; i++) {
    h = rope[i - 1];
    t = rope[i];
    if (Math.abs(t.x - h.x) > 1) {
      const dir = (h.x - t.x) / Math.abs(h.x - t.x);
      t.x += dir;
      if (t.y != h.y) {
        const dir = (h.y - t.y) / Math.abs(h.y - t.y);
        t.y += dir;
      }
    } 
    if (Math.abs(t.y - h.y) > 1) {
      const dir = (h.y - t.y) / Math.abs(h.y - t.y);
      t.y += dir;
      if (t.x != h.x) {
        const dir = (h.x - t.x) / Math.abs(h.x - t.x);
        t.x += dir;
      }
    }
    rope[i - 1] = h;
    rope[i] = t;
  }

  return rope;
}

function printRope(rope) {
  const ropeX = rope.map(knot => knot.x)
  const ropeY = rope.map(knot => knot.y)
  const x = {
    min: Math.min(...ropeX),
    max: Math.max(...ropeX)
  }
  const y = {
    min: Math.min(...ropeY),
    max: Math.max(...ropeY)
  }
  let ropeStr = "";
  for (let i = -25; i < 25; i++) {
    for (let j = -25; j < 25; j++) {
      let hasRope = false;
      rope.forEach(
        knot => {
          if (knot.x === j && knot.y === i) {
            hasRope = true;
          }
        }
      );
      if (hasRope) {
        ropeStr += 'X';
      } else {
        ropeStr += '.';
      }
    }
    ropeStr += '\n';
  }
  console.log(ropeStr);
}