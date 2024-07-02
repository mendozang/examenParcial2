// elementos HTML
const examButton = document.querySelector("#examBtn");
const startContainer = document.querySelector("#start")
const rulesContainer = document.querySelector("#rules");
const questionContainer = document.querySelector("#questionContainer");
const question = document.querySelector(".question");
const options = document.querySelector("#options");
const option = Array.from(document.getElementsByClassName("option"));
const numQuestions = document.querySelector("#numQuestions");
const nextButton = document.querySelector(".nextBtn");
const endContainer = document.querySelector("#end");
const endMessage = document.querySelector("#endMessage");
const timerSecs = document.querySelector("#timerSecs");
const timeLine = document.querySelector("#timeLine");

examButton.onclick = () => {
    startContainer.classList.add("hide");
    setTimeout(() => {
        rulesContainer.classList.remove("hide");
    }, 400);
}

document.querySelectorAll(".exitBtn").forEach(button => {
    button.onclick = () => {
        rulesContainer.classList.add("hide");
        endContainer.classList.add("hide");
        setTimeout(() => {
            startContainer.classList.remove("hide");
        }, 400);
    };
});

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let allQuestions = [];
let timeLeft = 15;

const maxQuestions = 10;

startExam = () => {
    questionCounter = 0;
    score = 0;
    allQuestions = [...questions];
    
}

getNewQuestion = () => {
    const questionIndex = Math.floor(Math.random() * allQuestions.length);
    acceptingAnswers = true;
    console.log("Question Index:", questionIndex);

    currentQuestion = allQuestions[questionIndex];
    option.forEach(option => {
        option.classList.remove("correct", "incorrect", "disabled");
    });

    questionCounter++;
    numQuestions.innerHTML = `${questionCounter} de ${maxQuestions} preguntas`;

    question.innerHTML = currentQuestion.question;

    option.forEach(option => {
        const number = option.dataset['number'];
        option.innerHTML = currentQuestion['option' + number];
    })

    allQuestions.splice(questionIndex, 1);
}

document.querySelectorAll(".startBtn").forEach(button => {
    button.onclick = () => {
        rulesContainer.classList.add("hide");
        endContainer.classList.add("hide");
        setTimeout(() => {
            questionContainer.classList.remove("hide");
        }, 400);
        startExam();
        startTimer();
        updateTimeline();
        getNewQuestion();
    };
});

nextButton.onclick = () => {
    if (questionCounter < maxQuestions) {
        nextButton.classList.add("hide");
        clearInterval(counterLine);
        clearInterval(counter);
        startTimer();
        updateTimeline();
        getNewQuestion();
    }

    else {
        endExam();
    }

}

option.forEach(option => {
    const allOptions = options.children.length;
    option.addEventListener("click", (e) => {
        if (!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedOption = e.target;
        const selectedAnswer = selectedOption.dataset["number"];

        if (selectedAnswer == currentQuestion.answer) {
            option.classList.add("correct");
            score++;
            option.innerHTML += ' <i class="fa-solid fa-check"></i>';
        }
        else {
            option.classList.add("incorrect");
            option.innerHTML += ' <i class="fa-solid fa-xmark"></i>';
            for (let i = 0; i < allOptions; i++) {
                let currentOption = options.children[i];
                if (currentOption.dataset["number"] == currentQuestion.answer) {
                    currentOption.classList.add("correct");
                    currentOption.innerHTML += ' <i class="fa-solid fa-check"></i>';
                    break;
                }
            }
        }

        for (i = 0; i < allOptions; i++) {
            options.children[i].classList.add("disabled");
        }
        clearInterval(counter);
        clearInterval(counterLine);
        nextButton.classList.remove("hide");
        console.log("Current Question Object:", currentQuestion);
        console.log("Displayed Question:", question.innerHTML);
        console.log("Correct Answer", currentQuestion.answer);
    })
})

endExam = () => {
    questionContainer.classList.add("hide");
    setTimeout(() => {
        endContainer.classList.remove("hide");
    }, 400);
    clearInterval(timer)
    clearInterval(counterLine);

    if (score >= 8) {
        endMessage.innerHTML = `Felicitaciones! 🎉 Conseguiste ${score} de ${maxQuestions}`
    }

    else if (score >= 5 && score <= 7) {
        endMessage.innerHTML = `Que bien 😃, Conseguiste ${score} de ${maxQuestions}`
    }

    else if (score >= 1 && score <= 4) {
        endMessage.innerHTML = `Hay que estudiar 😅, Conseguiste ${score} de ${maxQuestions}`
    }

    else {
        endMessage.innerHTML = `Lo siento 😢, Conseguiste ${score} de ${maxQuestions}`
    }
}

startTimer = () => {
    timeLeft = 15;
    allOptions = options.children.length;
    currentQuestion = allQuestions[questionCounter];
    counter = setInterval(timer, 1000);
    function timer() {
        timerSecs.textContent = timeLeft;

        timeLeft--;
        if (timeLeft < 9) {
            let addZero = timerSecs.textContent;
            timerSecs.textContent = "0" + addZero;
        }
        if (timeLeft < 0) {
            clearInterval(counter);
            clearInterval(counterLine);
            for (let i = 0; i < allOptions; i++) {
                if (i == currentQuestion.answer -1) {
                    options.children[i].classList.add("correct");
                    options.children[i].innerHTML += ' <i class="fa-solid fa-check"></i>';
                }
            }
            for (let i = 0; i < allOptions; i++) {
                options.children[i].classList.add("disabled");
            }
            nextButton.classList.remove("hide");
        }
    }
}


function updateTimeline() {
    let time = 0;
    const totalTime = 15000;
    const updateInterval = 29;
    const totalIncrements = totalTime / updateInterval;
    const incrementPercentage = (1 / totalIncrements) * 100;

    counterLine = setInterval(timerLine, updateInterval);

    function timerLine() {
        if (time >= totalIncrements) {
            clearInterval(counterLine);
        }
        else {
            time += 1;
            timeLine.style.width = (incrementPercentage * time) + "%";
        }
    }
}


