/**
 * QMS - Analysis Module
 * Handles Pareto analysis, Fishbone diagram, 5 Why analysis, and PPM calculations
 */

// ============================================
// Pareto Analysis
// ============================================

function updateParetoChart() {
    const defects = AppState.defects;
    const categoryCounts = {};
    
    // Count defects by category
    defects.forEach(d => {
        categoryCounts[d.category] = (categoryCounts[d.category] || 0) + d.quantity;
    });
    
    // Sort by count descending
    const sortedCategories = Object.entries(categoryCounts)
        .sort((a, b) => b[1] - a[1]);
    
    const categoryNames = {
        dimensional: AppState.currentLang === 'ar' ? 'بعدي' : 'Dimensional',
        visual: AppState.currentLang === 'ar' ? 'بصري' : 'Visual',
        functional: AppState.currentLang === 'ar' ? 'وظيفي' : 'Functional',
        material: AppState.currentLang === 'ar' ? 'مادي' : 'Material',
        assembly: AppState.currentLang === 'ar' ? 'تجميع' : 'Assembly',
        other: AppState.currentLang === 'ar' ? 'أخرى' : 'Other'
    };
    
    const labels = sortedCategories.map(([cat]) => categoryNames[cat] || cat);
    const data = sortedCategories.map(([, count]) => count);
    
    new SimpleChart('paretoChart', 'pareto', {
        labels,
        datasets: [{ data }]
    });
}

// ============================================
// Fishbone (Ishikawa) Diagram
// ============================================

let currentFishboneCauses = {
    man: [],
    machine: [],
    material: [],
    method: [],
    environment: [],
    measurement: []
};

function initFishbone() {
    // Populate defect selector
    const selector = document.getElementById('fishboneDefect');
    if (!selector) return;
    
    selector.innerHTML = `<option value="">${t('selectDefectForAnalysis')}</option>`;
    
    AppState.defects.slice(0, 20).forEach(defect => {
        const option = document.createElement('option');
        option.value = defect.id;
        option.textContent = `${defect.id} - ${defect.description.substring(0, 40)}...`;
        selector.appendChild(option);
    });
}

function updateFishbone() {
    const selector = document.getElementById('fishboneDefect');
    const defectId = selector?.value;
    
    if (!defectId) {
        // Reset causes
        currentFishboneCauses = {
            man: [],
            machine: [],
            material: [],
            method: [],
            environment: [],
            measurement: []
        };
    } else {
        const defect = AppState.defects.find(d => d.id === defectId);
        if (defect && defect.fishboneCauses) {
            currentFishboneCauses = defect.fishboneCauses;
        }
    }
    
    renderFishboneCauses();
}

function addCause() {
    const category = document.getElementById('causeCategory')?.value;
    const text = document.getElementById('causeText')?.value?.trim();
    
    if (!category || !text) {
        showToast(t('pleaseEnterCause'), 'warning');
        return;
    }
    
    if (!currentFishboneCauses[category]) {
        currentFishboneCauses[category] = [];
    }
    
    currentFishboneCauses[category].push({
        id: Date.now(),
        text: text,
        addedAt: new Date().toISOString()
    });
    
    document.getElementById('causeText').value = '';
    renderFishboneCauses();
    
    // Save to defect if selected
    const defectId = document.getElementById('fishboneDefect')?.value;
    if (defectId) {
        const defect = AppState.defects.find(d => d.id === defectId);
        if (defect) {
            defect.fishboneCauses = currentFishboneCauses;
            saveToStorage('defects', AppState.defects);
        }
    }
}

function removeCause(category, causeId) {
    if (currentFishboneCauses[category]) {
        currentFishboneCauses[category] = currentFishboneCauses[category].filter(c => c.id !== causeId);
        renderFishboneCauses();
        
        // Update defect if selected
        const defectId = document.getElementById('fishboneDefect')?.value;
        if (defectId) {
            const defect = AppState.defects.find(d => d.id === defectId);
            if (defect) {
                defect.fishboneCauses = currentFishboneCauses;
                saveToStorage('defects', AppState.defects);
            }
        }
    }
}

function renderFishboneCauses() {
    const container = document.getElementById('causesList');
    if (!container) return;
    
    const categoryLabels = {
        man: AppState.currentLang === 'ar' ? 'الإنسان' : 'Man',
        machine: AppState.currentLang === 'ar' ? 'الآلة' : 'Machine',
        material: AppState.currentLang === 'ar' ? 'المادة' : 'Material',
        method: AppState.currentLang === 'ar' ? 'الطريقة' : 'Method',
        environment: AppState.currentLang === 'ar' ? 'البيئة' : 'Environment',
        measurement: AppState.currentLang === 'ar' ? 'القياس' : 'Measurement'
    };
    
    let html = '';
    
    Object.entries(currentFishboneCauses).forEach(([category, causes]) => {
        if (causes.length > 0) {
            html += `
                <div class="cause-category">
                    <span class="category-tag">${categoryLabels[category]}</span>
                    ${causes.map(cause => `
                        <span class="cause-tag">
                            ${cause.text}
                            <button onclick="removeCause('${category}', ${cause.id})" title="${t('remove')}">
                                <i class="fas fa-times"></i>
                            </button>
                        </span>
                    `).join('')}
                </div>
            `;
        }
    });
    
    if (html === '') {
        html = `<p class="no-causes">${t('noCausesAdded')}</p>`;
    }
    
    container.innerHTML = html;
    
    // Update diagram visual
    updateFishboneVisual();
}

function updateFishboneVisual() {
    // Update the visual representation of causes on the fishbone diagram
    document.querySelectorAll('.category').forEach(catEl => {
        const category = catEl.dataset.category;
        const causes = currentFishboneCauses[category] || [];
        
        // Remove existing cause labels
        catEl.querySelectorAll('.cause-label').forEach(el => el.remove());
        
        // Add cause labels
        causes.slice(0, 3).forEach((cause, index) => {
            const label = document.createElement('div');
            label.className = 'cause-label';
            label.textContent = cause.text;
            label.style.cssText = `
                position: absolute;
                background: #f1f5f9;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 10px;
                white-space: nowrap;
                ${index === 0 ? 'top: -25px;' : index === 1 ? 'top: -45px;' : 'top: -65px;'}
                left: 50%;
                transform: translateX(-50%);
            `;
            catEl.appendChild(label);
        });
    });
}

// ============================================
// 5 Why Analysis
// ============================================

function analyzeFiveWhy() {
    const problem = document.getElementById('fiveWhyProblem')?.value?.trim();
    const answers = Array.from(document.querySelectorAll('.why-answer')).map(input => input.value.trim());
    
    if (!problem) {
        showToast(t('pleaseEnterProblem'), 'warning');
        return;
    }
    
    // Build root cause from answers
    let rootCause = '';
    for (let i = answers.length - 1; i >= 0; i--) {
        if (answers[i]) {
            rootCause = answers[i];
            break;
        }
    }
    
    const resultEl = document.getElementById('rootCauseResult');
    if (resultEl) {
        if (rootCause) {
            resultEl.value = rootCause;
            showToast(t('analysisComplete'), 'success');
        } else {
            resultEl.value = t('insufficientData');
            showToast(t('pleaseAnswerQuestions'), 'warning');
        }
    }
}

// ============================================
// PPM Calculator
// ============================================

function calculatePPM() {
    const totalProduced = parseInt(document.getElementById('totalProduced')?.value) || 0;
    const totalDefects = parseInt(document.getElementById('totalDefectsCalc')?.value) || 0;
    
    if (totalProduced <= 0) {
        document.getElementById('ppmResult').textContent = '0';
        document.getElementById('yieldResult').textContent = '0%';
        document.getElementById('defectRateResult').textContent = '0%';
        return;
    }
    
    const ppm = Math.round((totalDefects / totalProduced) * 1000000);
    const yieldRate = ((totalProduced - totalDefects) / totalProduced * 100).toFixed(2);
    const defectRate = (totalDefects / totalProduced * 100).toFixed(2);
    
    document.getElementById('ppmResult').textContent = ppm.toLocaleString();
    document.getElementById('yieldResult').textContent = yieldRate + '%';
    document.getElementById('defectRateResult').textContent = defectRate + '%';
}

// ============================================
// Trend Analysis Chart
// ============================================

function updateAnalysisTrendChart() {
    const defects = AppState.defects;
    const dailyCounts = {};
    
    // Get last 30 days
    const days = [];
    for (let i = 29; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        days.push(key);
        dailyCounts[key] = 0;
    }
    
    defects.forEach(d => {
        if (dailyCounts.hasOwnProperty(d.date)) {
            dailyCounts[d.date]++;
        }
    });
    
    const labels = days.map(d => d.substring(5)); // MM-DD
    const data = days.map(d => dailyCounts[d]);
    
    // Calculate moving average (7-day)
    const movingAvg = [];
    for (let i = 0; i < data.length; i++) {
        const start = Math.max(0, i - 6);
        const slice = data.slice(start, i + 1);
        const avg = slice.reduce((a, b) => a + b, 0) / slice.length;
        movingAvg.push(Math.round(avg * 10) / 10);
    }
    
    new SimpleChart('analysisTrendChart', 'line', {
        labels,
        datasets: [
            {
                label: AppState.currentLang === 'ar' ? 'العيوب' : 'Defects',
                data,
                borderColor: '#3b82f6'
            },
            {
                label: AppState.currentLang === 'ar' ? 'المتوسط المتحرك' : 'Moving Avg',
                data: movingAvg,
                borderColor: '#f59e0b'
            }
        ]
    });
}

// ============================================
// Update All Analysis
// ============================================

function updateAnalysisCharts() {
    updateParetoChart();
    initFishbone();
    updateAnalysisTrendChart();
}

// ============================================
// Additional Translations
// ============================================

const analysisTranslations = {
    ar: {
        selectDefectForAnalysis: 'اختر العيب للتحليل',
        pleaseEnterCause: 'الرجاء إدخال السبب',
        remove: 'إزالة',
        noCausesAdded: 'لم تتم إضافة أسباب بعد',
        pleaseEnterProblem: 'الرجاء إدخال بيان المشكلة',
        analysisComplete: 'اكتمل التحليل',
        insufficientData: 'بيانات غير كافية',
        pleaseAnswerQuestions: 'الرجاء الإجابة على الأسئلة',
        basicInfo: 'المعلومات الأساسية'
    },
    en: {
        selectDefectForAnalysis: 'Select defect for analysis',
        pleaseEnterCause: 'Please enter a cause',
        remove: 'Remove',
        noCausesAdded: 'No causes added yet',
        pleaseEnterProblem: 'Please enter problem statement',
        analysisComplete: 'Analysis complete',
        insufficientData: 'Insufficient data',
        pleaseAnswerQuestions: 'Please answer the questions',
        basicInfo: 'Basic Information'
    }
};

Object.keys(analysisTranslations).forEach(lang => {
    Object.assign(translations[lang], analysisTranslations[lang]);
});

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize when analysis section is shown
    const analysisLink = document.querySelector('a[data-section="analysis"]');
    if (analysisLink) {
        analysisLink.addEventListener('click', () => {
            setTimeout(updateAnalysisCharts, 100);
        });
    }
});

// Expose functions globally
window.updateAnalysisCharts = updateAnalysisCharts;
window.updateParetoChart = updateParetoChart;
window.initFishbone = initFishbone;
window.updateFishbone = updateFishbone;
window.addCause = addCause;
window.removeCause = removeCause;
window.analyzeFiveWhy = analyzeFiveWhy;
window.calculatePPM = calculatePPM;
window.updateAnalysisTrendChart = updateAnalysisTrendChart;
