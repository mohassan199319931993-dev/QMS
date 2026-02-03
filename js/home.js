// ===========================================
// 🏠 HOME.JS - الصفحة الرئيسية مع مخططات تفاعلية
// ===========================================

// ========================
// 📚 مصطلحات الجودة
// ========================
const qualityTerms = [
    {
        id: 1,
        title: "ISO 9001:2015",
        category: "iso",
        icon: "📖",
        iconClass: "info",
        definition: "المعيار الدولي لنظام إدارة الجودة الذي يحدد المتطلبات اللازمة لإثبات قدرة المنظمة على تقديم منتجات وخدمات تلبي متطلبات العملاء.",
        tags: ["معيار", "نظام إدارة", "شهادة"]
    },
    {
        id: 2,
        title: "التفكير المبني على المخاطر",
        category: "concepts",
        icon: "🎯",
        iconClass: "warning",
        definition: "نهج استباقي لتحديد وتقييم ومعالجة المخاطر والفرص التي قد تؤثر على قدرة المنظمة على تحقيق أهدافها.",
        tags: ["مخاطر", "استباقي", "تخطيط"]
    },
    {
        id: 3,
        title: "الدورة PDCA",
        category: "concepts",
        icon: "🔄",
        iconClass: "success",
        definition: "دورة التحسين المستمر المكونة من أربع مراحل: التخطيط (Plan)، التنفيذ (Do)، المراجعة (Check)، والعمل (Act).",
        tags: ["تحسين", "دورة", "مستمر"]
    },
    {
        id: 4,
        title: "صوت العميل (VoC)",
        category: "concepts",
        icon: "👂",
        iconClass: "info",
        definition: "عملية جمع وتحليل آراء وتوقعات وملاحظات العملاء لفهم احتياجاتهم وتفضيلاتهم بشكل كامل.",
        tags: ["عميل", "رضا", "بحوث"]
    },
    {
        id: 5,
        title: "مخطط عظمة السمكة",
        category: "tools",
        icon: "🐟",
        iconClass: "warning",
        definition: "أداة تحليلية لتصوير العلاقة السببية بين مشكلة وعواملها المساهمة، مقسمة إلى فئات رئيسية.",
        tags: ["سبب جذري", "تحليل", "مخطط"]
    },
    {
        id: 6,
        title: "تكلفة الجودة (CoQ)",
        category: "concepts",
        icon: "💰",
        iconClass: "success",
        definition: "مجموع التكاليف المرتبطة بمنع واكتشاف وتصحيح منتجات أو خدمات لا تفي بمتطلبات الجودة.",
        tags: ["مالية", "تحليل", "تكاليف"]
    }
];

// متغيرات المخططات
let mainQualityChart = null;
let statusDoughnutChart = null;
let modelsBarChart = null;

// ========================
// 🚀 تهيئة الصفحة
// ========================
(function initHome() {
    if (window.homeInitialized) return;
    window.homeInitialized = true;
    
    document.addEventListener('DOMContentLoaded', function() {
        // تحميل الإحصائيات
        loadDashboardStats();
        
        // تهيئة المخططات
        initCharts();
        
        // تحميل مصطلحات الجودة
        loadQualityTerms();
        
        // تحميل آخر النشاطات
        loadRecentActivity();
        
        // إعداد البحث والفلاتر
        setupTermsSearch();
        setupTermsFilters();
        setupPeriodSelector();
    });
})();

// ========================
// 📊 تحميل الإحصائيات
// ========================
function loadDashboardStats() {
    const stats = {
        totalRecords: 1247,
        qualityRate: 98.2,
        pendingReviews: 23
    };
    
    animateNumber('totalRecords', stats.totalRecords);
    animateNumber('qualityRate', stats.qualityRate, '%');
    animateNumber('pendingReviews', stats.pendingReviews);
}

// ========================
// 🔢 تأثير العدد المتزايد
// ========================
function animateNumber(elementId, targetValue, suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    if (element.dataset.animating === 'true') return;
    element.dataset.animating = 'true';
    
    const duration = 1500;
    const startTime = performance.now();
    const startValue = 0;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
        
        if (suffix === '%') {
            element.textContent = currentValue.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(currentValue).toLocaleString() + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.dataset.animating = 'false';
        }
    }
    
    requestAnimationFrame(update);
}

// ========================
// 📈 تهيئة المخططات
// ========================
function initCharts() {
    initMainQualityChart();
    initStatusDoughnutChart();
    initModelsBarChart();
}

// ========================
// 📊 المخطط الرئيسي - معدل الجودة
// ========================
function initMainQualityChart() {
    const ctx = document.getElementById('mainQualityChart');
    if (!ctx) return;
    
    const data = {
        labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
        datasets: [
            {
                label: 'الجودة الفعلية',
                data: [96.5, 97.2, 98.1, 97.8, 98.5, 98.2, 98.7],
                borderColor: '#6c63ff',
                backgroundColor: 'rgba(108, 99, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6c63ff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 6,
                pointHoverRadius: 8
            },
            {
                label: 'الهدف',
                data: [95, 95, 95, 95, 95, 95, 95],
                borderColor: '#10b981',
                borderWidth: 2,
                borderDash: [5, 5],
                fill: false,
                pointRadius: 0
            }
        ]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            intersect: false,
            mode: 'index'
        },
        plugins: {
            legend: { display: false },
            tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: { family: 'Cairo', size: 14 },
                bodyFont: { family: 'Cairo', size: 13 },
                padding: 12,
                cornerRadius: 8,
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + context.parsed.y + '%';
                    }
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
                    font: { family: 'Cairo' },
                    color: '#64748b'
                },
                grid: {
                    color: '#e2e8f0',
                    drawBorder: false
                }
            },
            x: {
                ticks: {
                    font: { family: 'Cairo' },
                    color: '#64748b'
                },
                grid: { display: false }
            }
        }
    };
    
    mainQualityChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// ========================
// 🥧 مخطط حالات السجلات
// ========================
function initStatusDoughnutChart() {
    const ctx = document.getElementById('statusDoughnutChart');
    if (!ctx) return;
    
    statusDoughnutChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['مقبول', 'قيد المراجعة', 'مرفوض'],
            datasets: [{
                data: [1189, 42, 16],
                backgroundColor: ['#10b981', '#f59e0b', '#ef4444'],
                borderWidth: 0,
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true,
                    labels: {
                        font: { family: 'Cairo', size: 12 },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { family: 'Cairo', size: 14 },
                    bodyFont: { family: 'Cairo', size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return context.label + ': ' + context.parsed + ' (' + percentage + '%)';
                        }
                    }
                }
            }
        }
    });
}

// ========================
// 📊 مخطط أداء الموديلات
// ========================
function initModelsBarChart() {
    const ctx = document.getElementById('modelsBarChart');
    if (!ctx) return;
    
    modelsBarChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['MOD-001', 'MOD-002', 'MOD-003', 'MOD-004', 'MOD-005'],
            datasets: [{
                label: 'معدل الجودة',
                data: [97.5, 95.2, 98.8, 94.1, 96.5],
                backgroundColor: [
                    'rgba(108, 99, 255, 0.8)',
                    'rgba(108, 99, 255, 0.6)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(239, 68, 68, 0.8)',
                    'rgba(245, 158, 11, 0.8)'
                ],
                borderRadius: 6,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    titleFont: { family: 'Cairo', size: 14 },
                    bodyFont: { family: 'Cairo', size: 13 },
                    padding: 12,
                    cornerRadius: 8,
                    callbacks: {
                        label: function(context) {
                            return 'معدل الجودة: ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 90,
                    max: 100,
                    ticks: {
                        callback: v => v + '%',
                        font: { family: 'Cairo', size: 10 },
                        color: '#64748b'
                    },
                    grid: {
                        color: '#e2e8f0',
                        drawBorder: false
                    }
                },
                x: {
                    ticks: {
                        font: { family: 'Cairo', size: 10 },
                        color: '#64748b'
                    },
                    grid: { display: false }
                }
            }
        }
    });
}

// ========================
// 🎛️ تبديل الفترة الزمنية
// ========================
function setupPeriodSelector() {
    const buttons = document.querySelectorAll('.period-btn');
    
    buttons.forEach(btn => {
        btn.addEventListener('click', function() {
            buttons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const period = this.dataset.period;
            updateChartsByPeriod(period);
        });
    });
}

function updateChartsByPeriod(period) {
    // تحديث بيانات المخطط الرئيسي حسب الفترة
    const periodData = {
        week: {
            labels: ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'],
            data: [96.5, 97.2, 98.1, 97.8, 98.5, 98.2, 98.7]
        },
        month: {
            labels: ['الأسبوع 1', 'الأسبوع 2', 'الأسبوع 3', 'الأسبوع 4'],
            data: [96.8, 97.5, 98.2, 98.7]
        },
        quarter: {
            labels: ['الشهر 1', 'الشهر 2', 'الشهر 3'],
            data: [96.5, 97.8, 98.7]
        },
        year: {
            labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
            data: [94.5, 95.2, 96.1, 95.8, 97.3, 98.5, 97.9, 98.2, 98.6, 98.1, 98.4, 98.7]
        }
    };
    
    const data = periodData[period];
    if (data && mainQualityChart) {
        mainQualityChart.data.labels = data.labels;
        mainQualityChart.data.datasets[0].data = data.data;
        mainQualityChart.data.datasets[1].data = data.data.map(() => 95);
        mainQualityChart.update();
    }
}

// ========================
// 📚 تحميل مصطلحات الجودة
// ========================
function loadQualityTerms(filter = 'all', searchQuery = '') {
    const termsGrid = document.getElementById('termsGrid');
    if (!termsGrid) return;
    
    let filteredTerms = qualityTerms;
    
    if (filter !== 'all') {
        filteredTerms = filteredTerms.filter(term => term.category === filter);
    }
    
    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredTerms = filteredTerms.filter(term => 
            term.title.toLowerCase().includes(query) ||
            term.definition.toLowerCase().includes(query) ||
            term.tags.some(tag => tag.toLowerCase().includes(query))
        );
    }
    
    if (filteredTerms.length === 0) {
        termsGrid.innerHTML = `
            <div class="no-results" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <i class="fas fa-search" style="font-size: 48px; color: var(--text-muted); margin-bottom: 16px;"></i>
                <p style="color: var(--text-muted);">لا توجد نتائج مطابقة</p>
            </div>
        `;
        return;
    }
    
    termsGrid.innerHTML = filteredTerms.map(term => `
        <div class="term-card" onclick="showTermDetails(${term.id})">
            <div class="term-card-header">
                <div class="term-icon ${term.iconClass}">
                    <span>${term.icon}</span>
                </div>
                <h4>${term.title}</h4>
            </div>
            <p>${term.definition}</p>
            <div class="term-tags">
                ${term.tags.map(tag => `<span class="term-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `).join('');
}

// ========================
// 🔍 إعداد البحث
// ========================
function setupTermsSearch() {
    const searchInput = document.getElementById('termsSearch');
    if (!searchInput) return;
    
    let searchTimeout;
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim();
        
        searchTimeout = setTimeout(() => {
            const activeFilter = document.querySelector('.filter-chip.active')?.dataset.filter || 'all';
            loadQualityTerms(activeFilter, query);
        }, 300);
    });
}

// ========================
// 🎛️ إعداد الفلاتر
// ========================
function setupTermsFilters() {
    const filterChips = document.querySelectorAll('.filter-chip');
    
    filterChips.forEach(chip => {
        chip.addEventListener('click', function() {
            filterChips.forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            const searchQuery = document.getElementById('termsSearch')?.value.trim() || '';
            loadQualityTerms(filter, searchQuery);
        });
    });
}

// ========================
// 👁️ عرض تفاصيل المصطلح
// ========================
function showTermDetails(termId) {
    const term = qualityTerms.find(t => t.id === termId);
    if (!term) return;
    
    showModal(term.title, `
        <div class="term-modal-content">
            <div class="term-modal-header">
                <div class="term-icon ${term.iconClass}">
                    <span>${term.icon}</span>
                </div>
                <div>
                    <h3>${term.title}</h3>
                    <span class="term-category">${getCategoryLabel(term.category)}</span>
                </div>
            </div>
            <p class="term-definition">${term.definition}</p>
            <div class="term-tags">
                ${term.tags.map(tag => `<span class="term-tag">${tag}</span>`).join('')}
            </div>
        </div>
    `);
}

function getCategoryLabel(category) {
    const labels = {
        'iso': 'معايير ISO',
        'tools': 'أدوات الجودة',
        'concepts': 'مفاهيم أساسية'
    };
    return labels[category] || category;
}

// ========================
// 📝 تحميل آخر النشاطات
// ========================
function loadRecentActivity() {
    const activityList = document.getElementById('activityList');
    if (!activityList) return;
    
    const activities = [
        { icon: 'fa-plus-circle', iconClass: 'success', text: 'تم إضافة سجل جودة جديد QC-2024-01025', time: 'منذ 5 دقائق' },
        { icon: 'fa-check-circle', iconClass: 'info', text: 'تم اعتماد سجل QC-2024-01024', time: 'منذ 15 دقيقة' },
        { icon: 'fa-file-alt', iconClass: 'warning', text: 'تم رفع مستند جديد: دليل ISO 9001', time: 'منذ ساعة' },
        { icon: 'fa-chart-line', iconClass: 'success', text: 'تم إنشاء تقرير الجودة الشهري', time: 'منذ 3 ساعات' },
        { icon: 'fa-user', iconClass: 'info', text: 'تسجيل دخول المستخدم أحمد محمود', time: 'منذ 5 ساعات' }
    ];
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-icon ${activity.iconClass}">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p>${activity.text}</p>
                <span>${activity.time}</span>
            </div>
        </div>
    `).join('');
}

// ========================
// 🔔 Toast Notifications
// ========================
function showToast(message, type = 'info', duration = 3000) {
    let container = document.getElementById('toastContainer');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toastContainer';
        container.className = 'toast-container';
        document.body.appendChild(container);
    }
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const iconClass = {
        success: 'fa-check-circle',
        error: 'fa-times-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    }[type] || 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fas ${iconClass} toast-icon"></i>
        <div class="toast-content"><p>${message}</p></div>
        <button class="toast-close" onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('hiding');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// ========================
// 🪟 Modal
// ========================
function showModal(title, content) {
    const existingModal = document.querySelector('.custom-modal');
    if (existingModal) existingModal.remove();
    
    const modal = document.createElement('div');
    modal.className = 'custom-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="closeModal()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="closeModal()"><i class="fas fa-times"></i></button>
            </div>
            <div class="modal-body">${content}</div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

function closeModal() {
    const modal = document.querySelector('.custom-modal');
    if (modal) modal.remove();
}

// تصدير الدوال
window.showToast = showToast;
window.showModal = showModal;
window.closeModal = closeModal;
window.showTermDetails = showTermDetails;
