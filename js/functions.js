// ===========================================
// 🔧 FUNCTIONS.JS - دوال مشتركة
// ===========================================

// ========================
// 📅 دوال التاريخ والوقت
// ========================

/**
 * تهيئة نموذج التاريخ والوقت
 */
function initDateForm() {
    const dateInput = document.getElementById("datetime");
    if (!dateInput) return;

    const yearInput = document.getElementById("year");
    const quarterInput = document.getElementById("quarter");
    const monthInput = document.getElementById("month");
    const weekInput = document.getElementById("week");
    const shiftInput = document.getElementById("shift");
    const hourInput = document.getElementById("hour");

    // عند تغيير التاريخ والوقت
    dateInput.addEventListener("change", () => {
        if (!dateInput.value) return;

        const selectedDate = new Date(dateInput.value);
        if (isNaN(selectedDate)) {
            console.error("❌ التاريخ غير صحيح:", dateInput.value);
            return;
        }

        const year = selectedDate.getFullYear();
        if (yearInput) yearInput.value = year;

        // 🗓️ الشهر
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        if (monthInput) monthInput.value = `${year}_${month}`;

        // 📊 الربع
        const quarter = Math.floor(selectedDate.getMonth() / 3) + 1;
        if (quarterInput) quarterInput.value = `${year}_Q${quarter}`;

        // 🔢 الأسبوع
        if (weekInput) weekInput.value = `${year}-W${getWeekNumber(selectedDate)}`;

        // 🕒 استخراج الساعة وعرضها
        const hours = selectedDate.getHours();
        const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
        if (hourInput) hourInput.value = `${hours.toString().padStart(2, "0")}:${minutes}`;

        // 🔄 تحديد الوردية
        if (shiftInput) {
            if (hours >= 7 && hours < 15) {
                shiftInput.value = "1"; // 7 صباحًا - 3 عصرًا
            } else if (hours >= 15 && hours < 23) {
                shiftInput.value = "2"; // 3 عصرًا - 11 مساءً
            } else {
                shiftInput.value = "3"; // 11 مساءً - 7 صباحًا
            }
        }
    });

    // زر "الآن" لتحديد التاريخ الحالي
    const nowButton = document.querySelector('.now-button');
    if (nowButton) {
        nowButton.addEventListener('click', () => {
            const now = new Date();
            const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
                .toISOString()
                .slice(0, 16);
            dateInput.value = localDateTime;
            dateInput.dispatchEvent(new Event('change'));
        });
    }
}

/**
 * حساب رقم الأسبوع
 */
function getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - dayNum + 3);
    const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
    return (
        1 +
        Math.round(
            ((date - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) /
                7
        )
    );
}

// ========================
// 🔍 البحث التلقائي
// ========================

/**
 * تهيئة البحث التلقائي للموديلات
 */
function initModelAutocomplete() {
    const modelCodeInput = document.getElementById('model-code');
    const suggestionsList = document.getElementById('model-suggestions');

    if (!modelCodeInput || !suggestionsList) return;

    modelCodeInput.addEventListener('input', function() {
        const value = this.value.trim().toUpperCase();
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'none';

        if (value.length === 0) return;

        // البحث في قاعدة البيانات
        const filteredModels = window.models ? window.models.filter(model =>
            model.code && model.code.toUpperCase().includes(value)
        ) : [];

        if (filteredModels.length > 0) {
            filteredModels.forEach(model => {
                const li = document.createElement('li');
                li.textContent = `${model.code} - ${model.name}`;
                li.addEventListener('click', () => {
                    modelCodeInput.value = model.code;
                    fillModelFields(model);
                    suggestionsList.style.display = 'none';
                });
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = 'block';
        }
    });

    // إخفاء القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (e.target !== modelCodeInput) {
            suggestionsList.style.display = 'none';
        }
    });
}

/**
 * تعبئة حقول الموديل
 */
function fillModelFields(model) {
    const fields = {
        'model-name': model.name,
        'model-number': model.number,
        'model-type': model.type,
        'm-day': model.mDay,
        'pdn-s': model.pdnS,
        'dft-s': model.dftS,
        'type': model.type,
        'target': model.target
    };

    Object.entries(fields).forEach(([id, value]) => {
        const field = document.getElementById(id);
        if (field) field.value = value || '';
    });
}

// ========================
// 📊 المخططات البيانية
// ========================

/**
 * رسم مخطط بياني
 */
function renderChart(canvasId, type = 'bar', data = null, options = null) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    // بيانات افتراضية
    const defaultData = {
        labels: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو"],
        datasets: [{
            label: "معدل الجودة",
            data: [95, 96, 97, 96, 98, 98.5],
            backgroundColor: 'rgba(108, 99, 255, 0.5)',
            borderColor: '#6c63ff',
            borderWidth: 2,
            tension: 0.4
        }]
    };

    const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                rtl: true,
                labels: {
                    font: { family: 'Cairo' }
                }
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 90,
                max: 100,
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    },
                    font: { family: 'Cairo' }
                }
            },
            x: {
                ticks: {
                    font: { family: 'Cairo' }
                }
            }
        }
    };

    return new Chart(ctx.getContext("2d"), {
        type: type,
        data: data || defaultData,
        options: options || defaultOptions
    });
}

// ========================
// 🔔 Toast Notifications
// ========================

/**
 * عرض رسالة Toast
 */
function showToast(message, type = 'info', duration = 3000) {
    // استخدام الدالة من home.js إذا كانت موجودة
    if (window.showToast && window.showToast !== showToast) {
        window.showToast(message, type, duration);
        return;
    }

    const container = document.getElementById('toastContainer') || createToastContainer();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.style.cssText = `
        background: var(--bg-secondary);
        border: 1px solid var(--border-color);
        border-right: 4px solid ${getToastColor(type)};
        border-radius: 12px;
        padding: 16px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        animation: slideInLeft 0.3s ease;
        min-width: 300px;
        margin-bottom: 12px;
    `;

    const iconClass = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type] || 'fa-info-circle';

    toast.innerHTML = `
        <i class="fas ${iconClass}" style="color: ${getToastColor(type)}; font-size: 20px;"></i>
        <div style="flex: 1;">
            <p style="margin: 0; font-size: 14px;">${message}</p>
        </div>
        <button onclick="this.parentElement.remove()" style="color: var(--text-muted); background: none; border: none; cursor: pointer;">
            <i class="fas fa-times"></i>
        </button>
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOutLeft 0.3s ease forwards';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

function getToastColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toastContainer';
    container.style.cssText = `
        position: fixed;
        bottom: 24px;
        left: 24px;
        display: flex;
        flex-direction: column;
        gap: 12px;
        z-index: 9999;
    `;
    document.body.appendChild(container);
    return container;
}

// ========================
// 🪟 Modal
// ========================

/**
 * عرض نافذة منبثقة
 */
function showModal(title, content) {
    // استخدام الدالة من home.js إذا كانت موجودة
    if (window.showModal && window.showModal !== showModal) {
        window.showModal(title, content);
        return;
    }

    // إزالة أي نافذة منبثقة موجودة
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) existingModal.remove();

    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()" style="
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            backdrop-filter: blur(5px);
        "></div>
        <div class="modal-content" style="
            position: relative;
            background: white;
            border-radius: 16px;
            width: 90%;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
            box-shadow: 0 25px 50px rgba(0,0,0,0.25);
            animation: modalSlideIn 0.3s ease;
        ">
            <div class="modal-header" style="
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 20px;
                border-bottom: 1px solid #e2e8f0;
            ">
                <h3 style="margin: 0; font-size: 18px;">${title}</h3>
                <button onclick="closeModal()" style="
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #718096;
                    background: none;
                    border: none;
                    cursor: pointer;
                ">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="modal-body" style="padding: 0;">
                ${content}
            </div>
        </div>
    `;

    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    `;

    document.body.appendChild(modal);
}

/**
 * إغلاق النافذة المنبثقة
 */
function closeModal() {
    const modal = document.querySelector('.custom-modal');
    if (modal) {
        modal.querySelector('.modal-content').style.animation = 'modalSlideOut 0.2s ease forwards';
        setTimeout(() => modal.remove(), 200);
    }
}

// ========================
// 📋 دوال مساعدة
// ========================

/**
 * تنسيق التاريخ
 */
function formatDate(date, format = 'long') {
    const d = new Date(date);
    if (isNaN(d)) return '';

    const options = {
        short: { year: 'numeric', month: 'short', day: 'numeric' },
        long: { year: 'numeric', month: 'long', day: 'numeric' },
        full: { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }
    };

    return d.toLocaleDateString('ar-SA', options[format] || options.long);
}

/**
 * تنسيق الوقت النسبي
 */
function formatRelativeTime(date) {
    const d = new Date(date);
    const now = new Date();
    const diffMs = now - d;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'الآن';
    if (diffMins < 60) return `منذ ${diffMins} دقيقة`;
    if (diffHours < 24) return `منذ ${diffHours} ساعة`;
    if (diffDays < 7) return `منذ ${diffDays} يوم`;
    return formatDate(date);
}

/**
 * تنسيق الرقم
 */
function formatNumber(num, decimals = 0) {
    return Number(num).toLocaleString('ar-SA', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
    });
}

/**
 * توليد معرف عشوائي
 */
function generateId(prefix = 'ID') {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * نسخ إلى الحافظة
 */
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        showToast('تم النسخ إلى الحافظة', 'success');
    } catch (err) {
        // طريقة بديلة
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('تم النسخ إلى الحافظة', 'success');
    }
}

/**
 * تنزيل ملف
 */
function downloadFile(content, filename, type = 'text/plain') {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

/**
 * تأخير (debounce)
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * خنق (throttle)
 */
function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================
// 🎨 دوال التصميم
// ========================

/**
 * تبديل الوضع الليلي
 */
function toggleDarkMode() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('qc_theme', newTheme);
}

/**
 * تطبيق الوضع المحفوظ
 */
function applySavedTheme() {
    const savedTheme = localStorage.getItem('qc_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
}

// ========================
// 📦 LocalStorage
// ========================

/**
 * حفظ في LocalStorage
 */
function saveToStorage(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to storage:', e);
        return false;
    }
}

/**
 * قراءة من LocalStorage
 */
function loadFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Error loading from storage:', e);
        return defaultValue;
    }
}

/**
 * حذف من LocalStorage
 */
function removeFromStorage(key) {
    localStorage.removeItem(key);
}

// ========================
// 🚀 تهيئة عامة
// ========================
document.addEventListener('DOMContentLoaded', function() {
    // تطبيق الوضع المحفوظ
    applySavedTheme();

    // إضافة أنماط CSS للرسائل
    if (!document.getElementById('toastStyles')) {
        const styles = document.createElement('style');
        styles.id = 'toastStyles';
        styles.textContent = `
            @keyframes slideInLeft {
                from { opacity: 0; transform: translateX(-100%); }
                to { opacity: 1; transform: translateX(0); }
            }
            @keyframes slideOutLeft {
                from { opacity: 1; transform: translateX(0); }
                to { opacity: 0; transform: translateX(-100%); }
            }
            @keyframes modalSlideIn {
                from { opacity: 0; transform: translateY(-20px) scale(0.95); }
                to { opacity: 1; transform: translateY(0) scale(1); }
            }
            @keyframes modalSlideOut {
                from { opacity: 1; transform: translateY(0) scale(1); }
                to { opacity: 0; transform: translateY(-20px) scale(0.95); }
            }
        `;
        document.head.appendChild(styles);
    }
});

// تصدير الدوال
window.showToast = showToast;
window.showModal = showModal;
window.closeModal = closeModal;
window.formatDate = formatDate;
window.formatRelativeTime = formatRelativeTime;
window.formatNumber = formatNumber;
window.generateId = generateId;
window.copyToClipboard = copyToClipboard;
window.downloadFile = downloadFile;
window.debounce = debounce;
window.throttle = throttle;
window.toggleDarkMode = toggleDarkMode;
window.saveToStorage = saveToStorage;
window.loadFromStorage = loadFromStorage;
window.removeFromStorage = removeFromStorage;
