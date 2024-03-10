const button = document.querySelector("#start");
const gameContainer = document.getElementById("game");

let matches = 0;

let deck = [];
let card1 = null;
let card2 = null;
let noclicking = false;
let finished = false;
let score = 0;
let flipped = 0;

button.addEventListener("click", function(event) {
  event.preventDefault();

  matches = parseInt(document.querySelector("#difficulty").value);

  if(matches < 1) {
    alert("Please enter a number greater than 0");
  }

  deck = [];

  for(let i = 0; i < matches; i++) {
    const randomColor = Math.floor(Math.random()*16777215).toString(16);
    deck.push(randomColor);
    deck.push(randomColor);
  }

  deck = shuffle(deck);

  noclicking = false;
  finished = false;
  score = 0;
  flipped = 0;

  createDivsForColors(deck);
});

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

function createDivsForColors(colorArray) {
gameContainer.innerHTML = "";

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


function handleCardClick(event) {
  const card = event.target;

  if(noclicking) return;
  // if card is flipped, do nothing
  if(card.classList.contains("flipped")) return;

  score++;
  document.querySelector("#score").innerHTML = `Score: ${score}`;

  card.style.backgroundColor = `#${card.classList[0]}`;
  card.innerHTML = `#${card.classList[0]}`;

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
        card1.innerHTML = "";
        card2.innerHTML = "";
        card1.classList.remove("flipped");
        card2.classList.remove("flipped");
        card1 = null;
        card2 = null;

        noclicking = false;
      }, 1000);
    }
  }

  if(flipped === deck.length) {
    let bestScore = localStorage.getItem("bestScore");
    if(bestScore === null) {
      bestScore = score;
    } else {
      bestScore = Math.min(parseInt(bestScore), score);
    }

    localStorage.setItem("bestScore", bestScore);

    alert(`WINNER! Score: ${score}. Best Score: ${bestScore}`);
  }
}