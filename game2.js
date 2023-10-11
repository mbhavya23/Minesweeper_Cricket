var gameGridSize;
var currentPlayerIndex = 0;
var players = [];
var playerColors = ['lightgreen', 'lightblue']; // Define an array of colors for players

//Function to start game
function startGame() {
  var playerNames = prompt("Enter 2 players names :").split(",");
  players = playerNames.map(function(name) {
    return {
      name: name.trim(),
      score: 0,
      hasClickedFielder: false // To track if the player has clicked on a fielder
    };
  });

  var gridSize = parseInt(prompt("Enter grid size:"));
  if (isNaN(gridSize) || gridSize < 5 || gridSize > 11) {
    alert("Invalid grid size. Defaulting to 6x6 grid.");
    gridSize = 6;
  }

  gameGridSize = gridSize;

  generateGameGrid();
  updateScoreboard();
}

// Function to generate random positions for fielders
function generateRandomFielderPositions() {
  var totalBlocks = gameGridSize * gameGridSize;
  var fielderPositions = [];

  while (fielderPositions.length < 11) { // Generate 11 fielder positions
    var randomIndex = Math.floor(Math.random() * totalBlocks);  // Generate a random index within the total number of blocks
    var position = calculatePosition(randomIndex);  // Calculate the position (row, col) based on the index

    if (!fielderPositions.includes(position)) {
      fielderPositions.push(position);
    }
  }

  return fielderPositions;
}

// Function to calculate the position (row, col) based on an index
function calculatePosition(index) {
  var row = Math.floor(index / gameGridSize);
  var col = index % gameGridSize;
  return `${row},${col}`;
}

// Function to generate the game grid on the web page
function generateGameGrid() {
  var gameGrid = document.getElementById('game-grid');
  gameGrid.innerHTML = '';  // Clear the game grid contents
  gameGrid.style.gridTemplateColumns = `repeat(${gameGridSize}, 0fr)`;

  var fielderPositions = generateRandomFielderPositions(); // Generate random positions for fielders
  var powerUpPositions = generateRandomPowerUpPositions(); // Generate random positions for power-ups

  for (var i = 0; i < gameGridSize; i++) {
    for (var j = 0; j < gameGridSize; j++) {
      var block = document.createElement('div');
      block.onclick = function() {
        handleClick(this); // event handler to handle clicks on the block
      };
      block.classList.add('block');
      var position = `${i},${j}`;

      if (fielderPositions.includes(position)) {
        block.classList.add('fielder');
      } else {
        var score = getRandomScore();

        if (powerUpPositions.includes(position)) {
          score *= 4; // 4X times score if there's a power-up
          block.classList.add('power-up');
        }
        block.setAttribute('data-score', score);
      }
      gameGrid.appendChild(block);
    }
  }
}

// Function to generate random positions for power-ups
function generateRandomPowerUpPositions() {
  var totalBlocks = gameGridSize * gameGridSize;
  var powerUpPositions = [];

  while (powerUpPositions.length < 5) { // Generate 5 power-up positions
    var randomIndex = Math.floor(Math.random() * totalBlocks);
    var position = calculatePosition(randomIndex);

    if (!powerUpPositions.includes(position)) {
      powerUpPositions.push(position);
    }
  }
  return powerUpPositions;
}

// Function to get a random score
function getRandomScore() {
  var scores = [0, 1, 2, 3, 4, 6];
  var randomIndex = Math.floor(Math.random() * scores.length);
  return scores[randomIndex];
}

// Function to handle clicks on the blocks in the game grid
function handleClick(block) {
  if (block.classList.contains('clicked')) {
    return;  // If the block is already clicked, do nothing
  }

  if (gameIsOver()) {
    return; // If the game is already over, do nothing
  }

  block.classList.add('clicked');

  if (block.classList.contains('fielder')) {
    block.style.backgroundColor = 'red';
    players[currentPlayerIndex].hasClickedFielder = true;

    if (gameIsOver()) {
      endGame();
      disableBlockClicks();
    } else {
      currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
    }
  } else {
    const randomScore = parseInt(block.getAttribute('data-score'));
    block.style.backgroundColor = playerColors[currentPlayerIndex];
    block.textContent = randomScore;
    players[currentPlayerIndex].score += randomScore;

    updateScoreboard();
    currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
  }
}

function gameIsOver() {
  return players.filter(function(player) {
    return !player.hasClickedFielder;
  }).length === 1;
}

//Function to end game
function endGame() {
  var scoreMessage = players.map(function(player) {
    return player.name + ": " + player.score;
  }).join("\n");

  var winner = players.find(function(player) {
    return !player.hasClickedFielder;
  });

  var notwinner = players.find(function(player){
    return player.hasClickedFielder;
  });

  alert("Game Over!\n\nFinal Scores:\n" + scoreMessage + "\n\n" + "❗" + notwinner.name + " is caught by fielder ❗" + "\n\n🌟Winner🌟: " + winner.name + "\n\nCongratulations " + winner.name + "!! You have won the game 😊");
 document.getElementById("startGame").disabled = true;
}

function disableBlockClicks() {
  var blocks = document.getElementsByClassName('block');
  for (var i = 0; i < blocks.length; i++) {
    blocks[i].onclick = null; // Remove the onclick event handler to disable block clicks
  }
}

// Update score board
function updateScoreboard() {
  var scoreboard = document.getElementById('scoreboard');
  scoreboard.innerHTML = '';

  players.forEach(function(player) {
    var playerScore = document.createElement('div');
    playerScore.textContent = player.name + ": " + player.score;
    scoreboard.appendChild(playerScore);
  });
}
