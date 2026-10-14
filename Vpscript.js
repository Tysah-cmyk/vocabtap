const words = [
  { emoji: "🍎", label: "Apple", speech: "I want an apple", category: "food" },
  { emoji: "💧", label: "Water", speech: "I want water", category: "needs" },
  { emoji: "🙋", label: "Help me", speech: "help me", category: "needs" },
  { emoji: "🏠", label: "Home", speech: "I want to go home", category: "needs" },
  { emoji: "🚽", label: "Bathroom", speech: "I need the bathroom", category: "needs" },
  { emoji: "😊", label: "Happy", speech: "I feel happy", category: "feelings" },
  { emoji: "😢", label: "Sad", speech: "I feel sad", category: "feelings" },
  { emoji: "🍕", label: "Pizza", speech: "I want pizza", category: "food" },
  { emoji: "👨", label: "Dad", speech: "Dad", category: "family" },
  { emoji: "👩", label: "Mom", speech: "Mom", category: "family" },
  { emoji: "🏖️", label: "Beach", speech: "I want to go to the beach", category: "places" },
  { emoji: "🏞️", label: "Park", speech: "I want to go to the park", category: "places" },
  { emoji: "⚽", label: "Soccer", speech: "I want to play soccer", category: "sports" },
  { emoji: "🎨", label: "Art", speech: "I like drawing", category: "activities" },
  { emoji: "🎵", label: "Music", speech: "I like music", category: "music" },
  { emoji: "1️⃣", label: "One", speech: "o-n-e 1", category: "numbers" },
  { emoji: "2️⃣", label: "Two", speech: "t-w-o 2", category: "numbers" },
  { emoji: "3️⃣", label: "Three", speech: "t-h-r-e-e 3", category: "numbers" },
  { emoji: "4️⃣", label: "Four", speech: "f-o-u-r 4", category: "numbers" },
  { emoji: "5️⃣", label: "Five", speech: "f-i-v-e 5", category: "numbers" },
  { emoji: "🐶", label: "Dog", speech: "I like dogs", category: "animals" },
  { emoji: "🐱", label: "Cat", speech: "I like cats", category: "animals" },
  { emoji: "🧩", label: "Play", speech: "It's play time", category: "time" },
  { emoji: "🕒", label: "Go", speech: "It's time to go", category: "time" }
];

const categories = ["all", "needs", "feelings", "food", "family", "places", "activities", "numbers", "animals", "sports", "music", "time"];

const grid = document.querySelector(".card-grid");
const tabs = document.querySelector(".tabs");
const stripWords = document.querySelector(".strip-words");
let sentence = [];
let buildMode = false;
const strip = document.querySelector(".strip");
const modeButton = document.querySelector("#mode-button");

strip.classList.add("hidden");
function showCards(category) {
  grid.innerHTML = "";

  words.forEach(function (item) {
    if (category === "all" || item.category === category) {
      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML =
        '<div class="emoji">' + item.emoji + '</div>' +
        '<div class="word">' + item.label + '</div>';

      card.addEventListener("click", function () {
        card.classList.add("tapped");
        if (buildMode) {
  addToStrip(item);
} else {
  speak(item.speech);
}
        setTimeout(function () {
          card.classList.remove("tapped");
        }, 600);
      });

      grid.appendChild(card);
    }
  });
}

categories.forEach(function (name) {
  const button = document.createElement("button");
  button.classList.add("tab");
  button.textContent = name;
  button.addEventListener("click", function () {
    showCards(name);
    setActiveTab(button);
  });
  tabs.appendChild(button);
});

function addToStrip(item) {
  sentence.push(item);
  drawStrip();
}

function drawStrip() {
  stripWords.textContent = sentence.map(function (item) {
    return item.emoji + " " + item.label;
  }).join("  ");
}

document.querySelector("#speak-all").addEventListener("click", function () {
  const text = sentence.map(function (item) {
    return item.label;
  }).join(" ");
  speak(text);
});

document.querySelector("#clear-all").addEventListener("click", function () {
  sentence = [];
  drawStrip();
});
modeButton.addEventListener("click", function () {
  buildMode = !buildMode;
  strip.classList.toggle("hidden");

  if (buildMode) {
    modeButton.textContent = "Mode: Build a sentence";
  } else {
    modeButton.textContent = "Mode: Speak on tap";
    sentence = [];
    drawStrip();
  }
});

const categorySelect = document.querySelector("#new-category");
let customCards = [];

try {
  const saved = localStorage.getItem("vocabtapCustomCards");
  if (saved) {
    customCards = JSON.parse(saved);
    customCards.forEach(function (card) {
      words.push(card);
    });
  }
} catch (error) {
  customCards = [];
}

function saveCustomCards() {
  localStorage.setItem("vocabtapCustomCards", JSON.stringify(customCards));
}

categories.forEach(function (name) {
  if (name !== "all") {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    categorySelect.appendChild(option);
  }
});

document.querySelector("#add-button").addEventListener("click", function () {
  const emojiBox = document.querySelector("#new-emoji");
  const labelBox = document.querySelector("#new-label");
  const speechBox = document.querySelector("#new-speech");

  const emoji = emojiBox.value.trim();
  const label = labelBox.value.trim();
  let speech = speechBox.value.trim();

  if (emoji === "" || label === "") {
    alert("Please fill in the emoji and the word.");
    return;
  }

  if (speech === "") {
    speech = label;
  }

  words.push({
    emoji: emoji,
    label: label,
    speech: speech,
    category: categorySelect.value
  });

  emojiBox.value = "";
  labelBox.value = "";
  speechBox.value = "";

  showCards("all");
  setActiveTab(document.querySelector(".tab"));
});s
function speak(text) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  window.speechSynthesis.speak(utterance);
}
function setActiveTab(activeButton) {
  document.querySelectorAll(".tab").forEach(function (button) {
    button.classList.remove("active");
  });
  activeButton.classList.add("active");
}

showCards("all");
setActiveTab(document.querySelector(".tab"));