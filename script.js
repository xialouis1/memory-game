const gameContainer = document.getElementById("game");

const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

// here is a helper function to shuffle an array
// it returns the same array with values shuffled
// it is based on an algorithm called Fisher Yates if you want ot research more
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}

let shuffledColors = shuffle(COLORS);

// this function loops over the array of colors
// it creates a new div and gives it a class with the value of the color
// it also adds an event listener for a click for each card
function createDivsForColors(colorArray) {
  for (let color of colorArray) {
    // create a new div
    const newDiv = document.createElement("div");

    // give it a class attribute for the value we are looping over
    newDiv.classList.add(color);

    // call a function handleCardClick when a div is clicked on
    newDiv.addEventListener("click", handleCardClick);

    // append the div to the element with an id of game
    gameContainer.append(newDiv);
  }
}

let card1 = null;
let card2 = null;
let noclicking = false;
let finished = false;
let score = 0;
let flipped = 0;
function handleCardClick(event) {
  const card = event.target;

  if(noclicking) return;
  // if card is flipped, do nothing
  if(card.classList.contains("flipped")) return;

  score++;
  document.querySelector("#score").innerHTML = `Score: ${score}`;

  card.style.backgroundColor = card.classList[0];

  // !false || !false
  // if less than two cards are flipped
  if(!card1 || !card2) {
    card.classList.add("flipped");
    // set one card to selection
    card1 = card1 || card;
    // if same card is selected, set other card to nothing
    // if different card is selected, set other card to selection
    card2 = (card === card1) ? null : card;
  }

  // if two cards are flipped
  if(card1 && card2) {
    noclicking = true;

    if(card1.className == card2.className) {
      card1.removeEventListener("click", handleCardClick);
      card2.removeEventListener("click", handleCardClick);
      card1 = null;
      card2 = null;

      flipped += 2;

      noclicking = false;
    } else {
      setTimeout(function() {
        card1.style.backgroundColor = "";
        card2.style.backgroundColor = "";
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1 = null;
        card2 = null;

        noclicking = false;
      }, 1000);
    }
  }

  if(flipped === COLORS.length) {
    let bestScore = localStorage.getItem("bestScore");
    if(bestScore === null) {
      bestScore = score;
    } else {
      bestScore = Math.min(parseInt(bestScore), score);
    }

    localStorage.setItem("bestScore", bestScore);

    alert(`WINNER! Score: ${score}. Best Score: ${bestScore}`);

    const div = document.querySelector("#button");
    const restart = document.createElement("button");
    restart.innerHTML = "Restart";
    restart.addEventListener("click", function() {
      location.reload();
    });

    div.appendChild(restart);
  }
}

const button = document.querySelector("#start");
button.addEventListener("click", function() {
  createDivsForColors(shuffledColors);
  button.remove();
});