


const quizData = [
    {
        question: 'Where is the correct place to insert a javascript?',
        a: "The <head> section",
        b: "The <body> section",
        c: "Both the <head> and the <body> section",
        d: "none of the above",
        correct: "c" 
    },
    {
        question: 'Which language runs on the web browser?',
        a: "Java",
        b: "C",
        c: "Python",
        d: "javascript",
        correct: "d" 
    },
     {
        question: 'What does css stands for?',
        a: "Central style sheet",
        b: "Cascading style sheet",
        c: "Cascading simpe sheet",
        d: "Cars suvs sailboat",
        correct: "b" 
    },
     {
        question: 'What does HTML stands for?',
        a: "Hypertext markup language",
        b: "Hypertext Markdown Language",
        c: "Hyperloop machine language",
        d: "Helicopter terminal motorbike",
        correct: "a" 
    },
     {
        question: 'What year was javascript a launched?',
        a: "1996",
        b: "1995",
        c: "1994",
        d: "javascript",
        correct: "b" 
    },

]
const quiz = document.querySelector(".quiz-body")
const answerEl = document.querySelectorAll(".answer")
const questionEl = document.getElementById("question")
const footerEl = document.querySelector(".quiz-footer")
const quizDetailEl = document.querySelector(".quiz-details")
const liEl = document.querySelector("ul li")

const a_txt = document.getElementById("a_text")
const b_txt = document.getElementById("b_text")
const c_txt = document.getElementById("c_text")
const d_txt = document.getElementById("d_text")
const btnSubmit = document.getElementById("btn")

let currentQuiz = 0;
let score = 0

loadQuiz();

function loadQuiz(){
    deselectAnswers();
    const currentQuizData = quizData[currentQuiz]
    questionEl.innerText = currentQuizData.question
    a_txt.innerText = currentQuizData.a
    b_txt.innerText = currentQuizData.b
    c_txt.innerText = currentQuizData.c
    d_txt.innerText = currentQuizData.d
    quizDetailEl.innerHTML = `<p>${currentQuiz + 1} of ${quizData.length}</p>`
    

}

// deslect
function deselectAnswers(){
    answerEl.forEach((answerEL) => {
        answerEl.checked = false
    })
}

// get selected

function getSelected(){
    let answer;
    answerEl.forEach((answerEls) =>{
        if (answerEls.checked){
            answer = answerEls.id
        }
    } )
    return answer
}

btnSubmit.addEventListener("click", function (){
    const answers = getSelected()

    if (answers){
        if(answers === quizData[currentQuiz].correct) {
            score++;
        }
        nextQuestion()
    }
})
console.log(quizData)
//next slide
function nextQuestion(){
    currentQuiz++;

    if (currentQuiz < quizData.length){
        loadQuiz();
    } else {
        quiz.innerHTML = `<h2> YOu answered ${score}/${quizData.length} question correctly </h2>
        <button type="button" onclick="location.reload()">Reload </button>`
        footerEl.style.display = "none"
    }
}