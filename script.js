//Initial References
const letterContainer = document.getElementById("letter-container");
const optionsContainer = document.getElementById("options-container");
const userInputSection = document.getElementById("user-input-section");
const newGameContainer = document.getElementById("new-game-container");
const newGameButton = document.getElementById("new-game-button");
const canvas = document.getElementById("canvas");
const resultText = document.getElementById("result-text");

const imageCalc = document.getElementById("calc-exercise")
const answerIput = document.getElementById("answer-input")

//Options values for buttons
let options = {
  exercises: [
    { image: "./images/tasks/first.jpg", answer: "0.21" },
    { image: "./images/tasks/second.jpg", answer: "xsinx" },
    { image: "./images/tasks/third.jpg", answer: "1/3" },
    { image: "./images/tasks/fourth.jpg", answer: "1/3" },
    { image: "./images/tasks/fifth.jpg", answer: "1/3" },
    { image: "./images/tasks/sixth.jpg", answer: "-inf" },
    { image: "./images/tasks/seventh.jpg", answer: "1/2" },
    { image: "./images/tasks/eighth.jpg", answer: "2 - 2/e" },
  ],

};

//count
let winCount = 0;
let count = 0;

let chosenWord = "";


//Block all the Buttons
const blocker = () => {
  let letterButtons = document.querySelectorAll(".letters");

  //disable all letters
  letterButtons.forEach((button) => {
    button.disabled.true;
  });
  newGameContainer.classList.remove("hide");
};

/// Word Generator
const generateWord = (category) => {
  // Initially hide letters, clear previous word
  letterContainer.classList.remove("hide");
  userInputSection.innerText = "";

  // Check if the category is a valid option
  if (options.hasOwnProperty(category)) {
    let categoryWords = options[category];
    // Choose a random word
    chosenWord = categoryWords[Math.floor(Math.random() * categoryWords.length)];
    chosenWord = chosenWord.toUpperCase();

    // Replace every letter with a span containing a dash
    let displayItem = chosenWord.replace(/./g, '<span class="dashes">_</span>');

    // Display each element as a span
    userInputSection.innerHTML = displayItem;
  } else {
    console.error("Invalid category. Please provide a valid category.");
  }
};

const initializer2 = () => {
  winCount = 0;
  count = 0;

  newGameContainer.classList.add("hide");
  imageCalc.innerHTML = "";
  imageCalc.classList.remove("hide");

  const exercises = options.exercises;
  const answerInput = document.getElementById("answer-input");

  let { initialDrawing } = canvasCreator();
  // initialDrawing would draw the frame
  initialDrawing();

  // Define a recursive function for handling each exercise
  const handleExercise = async (index) => {
    if (index < exercises.length) {
      // Change the image
      imageCalc.innerHTML = `<img src="${exercises[index].image}" alt="exercise" class="exercise-image">`;

      // Clear previous input
      answerInput.value = "";

      // Await user input
      await waitForEnterKey();

      // Handle the user input
      const userInput = answerInput.value.trim();
      lose = process_user_input(userInput, index);

      // Move to the next exercise after a short delay
      setTimeout(() => handleExercise(index + 1), 100);

      if (lose) {
        return;
      }

    } else {
      // Display the result after completing all exercises
      resultText.innerHTML = `<h2 class='win-msg'>Молодець!</h2>`;
      newGameContainer.classList.remove("hide");
    }
  };

  // Start handling exercises
  handleExercise(0);
};

const process_user_input = (user_input, number) => {
  if (user_input === options.exercises[number].answer) {
    winCount += 1;
  } else {
    count += 2;
    for (let i = 0; i <= count; i++) {
      drawMan(i);
    }
    if (count == 6) {
      resultText.innerHTML = `<h2 class='lose-msg'>Нечемний(а)!</h2>`;
      imageCalc.classList.add("hide");
      newGameContainer.classList.remove("hide");
      count = 0;
      return False;
    }
  }

}


// Function to wait for Enter key press
const waitForEnterKey = () => {
  return new Promise((resolve) => {
    const handleKeyPress = (event) => {
      if (event.key === "Enter") {
        // Remove the event listener
        document.removeEventListener("keypress", handleKeyPress);
        resolve();
      }
    };

    // Add event listener for Enter key press
    document.addEventListener("keypress", handleKeyPress);
  });
};



//Initial Function (Called when page loads/user presses new game)
const initializer = () => {
  winCount = 0;
  count = 0;

  


  //Initially erase all content and hide letteres and new game button
  userInputSection.innerHTML = "";
  optionsContainer.classList.add("hide");
  letterContainer.classList.add("hide");
  newGameContainer.classList.add("hide");
  letterContainer.innerHTML = "";

  //For creating letter buttons
  for (let i = 65; i < 91; i++) {
    let button = document.createElement("button");
    button.classList.add("letters");
    //Number to ASCII[A-Z]
    button.innerText = String.fromCharCode(i);
    //character button click
    button.addEventListener("click", () => {
      let charArray = chosenWord.split("");
      let dashes = document.getElementsByClassName("dashes");
      //if array contains clciked value replace the matched dash with letter else dram on canvas
      if (charArray.includes(button.innerText)) {
        charArray.forEach((char, index) => {
          //if character in array is same as clicked button
          if (char === button.innerText) {
            //replace dash with letter
            dashes[index].innerText = char;
            //increment counter
            winCount += 1;
            //if winCount equals word lenfth
            if (winCount == charArray.length) {
              resultText.innerHTML = `<h2 class='win-msg'>You Win!!</h2><p>The word was <span>${chosenWord}</span></p>`;
              //block all buttons
              blocker();
            }
          }
        });
      } else {
        //lose count
        count += 1;
        //for drawing man
        drawMan(count);
        //Count==6 because head,body,left arm, right arm,left leg,right leg
        if (count == 6) {
          resultText.innerHTML = `<h2 class='lose-msg'>You Lose!!</h2>`;
          blocker();
        }
      }
      //disable clicked button
      button.disabled = true;
    });
    letterContainer.append(button);
  }

  // displayOptions();
  generateWord("fruits");
  //Call to canvasCreator (for clearing previous canvas and creating initial canvas)
  let { initialDrawing } = canvasCreator();
  //initialDrawing would draw the frame
  initialDrawing();
};

//Canvas
const canvasCreator = () => {
  let context = canvas.getContext("2d");
  context.beginPath();
  context.strokeStyle = "#000";
  context.lineWidth = 2;

  //For drawing lines
  const drawLine = (fromX, fromY, toX, toY) => {
    context.moveTo(fromX, fromY);
    context.lineTo(toX, toY);
    context.stroke();
  };

  const head = () => {
    context.beginPath();
    context.arc(70, 30, 10, 0, Math.PI * 2, true);
    context.stroke();
  };

  const body = () => {
    drawLine(70, 40, 70, 80);
  };

  const leftArm = () => {
    drawLine(70, 50, 50, 70);
  };

  const rightArm = () => {
    drawLine(70, 50, 90, 70);
  };

  const leftLeg = () => {
    drawLine(70, 80, 50, 110);
  };

  const rightLeg = () => {
    drawLine(70, 80, 90, 110);
  };

  //initial frame
  const initialDrawing = () => {
    //clear canvas
    context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    //bottom line
    drawLine(10, 130, 130, 130);
    //left line
    drawLine(10, 10, 10, 131);
    //top line
    drawLine(10, 10, 70, 10);
    //small top line
    drawLine(70, 10, 70, 20);
  };

  return { initialDrawing, head, body, leftArm, rightArm, leftLeg, rightLeg };
};

//draw the man
const drawMan = (count) => {
  let { head, body, leftArm, rightArm, leftLeg, rightLeg } = canvasCreator();
  switch (count) {
    case 1:
      head();
      break;
    case 2:
      body();
      break;
    case 3:
      leftArm();
      break;
    case 4:
      rightArm();
      break;
    case 5:
      leftLeg();
      break;
    case 6:
      rightLeg();
      break;
    default:
      break;
  }
};

//New Game
newGameButton.addEventListener("click", initializer2);
window.onload = initializer2;