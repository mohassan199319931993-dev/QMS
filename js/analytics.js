// ===========================================
// 📊 ANALYTICS.JS - التحليلات مع مخططات تفاعلية
// ===========================================

// متغيرات المخططات
let qualityTrendChart = null;
let statusChart = null;
let modelsChart = null;
let defectTypesChart = null;
let productionLinesChart = null;
let monthlyComparisonChart = null;
let shiftDefectsChart = null;

// ========================
// 🚀 تهيئة الصفحة
// ========================
(function initAnalytics() {
    if (window.analyticsInitialized) return;
    window.analyticsInitialized = true;
    
    document.addEventListener('DOMContentLoaded', function() {
        // تعيين تواريخ افتراضية
        setDefaultDates();
        
        // تهيئة جميع المخططات
        initAllCharts();
    });
})();

// ========================
// 📅 تعيين التواريخ الافتراضية
// ========================
function setDefaultDates() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    
    const fromDateInput = document.getElementById('fromDate');
    const toDateInput = document.getElementById('toDate');
    
    if (fromDateInput) {
        fromDateInput.value = firstDayOfYear.toISOString().split('T')[0];
    }
    if (toDateInput) {
        toDateInput.value = today.toISOString().split('T')[0];
    }
}

// ========================
// 📊 تهيئة جميع المخططات
// ========================
function initAllCharts() {
    initQualityTrendChart();
    initStatusChart();
    initModelsChart();
    initDefectTypesChart();
    initProductionLinesChart();
    initMonthlyComparisonChart();
    initShiftDefectsChart();
}

// ========================
// 📈 مخطط اتجاه الجودة
// ========================
function initQualityTrendChart() {
    const ctx = document.getElementById('qualityTrendChart');
    if (!ctx) return;
    
    const data = {
        labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
        datasets: [
            {
                label: 'معدل الجودة',
                data: [94.5, 95.2, 96.1, 95.8, 97.3, 98.5, 97.9, 98.2, 98.6, 98.1, 98.4, 98.7],
                borderColor: '#6c63ff',
                backgroundColor: 'rgba(108, 99, 255, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#6c63ff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 8
            },
            {
                label: 'الهدف',
                data: [95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95, 95],
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
            legend: {
                position: 'top',
                rtl: true,
                labels: {
                    font: { family: 'Cairo', size: 12 },
                    usePointStyle: true,
                    padding: 20
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
    
    qualityTrendChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options
    });
}

// ========================
// 🥧 مخطط حالات السجلات
// ========================
function initStatusChart() {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;
    
    statusChart = new Chart(ctx, {
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
                        font: { family: 'Cairo', size: 11 },
                        padding: 15,
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
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
function initModelsChart() {
    const ctx = document.getElementById('modelsChart');
    if (!ctx) return;
    
    modelsChart = new Chart(ctx, {
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
// 🥧 مخطط أنواع العيوب
// ========================
function initDefectTypesChart() {
    const ctx = document.getElementById('defectTypesChart');
    if (!ctx) return;
    
    defectTypesChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['عيوب بصرية', 'عيوب هيكلية', 'عيوب وظيفية', 'عيوب تجميع'],
            datasets: [{
                data: [45, 25, 20, 10],
                backgroundColor: ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true,
                    labels: {
                        font: { family: 'Cairo', size: 10 },
                        padding: 10,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

// ========================
// 📊 مخطط خطوط الإنتاج
// ========================
function initProductionLinesChart() {
    const ctx = document.getElementById('productionLinesChart');
    if (!ctx) return;
    
    productionLinesChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['الجودة', 'السرعة', 'الكفاءة', 'السلامة', 'النظافة'],
            datasets: [{
                label: 'خط A',
                data: [95, 88, 92, 98, 90],
                borderColor: '#6c63ff',
                backgroundColor: 'rgba(108, 99, 255, 0.2)',
                pointBackgroundColor: '#6c63ff'
            }, {
                label: 'خط B',
                data: [92, 95, 88, 94, 93],
                borderColor: '#10b981',
                backgroundColor: 'rgba(16, 185, 129, 0.2)',
                pointBackgroundColor: '#10b981'
            }, {
                label: 'خط C',
                data: [88, 90, 95, 92, 96],
                borderColor: '#f59e0b',
                backgroundColor: 'rgba(245, 158, 11, 0.2)',
                pointBackgroundColor: '#f59e0b'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true,
                    labels: {
                        font: { family: 'Cairo', size: 10 }
                    }
                }
            },
            scales: {
                r: {
                    min: 80,
                    max: 100,
                    ticks: {
                        stepSize: 5,
                        backdropColor: 'transparent'
                    }
                }
            }
        }
    });
}

// ========================
// 📊 مخطط المقارنة الشهرية
// ========================
function initMonthlyComparisonChart() {
    const ctx = document.getElementById('monthlyComparisonChart');
    if (!ctx) return;
    
    monthlyComparisonChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
            datasets: [{
                label: '2024',
                data: [120, 135, 142, 128, 156, 148],
                backgroundColor: '#6c63ff',
                borderRadius: 4
            }, {
                label: '2023',
                data: [110, 125, 130, 120, 140, 135],
                backgroundColor: '#94a3b8',
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    rtl: true,
                    labels: {
                        font: { family: 'Cairo', size: 11 }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
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
// 📊 مخطط عيوب الورديات
// ========================
function initShiftDefectsChart() {
    const ctx = document.getElementById('shiftDefectsChart');
    if (!ctx) return;
    
    shiftDefectsChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            labels: ['الوردية 1', 'الوردية 2', 'الوردية 3'],
            datasets: [{
                data: [15, 25, 35],
                backgroundColor: [
                    'rgba(16, 185, 129, 0.7)',
                    'rgba(245, 158, 11, 0.7)',
                    'rgba(239, 68, 68, 0.7)'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    rtl: true,
                    labels: {
                        font: { family: 'Cairo', size: 11 }
                    }
                }
            },
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        display: false
                    }
                }
            }
        }
    });
}

// ========================
// 🔧 تطبيق الفلاتر
// ========================
function applyFilters() {
    showToast('تم تطبيق الفلاتر', 'success');
    
    // تحديث المخططات ببيانات جديدة (محاكاة)
    updateChartsWithNewData();
}

function updateChartsWithNewData() {
    // تحديث مخطط الجودة
    if (qualityTrendChart) {
        const newData = Array.from({length: 12}, () => 90 + Math.random() * 10);
        qualityTrendChart.data.datasets[0].data = newData;
        qualityTrendChart.update();
    }
    
    // تحديث مخطط الموديلات
    if (modelsChart) {
        const newData = Array.from({length: 5}, () => 90 + Math.random() * 10);
        modelsChart.data.datasets[0].data = newData;
        modelsChart.update();
    }
}

// ========================
// 📥 تصدير التقرير
// ========================
function exportReport() {
    showToast('جاري تحضير التقرير...', 'info');
    setTimeout(() => {
        showToast('تم تصدير التقرير بنجاح', 'success');
    }, 1500);
}

// ========================
// 🔄 تبديل نوع المخطط
// ========================
function toggleChartType(chartName) {
    if (chartName === 'qualityTrend' && qualityTrendChart) {
        const newType = qualityTrendChart.config.type === 'line' ? 'bar' : 'line';
        const config = qualityTrendChart.config;
        
        qualityTrendChart.destroy();
        
        const ctx = document.getElementById('qualityTrendChart');
        qualityTrendChart = new Chart(ctx, {
            type: newType,
            data: config.data,
            options: config.options
        });
        
        showToast('تم تغيير نوع المخطط', 'success');
    }
}

// ========================
// 📥 تحميل المخطط
// ========================
function downloadChart(chartName) {
    let chart;
    switch(chartName) {
        case 'qualityTrend': chart = qualityTrendChart; break;
        case 'status': chart = statusChart; break;
        case 'models': chart = modelsChart; break;
    }
    
    if (chart) {
        const link = document.createElement('a');
        link.download = chartName + '-chart.png';
        link.href = chart.toBase64Image();
        link.click();
        showToast('تم تحميل المخطط', 'success');
    }
}

// ========================
// 📤 تصدير الجدول
// ========================
function exportTable() {
    showToast('جاري تصدير الجدول...', 'info');
    setTimeout(() => {
        showToast('تم تصدير الجدول بنجاح', 'success');
    }, 1000);
}

// ========================
// 🔔 Toast Notification
// ========================
function showToast(message, type = 'info') {
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
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// تصدير الدوال
window.applyFilters = applyFilters;
window.exportReport = exportReport;
window.toggleChartType = toggleChartType;
window.downloadChart = downloadChart;
window.exportTable = exportTable;
