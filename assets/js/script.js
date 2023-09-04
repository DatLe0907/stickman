const main = document.getElementById("main");
const themeSong = new Audio(
  "./assets/audio/Interstellar Main Theme  Extra Extended  Soundtrack by  Hans Zimmer.mp3"
);
const waterSplash = new Audio("./assets/audio/water-splash.mp3");
const success = new Audio("./assets/audio/success.mp3");
const death = new Audio("./assets/audio/death.mp3");
const deathMusic = new Audio("./assets/audio/death-music.mp3")

const trueLetterEffect = new Audio("./assets/audio/interface.mp3");
const falseLetterEffect = new Audio("./assets/audio/hurt.mp3");

// Nhấn vào start btn -> chạy nhạc và bắt đầu chạy game
let startButton = document.querySelector(".start-game");
main.style.backgroundImage = 'url("./assets/img/space-background.jpeg")';
function handleStartButtonClick() {
  themeSong.play();
  startGame();

  // Remove event listener for "Enter" key
  document.removeEventListener("keydown", handleKeyDown);
}

function handleKeyDown(e) {
  if (e.key === "Enter") {
    themeSong.play();
    startGame();
    document.removeEventListener("keydown", handleKeyDown);
  }
}

if (startButton !== null) {
  startButton.addEventListener("click", handleStartButtonClick);
  document.addEventListener("keydown", handleKeyDown);
}

// khi nhạc kết thúc -> restart
themeSong.addEventListener(
  "ended",
  function () {
    this.currentTime = 0;
    this.play();
  },
  false
);

function startGame(word) {
  main.innerHTML = `
  <section>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </section>
  <div class="container">
        <div class="game__modal">
          <div class="modal__overlay"></div>
          <div class="modal__content">
            <img src="" alt="" />
            <h4>Game Over!</h4>
            <p>The correct word was: <b>${word}</b></p>
            <button class="continue btn">Continue</button>
          </div>
        </div>
        <div class="wrapper">
          <div class="alien__box">
            <img src="./assets/img/ufo.png" alt="">
            <div class = "gamma"></div>
          </div>
          <div class="drowned-man__box">
            <div class="box__container">
              <img src="./assets/img/astronaut-stickman.png" alt="">
            </div>
          </div>
        </div>
        <div class="game__box">
          <ul class="word-display"></ul>
          <h4 class="hint-text">
            Hint:
            <b>Lorem ipsum dolor sit amet consectetur adipisicing elit.</b>
          </h4>
          <div class="guesses-text">
            <div class = "hearts"></div>
          </div>
          <div class="keyboard"></div>
        </div>
      </div>
      <div class="footer">
        <i>Source: Datle0907</i>
        <p>From: Team IT07</p>
      </div>`;

  const wordDisplay = document.querySelector(".word-display"),
    keyBoard = document.querySelector(".keyboard"),
    guessesText = document.querySelector(".hearts"),
    water = document.querySelector(".water"),
    modal = document.querySelector(".game__modal"),
    gamma = document.querySelector(".alien__box .gamma"),
    continueBtn = document.querySelector(".continue"),
    man = document.querySelector('.box__container img');
  const maxGuesses = 6;
  const gammaHeight = document.querySelector('.container .wrapper').offsetHeight - (document.querySelector('.box__container img').offsetHeight + document.querySelector('.alien__box img').offsetHeight);
  let check;
  let currentWord,
    wrongGuessCount,
    correctLetter = [];

  function resetGame() {
    man.src = "./assets/img/astronaut-stickman.png"
    correctLetter = [];
    wrongGuessCount = 0;
    // Hiển thị số câu trl sai
    hearts = [];
    for(let i = 0; i < maxGuesses-wrongGuessCount; i++){
      hearts.push(`
      <div class="heart">
      <img src="./assets/img/heart.png" alt="">
    </div>
      `)
    }
    guessesText.innerHTML = hearts.join('')
    keyBoard.querySelectorAll("button").forEach(function (btn) {
      btn.disabled = false;
    });

    // Ẩn keyword
    wordDisplay.innerHTML = currentWord
      .split("")
      .map(function () {
        return `<li class="letter"></li>`;
      })
      .join("");
      gamma.style = `
      height: 0%;
  `;
  }

  function getRandomWord() {
  
    // Select random word from wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
  
    // Update hint text
    document.querySelector(".hint-text b").innerText = hint;
  

    resetGame(); // Reset game state after getting a new word

    // Display word as empty boxes
    wordDisplay.innerHTML = word
      .split("")
      .map(function () {
        return `<li class="letter"></li>`;
      })
      .join("");
  }

  // hiển thị game over
  function gameOver(isCompleted) {
    setTimeout(function () {
      const modalText = isCompleted
        ? `You found the word: `
        : `The correct word is: `;
      modal.querySelector("img").src = `assets/img/${
        isCompleted ? "completed" : "lost"
      }.png`;
      modal.querySelector("h4").innerText = `${
        isCompleted ? "Congratulation!" : "Game Over!"
      }`;
      modal.querySelector("p").innerHTML = `${modalText}<b>${currentWord}</b>`;
      modal.classList.add("show");
      return (check = isCompleted);
    }, 2000);
  }

  function initGame(button, inputLetter) {
    if (currentWord.includes(inputLetter)) {
      [...currentWord].forEach(function (letter, index) {
        if (letter === inputLetter) {
          trueLetterEffect.play();
          correctLetter.push(letter);
          wordDisplay.querySelectorAll("li")[index].innerText = letter;
          wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
        }
      });
    } else {
      wrongGuessCount++;
      if (wrongGuessCount <= maxGuesses) {
        falseLetterEffect.play()
        gamma.style = `
            transition: 0.3s;
            height: ${gammaHeight + 20}px;
        `;
        setTimeout(function(){
          man.style = `
        filter: opacity(0.5) drop-shadow(0 0 red);
        `
        },300)
        setTimeout(function () {
          man.style = `
        filter: none`
          gamma.style = `
            transition: 0s;
        height: 0%;
        `;
        }, 450);
      }
    }
    let hearts = [];
    for(let i = 0; i < maxGuesses-wrongGuessCount; i++){
      hearts.push(`
      <div class="heart">
      <img src="./assets/img/heart.png" alt="">
    </div>
      `)
    }
    setTimeout(function(){
      guessesText.innerHTML = hearts.join('');
    },400)
    button.disabled = true;
    if (wrongGuessCount === maxGuesses) {
      gameOver(false);
      deathMusic.play();
      setTimeout(function(){
        death.play()
      },2000)
      setTimeout(function(){
        man.src = "./assets/img/death.png"
      },2000)
    }
    if (correctLetter.length === currentWord.length) {
      gameOver(true);
      success.play();
    }
  }

  // Create letter btn & add event listen
  for (let i = 97; i < 123; i++) {
    const button = document.createElement("button");
    button.classList.add("btn");
    button.innerHTML = String.fromCharCode(i);
    keyBoard.appendChild(button);
    button.addEventListener("click", function (e) {
      initGame(e.target, String.fromCharCode(i));
    });
  }

  let btnList = document.querySelectorAll(".keyboard button"),
    keyTypedList = [];
  document.addEventListener("keydown", function (e) {
    btnList.forEach(function (btn) {
      if (btn.innerText === e.key.toUpperCase()) {
        initGame(btn, e.key);
        keyTypedList.push(e.key.toUpperCase());
      }
      keyTypedList.forEach(function (keyTyped) {
        if ((e.key = keyTyped)) {
          e.preventDefault();
        }
      });
    });
  });

  getRandomWord();
  continueBtn.addEventListener("click", function () {
    getRandomWord();
    modal.classList.remove("show");
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && (check === true || check === false)) {
    getRandomWord();
    modal.classList.remove("show");
    }
  });
}
