// ===========================================
// 📊 DASHBOARD.JS - لوحة التحكم المتقدمة
// ===========================================

// ========================
// 📈 متغيرات المخططات
// ========================
let qualityChart = null;
let statusChart = null;
let modelsChart = null;
let defectTypesChart = null;
let shiftChart = null;
let trendChart = null;

// ========================
// 🚀 تهيئة الصفحة
// ========================
(function initDashboard() {
    if (window.dashboardInitialized) return;
    window.dashboardInitialized = true;
    
    document.addEventListener('DOMContentLoaded', function() {
        // تحميل الإحصائيات
        loadStats();
        
        // تهيئة المخططات
        initCharts();
        
        // تحميل آخر السجلات
        loadRecentRecords();
        
        // بدء تحديث فوري
        startRealtimeUpdates();
    });
})();

// ========================
// 📊 تحميل الإحصائيات
// ========================
function loadStats() {
    // محاكاة جلب البيانات من قاعدة البيانات
    const stats = generateRealtimeStats();
    
    // تحديث العناصر مع تأثير العد
    animateNumber('totalRecords', stats.totalRecords);
    animateNumber('approvedRecords', stats.approvedRecords);
    animateNumber('pendingRecords', stats.pendingRecords);
    animateNumber('qualityRate', stats.qualityRate, '%');
}

// ========================
// 📈 توليد إحصائيات فورية
// ========================
function generateRealtimeStats() {
    const baseStats = {
        totalRecords: 1247,
        approvedRecords: 1189,
        pendingRecords: 42,
        rejectedRecords: 16,
        qualityRate: 98.2
    };
    
    // إضافة تغييرات عشوائية صغيرة للمحاكاة
    const variation = () => (Math.random() - 0.5) * 0.5;
    
    return {
        totalRecords: baseStats.totalRecords + Math.floor(variation() * 10),
        approvedRecords: baseStats.approvedRecords + Math.floor(variation() * 5),
        pendingRecords: baseStats.pendingRecords + Math.floor(variation() * 3),
        qualityRate: Math.min(100, Math.max(95, baseStats.qualityRate + variation()))
    };
}

// ========================
// 🔢 تأثير العدد المتزايد
// ========================
function animateNumber(elementId, targetValue, suffix = '') {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const duration = 1500;
    const startTime = performance.now();
    const startValue = 0;
    
    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // دالة التسهيل
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        
        const currentValue = startValue + (targetValue - startValue) * easeOutQuart;
        
        if (suffix === '%') {
            element.textContent = currentValue.toFixed(1) + suffix;
        } else {
            element.textContent = Math.floor(currentValue).toLocaleString('ar-SA') + suffix;
        }
        
        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }
    
    requestAnimationFrame(update);
}

// ========================
// 📈 تهيئة جميع المخططات
// ========================
function initCharts() {
    initQualityChart();
    initStatusChart();
    initModelsChart();
    initDefectTypesChart();
    initShiftChart();
    initTrendChart();
}

// ========================
// 📊 مخطط معدل الجودة الشهري
// ========================
function initQualityChart() {
    const ctx = document.getElementById('qualityChart');
    if (!ctx) return;
    
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 320);
    gradient.addColorStop(0, 'rgba(108, 99, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(108, 99, 255, 0.0)');
    
    const data = {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
        datasets: [{
            label: 'معدل الجودة',
            data: [95.2, 96.1, 97.3, 96.8, 98.1, 98.5],
            backgroundColor: gradient,
            borderColor: '#6c63ff',
            borderWidth: 3,
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#6c63ff',
            pointBorderColor: '#fff',
            pointBorderWidth: 3,
            pointRadius: 6,
            pointHoverRadius: 10,
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: '#6c63ff',
            pointHoverBorderWidth: 3
        }, {
            label: 'الهدف',
            data: [95, 95, 95, 95, 95, 95],
            borderColor: '#10b981',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0,
            fill: false,
            pointRadius: 0,
            pointHoverRadius: 0
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index',
            intersect: false
        },
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'start',
                rtl: true,
                labels: {
                    font: { family: 'Cairo', size: 12 },
                    padding: 15,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                titleFont: { family: 'Cairo', size: 14 },
                bodyFont: { family: 'Cairo', size: 13 },
                padding: 15,
                cornerRadius: 10,
                displayColors: true,
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
                    font: { family: 'Cairo', size: 11 },
                    color: '#64748b'
                },
                grid: {
                    color: 'rgba(226, 232, 240, 0.6)',
                    drawBorder: false
                }
            },
            x: {
                ticks: {
                    font: { family: 'Cairo', size: 12 },
                    color: '#64748b'
                },
                grid: {
                    display: false
                }
            }
        },
        animation: {
            duration: 1500,
            easing: 'easeOutQuart'
        }
    };
    
    qualityChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// ========================
// 🥧 مخطط توزيع حالات السجلات
// ========================
function initStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    const data = {
        labels: ['مقبول', 'قيد المراجعة', 'مرفوض'],
        datasets: [{
            data: [1189, 42, 16],
            backgroundColor: [
                '#10b981',
                '#f59e0b',
                '#ef4444'
            ],
            borderWidth: 0,
            hoverOffset: 15
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                rtl: true,
                labels: {
                    font: { family: 'Cairo', size: 13 },
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                titleFont: { family: 'Cairo', size: 14 },
                bodyFont: { family: 'Cairo', size: 13 },
                padding: 15,
                cornerRadius: 10,
                callbacks: {
                    label: function(context) {
                        const total = context.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((context.parsed / total) * 100).toFixed(1);
                        return context.label + ': ' + context.parsed.toLocaleString('ar-SA') + ' (' + percentage + '%)';
                    }
                }
            }
        },
        cutout: '65%',
        animation: {
            animateRotate: true,
            duration: 1500
        }
    };
    
    statusChart = new Chart(ctx, {
        type: 'doughnut',
        data: data,
        options: options
    });
}

// ========================
// 📊 مخطط أداء الموديلات
// ========================
function initModelsChart() {
    const ctx = document.getElementById('modelsChart');
    if (!ctx) return;
    
    const data = {
        labels: ['MOD-001', 'MOD-002', 'MOD-003', 'MOD-004', 'MOD-005'],
        datasets: [{
            label: 'معدل الجودة',
            data: [98.5, 97.2, 99.1, 96.8, 98.0],
            backgroundColor: [
                'rgba(108, 99, 255, 0.8)',
                'rgba(59, 130, 246, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(245, 158, 11, 0.8)',
                'rgba(139, 92, 246, 0.8)'
            ],
            borderColor: [
                '#6c63ff',
                '#3b82f6',
                '#10b981',
                '#f59e0b',
                '#8b5cf6'
            ],
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
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
                    callback: function(value) {
                        return value + '%';
                    },
                    font: { family: 'Cairo', size: 10 },
                    color: '#64748b'
                },
                grid: {
                    color: 'rgba(226, 232, 240, 0.6)',
                    drawBorder: false
                }
            },
            x: {
                ticks: {
                    font: { family: 'Cairo', size: 11 },
                    color: '#64748b'
                },
                grid: {
                    display: false
                }
            }
        },
        animation: {
            duration: 1200,
            easing: 'easeOutBounce'
        }
    };
    
    modelsChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// ========================
// 🥧 مخطط أنواع العيوب
// ========================
function initDefectTypesChart() {
    const ctx = document.getElementById('defectTypesChart');
    if (!ctx) return;
    
    const data = {
        labels: ['خدش', 'بقعة', 'تشوه', 'لون', 'حجم', 'أخرى'],
        datasets: [{
            data: [45, 32, 28, 22, 18, 12],
            backgroundColor: [
                '#ef4444',
                '#f97316',
                '#f59e0b',
                '#eab308',
                '#84cc16',
                '#64748b'
            ],
            borderWidth: 2,
            borderColor: '#fff',
            hoverOffset: 10
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                rtl: true,
                labels: {
                    font: { family: 'Cairo', size: 11 },
                    padding: 10,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    boxWidth: 10
                }
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                titleFont: { family: 'Cairo', size: 13 },
                bodyFont: { family: 'Cairo', size: 12 },
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
        },
        animation: {
            animateRotate: true,
            duration: 1200
        }
    };
    
    defectTypesChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options
    });
}

// ========================
// 📊 مخطط الجودة حسب الوردية
// ========================
function initShiftChart() {
    const ctx = document.getElementById('shiftChart');
    if (!ctx) return;
    
    const data = {
        labels: ['الوردية الصباحية', 'الوردية المسائية', 'الوردية الليلية'],
        datasets: [{
            label: 'معدل الجودة',
            data: [98.7, 97.9, 97.2],
            backgroundColor: [
                'rgba(16, 185, 129, 0.7)',
                'rgba(245, 158, 11, 0.7)',
                'rgba(108, 99, 255, 0.7)'
            ],
            borderColor: [
                '#10b981',
                '#f59e0b',
                '#6c63ff'
            ],
            borderWidth: 2
        }, {
            label: 'الكمية المنتجة',
            data: [4500, 3800, 2800],
            backgroundColor: [
                'rgba(16, 185, 129, 0.3)',
                'rgba(245, 158, 11, 0.3)',
                'rgba(108, 99, 255, 0.3)'
            ],
            borderColor: [
                '#10b981',
                '#f59e0b',
                '#6c63ff'
            ],
            borderWidth: 2,
            yAxisID: 'y1'
        }]
    };
    
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                rtl: true,
                labels: {
                    font: { family: 'Cairo', size: 10 },
                    padding: 10,
                    usePointStyle: true,
                    pointStyle: 'circle'
                }
            },
            tooltip: {
                backgroundColor: 'rgba(30, 41, 59, 0.95)',
                titleFont: { family: 'Cairo', size: 13 },
                bodyFont: { family: 'Cairo', size: 12 },
                padding: 12,
                cornerRadius: 8
            }
        },
        scales: {
            y: {
                beginAtZero: false,
                min: 90,
                max: 100,
                position: 'left',
                ticks: {
                    callback: function(value) {
                        return value + '%';
                    },
                    font: { family: 'Cairo', size: 10 },
                    color: '#64748b'
                },
                grid: {
                    color: 'rgba(226, 232, 240, 0.6)',
                    drawBorder: false
                }
            },
            y1: {
                beginAtZero: true,
                position: 'right',
                ticks: {
                    callback: function(value) {
                        return value.toLocaleString('ar-SA');
                    },
                    font: { family: 'Cairo', size: 10 },
                    color: '#94a3b8'
                },
                grid: {
                    display: false
                }
            },
            x: {
                ticks: {
                    font: { family: 'Cairo', size: 10 },
                    color: '#64748b'
                },
                grid: {
                    display: false
                }
            }
        },
        animation: {
            duration: 1200,
            easing: 'easeOutQuart'
        }
    };
    
    shiftChart = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: options
    });
}

// ========================
// 📈 مخطط الاتجاه الأسبوعي
// ========================
function initTrendChart() {
    // هذا المخطط إضافي يمكن استخدامه في المستقبل
}

// ========================
// 🔄 تحديث فوري للبيانات
// ========================
function startRealtimeUpdates() {
    // تحديث كل 30 ثانية
    setInterval(() => {
        updateStatsRealtime();
    }, 30000);
}

// ========================
// 📊 تحديث الإحصائيات الفورية
// ========================
function updateStatsRealtime() {
    const stats = generateRealtimeStats();
    
    // تحديث العناصر بدون تأثير
    const totalEl = document.getElementById('totalRecords');
    const approvedEl = document.getElementById('approvedRecords');
    const pendingEl = document.getElementById('pendingRecords');
    const qualityEl = document.getElementById('qualityRate');
    
    if (totalEl) totalEl.textContent = stats.totalRecords.toLocaleString('ar-SA');
    if (approvedEl) approvedEl.textContent = stats.approvedRecords.toLocaleString('ar-SA');
    if (pendingEl) pendingEl.textContent = stats.pendingRecords.toLocaleString('ar-SA');
    if (qualityEl) qualityEl.textContent = stats.qualityRate.toFixed(1) + '%';
}

// ========================
// 💾 تحميل مخطط كصورة
// ========================
function downloadChart(chartName) {
    let chart;
    switch(chartName) {
        case 'quality': chart = qualityChart; break;
        case 'status': chart = statusChart; break;
        case 'models': chart = modelsChart; break;
        case 'defects': chart = defectTypesChart; break;
        case 'shift': chart = shiftChart; break;
    }
    
    if (chart) {
        const link = document.createElement('a');
        link.download = `chart-${chartName}-${new Date().toISOString().split('T')[0]}.png`;
        link.href = chart.toBase64Image();
        link.click();
        
        showToast('تم تحميل المخطط بنجاح', 'success');
    }
}

// ========================
// 📋 تحميل آخر السجلات
// ========================
function loadRecentRecords() {
    const tableBody = document.getElementById('recentRecordsTable');
    if (!tableBody) return;
    
    // محاكاة جلب البيانات
    const records = [
        { id: 'QC-2024-01025', date: '2024-06-15', model: 'MOD-001', quantity: 2500, status: 'approved' },
        { id: 'QC-2024-01024', date: '2024-06-15', model: 'MOD-003', quantity: 1800, status: 'approved' },
        { id: 'QC-2024-01023', date: '2024-06-14', model: 'MOD-002', quantity: 3200, status: 'pending' },
        { id: 'QC-2024-01022', date: '2024-06-14', model: 'MOD-005', quantity: 1500, status: 'approved' },
        { id: 'QC-2024-01021', date: '2024-06-13', model: 'MOD-004', quantity: 2800, status: 'rejected' },
        { id: 'QC-2024-01020', date: '2024-06-13', model: 'MOD-001', quantity: 2100, status: 'approved' }
    ];
    
    tableBody.innerHTML = records.map((record, index) => `
        <tr style="animation: fadeIn 0.3s ease ${index * 0.1}s backwards;">
            <td><strong>${record.id}</strong></td>
            <td>${formatDate(record.date)}</td>
            <td><span class="model-badge">${record.model}</span></td>
            <td>${record.quantity.toLocaleString('ar-SA')}</td>
            <td><span class="status-badge ${record.status}">${getStatusLabel(record.status)}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewRecord('${record.id}')" title="عرض">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editRecord('${record.id}')" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteRecord('${record.id}')" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ========================
// 🏷️ الحصول على اسم الحالة
// ========================
function getStatusLabel(status) {
    const labels = {
        'approved': 'مقبول',
        'pending': 'قيد المراجعة',
        'rejected': 'مرفوض'
    };
    return labels[status] || status;
}

// ========================
// 📅 تنسيق التاريخ
// ========================
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// ========================
// 👁️ عرض سجل
// ========================
function viewRecord(recordId) {
    showToast(`عرض السجل ${recordId}`, 'info');
}

// ========================
// ✏️ تعديل سجل
// ========================
function editRecord(recordId) {
    showToast(`تعديل السجل ${recordId}`, 'info');
}

// ========================
// 🗑️ حذف سجل
// ========================
function deleteRecord(recordId) {
    if (confirm(`هل أنت متأكد من حذف السجل ${recordId}؟`)) {
        showToast(`تم حذف السجل ${recordId}`, 'success');
        loadRecentRecords();
    }
}

// ========================
// 🔔 عرض إشعار
// ========================
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// تصدير الدوال للاستخدام العام
window.viewRecord = viewRecord;
window.editRecord = editRecord;
window.deleteRecord = deleteRecord;
window.downloadChart = downloadChart;
