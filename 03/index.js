// template function
function solvePuzzle(inputFile, callback) {
  const fr = new FileReader();
  fr.addEventListener('load', () => {
    const inputList = fr.result.split('\r\n');
    const solution = callback( inputList );

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

  function solve(rucksackList) {
    const allSharedItems = rucksackList.map(
      rucksack => getSharedItems(rucksack)
    );

    return allSharedItems.reduce((sum, element) => {
      // console.log(element);
      return sum + element.reduce((sum, subElement) => {
        // console.log(subElement);
        return sum + getPriority(subElement)
      }, 0)
    }, 0);
  }

  solvePuzzle(inputFile, solve);
});

// puzzle 2
document.getElementById("puzzle-2").addEventListener("click", e => {
  const inputFile = fileInput.files[0];

  function solve(rucksackList) {
    const elfGroups = getElfGroups(rucksackList);
    const badges = elfGroups.map(getBadge);
    return badges.reduce((sum, badge) => sum + getPriority(badge), 0);
  }

  solvePuzzle(inputFile, solve);
})

// helpers
function getSharedItems(rucksack) {
  const sharedItems = [];
  const firstCompartment = rucksack.substring(0, rucksack.length / 2);
  const secondCompartment = rucksack.substring(rucksack.length / 2);
  const firstCompartmentInventory = [];

  for (let i = 0; i < firstCompartment.length; i++) {
    const item = firstCompartment[i];
    if (!firstCompartmentInventory.includes(item)) {
      firstCompartmentInventory.push(item);
    }
  }

  for (let i = 0; i < secondCompartment.length; i++) {
    const item = secondCompartment[i];
    if (firstCompartmentInventory.includes(item) && !sharedItems.includes(item)) {
      sharedItems.push(item);
    }
  }

  return sharedItems;
  // console.log("firstCompartment: " + firstCompartment, "secondCompartment: " + secondCompartment);
}

function getPriority(item) {
  let priorityValue = 0;
  if (item >= 'A' && item <= 'Z') {
    priorityValue = item.charCodeAt(0) - 'A'.charCodeAt(0) + 27;
  } else {
    priorityValue = item.charCodeAt(0) - 'a'.charCodeAt(0) + 1;
  }
  console.log(item, '=>', priorityValue);
  return priorityValue;
}

function getElfGroups(rucksacks) {
  const elfGroups = [];
  for (let i = 0; i < rucksacks.length; i += 3) {
    elfGroups.push(rucksacks.slice(i, i + 3));
  }
  return elfGroups;
}

function getBadge(elfGroup) {
  const elfInventories = [[], [], []];
  const inventoryLengths = elfGroup.map(elfInventory => elfInventory.length);

  for (let i = 0; i < Math.max(...inventoryLengths); i++) {
    elfGroup.forEach(
      (elfInventory, index) => {
        if (i < elfInventory.length) {
          const item = elfInventory[i];
          if (!elfInventories[index].includes(item)) {
            elfInventories[index].push(item);
          }
        }
      }
    )
  }

  const badge = elfInventories[0].filter(
    item => {
      let shared = true;
      for (let i = 1; i < elfInventories.length; i++) {
        if (!elfInventories[i].includes(item)) {
          shared = false;
        }
      }
      return shared;
    }
  )[0];

  console.log(badge);

  return badge;
}