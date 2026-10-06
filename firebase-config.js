// ===== FIREBASE CONFIGURATION =====
// Этот файл содержит конфигурацию для подключения к Firebase
// Данные уже заполнены и готовы к использованию

const firebaseConfig = {
    apiKey: "AIzaSyCiBsjv49zriigjdFATMEWcHtfCwqC7dnw",
    authDomain: "fincode-project.firebaseapp.com",
    databaseURL: "https://fincode-project-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "fincode-project",
    storageBucket: "fincode-project.firebasestorage.app",
    messagingSenderId: "829798317077",
    appId: "1:829798317077:web:d13854139a8aa6ef25221c"
};

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = firebaseConfig;
}
