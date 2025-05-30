let questions = [];
let currentQuestion = 0;
let score = 0;
let timeLeft = 60;
let timer;
let isAnswering = false;

const titles = [
    {
        name: "Smoldering Spark",
        description: "This is the first title given to newcomers who are just igniting their fire in the world of Fogo. They are beginning to learn the basics and haven't gained much experience yet, but their flame is just starting to grow.",
        minScore: 0
    },
    {
        name: "Blazing Warrior",
        description: "A title for those who have already taken the first steps in mastering Fogo. Their fire has become brighter, and they confidently move forward, learning subtleties and showing persistence.",
        minScore: 5
    },
    {
        name: "Flame Guardian",
        description: "These are experts who have mastered the complex terms from the whitepaper. Their knowledge is enough to light up the entire world.",
        minScore: 9
    },
    {
        name: "Lord of the Flame",
        description: "The highest title given to those who have burned the entire whitepaper to ashes with their flame. Their fire not only burns but also illuminates the path for others. The legends of Fogo are those who inspire and lead the whole world.",
        minScore: 12
    }
];

document.addEventListener('DOMContentLoaded', function() {
    loadQuestions();
});

async function loadQuestions() {
    try {
        const response = await fetch('questions.json');
        if (!response.ok) {
            throw new Error('Не удалось загрузить вопросы');
        }
        questions = await response.json();
        console.log('Вопросы загружены успешно:', questions.length);
        console.log('Все вопросы:', questions);
    } catch (error) {
        console.error('Ошибка загрузки вопросов:', error);
        questions = getBackupQuestions();
    }
}

function getBackupQuestions() {
    return [
        {
            "question": "Which blockchain protocol is Fogo built upon?",
            "answers": [
                {"text": "Ethereum", "correct": false},
                {"text": "Solana", "correct": true},
                {"text": "Bitcoin", "correct": false},
                {"text": "Polkadot", "correct": false}
            ]
        },
        {
            "question": "What new consensus mechanism does Fogo introduce?",
            "answers": [
                {"text": "Proof of Work", "correct": false},
                {"text": "Delegated Proof of Stake", "correct": false},
                {"text": "Multi-local consensus", "correct": true},
                {"text": "PBFT", "correct": false}
            ]
        }
    ];
}

function startQuiz() {
    if (questions.length === 0) {
        alert('Вопросы еще загружаются, подождите немного...');
        return;
    }
    
    document.getElementById('mainScreen').style.display = 'none';
    document.getElementById('quizScreen').style.display = 'block';
    currentQuestion = 0;
    score = 0;
    showQuestion();
}

function showQuestion() {
    if (currentQuestion >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestion];
    document.getElementById('questionCounter').textContent = `Question ${currentQuestion + 1} of ${questions.length}`;
    document.getElementById('question').textContent = question.question;
    
    const answersContainer = document.getElementById('answers');
    answersContainer.innerHTML = '';
    
    question.answers.forEach((answer, index) => {
        const button = document.createElement('button');
        button.className = 'answer-btn';
        button.textContent = answer.text;
        button.onclick = () => selectAnswer(index);
        answersContainer.appendChild(button);
    });

    startTimer();
    isAnswering = false;
}

function startTimer() {
    timeLeft = 60;
    updateTimer();
    timer = setInterval(() => {
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(timer);
            if (!isAnswering) {
                nextQuestion();
            }
        }
    }, 1000);
}

function updateTimer() {
    document.getElementById('timer').textContent = timeLeft;
    document.getElementById('timer').style.color = timeLeft <= 10 ? '#e74c3c' : '#ffa500';
}

function selectAnswer(selectedIndex) {
    if (isAnswering) return;
    isAnswering = true;
    clearInterval(timer);

    const question = questions[currentQuestion];
    const buttons = document.querySelectorAll('.answer-btn');
    const selectedButton = buttons[selectedIndex];

    const correctIndex = question.answers.findIndex(answer => answer.correct === true);
    
    if (currentQuestion === questions.length - 1) {
        buttons.forEach(button => {
            button.classList.add('correct');
        });
        score++;
        createAnimation('✓', true);
    } else {
        if (selectedIndex === correctIndex) {
            selectedButton.classList.add('correct');
            score++;
            createAnimation('✓', true);
        } else {
            selectedButton.classList.add('incorrect');
            if (correctIndex !== -1) {
                buttons[correctIndex].classList.add('correct');
            }
            createAnimation('✗', false);
        }
    }

    setTimeout(() => {
        nextQuestion();
    }, 2000);
}

function createAnimation(symbol, isCorrect) {
    const overlay = document.getElementById('animationOverlay');
    
    for (let i = 0; i < 8; i++) {
        setTimeout(() => {
            const element = document.createElement('div');
            if (isCorrect) {
                element.className = 'checkmark';
                const img = document.createElement('img');
                img.src = 'logo.png';
                img.alt = 'Logo';
                element.appendChild(img);
            } else {
                element.className = 'cross';
                element.textContent = '✗';
            }
            element.style.left = Math.random() * window.innerWidth + 'px';
            element.style.top = '0px';
            overlay.appendChild(element);

            setTimeout(() => {
                if (overlay.contains(element)) {
                    overlay.removeChild(element);
                }
            }, 1000);
        }, i * 100);
    }
}

function nextQuestion() {
    currentQuestion++;
    showQuestion();
}

function showResults() {
    document.getElementById('quizScreen').style.display = 'none';
    document.getElementById('resultsScreen').style.display = 'block';
    
    document.getElementById('finalScore').textContent = `You scored ${score} out of ${questions.length} questions correctly!`;
    
    const title = titles.slice().reverse().find(t => score >= t.minScore);
    document.getElementById('titleName').textContent = title.name;
    document.getElementById('titleDescription').textContent = title.description;
}

function resetQuiz() {
    document.getElementById('resultsScreen').style.display = 'none';
    document.getElementById('mainScreen').style.display = 'block';
    currentQuestion = 0;
    score = 0;
    clearInterval(timer);
}
