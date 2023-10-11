
// Get the query parameters from the URL
function getQueryParams() {
  var params = {};
  window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(str, key, value) {
  params[key] = value;
  });
  return params;
}

// Global variables
var queryParams = getQueryParams();
var gridSize = parseInt(queryParams.gridSize);
var gameGridElement = document.getElementById("gameGrid");
var gameGrid, score, gameOver;
var lifeLine = 1; // Number of life lines for the player
var lifelineUsed = false; // Variable to track if the lifeline has been used
var players = []; // Array to store player names and scores
var clickedCells = [];
var ballCount = 0; //number of clicks on the cells

// Get the modal element
var modal = document.getElementById("gameOverModal");

// Get the close button element
var closeBtn = document.getElementsByClassName("close")[0];

//Retrieve player names from local storage
var playerNames = JSON.parse(localStorage.getItem("playerNames"));

// Initialize the game grid
function initializeGrid() {
  var grid = [];
  var scores = [0, 1, 2, 3, 4, 6]; // Possible scores for the cells
  var powerUpProbability = 0.1; // Probability of a cell having a power-up

  for (var row = 0; row < gridSize; row++) {
    var rowData = [];
      for (var col = 0; col < gridSize; col++) {
        var cell = {
          score: scores[Math.floor(Math.random() * scores.length)],
          clicked: false,
          fielder: false,
          powerUp: false
        };

        // Check if the cell have a power-up
        if (!cell.fielder && Math.random() < powerUpProbability) {
        if (cell.score !== 0){
        cell.powerUp = true; //4X times the score for power-up cell
      }
    }
      rowData.push(cell);
    }
    grid.push(rowData);
  }
  return grid;
}

// Function to display the modal
function displayGameOverModal(score, numBalls) {
  // Set the total score and number of balls in the modal
  document.getElementById("totalScore").textContent = score;
  document.getElementById("numBalls").textContent = numBalls;
  // Display the modal
  modal.style.display = "block";
  
  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}

//Update the number of balls
function updateBallCount() {
  var ballCountElement = document.getElementById("ballCount");
  ballCountElement.innerText = ballCount.toString();
}

// Function to display the pop-up modal
function displayPowerUpModal() {
  
  var modal = document.getElementById("popupModal");
  modal.style.display = "block";

  window.onclick = function(event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  };
}


// Function to place fielders randomly on the grid
function placeFielders() {
  var totalCells = gridSize * gridSize;
  var fieldersCount = 11; // Number of fielders to place

  while (fieldersCount > 0) {
    var randomRow = Math.floor(Math.random() * gridSize);
    var randomCol = Math.floor(Math.random() * gridSize);

    if (!gameGrid[randomRow][randomCol].fielder) {
      gameGrid[randomRow][randomCol].fielder = true;
      fieldersCount--;
    }
  }
}

// Function to display "Congratulations" message with player's name and score
function displayCongratulations(playerName) {
  var scoreElement = document.getElementById("score");
  scoreElement.innerText = "Congratulations, " + "! You've clicked all non-fielder cells. Your final score is: " + score;
}

// Function to handle cell click event
function handleCellClick(row, col) {
  if (gameOver) return; // Ignore clicks after game over

  var cell = gameGrid[row][col];
  var cellElement = gameGridElement.rows[row].cells[col];
  
  if(cell.clicked || clickedCells.includes(cell)){
    return;
  }
  if (!cell.clicked) {
    cell.clicked = true;

    if (cell.fielder) {
      
      // Display a confirmation message to ask if the player wants a lifeline
      var confirmLifeline = confirm("Fielder caught you 🥺." +"\n" + "Use a lifeline❤️?" + "\n" + "Remember your score will be decreased by 10.");

      if (confirmLifeline) {
        if (!lifelineUsed && score >= 10) { 
          // Check if the lifeline has not been used and player has enough score
          lifelineUsed = true; // Set the lifeline as used
          // Decrement the score by 10 if the player chooses the lifeline
          score -= 10;
          cellElement.classList.add("fielder-clicked"); // Apply red color for fielder click
          displayScore();
          // If player already used the lifeline
        } else {
          if(lifelineUsed) {
            alert("Sorry, you have already used the lifeline 😔.");
          }
          // Player does not have enough score for a lifeline
          else {
          alert("Sorry, you don't have enough score for a lifeline 😥.");
        }
        gameOver = true;
        cellElement.classList.add("fielder-clicked"); // Apply red color for fielder click
        displayFinalScore();
        displayGameOverModal(score,ballCount+1);        
      }      
      } else {
        // Player chooses not to use a lifeline
      gameOver = true;
      cellElement.classList.add("fielder-clicked"); // Apply red color for fielder click
      displayFinalScore();
      displayGameOverModal(score,ballCount+1);
    }
  }
    else if (cell.powerUp) {
      //If the cell contains a power-up
      var popupmessage = document.getElementById("powerscore");
      score += 4*cell.score;
      cellElement = gameGridElement.rows[row].cells[col];
      cellElement.innerText = '⭐';
      cellElement.classList.add("clicked");
      displayScore();
      popupmessage.textContent = `Heyy !! You got a power-up of ${cell.score} * 4 times of runs.`
      displayPowerUpModal();
    }
    else {
      score += cell.score;
      cellElement = gameGridElement.rows[row].cells[col];
      cellElement.innerText = cell.score;
      cellElement.classList.add("clicked");
      displayScore();


      // Check if all non-fielder cells are clicked
      var allNonFielderClicked = true;
      for (var i = 0; i < gameGrid.length; i++) {
        for (var j = 0; j < gameGrid[i].length; j++) {
          var gridCell = gameGrid[i][j];
          if (!gridCell.fielder && !gridCell.clicked) {
            allNonFielderClicked = false;
            break;
    }
  }
}
      // Display "Congratulations" with score if all non-fielder cells are clicked
      if (allNonFielderClicked) {
      displayCongratulations();
      gameOver = true;
      }
    }
  }
  ballCount++;
  updateBallCount();
}

// Function to display the current score
function displayScore() {
  var scoreElement = document.getElementById("score");
  scoreElement.innerText = "Score: " + score;
}

// Function to display the final score
function displayFinalScore() {
  var scoreElement = document.getElementById("score");
  scoreElement.innerText = "Game Over! Final Score: " + score;
  
}

// Function to reveal fielders temporarily
function revealFielders() {
  const myButton=document.getElementById("reveal");
  for (var row = 0; row < gridSize; row++) {
    for (var col = 0; col < gridSize; col++) {
      var cell = gameGrid[row][col];
      var cellElement = gameGridElement.rows[row].cells[col];

      if (cell.fielder) {
        if(score >= 10){
        if(ballCount >= 7) {
        cellElement.classList.add("fielder-revealed"); // Apply special styling for revealed fielders
        }
       }
      }
    }
  }
  if(score >= 10){
  if(ballCount >= 7) {
  score = score - 5
  displayScore();
  }
  }
  setTimeout(function() {
    for (var row = 0; row < gridSize; row++) {
      for (var col = 0; col < gridSize; col++) {
        var cellElement = gameGridElement.rows[row].cells[col];
        cellElement.classList.remove("fielder-revealed"); // Remove the special styling for revealed fielders
      }
    }
  }, 1000);
  myButton.disabled=true;
}

// Function to reset the game
function resetGame() {
  gridSize = parseInt(queryParams.gridSize);
  gameGridElement.innerHTML = ""; // Clear the existing grid
  gameGrid = initializeGrid();
  placeFielders();
  score = 0;
  gameOver = false;
  displayScore();

  // Generate the new game grid
  for (var row = 0; row < gridSize; row++) {
    var tr = document.createElement("tr");

    for (var col = 0; col < gridSize; col++) {
      var td = document.createElement("td");
      td.setAttribute("class", "cell");
      td.setAttribute("data-row", row);
      td.setAttribute("data-col", col);

      var cell = gameGrid[row][col];

    // Apply different styles for power-up cells
    if (cell.powerUp) {
      td.classList.add("power-up-cell");
    }
    
      td.addEventListener("click", function() {
        var row = parseInt(this.getAttribute("data-row"));
        var col = parseInt(this.getAttribute("data-col"));
        handleCellClick(row, col);
      });

      tr.appendChild(td);
    }

    gameGridElement.appendChild(tr);
  }
  const myButton=document.getElementById("reveal");
  myButton.disabled = false;
  lifelineUsed = false;
  ballCount = 0;
  updateBallCount();
}

// Event listener for the reset button
var resetButton = document.getElementById("reset");
resetButton.addEventListener("click", resetGame);

// Initialize the game
resetGame();
