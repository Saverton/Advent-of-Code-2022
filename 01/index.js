// template function
function solvePuzzle(inputFile, callback) {
  const fr = new FileReader();
  fr.addEventListener('load', () => {
    const solution = callback(fr.result.split('\r\n\r\n'));

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

  function getMaxCals(arrayOfCalorieGroups) {
    let maxCals = 0;

    arrayOfCalorieGroups.forEach(calorieGroup => {
      const totalCals = getTotalCaloriesInGroup(calorieGroup);
      if (totalCals > maxCals) {
        maxCals = totalCals;
      }
    });

    return maxCals;
  }

  solvePuzzle(inputFile, getMaxCals);
});

// puzzle 2
document.getElementById("puzzle-2").addEventListener("click", e => {
  const inputFile = fileInput.files[0];

  function getTopThreeTotal(arrayOfCalorieGroups) {
    let topThree = [0, 0, 0];

    arrayOfCalorieGroups.forEach(calorieGroup => {
      const totalCals = getTotalCaloriesInGroup(calorieGroup);
      // console.log(totalCals);
      if (totalCals > Math.min(...topThree)) {
        topThree.push(totalCals);
      }
      while (topThree.length > 3) {
        const minIndex = topThree.indexOf(Math.min(...topThree));
        topThree = topThree.filter((item, index) => index !== minIndex);
      }
    });

    const sum = topThree.reduce((sum, item) => sum + item, 0);

    return sum;
  }

  solvePuzzle(inputFile, getTopThreeTotal);
})

function getTotalCaloriesInGroup(calorieGroup) {
  const calorieArray = calorieGroup.split(/\s/).filter(c => c.length > 0);
  return calorieArray.reduce((sum, cals) => sum + parseInt(cals), 0);
}