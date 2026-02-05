// ===========================================
// 🔐 LOGIN.JS - نظام تسجيل الدخول
// ===========================================

// ========================
// 📦 بيانات المستخدمين
// ========================
const usersDB = [
    {
        id: 'USR-001',
        username: 'admin',
        password: 'admin123',
        fullName: 'مدير النظام',
        email: 'admin@quality.com',
        role: 'admin',
        department: 'إدارة النظام',
        profileImage: 'https://ui-avatars.com/api/?name=Admin&background=6c63ff&color=fff'
    },
    {
        id: 'USR-002',
        username: 'quality_manager',
        password: 'manager123',
        fullName: 'مدير الجودة',
        email: 'manager@quality.com',
        role: 'quality_manager',
        department: 'إدارة الجودة',
        profileImage: 'https://ui-avatars.com/api/?name=Manager&background=10b981&color=fff'
    },
    {
        id: 'USR-003',
        username: 'inspector1',
        password: 'insp123',
        fullName: 'أحمد محمود',
        email: 'ahmed@quality.com',
        role: 'inspector',
        department: 'فحص الجودة',
        profileImage: 'https://ui-avatars.com/api/?name=Ahmed&background=f59e0b&color=fff'
    },
    {
        id: 'USR-004',
        username: 'inspector2',
        password: 'insp123',
        fullName: 'سارة حسن',
        email: 'sara@quality.com',
        role: 'inspector',
        department: 'فحص الجودة',
        profileImage: 'https://ui-avatars.com/api/?name=Sara&background=ec4899&color=fff'
    },
    {
        id: 'USR-005',
        username: 'analyst',
        password: 'analyst123',
        fullName: 'محمد علي',
        email: 'mohamed@quality.com',
        role: 'analyst',
        department: 'تحليل البيانات',
        profileImage: 'https://ui-avatars.com/api/?name=Mohamed&background=3b82f6&color=fff'
    }
];

// متغير للتحقق من التهيئة
let loginInitialized = false;

// ========================
// 🚀 تهيئة الصفحة
// ========================
document.addEventListener('DOMContentLoaded', function() {
    // منع التهيئة المتكررة
    if (loginInitialized) return;
    loginInitialized = true;
    
    // التحقق من وجود جلسة نشطة
    checkExistingSession();
    
    // إعداد مستمعي الأحداث
    setupEventListeners();
    
    // تحميل اسم المستخدم المحفوظ
    loadSavedUsername();
});

// ========================
// 🎧 إعداد مستمعي الأحداث
// ========================
function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleLogin();
        });
    }
    
    // إغلاق النافذة المنبثقة عند النقر خارجها
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('forgotModal');
        if (e.target === modal) {
            closeForgotModal();
        }
    });
    
    // الضغط على Enter في حقول الإدخال
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    if (usernameInput) {
        usernameInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                if (passwordInput) passwordInput.focus();
            }
        });
    }
    
    if (passwordInput) {
        passwordInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                handleLogin();
            }
        });
    }
}

// ========================
// 🔑 معالجة تسجيل الدخول
// ========================
function handleLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const rememberMe = document.getElementById('rememberMe').checked;
    const loginBtn = document.getElementById('loginBtn');
    
    // التحقق من إدخال البيانات
    if (!username || !password) {
        showError('الرجاء إدخال اسم المستخدم وكلمة المرور');
        return;
    }
    
    // عرض حالة التحميل
    loginBtn.classList.add('loading');
    loginBtn.disabled = true;
    hideError();
    
    // محاكاة التحقق من الخادم
    setTimeout(() => {
        const user = authenticateUser(username, password);
        
        if (user) {
            handleSuccessfulLogin(user, rememberMe);
        } else {
            handleFailedLogin();
        }
        
        // إخفاء حالة التحميل
        loginBtn.classList.remove('loading');
        loginBtn.disabled = false;
    }, 1000);
}

// ========================
// ✅ التحقق من المستخدم
// ========================
function authenticateUser(username, password) {
    return usersDB.find(user => 
        user.username === username && user.password === password
    );
}

// ========================
// 🎉 نجاح تسجيل الدخول
// ========================
function handleSuccessfulLogin(user, rememberMe) {
    // حفظ بيانات الجلسة
    const sessionData = {
        userId: user.id,
        username: user.username,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        department: user.department,
        profileImage: user.profileImage,
        loginTime: new Date().toISOString()
    };
    
    // حفظ في LocalStorage أو SessionStorage
    if (rememberMe) {
        localStorage.setItem('qc_user', JSON.stringify(sessionData));
        localStorage.setItem('qc_remember_username', user.username);
    } else {
        sessionStorage.setItem('qc_user', JSON.stringify(sessionData));
        localStorage.removeItem('qc_remember_username');
    }
    
    // تسجيل النشاط
    logActivity('login', user.id, 'success');
    
    // التوجيه إلى الصفحة الرئيسية
    window.location.href = 'index.html';
}

// ========================
// ❌ فشل تسجيل الدخول
// ========================
function handleFailedLogin() {
    showError('اسم المستخدم أو كلمة المرور غير صحيحة');
    
    // تأثير الاهتزاز على الحقول
    const inputs = document.querySelectorAll('.input-wrapper input');
    inputs.forEach(input => {
        input.style.animation = 'shake 0.5s ease';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    });
    
    // تسجيل محاولة فاشلة
    logActivity('login', null, 'failed');
}

// ========================
// 📋 تسجيل النشاط
// ========================
function logActivity(type, userId, status) {
    const activities = JSON.parse(localStorage.getItem('qc_activities') || '[]');
    
    activities.push({
        id: 'ACT-' + Date.now(),
        type: type,
        userId: userId,
        status: status,
        timestamp: new Date().toISOString(),
        ipAddress: '127.0.0.1'
    });
    
    // الاحتفاظ بآخر 100 نشاط فقط
    if (activities.length > 100) {
        activities.shift();
    }
    
    localStorage.setItem('qc_activities', JSON.stringify(activities));
}

// ========================
// 🔍 التحقق من الجلسة
// ========================
function checkExistingSession() {
    const userData = localStorage.getItem('qc_user') || sessionStorage.getItem('qc_user');
    const user = userData ? JSON.parse(userData) : null;
    
    if (user) {
        // التحقق من صلاحية الجلسة (24 ساعة)
        const loginTime = new Date(user.loginTime);
        const now = new Date();
        const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
        
        if (hoursDiff < 24) {
            // الجلسة صالحة، التوجيه للرئيسية
            window.location.href = 'index.html';
        } else {
            // الجلسة منتهية، مسح البيانات
            clearSession();
        }
    }
}

// ========================
// 🧹 مسح الجلسة
// ========================
function clearSession() {
    localStorage.removeItem('qc_user');
    sessionStorage.removeItem('qc_user');
}

// ========================
// 💾 تحميل اسم المستخدم المحفوظ
// ========================
function loadSavedUsername() {
    const savedUsername = localStorage.getItem('qc_remember_username');
    const usernameInput = document.getElementById('username');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const passwordInput = document.getElementById('password');
    
    if (savedUsername && usernameInput) {
        usernameInput.value = savedUsername;
        if (rememberMeCheckbox) rememberMeCheckbox.checked = true;
        if (passwordInput) passwordInput.focus();
    } else if (usernameInput) {
        usernameInput.focus();
    }
}

// ========================
// 👁️ تبديل إظهار كلمة المرور
// ========================
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    if (!passwordInput || !eyeIcon) return;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
}

// ========================
// 📝 تعبئة بيانات تجريبية
// ========================
function fillDemo(username, password) {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    
    if (usernameInput) usernameInput.value = username;
    if (passwordInput) passwordInput.value = password;
    if (rememberMeCheckbox) rememberMeCheckbox.checked = false;
    
    hideError();
}

// ========================
// ⚠️ عرض رسالة خطأ
// ========================
function showError(message) {
    const errorMessage = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    if (errorMessage && errorText) {
        errorText.textContent = message;
        errorMessage.style.display = 'flex';
    }
}

// ========================
// 🗑️ إخفاء رسالة خطأ
// ========================
function hideError() {
    const errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
        errorMessage.style.display = 'none';
    }
}

// ========================
// 🔑 نافذة نسيت كلمة المرور
// ========================
function showForgotPassword() {
    const modal = document.getElementById('forgotModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeForgotModal() {
    const modal = document.getElementById('forgotModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function sendResetLink() {
    const emailInput = document.getElementById('resetEmail');
    if (!emailInput) return;
    
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('الرجاء إدخال البريد الإلكتروني');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('الرجاء إدخال بريد إلكتروني صحيح');
        return;
    }
    
    alert('تم إرسال رابط استعادة كلمة المرور إلى بريدك الإلكتروني');
    closeForgotModal();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ========================
// 🚪 تسجيل الخروج
// ========================
function logout() {
    const user = getCurrentUser();
    
    if (user) {
        logActivity('logout', user.userId, 'success');
    }
    
    clearSession();
    window.location.href = 'login.html';
}

// ========================
// 🔒 التحقق من الصلاحيات
// ========================
function checkAuth(requiredRole) {
    const userData = localStorage.getItem('qc_user') || sessionStorage.getItem('qc_user');
    const user = userData ? JSON.parse(userData) : null;
    
    if (!user) {
        window.location.href = 'login.html';
        return false;
    }
    
    if (requiredRole && user.role !== requiredRole && user.role !== 'admin') {
        alert('ليس لديك صلاحية للوصول إلى هذه الصفحة');
        window.location.href = 'index.html';
        return false;
    }
    
    return user;
}

// ========================
// 👤 الحصول على المستخدم الحالي
// ========================
function getCurrentUser() {
    const userData = localStorage.getItem('qc_user') || sessionStorage.getItem('qc_user');
    return userData ? JSON.parse(userData) : null;
}

// تصدير الدوال
window.logout = logout;
window.checkAuth = checkAuth;
window.getCurrentUser = getCurrentUser;
window.togglePassword = togglePassword;
window.fillDemo = fillDemo;
window.showForgotPassword = showForgotPassword;
window.closeForgotModal = closeForgotModal;
window.sendResetLink = sendResetLink;
