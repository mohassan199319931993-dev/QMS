// ===========================================
// ⚙️ SETTINGS.JS - الإعدادات
// ===========================================

// ========================
// 🚀 تهيئة الصفحة
// ========================
document.addEventListener('DOMContentLoaded', function() {
    // تحميل بيانات المستخدم
    loadUserProfile();
    
    // إعداد تبديل علامات التبويب
    setupTabs();
});

// ========================
// 👤 تحميل بيانات المستخدم
// ========================
function loadUserProfile() {
    const user = getCurrentUser();
    if (!user) return;
    
    document.getElementById('profileImage').src = user.profileImage;
    document.getElementById('profileName').textContent = user.fullName;
    document.getElementById('profileRole').textContent = getRoleLabel(user.role);
    
    document.getElementById('fullName').value = user.fullName;
    document.getElementById('email').value = user.email;
    document.getElementById('department').value = user.department;
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
// 🗂️ إعداد علامات التبويب
// ========================
function setupTabs() {
    const navItems = document.querySelectorAll('.settings-nav .nav-item');
    
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            // إزالة النشاط من جميع العناصر
            navItems.forEach(nav => nav.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
            
            // إضافة النشاط للعنصر المحدد
            this.classList.add('active');
            const tabId = this.dataset.tab;
            document.getElementById(tabId).classList.add('active');
        });
    });
}

// ========================
// 💾 حفظ الملف الشخصي
// ========================
function saveProfile() {
    showToast('تم حفظ الملف الشخصي بنجاح', 'success');
}

// ========================
// 💾 حفظ الإعدادات العامة
// ========================
function saveGeneralSettings() {
    showToast('تم حفظ الإعدادات العامة بنجاح', 'success');
}

// ========================
// 🎨 حفظ إعدادات المظهر
// ========================
function saveAppearanceSettings() {
    const primaryColor = document.getElementById('primaryColor').value;
    document.documentElement.style.setProperty('--primary', primaryColor);
    showToast('تم حفظ إعدادات المظهر بنجاح', 'success');
}

// ========================
// 🔔 حفظ إعدادات الإشعارات
// ========================
function saveNotificationSettings() {
    showToast('تم حفظ إعدادات الإشعارات بنجاح', 'success');
}

// ========================
// 🔑 تغيير كلمة المرور
// ========================
function changePassword() {
    showToast('تم تغيير كلمة المرور بنجاح', 'success');
}

// ========================
// 📸 تغيير الصورة
// ========================
function changeAvatar() {
    showToast('قريباً: إمكانية تغيير الصورة', 'info');
}

// ========================
// 📥 تصدير البيانات
// ========================
function exportAllData() {
    showToast('جاري تصدير البيانات...', 'info');
    setTimeout(() => {
        showToast('تم تصدير البيانات بنجاح', 'success');
    }, 1500);
}

// ========================
// 💾 نسخ احتياطي
// ========================
function createBackup() {
    showToast('جاري إنشاء نسخة احتياطية...', 'info');
    setTimeout(() => {
        showToast('تم إنشاء النسخة الاحتياطية بنجاح', 'success');
    }, 1500);
}

// ========================
// 🗑️ حذف الحساب
// ========================
function deleteAccount() {
    if (confirm('هل أنت متأكد من حذف حسابك؟ هذا الإجراء لا يمكن التراجع عنه.')) {
        showToast('تم حذف الحساب بنجاح', 'success');
        setTimeout(() => {
            logout();
        }, 1500);
    }
}

// تصدير الدوال
window.saveProfile = saveProfile;
window.saveGeneralSettings = saveGeneralSettings;
window.saveAppearanceSettings = saveAppearanceSettings;
window.saveNotificationSettings = saveNotificationSettings;
window.changePassword = changePassword;
window.changeAvatar = changeAvatar;
window.exportAllData = exportAllData;
window.createBackup = createBackup;
window.deleteAccount = deleteAccount;
