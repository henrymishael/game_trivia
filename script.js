// Questions for different age groups
const adultQuestions = [
  {
    question: "Who is the father of Naruto?",
    options: ["Minato", "Sakura", "Killer bee", "Kakashi"],
    correctAnswer: 0,
  },
  {
    question: "What is the capital of Japan?",
    options: ["Beijing", "Seoul", "Tokyo", "Bangkok"],
    correctAnswer: 2,
  },
  {
    question: "Who wrote 'Purple Hibiscus?",
    options: [
      "Chimamanda Ngozi Adichie",
      "Chinua Achebe",
      "Wole Soyinka",
      "Sefi Atang",
    ],
    correctAnswer: 0,
  },
  {
    question:
      "When was Nigeria Democracy celebrated before changing it to June 12?",
    options: ["May 27", "October 1st", "May 29th", "June 12th"],
    correctAnswer: 2,
  },
  {
    question: "Which country is known as the Land of the Rising Sun?",
    options: ["China", "South Korea", "Thailand", "Japan"],
    correctAnswer: 3,
  },
];

const kidQuestions = [
  {
    question: "What color do you get when you mix blue and yellow?",
    options: ["Red", "Green", "Purple", "Orange"],
    correctAnswer: 1,
  },
  {
    question: "How many legs does a spider have?",
    options: ["4", "6", "8", "10"],
    correctAnswer: 2,
  },
  {
    question: "Which animal is known as the King of the Jungle?",
    options: ["Tiger", "Lion", "Elephant", "Giraffe"],
    correctAnswer: 1,
  },
  {
    question: "What is the name of Mickey Mouse's girlfriend?",
    options: ["Daisy", "Minnie", "Pluto", "Goofy"],
    correctAnswer: 1,
  },
  {
    question: "Which fruit is associated with keeping the doctor away?",
    options: ["Banana", "Orange", "Apple", "Grapes"],
    correctAnswer: 2,
  },
];

// DOM Elements
const startScreen = document.getElementById("start-screen");
const nameScreen = document.getElementById("name-screen");
const ageScreen = document.getElementById("age-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultsScreen = document.getElementById("results-screen");

const startBtn = document.getElementById("start-btn");
const nameInput = document.getElementById("name-input");
const nameSubmit = document.getElementById("name-submit");
const ageInput = document.getElementById("age-input");
const ageSubmit = document.getElementById("age-submit");
const questionText = document.getElementById("question-text");
const optionsContainer = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const currentScoreDisplay = document.getElementById("current-score");
const playerNameDisplay = document.getElementById("player-name");
const finalScoreDisplay = document.getElementById("final-score");
const resultMessage = document.getElementById("result-message");
const playAgainBtn = document.getElementById("play-again");
const themeToggle = document.getElementById("theme-toggle");
const sunIcon = document.getElementById("sun-icon");
const moonIcon = document.getElementById("moon-icon");
const soundToggle = document.getElementById("sound-toggle");
const body = document.body;

// Audio elements
const backgroundMusic = document.getElementById("background-music");
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");
const winSound = document.getElementById("win-sound");

// Game state
let currentQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let playerName = "";
let playerAge = 0;
let soundEnabled = false;
let darkThemeEnabled = false;

// Event Listeners
startBtn.addEventListener("click", () => {
  showScreen(nameScreen);
});

nameSubmit.addEventListener("click", () => {
  if (nameInput.value.trim() !== "") {
    playerName = nameInput.value.trim();
    showScreen(ageScreen);
  } else {
    alert("Please enter your name");
  }
});

ageSubmit.addEventListener("click", () => {
  if (ageInput.value.trim() !== "" && !isNaN(ageInput.value)) {
    playerAge = parseInt(ageInput.value);
    startQuiz();
  } else {
    alert("Please enter a valid age");
  }
});

nextBtn.addEventListener("click", () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < currentQuestions.length) {
    showQuestion();
  } else {
    showResults();
  }
});

playAgainBtn.addEventListener("click", () => {
  resetQuiz();
  showScreen(nameScreen);
});

function setTheme(theme) {
  if (theme === "dark") {
    body.setAttribute("data-theme", "dark");
    sunIcon.style.display = "none";
    moonIcon.style.display = "block";
    localStorage.setItem("theme", "dark");
  } else {
    body.removeAttribute("data-theme");
    sunIcon.style.display = "block";
    moonIcon.style.display = "none";
    localStorage.setItem("theme", "light");
  }
}

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
}

// Theme toggle event listener
themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  setTheme(currentTheme === "dark" ? "light" : "dark");
});

soundToggle.addEventListener("click", toggleSound);

// Functions
function showScreen(screen) {
  // Hide all screens
  document.querySelectorAll(".screen").forEach((s) => {
    s.classList.remove("active");
  });

  // Show the requested screen
  screen.classList.add("active");
}

function startQuiz() {
  // Set questions based on age
  currentQuestions = playerAge >= 18 ? adultQuestions : kidQuestions;

  // Reset quiz state
  currentQuestionIndex = 0;
  score = 0;
  currentScoreDisplay.textContent = score;

  // Show quiz screen and first question
  showScreen(quizScreen);
  showQuestion();

  // Start background music if enabled
  if (soundEnabled) {
    backgroundMusic.play();
  }
}

function showQuestion() {
  const question = currentQuestions[currentQuestionIndex];
  questionText.textContent = question.question;

  // Clear previous options
  optionsContainer.innerHTML = "";

  // Add new options
  question.options.forEach((option, index) => {
    const optionElement = document.createElement("div");
    optionElement.classList.add("option");
    optionElement.textContent = option;
    optionElement.addEventListener("click", () =>
      selectOption(index, question.correctAnswer)
    );
    optionsContainer.appendChild(optionElement);
  });

  // Hide next button until an option is selected
  nextBtn.classList.add("hide");
}

function selectOption(selectedIndex, correctIndex) {
  // Disable further selections
  const options = document.querySelectorAll(".option");
  options.forEach((option) => {
    option.style.pointerEvents = "none";
  });

  // Mark correct and wrong answers
  options[correctIndex].classList.add("correct");

  if (selectedIndex !== correctIndex) {
    options[selectedIndex].classList.add("wrong");
    if (soundEnabled) {
      wrongSound.play();
    }
  } else {
    // Increment score for correct answer
    score++;
    currentScoreDisplay.textContent = score;
    if (soundEnabled) {
      correctSound.play();
    }
  }

  // Show next button
  nextBtn.classList.remove("hide");
}

function showResults() {
  // Stop background music
  backgroundMusic.pause();
  backgroundMusic.currentTime = 0;

  // Play win sound if perfect score
  if (score === 5 && soundEnabled) {
    winSound.play();
  }

  // Update results screen
  playerNameDisplay.textContent = playerName;
  finalScoreDisplay.textContent = score;

  if (score === 5) {
    resultMessage.textContent = "Congratulations! You got a perfect score!";
  } else {
    resultMessage.textContent =
      "Congratulations! Try again to get a perfect score.";
  }

  showScreen(resultsScreen);
}

function resetQuiz() {
  // Reset game state
  currentQuestionIndex = 0;
  score = 0;
  nameInput.value = "";
  ageInput.value = "";
}

function toggleTheme() {
  darkThemeEnabled = !darkThemeEnabled;
  document.body.classList.toggle("dark-theme", darkThemeEnabled);

  // Update icon
  const themeIcon = themeToggle.querySelector("i");
  themeIcon.className = darkThemeEnabled ? "fas fa-sun" : "fas fa-moon";
}

function toggleSound() {
  soundEnabled = !soundEnabled;

  // Update icon
  const soundIcon = soundToggle.querySelector("i");
  soundIcon.className = soundEnabled
    ? "fas fa-volume-up"
    : "fas fa-volume-mute";

  // Handle background music
  if (soundEnabled) {
    if (quizScreen.classList.contains("active")) {
      backgroundMusic.play();
    }
  } else {
    backgroundMusic.pause();
  }
}
