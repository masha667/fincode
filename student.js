// ===== FIREBASE CONFIGURATION =====
// ЗАМЕНИТЕ ЭТИ ДАННЫЕ НА СВОИ ИЗ FIREBASE CONSOLE!
const firebaseConfig = {
    apiKey: "AIzaSyCiBsjv49zriigjdFATMEWcHtfCwqC7dnw",
    authDomain: "fincode-project.firebaseapp.com",
    databaseURL: "https://fincode-project-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fincode-project",
    storageBucket: "fincode-project.firebasestorage.app",
    messagingSenderId: "829798317077",
    appId: "1:829798317077:web:d13854139a8aa6ef25221c"
};

// Initialize Firebase
let db = null;
let firebaseInitialized = false;

try {
    firebase.initializeApp(firebaseConfig);
    db = firebase.database();
    firebaseInitialized = true;
} catch (e) {
    document.getElementById('firebaseStatus').className = 'firebase-status error';
    document.getElementById('firebaseStatus').textContent = '❌ Ошибка подключения. Сообщи учителю.';
}

// ===== STUDENT DATA =====
let student = {
    id: null,
    name: '',
    avatar: '🦊',
    roomCode: '',
    score: 0,
    currentLevel: 1,
    currentQuestion: 0,
    answeredQuestions: 0,
    totalQuestions: 0,
    status: 'waiting',
    joinedAt: null,
    answers: []
};

let room = null;
let roomListener = null;

// ===== GAME DATA =====
const gameQuestions = [
    // Level 1: Финансовая база
    [
        { type: "quiz", category: "💰 Финансы", text: "Что такое бюджет?", answers: ["План доходов и расходов", "Вид банковской карты", "Налог на покупки", "Сумма всех долгов"], correct: 0, explanation: "Бюджет — это план, который помогает распределять доходы и расходы!" },
        { type: "quiz", category: "💰 Финансы", text: "Где безопаснее всего хранить сбережения?", answers: ["Под матрасом", "В банке", "В игрушке", "На улице"], correct: 1, explanation: "Банк защищает деньги и может начислять проценты на вклад." },
        { type: "truefalse", category: "💰 Финансы", text: "Инфляция — это когда деньги обесцениваются, а цены растут.", correct: true, explanation: "Верно! При инфляции одни и те же деньги покупают всё меньше." },
        { type: "quiz", category: "💰 Финансы", text: "Как называется доход от денег, положенных в банк?", answers: ["Кэшбэк", "Проценты", "Бонус", "Скидка"], correct: 1, explanation: "Банк платит проценты за то, что ты хранишь у него деньги!" },
        { type: "truefalse", category: "💰 Финансы", text: "Кэшбэк — это когда банк возвращает часть потраченных денег.", correct: true, explanation: "Да! Это приятный бонус за покупки картой." }
    ],
    // Level 2: Цифровая безопасность
    [
        { type: "quiz", category: "🔒 Безопасность", text: "Что делать, если незнакомец в сети просит твой пароль?", answers: ["Дать, если он вежливый", "Никогда не давать", "Дать фейковый", "Спросить у друзей"], correct: 1, explanation: "Настоящие администраторы НИКОГДА не просят пароль!" },
        { type: "truefalse", category: "🔒 Безопасность", text: "Надёжный пароль должен содержать буквы, цифры и символы.", correct: true, explanation: "Чем сложнее пароль, тем труднее его взломать." },
        { type: "quiz", category: "🔒 Безопасность", text: "Что такое фишинг?", answers: ["Вид рыбалки", "Мошенничество с поддельными сайтами", "Компьютерная игра", "Быстрый интернет"], correct: 1, explanation: "Фишинг — это когда мошенники создают фейковые сайты для кражи данных." },
        { type: "truefalse", category: "🔒 Безопасность", text: "Можно публиковать фото билета с паспортными данными в соцсетях.", correct: false, explanation: "Нет! Это личные данные, которыми могут воспользоваться мошенники." },
        { type: "quiz", category: "🔒 Безопасность", text: "Что делать при получении подозрительной ссылки от друга?", answers: ["Сразу открыть", "Удалить и спросить друга лично", "Переслать другим", "Кликнуть из любопытства"], correct: 1, explanation: "Аккаунт друга могли взломать. Лучше уточнить у него напрямую." }
    ],
    // Level 3: Экономика вокруг нас
    [
        { type: "quiz", category: "📊 Экономика", text: "Что такое спрос?", answers: ["Желание и возможность купить товар", "Количество товаров в магазине", "Налог на покупку", "Рекламный слоган"], correct: 0, explanation: "Спрос — это когда ты хочешь товар И имеешь деньги на него." },
        { type: "truefalse", category: "📊 Экономика", text: "Реклама всегда говорит только правду о товаре.", correct: false, explanation: "Реклама часто приукрашивает, чтобы заставить купить." },
        { type: "quiz", category: "📊 Экономика", text: "Почему зимой дорожают мандарины?", answers: ["Потому что Новый год", "Сезонность и стоимость доставки", "Магазины жадные", "Случайность"], correct: 1, explanation: "Зимой мандарины везут издалека — это увеличивает расходы." },
        { type: "truefalse", category: "📊 Экономика", text: "Конкуренция заставляет компании улучшать товары.", correct: true, explanation: "Когда фирмы соревнуются, им выгодно делать лучше и дешевле." },
        { type: "quiz", category: "📊 Экономика", text: "Что такое кэшбэк?", answers: ["Возврат части денег за покупку", "Новый налог", "Вид криптовалюты", "Банковский кредит"], correct: 0, explanation: "Кэшбэк — это когда банк возвращает часть потраченных денег." }
    ]
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    setupCodeInputs();
    setupAvatarSelect();
});

function setupCodeInputs() {
    const inputs = document.querySelectorAll('.code-input');
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && e.target.value.length === 0 && index > 0) {
                inputs[index - 1].focus();
            }
        });
    });
}

function setupAvatarSelect() {
    document.querySelectorAll('.avatar-option').forEach(option => {
        option.addEventListener('click', () => {
            document.querySelectorAll('.avatar-option').forEach(o => o.classList.remove('selected'));
            option.classList.add('selected');
            student.avatar = option.dataset.avatar;
        });
    });
}

function joinRoom() {
    if (!firebaseInitialized) {
        showJoinError('Ошибка подключения. Сообщи учителю.');
        return;
    }

    const code = [
        document.getElementById('code1').value,
        document.getElementById('code2').value,
        document.getElementById('code3').value,
        document.getElementById('code4').value
    ].join('').toUpperCase();

    const name = document.getElementById('studentName').value.trim();

    if (code.length !== 4) {
        showJoinError('Введи код из 4 символов');
        return;
    }

    if (!name) {
        showJoinError('Введи своё имя');
        return;
    }

    // Check if room exists in Firebase
    db.ref('rooms/' + code).once('value', (snapshot) => {
        if (!snapshot.exists()) {
            showJoinError('Комната не найдена. Проверь код.');
            return;
        }

        room = snapshot.val();

        if (room.status === 'finished') {
            showJoinError('Урок уже завершён');
            return;
        }

        // Create student
        student = {
            id: 'student_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            name: name,
            avatar: student.avatar,
            roomCode: code,
            score: 0,
            currentLevel: 1,
            currentQuestion: 0,
            answeredQuestions: 0,
            totalQuestions: room.levelsCount * 5,
            status: 'waiting',
            joinedAt: new Date().toISOString(),
            answers: []
        };

        // Save to Firebase
        saveStudent();

        // Show waiting screen
        showWaitingScreen();

        // Listen for game start
        listenForGameStart(code);
    });
}

function showJoinError(message) {
    const error = document.getElementById('joinError');
    error.textContent = message;
    error.style.display = 'block';
}

function showWaitingScreen() {
    document.getElementById('joinScreen').style.display = 'none';
    document.getElementById('waitingScreen').style.display = 'block';
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('finishScreen').style.display = 'none';

    document.getElementById('waitingLessonName').textContent = room?.lessonName || 'Финансовая грамотность';
    document.getElementById('waitingClassInfo').textContent = room?.className || '';
}

function listenForGameStart(roomCode) {
    roomListener = db.ref('rooms/' + roomCode + '/status');
    roomListener.on('value', (snapshot) => {
        const status = snapshot.val();
        if (status === 'playing') {
            startGame();
        } else if (status === 'finished') {
            showFinishScreen();
        }
    });
}

function startGame() {
    student.status = 'playing';
    saveStudent();

    document.getElementById('waitingScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';

    document.getElementById('studentAvatar').textContent = student.avatar;
    document.getElementById('displayStudentName').textContent = student.name;
    document.getElementById('studentProgress').textContent = `Уровень 1 из ${room.levelsCount}`;

    loadQuestion();
}

function loadQuestion() {
    const levelQuestions = gameQuestions[student.currentLevel - 1];
    if (!levelQuestions || student.currentQuestion >= levelQuestions.length) {
        if (student.currentLevel >= room.levelsCount) {
            finishGame();
        } else {
            student.currentLevel++;
            student.currentQuestion = 0;
            document.getElementById('studentProgress').textContent = `Уровень ${student.currentLevel} из ${room.levelsCount}`;
            saveStudent();
            loadQuestion();
        }
        return;
    }

    const question = levelQuestions[student.currentQuestion];

    document.getElementById('questionCategory').textContent = question.category;
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('questionInstruction').textContent = question.instruction || '';

    const content = document.getElementById('gameContent');
    content.innerHTML = '';

    if (question.type === 'quiz') {
        renderQuiz(question, content);
    } else if (question.type === 'truefalse') {
        renderTrueFalse(question, content);
    }

    document.getElementById('feedback').className = 'feedback';
    document.getElementById('nextBtn').className = 'btn next-btn';
}

function renderQuiz(question, container) {
    const grid = document.createElement('div');
    grid.className = 'answers-grid';

    const letters = ['А', 'Б', 'В', 'Г'];
    question.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerHTML = `<span class="answer-letter">${letters[index]}</span> ${answer}`;
        btn.onclick = () => selectAnswer(index === question.correct, btn, question);
        grid.appendChild(btn);
    });

    container.appendChild(grid);
}

function renderTrueFalse(question, container) {
    const div = document.createElement('div');
    div.className = 'truefalse-container';
    div.innerHTML = `
        <button class="tf-btn true" onclick="selectTF(true, this)">✓ ПРАВДА</button>
        <button class="tf-btn false" onclick="selectTF(false, this)">✗ ЛОЖЬ</button>
    `;
    container.appendChild(div);
}

function selectTF(answer, btn) {
    const question = gameQuestions[student.currentLevel - 1][student.currentQuestion];
    const isCorrect = answer === question.correct;

    document.querySelectorAll('.tf-btn').forEach(b => b.disabled = true);

    const correctBtn = question.correct ? document.querySelector('.tf-btn.true') : document.querySelector('.tf-btn.false');
    correctBtn.classList.add('correct');
    if (!isCorrect) btn.classList.add('wrong');

    processAnswer(isCorrect, question);
}

function selectAnswer(isCorrect, btn, question) {
    document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
    document.querySelectorAll('.answer-btn')[question.correct].classList.add('correct');
    if (!isCorrect) btn.classList.add('wrong');

    processAnswer(isCorrect, question);
}

function processAnswer(isCorrect, question) {
    const feedback = document.getElementById('feedback');

    if (isCorrect) {
        student.score += 20;
        feedback.className = 'feedback show success';
        feedback.innerHTML = `✅ Правильно! +20 баллов<br><small>${question.explanation}</small>`;
    } else {
        feedback.className = 'feedback show error';
        feedback.innerHTML = `❌ Неправильно.<br><small>${question.explanation}</small>`;
    }

    student.answers.push({
        level: student.currentLevel,
        question: student.currentQuestion,
        correct: isCorrect,
        timestamp: new Date().toISOString()
    });

    student.answeredQuestions++;
    document.getElementById('displayScore').textContent = student.score;

    saveStudent();
    showSync();

    document.getElementById('nextBtn').classList.add('show');
}

function nextQuestion() {
    student.currentQuestion++;
    saveStudent();
    loadQuestion();
}

function finishGame() {
    student.status = 'finished';
    saveStudent();
    showFinishScreen();
}

function showFinishScreen() {
    document.getElementById('joinScreen').style.display = 'none';
    document.getElementById('waitingScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'none';
    document.getElementById('finishScreen').style.display = 'block';

    document.getElementById('finalScore').textContent = student.score;
    document.getElementById('finalLevel').textContent = `Пройдено уровней: ${room?.levelsCount || student.currentLevel}`;
}

// ===== SYNC WITH FIREBASE =====
function saveStudent() {
    if (!firebaseInitialized || !student.roomCode) return;

    db.ref('rooms/' + student.roomCode + '/students/' + student.id).set(student);
}

function showSync() {
    const indicator = document.getElementById('syncIndicator');
    indicator.classList.add('show');
    setTimeout(() => indicator.classList.remove('show'), 2000);
}

// Cleanup on unload
window.addEventListener('beforeunload', () => {
    saveStudent();
    if (roomListener) {
        roomListener.off();
    }
});
