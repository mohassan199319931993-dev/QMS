// ===========================================
// 📋 HEADER.JS - رأس الصفحة والتنقل
// ===========================================

// متغير للتحقق من التهيئة
let headerInitialized = false;

// ========================
// 🚀 تهيئة الهيدر
// ========================
document.addEventListener('DOMContentLoaded', function() {
    // منع التهيئة المتكررة
    if (headerInitialized) return;
    headerInitialized = true;
    
    // تحديث معلومات المستخدم
    const user = getCurrentUser();
    if (user) {
        updateUserInfo(user);
    }
    
    // إعداد القائمة
    setupNavigation();
    
    // إعداد البحث
    setupSearch();
    
    // إعداد الإشعارات
    setupNotifications();
    
    // إعداد الوضع الليلي
    setupDarkMode();
    
    // تحديث الوقت
    updateDateTime();
    setInterval(updateDateTime, 60000);
    
    // إعداد القائمة المتنقلة
    setupMobileMenu();
});

// ========================
// 👤 تحديث معلومات المستخدم
// ========================
function updateUserInfo(user) {
    // اسم المستخدم
    const userNameElements = document.querySelectorAll('.user-name');
    userNameElements.forEach(el => {
        if (el.textContent !== user.fullName) {
            el.textContent = user.fullName;
        }
    });
    
    // دور المستخدم
    const userRoleElements = document.querySelectorAll('.user-role');
    userRoleElements.forEach(el => {
        const roleLabel = getRoleLabel(user.role);
        if (el.textContent !== roleLabel) {
            el.textContent = roleLabel;
        }
    });
    
    // صورة المستخدم
    const userImageElements = document.querySelectorAll('.user-image');
    userImageElements.forEach(el => {
        const newSrc = user.profileImage || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=6c63ff&color=fff`;
        if (el.src !== newSrc) {
            el.src = newSrc;
        }
        el.alt = user.fullName;
    });
}

// ========================
// 🏷️ الحصول على اسم الدور
// ========================
function getRoleLabel(role) {
    const roles = {
        'admin': 'مدير النظام',
        'quality_manager': 'مدير الجودة',
        'inspector': 'مفتش الجودة',
        'analyst': 'محلل البيانات'
    };
    return roles[role] || role;
}

// ========================
// 🧭 إعداد التنقل
// ========================
function setupNavigation() {
    // تحديد الرابط النشط
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    document.querySelectorAll('.nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// ========================
// 🔍 إعداد البحث
// ========================
function setupSearch() {
    const searchInput = document.getElementById('globalSearch');
    const searchResults = document.getElementById('searchResults');
    
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();
        
        if (query.length < 2) {
            hideSearchResults();
            return;
        }
        
        searchTimeout = setTimeout(() => {
            performSearch(query);
        }, 300);
    });
    
    searchInput.addEventListener('focus', function() {
        if (this.value.trim().length >= 2) {
            showSearchResults();
        }
    });
    
    // إغلاق نتائج البحث عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.search-container')) {
            hideSearchResults();
        }
    });
    
    // اختصار لوحة المفاتيح Ctrl+K
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            searchInput.focus();
        }
    });
}

// ========================
// 🔎 تنفيذ البحث
// ========================
function performSearch(query) {
    const searchResults = document.getElementById('searchResults');
    
    const results = [
        { type: 'record', title: 'سجل جودة QC-2024-00001', link: 'records.html' },
        { type: 'model', title: 'موديل ألفا (MOD-001)', link: 'data.html' },
        { type: 'document', title: 'دليل ISO 9001', link: 'library.html' },
        { type: 'report', title: 'تقرير الجودة الشهري', link: 'analytics.html' }
    ].filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>لا توجد نتائج لـ "${query}"</p>
            </div>
        `;
    } else {
        searchResults.innerHTML = results.map(result => `
            <a href="${result.link}" class="search-result-item">
                <i class="fas fa-${getResultIcon(result.type)}"></i>
                <span>${highlightMatch(result.title, query)}</span>
            </a>
        `).join('');
    }
    
    showSearchResults();
}

function getResultIcon(type) {
    const icons = {
        'record': 'clipboard-check',
        'model': 'box',
        'document': 'file-alt',
        'report': 'chart-bar'
    };
    return icons[type] || 'circle';
}

function highlightMatch(text, query) {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

function showSearchResults() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.classList.add('show');
    }
}

function hideSearchResults() {
    const searchResults = document.getElementById('searchResults');
    if (searchResults) {
        searchResults.classList.remove('show');
    }
}

// ========================
// 🔔 إعداد الإشعارات
// ========================
function setupNotifications() {
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationPanel = document.getElementById('notificationPanel');
    
    if (!notificationBtn || !notificationPanel) return;
    
    // تحميل الإشعارات مرة واحدة
    loadNotifications();
    
    notificationBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        notificationPanel.classList.toggle('show');
        
        if (notificationPanel.classList.contains('show')) {
            markNotificationsAsRead();
        }
    });
    
    // إغلاق اللوحة عند النقر خارجها
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.notifications-container')) {
            notificationPanel.classList.remove('show');
        }
    });
}

// ========================
// 📬 تحميل الإشعارات
// ========================
function loadNotifications() {
    const notifications = [
        {
            id: 1,
            type: 'warning',
            title: 'انخفاض في جودة خط B',
            message: 'انخفاض طفيف في جودة خط الإنتاج B بنسبة 1.2%',
            time: 'منذ ساعتين',
            read: false
        },
        {
            id: 2,
            type: 'info',
            title: 'اقتراب موعد التدقيق',
            message: 'موعد التدقيق الداخلي القادم خلال 3 أيام',
            time: 'منذ يوم',
            read: false
        },
        {
            id: 3,
            type: 'success',
            title: 'تحقيق الهدف الشهري',
            message: 'تم تحقيق هدف الجودة الشهري بنسبة 98.2%',
            time: 'منذ 3 أيام',
            read: true
        }
    ];
    
    const notificationList = document.getElementById('notificationList');
    const notificationCount = document.getElementById('notificationCount');
    
    if (notificationList) {
        notificationList.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.read ? 'read' : 'unread'}" data-id="${notif.id}">
                <div class="notification-icon ${notif.type}">
                    <i class="fas fa-${getNotificationIcon(notif.type)}"></i>
                </div>
                <div class="notification-content">
                    <h4>${notif.title}</h4>
                    <p>${notif.message}</p>
                    <span class="notification-time">${notif.time}</span>
                </div>
            </div>
        `).join('');
    }
    
    if (notificationCount) {
        const unreadCount = notifications.filter(n => !n.read).length;
        notificationCount.textContent = unreadCount;
        notificationCount.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'check-circle',
        'warning': 'exclamation-triangle',
        'danger': 'times-circle',
        'info': 'info-circle'
    };
    return icons[type] || 'bell';
}

function markNotificationsAsRead() {
    const notificationCount = document.getElementById('notificationCount');
    if (notificationCount) {
        notificationCount.style.display = 'none';
    }
}

function markAllAsRead() {
    document.querySelectorAll('.notification-item').forEach(item => {
        item.classList.remove('unread');
        item.classList.add('read');
    });
    markNotificationsAsRead();
}

// ========================
// 🌙 إعداد الوضع الليلي
// ========================
function setupDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (!darkModeToggle) return;
    
    // التحقق من التفضيل المحفوظ
    const savedTheme = localStorage.getItem('qc_theme') || 'light';
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }
    
    darkModeToggle.addEventListener('click', function() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('qc_theme', newTheme);
        
        this.innerHTML = newTheme === 'dark' ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    });
}

// ========================
// 📅 تحديث الوقت والتاريخ
// ========================
function updateDateTime() {
    const dateElement = document.getElementById('currentDate');
    const timeElement = document.getElementById('currentTime');
    
    const now = new Date();
    
    if (dateElement) {
        dateElement.textContent = now.toLocaleDateString('ar-SA', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    if (timeElement) {
        timeElement.textContent = now.toLocaleTimeString('ar-SA', {
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// ========================
// 📱 إعداد القائمة المتنقلة
// ========================
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (!menuToggle || !sidebar) return;
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('collapsed');
        document.body.classList.toggle('sidebar-collapsed');
        
        const isCollapsed = sidebar.classList.contains('collapsed');
        localStorage.setItem('qc_sidebar_collapsed', isCollapsed);
    });
    
    // استعادة الحالة المحفوظة
    const savedState = localStorage.getItem('qc_sidebar_collapsed') === 'true';
    if (savedState) {
        sidebar.classList.add('collapsed');
        document.body.classList.add('sidebar-collapsed');
    }
}

// ========================
// 👤 تبديل قائمة المستخدم
// ========================
function toggleUserMenu() {
    const userMenu = document.getElementById('userMenu');
    if (userMenu) {
        userMenu.classList.toggle('show');
    }
}

// ========================
// 🚪 تسجيل الخروج
// ========================
function logout() {
    if (confirm('هل تريد تسجيل الخروج من النظام؟')) {
        localStorage.removeItem('qc_user');
        sessionStorage.removeItem('qc_user');
        
        const user = getCurrentUser();
        if (user) {
            logActivity('logout', user.userId, 'success');
        }
        
        window.location.href = 'login.html';
    }
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
        timestamp: new Date().toISOString()
    });
    
    if (activities.length > 100) {
        activities.shift();
    }
    
    localStorage.setItem('qc_activities', JSON.stringify(activities));
}

// ========================
// 👤 الحصول على المستخدم الحالي
// ========================
function getCurrentUser() {
    const userData = localStorage.getItem('qc_user') || sessionStorage.getItem('qc_user');
    return userData ? JSON.parse(userData) : null;
}

// تصدير الدوال
window.toggleUserMenu = toggleUserMenu;
window.logout = logout;
window.getCurrentUser = getCurrentUser;
window.markAllAsRead = markAllAsRead;
