// ===========================================
// 🔐 LOGIN.JS - Google Sheets Auth Version
// ===========================================

// 🔗 رابط Google Apps Script Web App
const API_URL = "https://script.google.com/macros/s/AKfycbw4MGVpgCg_Ee3eemazNWhaeW75X3fMmoLctYopQv6HdzR6sv46IDCGZ7l5nJ8YQ1OL/exec";

// متغير منع التهيئة المكررة
let loginInitialized = false;

// ===========================================
// 🚀 تهيئة الصفحة
// ===========================================
document.addEventListener("DOMContentLoaded", () => {
    if (loginInitialized) return;
    loginInitialized = true;

    setupEventListeners();
    loadSavedUsername();
});

// ===========================================
// 🎧 Event Listeners
// ===========================================
function setupEventListeners() {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", e => {
            e.preventDefault();
            handleLogin();
        });
    }

    window.addEventListener("click", e => {
        const modal = document.getElementById("forgotModal");
        if (e.target === modal) closeForgotModal();
    });
}

// ===========================================
// 🔑 Handle Login
// ===========================================
async function handleLogin() {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;
    const rememberMe = document.getElementById("rememberMe").checked;
    const loginBtn = document.getElementById("loginBtn");

    if (!username || !password) {
        showError("الرجاء إدخال اسم المستخدم وكلمة المرور");
        return;
    }

    loginBtn.classList.add("loading");
    loginBtn.disabled = true;
    hideError();

    try {
        const response = await fetch(API_URL);
        const users = await response.json();

        const user = users.find(
            u => u.username === username && u.password === password
        );

        if (user) {
            handleSuccessfulLogin(user, rememberMe);
        } else {
            handleFailedLogin();
        }

    } catch (error) {
        showError("خطأ في الاتصال بقاعدة البيانات");
        console.error(error);
    }

    loginBtn.classList.remove("loading");
    loginBtn.disabled = false;
}

// ===========================================
// 🎉 Login Success
// ===========================================
function handleSuccessfulLogin(user, rememberMe) {
    const sessionData = {
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        loginTime: new Date().toISOString()
    };

    if (rememberMe) {
        localStorage.setItem("qc_user", JSON.stringify(sessionData));
        localStorage.setItem("qc_remember_username", user.username);
    } else {
        sessionStorage.setItem("qc_user", JSON.stringify(sessionData));
        localStorage.removeItem("qc_remember_username");
    }

    logActivity("login", user.username, "success");

    window.location.href = "index.html";
}

// ===========================================
// ❌ Login Failed
// ===========================================
function handleFailedLogin() {
    showError("اسم المستخدم أو كلمة المرور غير صحيحة");

    document.querySelectorAll("input").forEach(input => {
        input.style.animation = "shake 0.4s";
        setTimeout(() => input.style.animation = "", 400);
    });

    logActivity("login", null, "failed");
}

// ===========================================
// 📋 Activity Log (Local)
// ===========================================
function logActivity(type, user, status) {
    const logs = JSON.parse(localStorage.getItem("qc_logs") || "[]");

    logs.push({
        type,
        user,
        status,
        time: new Date().toISOString()
    });

    if (logs.length > 100) logs.shift();
    localStorage.setItem("qc_logs", JSON.stringify(logs));
}

// ===========================================
// 💾 Saved Username
// ===========================================
function loadSavedUsername() {
    const saved = localStorage.getItem("qc_remember_username");
    const usernameInput = document.getElementById("username");
    const remember = document.getElementById("rememberMe");

    if (saved && usernameInput) {
        usernameInput.value = saved;
        remember.checked = true;
    }
}

// ===========================================
// 👁️ Toggle Password
// ===========================================
function togglePassword() {
    const input = document.getElementById("password");
    const icon = document.getElementById("eyeIcon");

    if (input.type === "password") {
        input.type = "text";
        icon.classList.replace("fa-eye", "fa-eye-slash");
    } else {
        input.type = "password";
        icon.classList.replace("fa-eye-slash", "fa-eye");
    }
}

// ===========================================
// ⚠️ Error Handling
// ===========================================
function showError(msg) {
    const box = document.getElementById("errorMessage");
    const text = document.getElementById("errorText");

    if (box && text) {
        text.textContent = msg;
        box.style.display = "flex";
    }
}

function hideError() {
    const box = document.getElementById("errorMessage");
    if (box) box.style.display = "none";
}

// ===========================================
// 🔑 Forgot Password Modal
// ===========================================
function showForgotPassword() {
    document.getElementById("forgotModal").style.display = "flex";
}

function closeForgotModal() {
    document.getElementById("forgotModal").style.display = "none";
}

// ===========================================
// 🚪 Logout
// ===========================================
function logout() {
    localStorage.removeItem("qc_user");
    sessionStorage.removeItem("qc_user");
    window.location.href = "login.html";
}

// ===========================================
// 🔒 Auth Check
// ===========================================
function checkAuth(requiredRole) {
    const user =
        JSON.parse(localStorage.getItem("qc_user")) ||
        JSON.parse(sessionStorage.getItem("qc_user"));

    if (!user) {
        window.location.href = "login.html";
        return false;
    }

    if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
        alert("غير مصرح بالدخول");
        window.location.href = "index.html";
        return false;
    }

    return user;
}

// ===========================================
// 🌍 Expose Functions
// ===========================================
window.logout = logout;
window.checkAuth = checkAuth;
window.togglePassword = togglePassword;
window.showForgotPassword = showForgotPassword;
window.closeForgotModal = closeForgotModal;
