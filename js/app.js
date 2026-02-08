/**
 * QMS - Quality Management System
 * Main Application JavaScript
 * Supports Arabic (RTL) and English (LTR)
 */

// ============================================
// Global State & Configuration
// ============================================

const AppState = {
    currentLang: 'ar',
    currentSection: 'dashboard',
    sidebarCollapsed: false,
    defects: [],
    documents: [],
    masterData: {
        departments: ['الإنتاج', 'التجميع', 'التعبئة', 'الجودة', 'المستودع'],
        defectTypes: ['بعدي', 'بصري', 'وظيفي', 'مادي', 'تجميع'],
        models: ['MODEL-A', 'MODEL-B', 'MODEL-C', 'MODEL-D']
    },
    filters: {
        department: '',
        status: '',
        severity: '',
        fromDate: '',
        toDate: ''
    },
    pagination: {
        currentPage: 1,
        itemsPerPage: 10
    }
};

// Translations
const translations = {
    ar: {
        appName: 'نظام إدارة الجودة',
        dashboard: 'لوحة التحكم',
        defectRegistration: 'تسجيل العيوب',
        defectTracking: 'متابعة العيوب',
        analysis: 'تحليل الجودة',
        prediction: 'التنبؤ والتوقع',
        library: 'مكتبة الجودة',
        settings: 'الإعدادات',
        search: 'بحث...',
        totalDefects: 'إجمالي العيوب',
        defectsToday: 'عيوب اليوم',
        ppm: 'PPM',
        openClosed: 'مفتوح / مغلق',
        defectsByDept: 'العيوب حسب القسم',
        defectsByType: 'العيوب حسب النوع',
        monthlyTrend: 'الاتجاه الشهري',
        recentDefects: 'أحدث العيوب',
        viewAll: 'عرض الكل',
        date: 'التاريخ',
        time: 'الوقت',
        department: 'القسم',
        process: 'العملية',
        partCode: 'كود الجزء / الموديل',
        quantity: 'الكمية المتأثرة',
        defectCategory: 'فئة العيب',
        severity: 'الخطورة',
        defectDescription: 'وصف العيب',
        rootCause: 'السبب الجذري (أولي)',
        reporterName: 'اسم المبلغ',
        responsiblePerson: 'الشخص المسؤول',
        attachImage: 'إرفاق صورة',
        dragDrop: 'اسحب الصورة هنا أو انقر للاختيار',
        saveDefect: 'حفظ العيب',
        reset: 'إعادة تعيين',
        id: '#',
        description: 'الوصف',
        status: 'الحالة',
        responsible: 'المسؤول',
        actions: 'إجراءات',
        exportExcel: 'تصدير Excel',
        importExcel: 'استيراد Excel',
        fromDate: 'من تاريخ',
        toDate: 'إلى تاريخ',
        clearFilters: 'مسح',
        paretoAnalysis: 'تحليل باريتو (80/20)',
        paretoDesc: 'تحديد العيوب الأكثر تأثيراً',
        fishboneAnalysis: 'تحليل السبب الجذري (هيكل السمكة)',
        problem: 'المشكلة',
        addCauses: 'إضافة أسباب',
        fiveWhyAnalysis: 'تحليل 5 Why',
        problemStatement: 'بيان المشكلة',
        analyze: 'تحليل',
        rootCauseFound: 'السبب الجذري:',
        ppmCalculator: 'حاسبة PPM',
        totalProduced: 'إجمالي الإنتاج',
        yieldRate: 'معدل العائد',
        defectRate: 'معدل العيوب',
        trendAnalysis: 'تحليل الاتجاه',
        currentRiskLevel: 'مستوى الخطر الحالي',
        low: 'منخفض',
        medium: 'متوسط',
        high: 'عالي',
        defectTrend: 'اتجاه العيوب',
        openIssues: 'القضايا المفتوحة',
        avgResolutionTime: 'متوسط وقت الحل',
        futureDefects: 'التنبؤ بالعيوب المستقبلية',
        next30Days: 'الـ 30 يوم القادمة',
        riskDistribution: 'توزيع المخاطر',
        predictionSettings: 'إعدادات التنبؤ',
        predictionPeriod: 'فترة التنبؤ',
        confidenceLevel: 'مستوى الثقة',
        seasonality: 'الموسمية',
        alertsRecommendations: 'التنبيهات والتوصيات',
        uploadDocument: 'رفع مستند',
        allDocuments: 'الكل',
        sops: 'إجراءات العمل',
        workInstructions: 'تعليمات العمل',
        checklists: 'قوائم الفحص',
        standards: 'معايير الجودة',
        generalSettings: 'إعدادات عامة',
        language: 'اللغة',
        languageDesc: 'اختر لغة الواجهة',
        dateFormat: 'تنسيق التاريخ',
        dateFormatDesc: 'تنسيق عرض التاريخ',
        notifications: 'الإشعارات',
        notificationsDesc: 'تفعيل الإشعارات',
        dataManagement: 'إدارة البيانات',
        exportData: 'تصدير البيانات',
        exportDataDesc: 'تصدير جميع البيانات',
        importData: 'استيراد البيانات',
        importDataDesc: 'استيراد البيانات من ملف',
        clearData: 'مسح البيانات',
        clearDataDesc: 'حذف جميع البيانات',
        masterData: 'البيانات الأساسية',
        departments: 'الأقسام',
        defectTypes: 'أنواع العيوب',
        models: 'الموديلات',
        about: 'حول النظام',
        close: 'إغلاق',
        saveChanges: 'حفظ التغييرات',
        defectDetails: 'تفاصيل العيب',
        correctiveAction: 'الإجراء التصحيحي',
        preventiveAction: 'الإجراء الوقائي',
        targetDate: 'التاريخ المستهدف',
        closed: 'مغلق',
        open: 'مفتوح',
        inProgress: 'قيد المعالجة',
        critical: 'حرجة',
        success: 'تم بنجاح',
        error: 'خطأ',
        warning: 'تحذير',
        info: 'معلومة'
    },
    en: {
        appName: 'Quality Management System',
        dashboard: 'Dashboard',
        defectRegistration: 'Defect Registration',
        defectTracking: 'Defect Tracking',
        analysis: 'Quality Analysis',
        prediction: 'Prediction & Forecast',
        library: 'Quality Library',
        settings: 'Settings',
        search: 'Search...',
        totalDefects: 'Total Defects',
        defectsToday: 'Defects Today',
        ppm: 'PPM',
        openClosed: 'Open / Closed',
        defectsByDept: 'Defects by Department',
        defectsByType: 'Defects by Type',
        monthlyTrend: 'Monthly Trend',
        recentDefects: 'Recent Defects',
        viewAll: 'View All',
        date: 'Date',
        time: 'Time',
        department: 'Department',
        process: 'Process',
        partCode: 'Part Code / Model',
        quantity: 'Quantity Affected',
        defectCategory: 'Defect Category',
        severity: 'Severity',
        defectDescription: 'Defect Description',
        rootCause: 'Root Cause (Initial)',
        reporterName: 'Reporter Name',
        responsiblePerson: 'Responsible Person',
        attachImage: 'Attach Image',
        dragDrop: 'Drag image here or click to select',
        saveDefect: 'Save Defect',
        reset: 'Reset',
        id: '#',
        description: 'Description',
        status: 'Status',
        responsible: 'Responsible',
        actions: 'Actions',
        exportExcel: 'Export Excel',
        importExcel: 'Import Excel',
        fromDate: 'From Date',
        toDate: 'To Date',
        clearFilters: 'Clear',
        paretoAnalysis: 'Pareto Analysis (80/20)',
        paretoDesc: 'Identify most impactful defects',
        fishboneAnalysis: 'Root Cause Analysis (Fishbone)',
        problem: 'Problem',
        addCauses: 'Add Causes',
        fiveWhyAnalysis: '5 Why Analysis',
        problemStatement: 'Problem Statement',
        analyze: 'Analyze',
        rootCauseFound: 'Root Cause:',
        ppmCalculator: 'PPM Calculator',
        totalProduced: 'Total Produced',
        yieldRate: 'Yield Rate',
        defectRate: 'Defect Rate',
        trendAnalysis: 'Trend Analysis',
        currentRiskLevel: 'Current Risk Level',
        low: 'Low',
        medium: 'Medium',
        high: 'High',
        defectTrend: 'Defect Trend',
        openIssues: 'Open Issues',
        avgResolutionTime: 'Avg Resolution Time',
        futureDefects: 'Future Defects Prediction',
        next30Days: 'Next 30 Days',
        riskDistribution: 'Risk Distribution',
        predictionSettings: 'Prediction Settings',
        predictionPeriod: 'Prediction Period',
        confidenceLevel: 'Confidence Level',
        seasonality: 'Seasonality',
        alertsRecommendations: 'Alerts & Recommendations',
        uploadDocument: 'Upload Document',
        allDocuments: 'All',
        sops: 'SOPs',
        workInstructions: 'Work Instructions',
        checklists: 'Checklists',
        standards: 'Quality Standards',
        generalSettings: 'General Settings',
        language: 'Language',
        languageDesc: 'Select interface language',
        dateFormat: 'Date Format',
        dateFormatDesc: 'Date display format',
        notifications: 'Notifications',
        notificationsDesc: 'Enable notifications',
        dataManagement: 'Data Management',
        exportData: 'Export Data',
        exportDataDesc: 'Export all data',
        importData: 'Import Data',
        importDataDesc: 'Import data from file',
        clearData: 'Clear Data',
        clearDataDesc: 'Delete all data',
        masterData: 'Master Data',
        departments: 'Departments',
        defectTypes: 'Defect Types',
        models: 'Models',
        about: 'About',
        close: 'Close',
        saveChanges: 'Save Changes',
        defectDetails: 'Defect Details',
        correctiveAction: 'Corrective Action',
        preventiveAction: 'Preventive Action',
        targetDate: 'Target Date',
        closed: 'Closed',
        open: 'Open',
        inProgress: 'In Progress',
        critical: 'Critical',
        success: 'Success',
        error: 'Error',
        warning: 'Warning',
        info: 'Info'
    }
};

// ============================================
// Utility Functions
// ============================================

function generateId() {
    return 'DEF-' + Date.now().toString(36).toUpperCase();
}

function formatDate(date, format = 'DD/MM/YYYY') {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    
    switch(format) {
        case 'DD/MM/YYYY': return `${day}/${month}/${year}`;
        case 'MM/DD/YYYY': return `${month}/${day}/${year}`;
        case 'YYYY-MM-DD': return `${year}-${month}-${day}`;
        default: return `${day}/${month}/${year}`;
    }
}

function getTodayDate() {
    return new Date().toISOString().split('T')[0];
}

function getCurrentTime() {
    return new Date().toTimeString().slice(0, 5);
}

function showToast(message, type = 'info', title = '') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconMap = {
        success: 'check-circle',
        error: 'times-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    
    toast.innerHTML = `
        <i class="fas fa-${iconMap[type]} toast-icon"></i>
        <div class="toast-content">
            ${title ? `<div class="toast-title">${title}</div>` : ''}
            <div class="toast-message">${message}</div>
        </div>
        <button class="toast-close" onclick="this.parentElement.remove()">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = AppState.currentLang === 'ar' ? 'translateX(-100%)' : 'translateX(100%)';
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

function t(key) {
    return translations[AppState.currentLang][key] || key;
}

function updateTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[AppState.currentLang][key]) {
            el.textContent = translations[AppState.currentLang][key];
        }
    });
    
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[AppState.currentLang][key]) {
            el.placeholder = translations[AppState.currentLang][key];
        }
    });
}

// ============================================
// LocalStorage Management
// ============================================

function saveToStorage(key, data) {
    try {
        localStorage.setItem(`qms_${key}`, JSON.stringify(data));
        return true;
    } catch (e) {
        console.error('Error saving to localStorage:', e);
        return false;
    }
}

function loadFromStorage(key, defaultValue = null) {
    try {
        const data = localStorage.getItem(`qms_${key}`);
        return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
        console.error('Error loading from localStorage:', e);
        return defaultValue;
    }
}

function initializeStorage() {
    // Load defects
    const savedDefects = loadFromStorage('defects');
    if (savedDefects) {
        AppState.defects = savedDefects;
    } else {
        // Generate sample data for demo
        generateSampleData();
    }
    
    // Load documents
    const savedDocuments = loadFromStorage('documents');
    if (savedDocuments) {
        AppState.documents = savedDocuments;
    } else {
        generateSampleDocuments();
    }
    
    // Load master data
    const savedMasterData = loadFromStorage('masterData');
    if (savedMasterData) {
        AppState.masterData = savedMasterData;
    }
    
    // Load language preference
    const savedLang = loadFromStorage('language');
    if (savedLang) {
        AppState.currentLang = savedLang;
        document.documentElement.lang = savedLang;
        document.documentElement.dir = savedLang === 'ar' ? 'rtl' : 'ltr';
    }
}

function generateSampleData() {
    const departments = ['production', 'assembly', 'packaging', 'quality', 'warehouse'];
    const categories = ['dimensional', 'visual', 'functional', 'material', 'assembly'];
    const severities = ['low', 'medium', 'high', 'critical'];
    const statuses = ['open', 'in-progress', 'closed'];
    
    const sampleDefects = [];
    const today = new Date();
    
    for (let i = 0; i < 50; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - Math.floor(Math.random() * 90));
        
        sampleDefects.push({
            id: generateId(),
            date: date.toISOString().split('T')[0],
            time: `${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
            department: departments[Math.floor(Math.random() * departments.length)],
            process: `Process-${Math.floor(Math.random() * 10) + 1}`,
            partCode: `PRD-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            quantity: Math.floor(Math.random() * 100) + 1,
            category: categories[Math.floor(Math.random() * categories.length)],
            severity: severities[Math.floor(Math.random() * severities.length)],
            description: `عيب عينة رقم ${i + 1} - وصف العيب المسجل في النظام`,
            rootCause: i % 3 === 0 ? 'سبب عشوائي للعيب' : '',
            reporterName: `موظف ${Math.floor(Math.random() * 20) + 1}`,
            responsiblePerson: `مسؤول ${Math.floor(Math.random() * 10) + 1}`,
            status: statuses[Math.floor(Math.random() * statuses.length)],
            correctiveAction: '',
            preventiveAction: '',
            targetDate: '',
            closedDate: '',
            image: null,
            createdAt: date.toISOString(),
            updatedAt: date.toISOString()
        });
    }
    
    AppState.defects = sampleDefects.sort((a, b) => new Date(b.date) - new Date(a.date));
    saveToStorage('defects', AppState.defects);
}

function generateSampleDocuments() {
    AppState.documents = [
        { id: 1, name: 'إجراء فحص الجودة', type: 'sop', category: 'sop', date: '2024-01-15', size: '2.5 MB' },
        { id: 2, name: 'تعليمات التجميع', type: 'wi', category: 'wi', date: '2024-01-10', size: '1.8 MB' },
        { id: 3, name: 'قائمة فحص ما قبل الإنتاج', type: 'checklist', category: 'checklist', date: '2024-01-05', size: '500 KB' },
        { id: 4, name: 'معيار ISO 9001', type: 'standard', category: 'standard', date: '2024-01-01', size: '5.2 MB' },
        { id: 5, name: 'إجراء معالجة العيوب', type: 'sop', category: 'sop', date: '2024-01-20', size: '1.2 MB' },
        { id: 6, name: 'تعليمات التعبئة', type: 'wi', category: 'wi', date: '2024-01-18', size: '900 KB' }
    ];
    saveToStorage('documents', AppState.documents);
}

// ============================================
// Navigation & UI
// ============================================

function initNavigation() {
    // Sidebar navigation
    document.querySelectorAll('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const section = link.getAttribute('data-section');
            navigateToSection(section);
        });
    });
    
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('collapsed');
            AppState.sidebarCollapsed = sidebar.classList.contains('collapsed');
        });
    }
    
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            sidebar.classList.toggle('open');
        });
    }
    
    // Language toggle
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.addEventListener('click', toggleLanguage);
    }
    
    // Date filter buttons
    document.querySelectorAll('.date-filter button').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.date-filter button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            updateDashboard();
        });
    });
}

function navigateToSection(sectionId) {
    // Update sidebar active state
    document.querySelectorAll('.sidebar-nav li').forEach(li => li.classList.remove('active'));
    document.querySelector(`.sidebar-nav a[data-section="${sectionId}"]`)?.parentElement.classList.add('active');
    
    // Show section
    document.querySelectorAll('.section').forEach(section => section.classList.remove('active'));
    document.getElementById(sectionId)?.classList.add('active');
    
    AppState.currentSection = sectionId;
    
    // Update section-specific content
    switch(sectionId) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'defect-tracking':
            renderDefectsTable();
            break;
        case 'library':
            renderDocuments();
            break;
        case 'analysis':
            updateAnalysisCharts();
            break;
        case 'prediction':
            updatePrediction();
            break;
    }
    
    // Close mobile sidebar
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.remove('open');
    
    // Scroll to top
    window.scrollTo(0, 0);
}

function toggleLanguage() {
    AppState.currentLang = AppState.currentLang === 'ar' ? 'en' : 'ar';
    document.documentElement.lang = AppState.currentLang;
    document.documentElement.dir = AppState.currentLang === 'ar' ? 'rtl' : 'ltr';
    
    const langToggle = document.getElementById('langToggle');
    if (langToggle) {
        langToggle.querySelector('span').textContent = AppState.currentLang === 'ar' ? 'EN' : 'AR';
    }
    
    updateTranslations();
    saveToStorage('language', AppState.currentLang);
    
    // Refresh current section
    navigateToSection(AppState.currentSection);
}

function changeLanguage() {
    const langSelect = document.getElementById('language');
    if (langSelect) {
        AppState.currentLang = langSelect.value;
        document.documentElement.lang = AppState.currentLang;
        document.documentElement.dir = AppState.currentLang === 'ar' ? 'rtl' : 'ltr';
        
        const langToggle = document.getElementById('langToggle');
        if (langToggle) {
            langToggle.querySelector('span').textContent = AppState.currentLang === 'ar' ? 'EN' : 'AR';
        }
        
        updateTranslations();
        saveToStorage('language', AppState.currentLang);
    }
}

// ============================================
// Modal Functions
// ============================================

function openModal(content) {
    const modal = document.getElementById('defectModal');
    const modalBody = document.getElementById('modalBody');
    
    if (modalBody) {
        modalBody.innerHTML = content;
    }
    
    if (modal) {
        modal.classList.add('active');
    }
}

function closeModal() {
    const modal = document.getElementById('defectModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function closeModalOnOutsideClick(e) {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
}

// ============================================
// Image Preview
// ============================================

function previewImage(input) {
    const preview = document.getElementById('imagePreview');
    preview.innerHTML = '';
    
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            preview.appendChild(img);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

// ============================================
// Excel Import/Export
// ============================================

function exportToCSV(data, filename) {
    if (!data || data.length === 0) {
        showToast(t('noDataToExport'), 'warning');
        return;
    }
    
    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(h => {
            const val = row[h] || '';
            return `"${String(val).replace(/"/g, '""')}"`;
        }).join(','))
    ].join('\n');
    
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    
    showToast(t('exportSuccess'), 'success');
}

function importFromCSV(file, callback) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const text = e.target.result;
        const lines = text.split('\n').filter(line => line.trim());
        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        
        const data = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const row = {};
            headers.forEach((h, idx) => {
                row[h] = values[idx] || '';
            });
            data.push(row);
        }
        
        callback(data);
    };
    reader.readAsText(file);
}

function exportDefectsToExcel() {
    const filteredDefects = getFilteredDefects();
    const exportData = filteredDefects.map(d => ({
        'ID': d.id,
        'Date': d.date,
        'Time': d.time,
        'Department': d.department,
        'Process': d.process,
        'Part Code': d.partCode,
        'Quantity': d.quantity,
        'Category': d.category,
        'Severity': d.severity,
        'Description': d.description,
        'Root Cause': d.rootCause,
        'Reporter': d.reporterName,
        'Responsible': d.responsiblePerson,
        'Status': d.status,
        'Corrective Action': d.correctiveAction,
        'Preventive Action': d.preventiveAction,
        'Target Date': d.targetDate
    }));
    
    exportToCSV(exportData, `defects_${getTodayDate()}.csv`);
}

function importDefectsFromExcel(input) {
    if (!input.files || !input.files[0]) return;
    
    importFromCSV(input.files[0], (data) => {
        let imported = 0;
        data.forEach(row => {
            if (row.Date && row.Description) {
                AppState.defects.push({
                    id: row.ID || generateId(),
                    date: row.Date,
                    time: row.Time || getCurrentTime(),
                    department: row.Department || 'production',
                    process: row.Process || '',
                    partCode: row['Part Code'] || '',
                    quantity: parseInt(row.Quantity) || 1,
                    category: row.Category || 'other',
                    severity: row.Severity || 'medium',
                    description: row.Description,
                    rootCause: row['Root Cause'] || '',
                    reporterName: row.Reporter || 'System',
                    responsiblePerson: row.Responsible || '',
                    status: row.Status || 'open',
                    correctiveAction: row['Corrective Action'] || '',
                    preventiveAction: row['Preventive Action'] || '',
                    targetDate: row['Target Date'] || '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                imported++;
            }
        });
        
        saveToStorage('defects', AppState.defects);
        renderDefectsTable();
        showToast(`${imported} ${t('defectsImported')}`, 'success');
        input.value = '';
    });
}

function exportAllData() {
    const allData = {
        defects: AppState.defects,
        documents: AppState.documents,
        masterData: AppState.masterData,
        exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `qms_backup_${getTodayDate()}.json`;
    link.click();
    
    showToast(t('exportSuccess'), 'success');
}

function importAllData(input) {
    if (!input.files || !input.files[0]) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (data.defects) {
                AppState.defects = data.defects;
                saveToStorage('defects', AppState.defects);
            }
            
            if (data.documents) {
                AppState.documents = data.documents;
                saveToStorage('documents', AppState.documents);
            }
            
            if (data.masterData) {
                AppState.masterData = data.masterData;
                saveToStorage('masterData', AppState.masterData);
            }
            
            showToast(t('importSuccess'), 'success');
            navigateToSection('dashboard');
        } catch (err) {
            showToast(t('importError'), 'error');
        }
    };
    reader.readAsText(input.files[0]);
    input.value = '';
}

function clearAllData() {
    if (confirm(t('confirmClearData'))) {
        AppState.defects = [];
        AppState.documents = [];
        localStorage.removeItem('qms_defects');
        localStorage.removeItem('qms_documents');
        
        generateSampleData();
        generateSampleDocuments();
        
        showToast(t('dataCleared'), 'success');
        navigateToSection('dashboard');
    }
}

// ============================================
// Tags Input
// ============================================

function addTag(event, type) {
    if (event.key === 'Enter') {
        event.preventDefault();
        const input = event.target;
        const value = input.value.trim();
        
        if (value && !AppState.masterData[type].includes(value)) {
            AppState.masterData[type].push(value);
            saveToStorage('masterData', AppState.masterData);
            renderTags(type);
            input.value = '';
        }
    }
}

function removeTag(type, value) {
    AppState.masterData[type] = AppState.masterData[type].filter(t => t !== value);
    saveToStorage('masterData', AppState.masterData);
    renderTags(type);
}

function renderTags(type) {
    const container = document.getElementById(`${type}Tags`);
    if (!container) return;
    
    const input = container.querySelector('input');
    container.innerHTML = '';
    
    AppState.masterData[type].forEach(tag => {
        const tagEl = document.createElement('span');
        tagEl.className = 'tag';
        tagEl.innerHTML = `
            ${tag}
            <button onclick="removeTag('${type}', '${tag}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(tagEl);
    });
    
    container.appendChild(input);
}

// ============================================
// Library Functions
// ============================================

function filterLibrary(category) {
    document.querySelectorAll('.library-categories .category-card').forEach(card => {
        card.classList.toggle('active', card.dataset.category === category);
    });
    renderDocuments(category);
}

function renderDocuments(category = 'all') {
    const grid = document.getElementById('documentsGrid');
    if (!grid) return;
    
    const filtered = category === 'all' 
        ? AppState.documents 
        : AppState.documents.filter(d => d.category === category);
    
    grid.innerHTML = filtered.map(doc => `
        <div class="document-card ${doc.type}" onclick="viewDocument(${doc.id})">
            <div class="document-icon">
                <i class="fas fa-${getDocumentIcon(doc.type)}"></i>
            </div>
            <h4>${doc.name}</h4>
            <p>${t(doc.category)}</p>
            <div class="document-meta">
                <span>${doc.date}</span>
                <span>${doc.size}</span>
            </div>
        </div>
    `).join('');
}

function getDocumentIcon(type) {
    const icons = {
        pdf: 'file-pdf',
        image: 'file-image',
        doc: 'file-word',
        sop: 'file-alt',
        wi: 'tasks',
        checklist: 'check-square',
        standard: 'certificate'
    };
    return icons[type] || 'file';
}

function viewDocument(id) {
    const doc = AppState.documents.find(d => d.id === id);
    if (doc) {
        showToast(`${t('opening')}: ${doc.name}`, 'info');
    }
}

function uploadDocument(input) {
    if (!input.files || !input.files[0]) return;
    
    const file = input.files[0];
    const newDoc = {
        id: Date.now(),
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: file.name.split('.').pop().toLowerCase(),
        category: 'sop',
        date: getTodayDate(),
        size: formatFileSize(file.size)
    };
    
    AppState.documents.push(newDoc);
    saveToStorage('documents', AppState.documents);
    renderDocuments();
    
    showToast(t('documentUploaded'), 'success');
    input.value = '';
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize storage and load data
    initializeStorage();
    
    // Initialize navigation
    initNavigation();
    
    // Set today's date in form
    const dateInput = document.getElementById('defectDate');
    const timeInput = document.getElementById('defectTime');
    if (dateInput) dateInput.value = getTodayDate();
    if (timeInput) timeInput.value = getCurrentTime();
    
    // Initialize master data tags
    renderTags('departments');
    renderTags('defectTypes');
    renderTags('models');
    
    // Update translations
    updateTranslations();
    
    // Initialize dashboard
    updateDashboard();
    
    // Setup modal close on outside click
    document.getElementById('defectModal')?.addEventListener('click', closeModalOnOutsideClick);
    
    console.log('QMS System initialized successfully');
});

// Expose functions globally for onclick handlers
window.navigateToSection = navigateToSection;
window.toggleLanguage = toggleLanguage;
window.changeLanguage = changeLanguage;
window.openModal = openModal;
window.closeModal = closeModal;
window.previewImage = previewImage;
window.exportDefectsToExcel = exportDefectsToExcel;
window.importDefectsFromExcel = importDefectsFromExcel;
window.exportAllData = exportAllData;
window.importAllData = importAllData;
window.clearAllData = clearAllData;
window.addTag = addTag;
window.removeTag = removeTag;
window.filterLibrary = filterLibrary;
window.viewDocument = viewDocument;
window.uploadDocument = uploadDocument;
window.exportToCSV = exportToCSV;
window.showToast = showToast;
window.t = t;
