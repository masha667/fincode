// ===== FIREBASE CONFIGURATION =====
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
    console.error('Firebase error:', e);
}

// ===== GAME DATA =====
const levels = [
    {
        id: 1,
        name: "Финансовая база",
        desc: "Узнай, что такое деньги, бюджет и как правильно копить",
        icon: "💰",
        points: 100,
        questions: [
            { type: "quiz", category: "💰 Финансы", text: "Что такое бюджет?", answers: ["План доходов и расходов", "Вид банковской карты", "Налог на покупки", "Сумма всех долгов"], correct: 0, explanation: "Бюджет — это план, который помогает распределять доходы и расходы!" },
            { type: "truefalse", category: "💰 Финансы", text: "Инфляция — это когда деньги обесцениваются, а цены растут.", correct: true, explanation: "Верно! При инфляции одни и те же деньги покупают всё меньше." },
            { type: "quiz", category: "💰 Финансы", text: "Где безопаснее всего хранить сбережения?", answers: ["Под матрасом", "В банке", "В игрушке", "На улице"], correct: 1, explanation: "Банк защищает деньги и может начислять проценты на вклад." },
            { type: "quiz", category: "💰 Финансы", text: "Как называется доход от денег, положенных в банк?", answers: ["Кэшбэк", "Проценты", "Бонус", "Скидка"], correct: 1, explanation: "Банк платит проценты за то, что ты хранишь у него деньги!" },
            { type: "truefalse", category: "💰 Финансы", text: "Кэшбэк — это когда банк возвращает часть потраченных денег.", correct: true, explanation: "Да! Это приятный бонус за покупки картой." }
        ]
    },
    {
        id: 2,
        name: "Цифровая безопасность",
        desc: "Научись защищать себя в интернете",
        icon: "🔒",
        points: 150,
        questions: [
            { type: "quiz", category: "🔒 Безопасность", text: "Что делать, если незнакомец в сети просит твой пароль?", answers: ["Дать, если он вежливый", "Никогда не давать", "Дать фейковый", "Спросить у друзей"], correct: 1, explanation: "Настоящие администраторы НИКОГДА не просят пароль!" },
            { type: "truefalse", category: "🔒 Безопасность", text: "Надёжный пароль должен содержать буквы, цифры и символы.", correct: true, explanation: "Чем сложнее пароль, тем труднее его взломать." },
            { type: "quiz", category: "🔒 Безопасность", text: "Что такое фишинг?", answers: ["Вид рыбалки", "Мошенничество с поддельными сайтами", "Компьютерная игра", "Быстрый интернет"], correct: 1, explanation: "Фишинг — это когда мошенники создают фейковые сайты для кражи данных." },
            { type: "truefalse", category: "🔒 Безопасность", text: "Можно публиковать фото билета с паспортными данными в соцсетях.", correct: false, explanation: "Нет! Это личные данные, которыми могут воспользоваться мошенники." },
            { type: "quiz", category: "🔒 Безопасность", text: "Что делать при получении подозрительной ссылки от друга?", answers: ["Сразу открыть", "Удалить и спросить друга лично", "Переслать другим", "Кликнуть из любопытства"], correct: 1, explanation: "Аккаунт друга могли взломать. Лучше уточнить у него напрямую." }
        ]
    },
    {
        id: 3,
        name: "Экономика вокруг нас",
        desc: "Пойми, как работают цены, реклама и рынок",
        icon: "📊",
        points: 200,
        questions: [
            { type: "quiz", category: "📊 Экономика", text: "Что такое спрос?", answers: ["Желание и возможность купить товар", "Количество товаров в магазине", "Налог на покупку", "Рекламный слоган"], correct: 0, explanation: "Спрос — это когда ты хочешь товар И имеешь деньги на него." },
            { type: "truefalse", category: "📊 Экономика", text: "Реклама всегда говорит только правду о товаре.", correct: false, explanation: "Реклама часто приукрашивает, чтобы заставить купить." },
            { type: "quiz", category: "📊 Экономика", text: "Почему зимой дорожают мандарины?", answers: ["Потому что Новый год", "Сезонность и стоимость доставки", "Магазины жадные", "Случайность"], correct: 1, explanation: "Зимой мандарины везут издалека — это увеличивает расходы." },
            { type: "truefalse", category: "📊 Экономика", text: "Конкуренция заставляет компании улучшать товары.", correct: true, explanation: "Когда фирмы соревнуются, им выгодно делать лучше и дешевле." },
            { type: "quiz", category: "📊 Экономика", text: "Что такое кэшбэк?", answers: ["Возврат части денег за покупку", "Новый налог", "Вид криптовалюты", "Банковский кредит"], correct: 0, explanation: "Кэшбэк — это когда банк возвращает часть потраченных денег." }
        ]
    },
    {
        id: 4,
        name: "Код и технологии",
        desc: "Основы программирования и цифрового мира",
        icon: "💻",
        points: 250,
        questions: [
            { type: "quiz", category: "💻 Технологии", text: "Что такое алгоритм?", answers: ["Последовательность действий", "Компьютерная игра", "Математическая формула", "Вид робота"], correct: 0, explanation: "Алгоритм — это пошаговая инструкция для решения задачи." },
            { type: "quiz", category: "💻 Технологии", text: "Что из этого является языком программирования?", answers: ["Python", "Photoshop", "Windows", "Chrome"], correct: 0, explanation: "Python — популярный язык программирования. Остальное — программы." },
            { type: "truefalse", category: "💻 Технологии", text: "Баг — это ошибка в программе.", correct: true, explanation: "Да! Баги мешают программе работать правильно." },
            { type: "quiz", category: "💻 Технологии", text: "Что из этого НЕ является языком программирования?", answers: ["Python", "Photoshop", "Java", "C++"], correct: 1, explanation: "Photoshop — это графический редактор, а не язык программирования." },
            { type: "truefalse", category: "💻 Технологии", text: "Искусственный интеллект может учиться на данных.", correct: true, explanation: "ИИ анализирует информацию и становится умнее со временем." }
        ]
    },
    {
        id: 5,
        name: "Финансовый мастер",
        desc: "Сложные задачи для настоящих профи!",
        icon: "👑",
        points: 300,
        locked: true,
        questions: [
            { type: "quiz", category: "👑 Финмастер", text: "Что такое диверсификация?", answers: ["Распределение рисков", "Новый вид налога", "Банковская карта", "Стиль одежды"], correct: 0, explanation: "Диверсификация — это когда не кладешь все яйца в одну корзину." },
            { type: "quiz", category: "👑 Финмастер", text: "Что такое криптовалюта?", answers: ["Цифровые деньги без банков", "Игровая валюта", "Наличные доллары", "Банковский кредит"], correct: 0, explanation: "Криптовалюта — цифровые деньги, которые не контролируются банками." },
            { type: "truefalse", category: "👑 Финмастер", text: "Инвестиции всегда гарантируют прибыль.", correct: false, explanation: "Нет! Инвестиции связаны с рисками, можно и потерять." },
            { type: "quiz", category: "👑 Финмастер", text: "Что такое сложный процент?", answers: ["Проценты на проценты", "Очень сложная математика", "Налог на проценты", "Процент от покупки"], correct: 0, explanation: "Доход начисляется и на вклад, и на уже полученные проценты!" },
            { type: "truefalse", category: "👑 Финмастер", text: "NFT — это уникальный цифровой сертификат.", correct: true, explanation: "NFT подтверждает уникальность цифрового объекта." }
        ]
    }
];

const shopItems = [
    { id: 1, icon: "🎨", name: "Тёмная тема", price: 100, owned: false },
    { id: 2, icon: "🤖", name: "Робот Вертер", price: 200, owned: false },
    { id: 3, icon: "🌈", name: "Радужный фон", price: 300, owned: false },
    { id: 4, icon: "👑", name: "Корона", price: 500, owned: false },
    { id: 5, icon: "🚀", name: "Ракета", price: 800, owned: false },
    { id: 6, icon: "🐉", name: "Дракон", price: 1000, owned: false }
];

const achievements = [
    { id: 1, icon: "🌟", name: "Первый шаг", desc: "Пройди первый уровень", unlocked: false },
    { id: 2, icon: "🔥", name: "Серия побед", desc: "5 правильных подряд", unlocked: false },
    { id: 3, icon: "💎", name: "Коллекционер", desc: "Собери 500 баллов", unlocked: false },
    { id: 4, icon: "🚀", name: "Полёт", desc: "Пройди 3 уровня", unlocked: false },
    { id: 5, icon: "👑", name: "Мастер", desc: "Пройди все уровни", unlocked: false },
    { id: 6, icon: "⚡", name: "Молния", desc: "Ответь с первой попытки", unlocked: false },
    { id: 7, icon: "🎯", name: "Снайпер", desc: "Идеальный уровень", unlocked: false },
    { id: 8, icon: "🛡️", name: "Защитник", desc: "Найди всех мошенников", unlocked: false },
    { id: 9, icon: "💰", name: "Банкир", desc: "Собери бюджет без ошибок", unlocked: false },
    { id: 10, icon: "⏱️", name: "Скорость", desc: "Пройди на скорость", unlocked: false }
];

// ===== STATE =====
let currentMode = null; // 'class' or 'solo'
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

let soloState = {
    score: 0,
    streak: 0,
    bestStreak: 0,
    hearts: 3,
    completedLevels: [],
    currentLevel: 0,
    currentQuestion: 0,
    correctAnswers: 0,
    answered: false,
    levelStartTime: 0,
    timerInterval: null
};

let room = null;
let roomListener = null;

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    setupCodeInputs();
    setupAvatarSelect();
    showModeSelect();
});

// ===== SCREEN MANAGEMENT =====
function showScreen(screenId) {
    const screens = ['modeSelectScreen', 'joinScreen', 'waitingScreen', 'soloMenuScreen', 'gameScreen', 'finishScreen'];
    screens.forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    document.getElementById(screenId).classList.remove('hidden');
}

function showModeSelect() {
    showScreen('modeSelectScreen');
    currentMode = null;
}

function showJoinScreen() {
    showScreen('joinScreen');
    currentMode = 'class';
}

function startSoloMode() {
    currentMode = 'solo';
    student.name = 'Игрок';
    student.avatar = '🦊';

    document.getElementById('soloAvatar').textContent = student.avatar;
    document.getElementById('soloName').textContent = student.name;

    renderSoloLevels();
    renderSoloShop();
    renderSoloAchievements();
    updateSoloStats();

    showScreen('soloMenuScreen');
}

// ===== CLASS MODE =====
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

        saveStudent();
        showWaitingScreen();
        listenForGameStart(code);
    });
}

function showJoinError(message) {
    const error = document.getElementById('joinError');
    error.textContent = message;
    error.style.display = 'block';
}

function showWaitingScreen() {
    showScreen('waitingScreen');
    document.getElementById('waitingLessonName').textContent = room?.lessonName || 'Финансовая грамотность';
    document.getElementById('waitingClassInfo').textContent = room?.className || '';
}

function listenForGameStart(roomCode) {
    roomListener = db.ref('rooms/' + roomCode + '/status');
    roomListener.on('value', (snapshot) => {
        const status = snapshot.val();
        if (status === 'playing') {
            startClassGame();
        } else if (status === 'finished') {
            showFinishScreen();
        }
    });
}

function startClassGame() {
    student.status = 'playing';
    saveStudent();

    showScreen('gameScreen');
    document.getElementById('gameAvatar').textContent = student.avatar;
    document.getElementById('gameStudentName').textContent = student.name;
    document.getElementById('gameProgress').textContent = `Уровень 1 из ${room.levelsCount}`;

    loadClassQuestion();
}

function loadClassQuestion() {
    const levelQuestions = levels[student.currentLevel - 1]?.questions || [];
    if (student.currentQuestion >= levelQuestions.length) {
        if (student.currentLevel >= room.levelsCount) {
            finishClassGame();
        } else {
            student.currentLevel++;
            student.currentQuestion = 0;
            document.getElementById('gameProgress').textContent = `Уровень ${student.currentLevel} из ${room.levelsCount}`;
            saveStudent();
            loadClassQuestion();
        }
        return;
    }

    const question = levelQuestions[student.currentQuestion];
    renderQuestion(question, handleClassAnswer);
}

function handleClassAnswer(isCorrect, question) {
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
    document.getElementById('gameScore').textContent = student.score;

    saveStudent();
    showSync();

    document.getElementById('nextBtn').classList.add('show');
}

function finishClassGame() {
    student.status = 'finished';
    saveStudent();
    showFinishScreen();
}

// ===== SOLO MODE =====
function renderSoloLevels() {
    const grid = document.getElementById('soloLevelsGrid');
    grid.innerHTML = '';

    levels.forEach((level, index) => {
        const isLocked = level.locked && !soloState.completedLevels.includes(level.id - 1);
        const isCompleted = soloState.completedLevels.includes(level.id);

        const card = document.createElement('div');
        card.className = `level-card ${isLocked ? 'locked' : ''}`;
        card.innerHTML = `
            <div class="level-number">УРОВЕНЬ ${level.id}</div>
            <div class="level-title">${level.icon} ${level.name}</div>
            <div class="level-desc">${level.desc}</div>
            <div class="level-meta">
                <span class="level-points">+${level.points} баллов</span>
                <span class="level-status">${isLocked ? '🔒' : isCompleted ? '✅' : '▶️'}</span>
            </div>
        `;

        if (!isLocked) {
            card.onclick = () => startSoloLevel(index);
        }

        grid.appendChild(card);
    });
}

function renderSoloShop() {
    const grid = document.getElementById('soloShopGrid');
    grid.innerHTML = '';

    shopItems.forEach(item => {
        const div = document.createElement('div');
        div.className = `shop-item ${item.owned ? 'owned' : ''}`;
        div.innerHTML = `
            <div class="shop-item-icon">${item.icon}</div>
            <div class="shop-item-name">${item.name}</div>
            <div class="shop-item-price">${item.owned ? '✓ Куплено' : '⭐ ' + item.price}</div>
        `;
        div.onclick = () => buyItem(item);
        grid.appendChild(div);
    });
}

function renderSoloAchievements() {
    const grid = document.getElementById('soloAchievementsGrid');
    grid.innerHTML = '';

    achievements.forEach(ach => {
        const div = document.createElement('div');
        div.className = `achievement ${ach.unlocked ? 'unlocked' : ''}`;
        div.innerHTML = `
            <div class="achievement-icon">${ach.unlocked ? ach.icon : '🔒'}</div>
            <div class="achievement-name">${ach.name}</div>
            <div class="achievement-desc">${ach.desc}</div>
        `;
        grid.appendChild(div);
    });
}

function updateSoloStats() {
    document.getElementById('soloScore').textContent = soloState.score;
    updateSoloHearts();
    updateSoloStreak();
}

function updateSoloHearts() {
    const hearts = document.querySelectorAll('#soloHearts .heart');
    hearts.forEach((h, i) => {
        if (i < soloState.hearts) {
            h.classList.remove('lost');
        } else {
            h.classList.add('lost');
        }
    });
}

function updateSoloStreak() {
    const display = document.getElementById('soloStreak');
    if (soloState.streak >= 2) {
        display.style.display = 'flex';
        document.getElementById('soloStreakCount').textContent = soloState.streak;
    } else {
        display.style.display = 'none';
    }
}

function buyItem(item) {
    if (item.owned) {
        showToast('🎁', 'Уже куплено!');
        return;
    }
    if (soloState.score >= item.price) {
        soloState.score -= item.price;
        item.owned = true;
        updateSoloStats();
        renderSoloShop();
        showToast('🛍️', `Куплено: ${item.name}!`);
        createConfetti();
    } else {
        showToast('😅', 'Не хватает баллов!');
    }
}

function startSoloLevel(levelIndex) {
    soloState.currentLevel = levelIndex;
    soloState.currentQuestion = 0;
    soloState.hearts = 3;
    soloState.correctAnswers = 0;
    soloState.answered = false;
    soloState.levelStartTime = Date.now();

    const level = levels[levelIndex];

    showScreen('gameScreen');
    document.getElementById('gameAvatar').textContent = student.avatar;
    document.getElementById('gameStudentName').textContent = student.name;
    document.getElementById('gameProgress').textContent = `Уровень ${level.id}: ${level.name}`;
    document.getElementById('gameScore').textContent = soloState.score;

    updateGameHearts();
    loadSoloQuestion();
}

function loadSoloQuestion() {
    const level = levels[soloState.currentLevel];
    const question = level.questions[soloState.currentQuestion];

    soloState.answered = false;

    renderQuestion(question, handleSoloAnswer);
}

function handleSoloAnswer(isCorrect, question) {
    const feedback = document.getElementById('feedback');

    if (isCorrect) {
        soloState.score += 20;
        soloState.streak++;
        soloState.correctAnswers++;
        if (soloState.streak > soloState.bestStreak) {
            soloState.bestStreak = soloState.streak;
        }

        feedback.className = 'feedback show success';
        feedback.innerHTML = `✅ Правильно! +20 баллов<br><small>${question.explanation}</small>`;

        if (soloState.streak === 5) unlockAchievement(2);
        if (soloState.streak === 1 && soloState.currentQuestion === 0) unlockAchievement(6);
    } else {
        soloState.streak = 0;
        soloState.hearts--;
        updateGameHearts();

        feedback.className = 'feedback show error';
        feedback.innerHTML = `❌ Неправильно.<br><small>${question.explanation}</small>`;

        if (soloState.hearts <= 0) {
            setTimeout(() => {
                showToast('💔', 'Закончились жизни!');
                setTimeout(() => exitGame(), 1500);
            }, 1000);
        }
    }

    updateSoloStreak();
    document.getElementById('gameScore').textContent = soloState.score;
    document.getElementById('nextBtn').classList.add('show');
}

function finishSoloLevel() {
    const level = levels[soloState.currentLevel];
    const maxScore = level.questions.length * 20;
    const percentage = (soloState.correctAnswers / level.questions.length) * 100;

    const bonus = percentage === 100 ? level.points : Math.floor(level.points * 0.5);
    soloState.score += bonus;

    if (!soloState.completedLevels.includes(level.id)) {
        soloState.completedLevels.push(level.id);
    }

    if (level.id === 1) unlockAchievement(1);
    if (soloState.completedLevels.length >= 3) unlockAchievement(4);
    if (soloState.score >= 500) unlockAchievement(3);
    if (soloState.completedLevels.length === levels.length) unlockAchievement(5);
    if (percentage === 100) unlockAchievement(7);

    showToast('🎉', `Уровень пройден! +${bonus} бонусных баллов`);
    createConfetti();

    setTimeout(() => {
        exitGame();
    }, 2000);
}

function startMinigame(type) {
    showToast('🎮', 'Мини-игра скоро появится!');
}

// ===== QUESTION RENDERING =====
function renderQuestion(question, answerHandler) {
    document.getElementById('questionCategory').textContent = question.category;
    document.getElementById('questionText').textContent = question.text;
    document.getElementById('questionInstruction').textContent = question.instruction || '';

    const content = document.getElementById('gameContent');
    content.innerHTML = '';

    document.getElementById('feedback').className = 'feedback';
    document.getElementById('nextBtn').className = 'btn next-btn';

    if (question.type === 'quiz') {
        renderQuiz(question, content, answerHandler);
    } else if (question.type === 'truefalse') {
        renderTrueFalse(question, content, answerHandler);
    }
}

function renderQuiz(question, container, answerHandler) {
    const grid = document.createElement('div');
    grid.className = 'answers-grid';

    const letters = ['А', 'Б', 'В', 'Г'];
    question.answers.forEach((answer, index) => {
        const btn = document.createElement('button');
        btn.className = 'answer-btn';
        btn.innerHTML = `<span class="answer-letter">${letters[index]}</span> ${answer}`;
        btn.onclick = () => {
            document.querySelectorAll('.answer-btn').forEach(b => b.disabled = true);
            document.querySelectorAll('.answer-btn')[question.correct].classList.add('correct');
            if (index !== question.correct) btn.classList.add('wrong');
            answerHandler(index === question.correct, question);
        };
        grid.appendChild(btn);
    });

    container.appendChild(grid);
}

function renderTrueFalse(question, container, answerHandler) {
    const div = document.createElement('div');
    div.className = 'truefalse-container';
    div.innerHTML = `
        <button class="tf-btn true">✓ ПРАВДА</button>
        <button class="tf-btn false">✗ ЛОЖЬ</button>
    `;
    container.appendChild(div);

    const trueBtn = div.querySelector('.tf-btn.true');
    const falseBtn = div.querySelector('.tf-btn.false');

    trueBtn.onclick = () => {
        trueBtn.disabled = falseBtn.disabled = true;
        if (question.correct) {
            trueBtn.classList.add('correct');
        } else {
            trueBtn.classList.add('wrong');
            falseBtn.classList.add('correct');
        }
        answerHandler(question.correct, question);
    };

    falseBtn.onclick = () => {
        trueBtn.disabled = falseBtn.disabled = true;
        if (!question.correct) {
            falseBtn.classList.add('correct');
        } else {
            falseBtn.classList.add('wrong');
            trueBtn.classList.add('correct');
        }
        answerHandler(!question.correct, question);
    };
}

// ===== NAVIGATION =====
function nextQuestion() {
    if (currentMode === 'class') {
        student.currentQuestion++;
        saveStudent();
        loadClassQuestion();
    } else {
        soloState.currentQuestion++;
        const level = levels[soloState.currentLevel];
        if (soloState.currentQuestion >= level.questions.length) {
            finishSoloLevel();
        } else {
            loadSoloQuestion();
        }
    }
}

function exitGame() {
    if (currentMode === 'class') {
        showFinishScreen();
    } else {
        startSoloMode();
    }
}

function showFinishScreen() {
    showScreen('finishScreen');
    document.getElementById('finalScore').textContent = currentMode === 'class' ? student.score : soloState.score;
    document.getElementById('finalLevel').textContent = currentMode === 'class' 
        ? `Пройдено уровней: ${room?.levelsCount || student.currentLevel}`
        : `Пройдено уровней: ${soloState.completedLevels.length}`;
}

function updateGameHearts() {
    const hearts = document.querySelectorAll('#gameHearts .heart');
    hearts.forEach((h, i) => {
        if (i < soloState.hearts) {
            h.classList.remove('lost');
        } else {
            h.classList.add('lost');
        }
    });
}

// ===== FIREBASE SYNC =====
function saveStudent() {
    if (!firebaseInitialized || !student.roomCode) return;
    db.ref('rooms/' + student.roomCode + '/students/' + student.id).set(student);
}

function showSync() {
    const indicator = document.getElementById('syncIndicator');
    indicator.classList.add('show');
    setTimeout(() => indicator.classList.remove('show'), 2000);
}

// ===== UTILITIES =====
function unlockAchievement(id) {
    const ach = achievements.find(a => a.id === id);
    if (ach && !ach.unlocked) {
        ach.unlocked = true;
        setTimeout(() => {
            showToast(ach.icon, `Достижение: ${ach.name}!`);
            if (currentMode === 'solo') renderSoloAchievements();
        }, 300);
    }
}

function showToast(icon, text) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.innerHTML = `<span>${icon}</span><span>${text}</span>`;
    document.body.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

function createConfetti() {
    const colors = ['#f59e0b', '#10b981', '#8b5cf6', '#ec4899', '#f1f5f9'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        document.body.appendChild(confetti);

        const animation = confetti.animate([
            { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
        ], {
            duration: 2000 + Math.random() * 3000,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        });

        animation.onfinish = () => confetti.remove();
    }
}

// Cleanup on unload
window.addEventListener('beforeunload', () => {
    if (currentMode === 'class') {
        saveStudent();
    }
    if (roomListener) {
        roomListener.off();
    }
