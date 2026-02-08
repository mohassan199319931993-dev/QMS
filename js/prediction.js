/**
 * QMS - Prediction & Forecast Module
 * Handles trend-based prediction, risk assessment, and forecasting
 */

// ============================================
// Risk Level Assessment
// ============================================

function calculateRiskLevel() {
    const defects = AppState.defects;
    const now = new Date();
    
    // Calculate metrics
    const last7Days = defects.filter(d => {
        const defectDate = new Date(d.date);
        const daysDiff = (now - defectDate) / (1000 * 60 * 60 * 24);
        return daysDiff <= 7;
    });
    
    const previous7Days = defects.filter(d => {
        const defectDate = new Date(d.date);
        const daysDiff = (now - defectDate) / (1000 * 60 * 60 * 24);
        return daysDiff > 7 && daysDiff <= 14;
    });
    
    // Trend calculation
    const currentCount = last7Days.length;
    const previousCount = previous7Days.length;
    const trend = previousCount > 0 ? ((currentCount - previousCount) / previousCount) * 100 : 0;
    
    // Open issues
    const openIssues = defects.filter(d => d.status === 'open').length;
    
    // Average resolution time
    const closedDefects = defects.filter(d => d.status === 'closed' && d.closedDate);
    let avgResolutionDays = 0;
    
    if (closedDefects.length > 0) {
        const totalDays = closedDefects.reduce((sum, d) => {
            const created = new Date(d.date);
            const closed = new Date(d.closedDate);
            return sum + (closed - created) / (1000 * 60 * 60 * 24);
        }, 0);
        avgResolutionDays = totalDays / closedDefects.length;
    }
    
    // Determine risk level
    let riskLevel = 'low';
    let riskScore = 0;
    
    // Score based on trend
    if (trend > 20) riskScore += 3;
    else if (trend > 10) riskScore += 2;
    else if (trend > 0) riskScore += 1;
    
    // Score based on open issues
    if (openIssues > 20) riskScore += 3;
    else if (openIssues > 10) riskScore += 2;
    else if (openIssues > 5) riskScore += 1;
    
    // Score based on resolution time
    if (avgResolutionDays > 7) riskScore += 3;
    else if (avgResolutionDays > 4) riskScore += 2;
    else if (avgResolutionDays > 2) riskScore += 1;
    
    // Determine final risk level
    if (riskScore >= 6) riskLevel = 'high';
    else if (riskScore >= 3) riskLevel = 'medium';
    
    return {
        level: riskLevel,
        trend: trend,
        openIssues: openIssues,
        avgResolutionDays: avgResolutionDays,
        currentCount: currentCount,
        previousCount: previousCount
    };
}

function updateRiskIndicator() {
    const risk = calculateRiskLevel();
    
    // Update risk level display
    const riskLevelEl = document.getElementById('riskLevel');
    const riskBadge = document.getElementById('riskBadge');
    
    if (riskLevelEl) {
        riskLevelEl.className = `risk-level ${risk.level}`;
    }
    
    if (riskBadge) {
        const riskLabels = {
            low: AppState.currentLang === 'ar' ? 'منخفض' : 'Low',
            medium: AppState.currentLang === 'ar' ? 'متوسط' : 'Medium',
            high: AppState.currentLang === 'ar' ? 'عالي' : 'High'
        };
        riskBadge.className = `risk-badge ${risk.level}`;
        riskBadge.textContent = riskLabels[risk.level];
    }
    
    // Update trend
    const defectTrend = document.getElementById('defectTrend');
    if (defectTrend) {
        const trendIcon = risk.trend > 0 ? 'fa-arrow-up' : 'fa-arrow-down';
        const trendClass = risk.trend > 0 ? 'trend-up' : 'trend-down';
        const trendSign = risk.trend > 0 ? '+' : '';
        defectTrend.className = `factor-value ${trendClass}`;
        defectTrend.innerHTML = `<i class="fas ${trendIcon}"></i> ${trendSign}${Math.abs(risk.trend).toFixed(1)}%`;
    }
    
    // Update open issues
    const openIssuesCount = document.getElementById('openIssuesCount');
    if (openIssuesCount) {
        openIssuesCount.textContent = risk.openIssues;
    }
    
    // Update avg resolution time
    const avgResolutionTime = document.getElementById('avgResolutionTime');
    if (avgResolutionTime) {
        const daysLabel = AppState.currentLang === 'ar' ? 'يوم' : 'days';
        avgResolutionTime.textContent = `${risk.avgResolutionDays.toFixed(1)} ${daysLabel}`;
    }
    
    return risk;
}

// ============================================
// Prediction Algorithm
// ============================================

function calculatePrediction(days = 30) {
    const defects = AppState.defects;
    
    // Get daily defect counts for the last 60 days
    const dailyCounts = {};
    const now = new Date();
    
    for (let i = 59; i >= 0; i--) {
        const d = new Date(now);
        d.setDate(d.getDate() - i);
        const key = d.toISOString().split('T')[0];
        dailyCounts[key] = 0;
    }
    
    defects.forEach(d => {
        if (dailyCounts.hasOwnProperty(d.date)) {
            dailyCounts[d.date]++;
        }
    });
    
    const historicalData = Object.entries(dailyCounts).map(([date, count]) => ({
        date,
        count
    }));
    
    // Simple linear regression
    const n = historicalData.length;
    const sumX = historicalData.reduce((sum, _, i) => sum + i, 0);
    const sumY = historicalData.reduce((sum, d) => sum + d.count, 0);
    const sumXY = historicalData.reduce((sum, d, i) => sum + i * d.count, 0);
    const sumX2 = historicalData.reduce((sum, _, i) => sum + i * i, 0);
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;
    
    // Generate predictions
    const predictions = [];
    const confidenceInterval = 0.2; // 20% confidence interval
    
    for (let i = 1; i <= days; i++) {
        const predictedValue = Math.max(0, slope * (n + i) + intercept);
        const upperBound = predictedValue * (1 + confidenceInterval);
        const lowerBound = predictedValue * (1 - confidenceInterval);
        
        const futureDate = new Date(now);
        futureDate.setDate(futureDate.getDate() + i);
        
        predictions.push({
            date: futureDate.toISOString().split('T')[0],
            predicted: Math.round(predictedValue * 10) / 10,
            upper: Math.round(upperBound * 10) / 10,
            lower: Math.round(Math.max(0, lowerBound) * 10) / 10
        });
    }
    
    return {
        historical: historicalData,
        predictions: predictions,
        slope: slope,
        trend: slope > 0.1 ? 'increasing' : slope < -0.1 ? 'decreasing' : 'stable'
    };
}

function updatePredictionChart() {
    const period = parseInt(document.getElementById('predictionPeriod')?.value) || 30;
    const result = calculatePrediction(period);
    
    // Prepare data for chart
    const historicalDays = result.historical.slice(-14); // Last 14 days
    const labels = [
        ...historicalDays.map(d => d.date.substring(5)),
        ...result.predictions.map(d => d.date.substring(5))
    ];
    
    const historicalData = [...historicalDays.map(d => d.count), ...result.predictions.map(() => null)];
    const predictedData = [...historicalDays.map(() => null), ...result.predictions.map(d => d.predicted)];
    const upperBound = [...historicalDays.map(() => null), ...result.predictions.map(d => d.upper)];
    const lowerBound = [...historicalDays.map(() => null), ...result.predictions.map(d => d.lower)];
    
    // Create custom chart for prediction with confidence interval
    const canvas = document.getElementById('predictionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const width = canvas.width;
    const height = canvas.height;
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    
    ctx.clearRect(0, 0, width, height);
    
    // Calculate max value
    const allValues = [...historicalDays.map(d => d.count), ...result.predictions.map(d => d.upper)];
    const maxValue = Math.max(...allValues, 1);
    
    // Draw axes
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(padding, padding);
    ctx.lineTo(padding, height - padding);
    ctx.lineTo(width - padding, height - padding);
    ctx.stroke();
    
    // Draw confidence interval area
    ctx.fillStyle = 'rgba(59, 130, 246, 0.1)';
    ctx.beginPath();
    
    const predictionStart = historicalDays.length;
    
    // Upper bound
    for (let i = 0; i < result.predictions.length; i++) {
        const x = padding + ((predictionStart + i) / (labels.length - 1)) * chartWidth;
        const y = height - padding - (result.predictions[i].upper / maxValue) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    }
    
    // Lower bound (reverse)
    for (let i = result.predictions.length - 1; i >= 0; i--) {
        const x = padding + ((predictionStart + i) / (labels.length - 1)) * chartWidth;
        const y = height - padding - (result.predictions[i].lower / maxValue) * chartHeight;
        ctx.lineTo(x, y);
    }
    
    ctx.closePath();
    ctx.fill();
    
    // Draw historical data
    ctx.strokeStyle = '#3b82f6';
    ctx.lineWidth = 2;
    ctx.beginPath();
    
    historicalDays.forEach((d, i) => {
        const x = padding + (i / (labels.length - 1)) * chartWidth;
        const y = height - padding - (d.count / maxValue) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    
    // Draw prediction line
    ctx.strokeStyle = '#f59e0b';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    
    result.predictions.forEach((d, i) => {
        const x = padding + ((predictionStart + i) / (labels.length - 1)) * chartWidth;
        const y = height - padding - (d.predicted / maxValue) * chartHeight;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
    });
    
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw points
    historicalDays.forEach((d, i) => {
        const x = padding + (i / (labels.length - 1)) * chartWidth;
        const y = height - padding - (d.count / maxValue) * chartHeight;
        ctx.fillStyle = '#3b82f6';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // Draw prediction points
    result.predictions.forEach((d, i) => {
        const x = padding + ((predictionStart + i) / (labels.length - 1)) * chartWidth;
        const y = height - padding - (d.predicted / maxValue) * chartHeight;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
    });
    
    // X labels (every 7 days)
    ctx.fillStyle = '#64748b';
    ctx.font = '10px Cairo';
    ctx.textAlign = 'center';
    
    for (let i = 0; i < labels.length; i += 7) {
        const x = padding + (i / (labels.length - 1)) * chartWidth;
        ctx.fillText(labels[i], x, height - padding + 20);
    }
    
    // Y-axis labels
    ctx.textAlign = 'right';
    for (let i = 0; i <= 5; i++) {
        const value = Math.round((maxValue / 5) * i);
        const y = height - padding - (chartHeight / 5) * i;
        ctx.fillText(value, padding - 10, y + 4);
    }
    
    // Legend
    const legendY = 15;
    let legendX = width - 200;
    
    ctx.fillStyle = '#3b82f6';
    ctx.fillRect(legendX, legendY - 5, 15, 3);
    ctx.fillStyle = '#475569';
    ctx.font = '11px Cairo';
    ctx.textAlign = 'left';
    ctx.fillText(AppState.currentLang === 'ar' ? 'تاريخي' : 'Historical', legendX + 20, legendY);
    
    legendX += 80;
    ctx.strokeStyle = '#f59e0b';
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(legendX, legendY - 3);
    ctx.lineTo(legendX + 15, legendY - 3);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#475569';
    ctx.fillText(AppState.currentLang === 'ar' ? 'متوقع' : 'Predicted', legendX + 20, legendY);
    
    return result;
}

// ============================================
// Risk Distribution Chart
// ============================================

function updateRiskChart() {
    const defects = AppState.defects;
    
    // Categorize defects by risk
    const riskDistribution = {
        high: 0,
        medium: 0,
        low: 0
    };
    
    defects.forEach(d => {
        if (d.severity === 'critical' || (d.severity === 'high' && d.status === 'open')) {
            riskDistribution.high++;
        } else if (d.severity === 'high' || d.severity === 'medium') {
            riskDistribution.medium++;
        } else {
            riskDistribution.low++;
        }
    });
    
    const labels = [
        AppState.currentLang === 'ar' ? 'خطر عالي' : 'High Risk',
        AppState.currentLang === 'ar' ? 'خطر متوسط' : 'Medium Risk',
        AppState.currentLang === 'ar' ? 'خطر منخفض' : 'Low Risk'
    ];
    
    const data = [riskDistribution.high, riskDistribution.medium, riskDistribution.low];
    const colors = ['#ef4444', '#f59e0b', '#10b981'];
    
    new SimpleChart('riskChart', 'pie', {
        labels,
        datasets: [{ data }]
    }, { colors });
}

// ============================================
// Alerts & Recommendations
// ============================================

function generateAlerts() {
    const alerts = [];
    const defects = AppState.defects;
    const now = new Date();
    
    // Check for critical open defects
    const criticalOpen = defects.filter(d => d.severity === 'critical' && d.status === 'open');
    if (criticalOpen.length > 0) {
        alerts.push({
            type: 'danger',
            title: AppState.currentLang === 'ar' ? 'عيوب حرجة مفتوحة' : 'Critical Open Defects',
            message: `${criticalOpen.length} ${AppState.currentLang === 'ar' ? 'عيوب حرجة تتطلب اهتماماً فورياً' : 'critical defects require immediate attention'}`
        });
    }
    
    // Check for overdue defects
    const overdueDefects = defects.filter(d => {
        if (!d.targetDate || d.status === 'closed') return false;
        const target = new Date(d.targetDate);
        return target < now;
    });
    
    if (overdueDefects.length > 0) {
        alerts.push({
            type: 'warning',
            title: AppState.currentLang === 'ar' ? 'عيوب متأخرة' : 'Overdue Defects',
            message: `${overdueDefects.length} ${AppState.currentLang === 'ar' ? 'عيوب تجاوزت التاريخ المستهدف' : 'defects have exceeded their target date'}`
        });
    }
    
    // Check for increasing trend
    const risk = calculateRiskLevel();
    if (risk.trend > 20) {
        alerts.push({
            type: 'warning',
            title: AppState.currentLang === 'ar' ? 'زيادة في العيوب' : 'Increasing Defects',
            message: AppState.currentLang === 'ar' 
                ? `زيادة بنسبة ${risk.trend.toFixed(1)}% في العيوب مقارنة بالأسبوع الماضي`
                : `Defects increased by ${risk.trend.toFixed(1)}% compared to last week`
        });
    }
    
    // Check for department with most defects
    const deptCounts = {};
    defects.forEach(d => {
        deptCounts[d.department] = (deptCounts[d.department] || 0) + 1;
    });
    
    const topDept = Object.entries(deptCounts).sort((a, b) => b[1] - a[1])[0];
    if (topDept && topDept[1] > 10) {
        const deptNames = {
            production: AppState.currentLang === 'ar' ? 'الإنتاج' : 'Production',
            assembly: AppState.currentLang === 'ar' ? 'التجميع' : 'Assembly',
            packaging: AppState.currentLang === 'ar' ? 'التعبئة' : 'Packaging',
            quality: AppState.currentLang === 'ar' ? 'الجودة' : 'Quality',
            warehouse: AppState.currentLang === 'ar' ? 'المستودع' : 'Warehouse'
        };
        
        alerts.push({
            type: 'info',
            title: AppState.currentLang === 'ar' ? 'القسم الأكثر عيوباً' : 'Department with Most Defects',
            message: `${deptNames[topDept[0]] || topDept[0]}: ${topDept[1]} ${AppState.currentLang === 'ar' ? 'عيوب' : 'defects'}`
        });
    }
    
    // Recommendation based on analysis
    if (risk.avgResolutionDays > 5) {
        alerts.push({
            type: 'info',
            title: AppState.currentLang === 'ar' ? 'توصية للتحسين' : 'Improvement Recommendation',
            message: AppState.currentLang === 'ar'
                ? 'متوسط وقت الحل مرتفع. يُنصح بمراجعة عملية معالجة العيوب.'
                : 'Average resolution time is high. Consider reviewing the defect handling process.'
        });
    }
    
    return alerts;
}

function renderAlerts() {
    const container = document.getElementById('alertsList');
    if (!container) return;
    
    const alerts = generateAlerts();
    
    if (alerts.length === 0) {
        container.innerHTML = `
            <div class="alert-item info">
                <div class="alert-icon">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="alert-content">
                    <h4>${AppState.currentLang === 'ar' ? 'لا توجد تنبيهات' : 'No Alerts'}</h4>
                    <p>${AppState.currentLang === 'ar' ? 'النظام يعمل بشكل طبيعي' : 'System is operating normally'}</p>
                </div>
            </div>
        `;
        return;
    }
    
    container.innerHTML = alerts.map(alert => `
        <div class="alert-item ${alert.type}">
            <div class="alert-icon">
                <i class="fas fa-${alert.type === 'danger' ? 'exclamation-circle' : alert.type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            </div>
            <div class="alert-content">
                <h4>${alert.title}</h4>
                <p>${alert.message}</p>
            </div>
        </div>
    `).join('');
}

// ============================================
// Main Update Function
// ============================================

function updatePrediction() {
    updateRiskIndicator();
    updatePredictionChart();
    updateRiskChart();
    renderAlerts();
}

// ============================================
// Additional Translations
// ============================================

const predictionTranslations = {
    ar: {
        days: 'يوم',
        historical: 'تاريخي',
        predicted: 'متوقع',
        noAlerts: 'لا توجد تنبيهات',
        systemNormal: 'النظام يعمل بشكل طبيعي',
        criticalOpenDefects: 'عيوب حرجة مفتوحة',
        requireImmediateAttention: 'عيوب حرجة تتطلب اهتماماً فورياً',
        overdueDefects: 'عيوب متأخرة',
        exceededTargetDate: 'عيوب تجاوزت التاريخ المستهدف',
        increasingDefects: 'زيادة في العيوب',
        defectsIncreasedBy: 'زيادة بنسبة',
        comparedToLastWeek: 'في العيوب مقارنة بالأسبوع الماضي',
        departmentWithMostDefects: 'القسم الأكثر عيوباً',
        defects: 'عيوب',
        improvementRecommendation: 'توصية للتحسين',
        highResolutionTime: 'متوسط وقت الحل مرتفع. يُنصح بمراجعة عملية معالجة العيوب.',
        selectDefectForAnalysis: 'اختر العيب للتحليل',
        pleaseEnterCause: 'الرجاء إدخال السبب',
        remove: 'إزالة',
        noCausesAdded: 'لم تتم إضافة أسباب بعد',
        pleaseEnterProblem: 'الرجاء إدخال بيان المشكلة',
        analysisComplete: 'اكتمل التحليل',
        insufficientData: 'بيانات غير كافية',
        pleaseAnswerQuestions: 'الرجاء الإجابة على الأسئلة'
    },
    en: {
        days: 'days',
        historical: 'Historical',
        predicted: 'Predicted',
        noAlerts: 'No Alerts',
        systemNormal: 'System is operating normally',
        criticalOpenDefects: 'Critical Open Defects',
        requireImmediateAttention: 'critical defects require immediate attention',
        overdueDefects: 'Overdue Defects',
        exceededTargetDate: 'defects have exceeded their target date',
        increasingDefects: 'Increasing Defects',
        defectsIncreasedBy: 'Defects increased by',
        comparedToLastWeek: 'compared to last week',
        departmentWithMostDefects: 'Department with Most Defects',
        defects: 'defects',
        improvementRecommendation: 'Improvement Recommendation',
        highResolutionTime: 'Average resolution time is high. Consider reviewing the defect handling process.',
        selectDefectForAnalysis: 'Select defect for analysis',
        pleaseEnterCause: 'Please enter a cause',
        remove: 'Remove',
        noCausesAdded: 'No causes added yet',
        pleaseEnterProblem: 'Please enter problem statement',
        analysisComplete: 'Analysis complete',
        insufficientData: 'Insufficient data',
        pleaseAnswerQuestions: 'Please answer the questions'
    }
};

Object.keys(predictionTranslations).forEach(lang => {
    Object.assign(translations[lang], predictionTranslations[lang]);
});

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Initialize when prediction section is shown
    const predictionLink = document.querySelector('a[data-section="prediction"]');
    if (predictionLink) {
        predictionLink.addEventListener('click', () => {
            setTimeout(updatePrediction, 100);
        });
    }
});

// Expose functions globally
window.updatePrediction = updatePrediction;
window.calculateRiskLevel = calculateRiskLevel;
window.updateRiskIndicator = updateRiskIndicator;
window.updatePredictionChart = updatePredictionChart;
window.updateRiskChart = updateRiskChart;
window.generateAlerts = generateAlerts;
window.renderAlerts = renderAlerts;
