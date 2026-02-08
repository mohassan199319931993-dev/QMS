/**
 * QMS - Dashboard Module
 * Handles KPIs, charts, and dashboard functionality
 */

// ============================================
// Chart.js-like Canvas Chart Implementation
// ============================================

class SimpleChart {
    constructor(canvasId, type, data, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.type = type;
        this.data = data;
        this.options = {
            padding: 40,
            barWidth: 0.6,
            colors: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6'],
            ...options
        };
        
        this.resize();
        window.addEventListener('resize', () => this.resize());
        this.render();
    }
    
    resize() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = rect.width;
        this.height = rect.height;
        this.render();
    }
    
    render() {
        if (!this.ctx) return;
        
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        switch(this.type) {
            case 'bar':
                this.renderBarChart();
                break;
            case 'pie':
                this.renderPieChart();
                break;
            case 'line':
                this.renderLineChart();
                break;
            case 'pareto':
                this.renderParetoChart();
                break;
        }
    }
    
    renderBarChart() {
        const { labels, datasets } = this.data;
        const padding = this.options.padding;
        const chartWidth = this.width - padding * 2;
        const chartHeight = this.height - padding * 2;
        
        const maxValue = Math.max(...datasets[0].data);
        const barWidth = (chartWidth / labels.length) * this.options.barWidth;
        const barSpacing = (chartWidth / labels.length) * (1 - this.options.barWidth);
        
        // Draw axes
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, this.height - padding);
        this.ctx.lineTo(this.width - padding, this.height - padding);
        this.ctx.stroke();
        
        // Draw bars
        datasets[0].data.forEach((value, i) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + i * (barWidth + barSpacing) + barSpacing / 2;
            const y = this.height - padding - barHeight;
            
            // Bar
            this.ctx.fillStyle = this.options.colors[i % this.options.colors.length];
            this.ctx.fillRect(x, y, barWidth, barHeight);
            
            // Value label
            this.ctx.fillStyle = '#475569';
            this.ctx.font = '12px Cairo';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(value, x + barWidth / 2, y - 5);
            
            // X label
            this.ctx.fillStyle = '#64748b';
            this.ctx.font = '11px Cairo';
            this.ctx.fillText(labels[i], x + barWidth / 2, this.height - padding + 20);
        });
        
        // Y-axis labels
        this.ctx.fillStyle = '#64748b';
        this.ctx.font = '10px Cairo';
        this.ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = Math.round((maxValue / 5) * i);
            const y = this.height - padding - (chartHeight / 5) * i;
            this.ctx.fillText(value, padding - 10, y + 4);
            
            // Grid line
            if (i > 0) {
                this.ctx.strokeStyle = '#f1f5f9';
                this.ctx.beginPath();
                this.ctx.moveTo(padding, y);
                this.ctx.lineTo(this.width - padding, y);
                this.ctx.stroke();
            }
        }
    }
    
    renderPieChart() {
        const { labels, datasets } = this.data;
        const values = datasets[0].data;
        const total = values.reduce((a, b) => a + b, 0);
        
        const centerX = this.width / 2;
        const centerY = this.height / 2;
        const radius = Math.min(centerX, centerY) - this.options.padding;
        
        let currentAngle = -Math.PI / 2;
        
        values.forEach((value, i) => {
            const sliceAngle = (value / total) * 2 * Math.PI;
            const endAngle = currentAngle + sliceAngle;
            
            // Slice
            this.ctx.beginPath();
            this.ctx.moveTo(centerX, centerY);
            this.ctx.arc(centerX, centerY, radius, currentAngle, endAngle);
            this.ctx.closePath();
            this.ctx.fillStyle = this.options.colors[i % this.options.colors.length];
            this.ctx.fill();
            
            // Label
            const labelAngle = currentAngle + sliceAngle / 2;
            const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
            const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
            
            this.ctx.fillStyle = '#fff';
            this.ctx.font = 'bold 12px Cairo';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            const percentage = Math.round((value / total) * 100);
            if (percentage > 5) {
                this.ctx.fillText(`${percentage}%`, labelX, labelY);
            }
            
            currentAngle = endAngle;
        });
        
        // Legend
        let legendY = 20;
        labels.forEach((label, i) => {
            const percentage = Math.round((values[i] / total) * 100);
            
            this.ctx.fillStyle = this.options.colors[i % this.options.colors.length];
            this.ctx.fillRect(10, legendY - 8, 12, 12);
            
            this.ctx.fillStyle = '#475569';
            this.ctx.font = '11px Cairo';
            this.ctx.textAlign = 'left';
            this.ctx.fillText(`${label} (${percentage}%)`, 28, legendY);
            
            legendY += 20;
        });
    }
    
    renderLineChart() {
        const { labels, datasets } = this.data;
        const padding = this.options.padding;
        const chartWidth = this.width - padding * 2;
        const chartHeight = this.height - padding * 2;
        
        const allValues = datasets.flatMap(d => d.data);
        const maxValue = Math.max(...allValues);
        const minValue = Math.min(...allValues, 0);
        const valueRange = maxValue - minValue;
        
        // Draw axes
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, this.height - padding);
        this.ctx.lineTo(this.width - padding, this.height - padding);
        this.ctx.stroke();
        
        // Draw lines
        datasets.forEach((dataset, datasetIndex) => {
            this.ctx.strokeStyle = dataset.borderColor || this.options.colors[datasetIndex];
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            
            dataset.data.forEach((value, i) => {
                const x = padding + (i / (labels.length - 1)) * chartWidth;
                const y = this.height - padding - ((value - minValue) / valueRange) * chartHeight;
                
                if (i === 0) {
                    this.ctx.moveTo(x, y);
                } else {
                    this.ctx.lineTo(x, y);
                }
            });
            
            this.ctx.stroke();
            
            // Draw points
            this.ctx.fillStyle = dataset.borderColor || this.options.colors[datasetIndex];
            dataset.data.forEach((value, i) => {
                const x = padding + (i / (labels.length - 1)) * chartWidth;
                const y = this.height - padding - ((value - minValue) / valueRange) * chartHeight;
                
                this.ctx.beginPath();
                this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
                this.ctx.fill();
            });
        });
        
        // X labels
        this.ctx.fillStyle = '#64748b';
        this.ctx.font = '10px Cairo';
        this.ctx.textAlign = 'center';
        labels.forEach((label, i) => {
            const x = padding + (i / (labels.length - 1)) * chartWidth;
            this.ctx.fillText(label, x, this.height - padding + 20);
        });
        
        // Y-axis labels
        this.ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = Math.round(minValue + (valueRange / 5) * i);
            const y = this.height - padding - (chartHeight / 5) * i;
            this.ctx.fillText(value, padding - 10, y + 4);
        }
        
        // Legend
        if (datasets.length > 1) {
            let legendX = this.width - padding - 100;
            datasets.forEach((dataset, i) => {
                this.ctx.fillStyle = dataset.borderColor || this.options.colors[i];
                this.ctx.fillRect(legendX, 10, 15, 3);
                
                this.ctx.fillStyle = '#475569';
                this.ctx.font = '11px Cairo';
                this.ctx.textAlign = 'left';
                this.ctx.fillText(dataset.label, legendX + 20, 15);
                
                legendX += 80;
            });
        }
    }
    
    renderParetoChart() {
        const { labels, datasets } = this.data;
        const values = datasets[0].data;
        const padding = this.options.padding;
        const chartWidth = this.width - padding * 2;
        const chartHeight = this.height - padding * 2;
        
        // Sort data descending
        const sortedData = labels.map((label, i) => ({ label, value: values[i] }))
            .sort((a, b) => b.value - a.value);
        
        const sortedLabels = sortedData.map(d => d.label);
        const sortedValues = sortedData.map(d => d.value);
        const maxValue = sortedValues[0];
        const total = sortedValues.reduce((a, b) => a + b, 0);
        
        // Calculate cumulative percentages
        let cumulative = 0;
        const cumulativePercentages = sortedValues.map(v => {
            cumulative += v;
            return (cumulative / total) * 100;
        });
        
        const barWidth = (chartWidth / sortedLabels.length) * 0.7;
        const barSpacing = (chartWidth / sortedLabels.length) * 0.3;
        
        // Draw axes
        this.ctx.strokeStyle = '#e2e8f0';
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, this.height - padding);
        this.ctx.lineTo(this.width - padding, this.height - padding);
        this.ctx.stroke();
        
        // Draw 80% line
        const lineY = this.height - padding - (chartHeight * 0.8);
        this.ctx.strokeStyle = '#ef4444';
        this.ctx.setLineDash([5, 5]);
        this.ctx.beginPath();
        this.ctx.moveTo(padding, lineY);
        this.ctx.lineTo(this.width - padding, lineY);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
        
        // Draw bars
        sortedValues.forEach((value, i) => {
            const barHeight = (value / maxValue) * chartHeight;
            const x = padding + i * (barWidth + barSpacing) + barSpacing / 2;
            const y = this.height - padding - barHeight;
            
            this.ctx.fillStyle = cumulativePercentages[i] <= 80 ? '#3b82f6' : '#94a3b8';
            this.ctx.fillRect(x, y, barWidth, barHeight);
            
            // Value label
            this.ctx.fillStyle = '#475569';
            this.ctx.font = '11px Cairo';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(value, x + barWidth / 2, y - 5);
            
            // X label
            this.ctx.fillStyle = '#64748b';
            this.ctx.font = '9px Cairo';
            this.ctx.save();
            this.ctx.translate(x + barWidth / 2, this.height - padding + 15);
            this.ctx.rotate(-Math.PI / 4);
            this.ctx.fillText(sortedLabels[i], 0, 0);
            this.ctx.restore();
        });
        
        // Draw cumulative line
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        
        cumulativePercentages.forEach((pct, i) => {
            const x = padding + i * (barWidth + barSpacing) + barSpacing / 2 + barWidth / 2;
            const y = this.height - padding - (pct / 100) * chartHeight;
            
            if (i === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }
            
            // Point
            this.ctx.fillStyle = '#f59e0b';
            this.ctx.beginPath();
            this.ctx.arc(x, y, 4, 0, 2 * Math.PI);
            this.ctx.fill();
        });
        
        this.ctx.stroke();
        
        // Y-axis labels (left - values)
        this.ctx.fillStyle = '#64748b';
        this.ctx.font = '10px Cairo';
        this.ctx.textAlign = 'right';
        for (let i = 0; i <= 5; i++) {
            const value = Math.round((maxValue / 5) * i);
            const y = this.height - padding - (chartHeight / 5) * i;
            this.ctx.fillText(value, padding - 10, y + 4);
        }
        
        // Y-axis labels (right - percentages)
        this.ctx.textAlign = 'left';
        for (let i = 0; i <= 5; i++) {
            const pct = i * 20;
            const y = this.height - padding - (chartHeight / 5) * i;
            this.ctx.fillText(pct + '%', this.width - padding + 5, y + 4);
        }
        
        // Legend
        this.ctx.fillStyle = '#3b82f6';
        this.ctx.fillRect(this.width - 150, 10, 15, 15);
        this.ctx.fillStyle = '#475569';
        this.ctx.font = '11px Cairo';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Defects', this.width - 130, 22);
        
        this.ctx.strokeStyle = '#f59e0b';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(this.width - 150, 40);
        this.ctx.lineTo(this.width - 135, 40);
        this.ctx.stroke();
        this.ctx.fillStyle = '#475569';
        this.ctx.fillText('Cumulative %', this.width - 130, 44);
    }
}

// ============================================
// Dashboard Functions
// ============================================

function updateDashboard() {
    updateKPICards();
    updateCharts();
    updateRecentDefects();
}

function updateKPICards() {
    const defects = AppState.defects;
    const today = getTodayDate();
    
    // Total defects
    const totalDefects = defects.length;
    document.getElementById('totalDefects').textContent = totalDefects;
    
    // Defects today
    const defectsToday = defects.filter(d => d.date === today).length;
    document.getElementById('defectsToday').textContent = defectsToday;
    
    // PPM calculation (assuming 10000 as base production)
    const totalProduced = 10000;
    const ppm = totalProduced > 0 ? Math.round((totalDefects / totalProduced) * 1000000) : 0;
    document.getElementById('ppmValue').textContent = ppm.toLocaleString();
    
    // Open vs Closed
    const openIssues = defects.filter(d => d.status === 'open').length;
    const closedIssues = defects.filter(d => d.status === 'closed').length;
    document.getElementById('openIssues').innerHTML = `${openIssues} / <span id="closedIssues">${closedIssues}</span>`;
}

function updateCharts() {
    updateDeptChart();
    updateTypeChart();
    updateTrendChart();
}

function updateDeptChart() {
    const defects = AppState.defects;
    const deptCounts = {};
    
    defects.forEach(d => {
        deptCounts[d.department] = (deptCounts[d.department] || 0) + 1;
    });
    
    const deptNames = {
        production: AppState.currentLang === 'ar' ? 'الإنتاج' : 'Production',
        assembly: AppState.currentLang === 'ar' ? 'التجميع' : 'Assembly',
        packaging: AppState.currentLang === 'ar' ? 'التعبئة' : 'Packaging',
        quality: AppState.currentLang === 'ar' ? 'الجودة' : 'Quality',
        warehouse: AppState.currentLang === 'ar' ? 'المستودع' : 'Warehouse'
    };
    
    const labels = Object.keys(deptCounts).map(k => deptNames[k] || k);
    const data = Object.values(deptCounts);
    
    new SimpleChart('deptChart', 'bar', {
        labels,
        datasets: [{ data }]
    });
}

function updateTypeChart() {
    const defects = AppState.defects;
    const typeCounts = {};
    
    defects.forEach(d => {
        typeCounts[d.category] = (typeCounts[d.category] || 0) + 1;
    });
    
    const typeNames = {
        dimensional: AppState.currentLang === 'ar' ? 'بعدي' : 'Dimensional',
        visual: AppState.currentLang === 'ar' ? 'بصري' : 'Visual',
        functional: AppState.currentLang === 'ar' ? 'وظيفي' : 'Functional',
        material: AppState.currentLang === 'ar' ? 'مادي' : 'Material',
        assembly: AppState.currentLang === 'ar' ? 'تجميع' : 'Assembly',
        other: AppState.currentLang === 'ar' ? 'أخرى' : 'Other'
    };
    
    const labels = Object.keys(typeCounts).map(k => typeNames[k] || k);
    const data = Object.values(typeCounts);
    
    new SimpleChart('typeChart', 'pie', {
        labels,
        datasets: [{ data }]
    });
}

function updateTrendChart() {
    const defects = AppState.defects;
    const monthlyCounts = {};
    
    // Get last 6 months
    const months = [];
    for (let i = 5; i >= 0; i--) {
        const d = new Date();
        d.setMonth(d.getMonth() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        months.push(key);
        monthlyCounts[key] = 0;
    }
    
    defects.forEach(d => {
        const month = d.date.substring(0, 7);
        if (monthlyCounts.hasOwnProperty(month)) {
            monthlyCounts[month]++;
        }
    });
    
    const labels = months.map(m => {
        const [year, month] = m.split('-');
        return `${month}/${year}`;
    });
    
    const data = months.map(m => monthlyCounts[m]);
    
    new SimpleChart('trendChart', 'line', {
        labels,
        datasets: [{
            label: AppState.currentLang === 'ar' ? 'العيوب' : 'Defects',
            data,
            borderColor: '#3b82f6'
        }]
    });
}

function updateRecentDefects() {
    const tbody = document.getElementById('recentDefectsBody');
    if (!tbody) return;
    
    const recentDefects = AppState.defects.slice(0, 5);
    
    const deptNames = {
        production: AppState.currentLang === 'ar' ? 'الإنتاج' : 'Production',
        assembly: AppState.currentLang === 'ar' ? 'التجميع' : 'Assembly',
        packaging: AppState.currentLang === 'ar' ? 'التعبئة' : 'Packaging',
        quality: AppState.currentLang === 'ar' ? 'الجودة' : 'Quality',
        warehouse: AppState.currentLang === 'ar' ? 'المستودع' : 'Warehouse'
    };
    
    const categoryNames = {
        dimensional: AppState.currentLang === 'ar' ? 'بعدي' : 'Dimensional',
        visual: AppState.currentLang === 'ar' ? 'بصري' : 'Visual',
        functional: AppState.currentLang === 'ar' ? 'وظيفي' : 'Functional',
        material: AppState.currentLang === 'ar' ? 'مادي' : 'Material',
        assembly: AppState.currentLang === 'ar' ? 'تجميع' : 'Assembly',
        other: AppState.currentLang === 'ar' ? 'أخرى' : 'Other'
    };
    
    tbody.innerHTML = recentDefects.map(defect => `
        <tr>
            <td>${defect.id}</td>
            <td>${formatDate(defect.date)}</td>
            <td>${deptNames[defect.department] || defect.department}</td>
            <td>${categoryNames[defect.category] || defect.category}</td>
            <td>${defect.description.substring(0, 50)}${defect.description.length > 50 ? '...' : ''}</td>
            <td><span class="badge badge-${defect.severity}">${t(defect.severity)}</span></td>
            <td><span class="badge badge-${defect.status}">${t(defect.status)}</span></td>
        </tr>
    `).join('');
}

function exportChart(canvasId) {
    const canvas = document.getElementById(canvasId);
    if (canvas) {
        const link = document.createElement('a');
        link.download = `${canvasId}_${getTodayDate()}.png`;
        link.href = canvas.toDataURL();
        link.click();
        showToast(t('chartExported'), 'success');
    }
}

// ============================================
// Filter Functions
// ============================================

function getFilteredDefects() {
    return AppState.defects.filter(defect => {
        const matchDept = !AppState.filters.department || defect.department === AppState.filters.department;
        const matchStatus = !AppState.filters.status || defect.status === AppState.filters.status;
        const matchSeverity = !AppState.filters.severity || defect.severity === AppState.filters.severity;
        const matchFromDate = !AppState.filters.fromDate || defect.date >= AppState.filters.fromDate;
        const matchToDate = !AppState.filters.toDate || defect.date <= AppState.filters.toDate;
        
        return matchDept && matchStatus && matchSeverity && matchFromDate && matchToDate;
    });
}

function applyFilters() {
    AppState.filters.department = document.getElementById('filterDepartment')?.value || '';
    AppState.filters.status = document.getElementById('filterStatus')?.value || '';
    AppState.filters.severity = document.getElementById('filterSeverity')?.value || '';
    AppState.filters.fromDate = document.getElementById('filterFromDate')?.value || '';
    AppState.filters.toDate = document.getElementById('filterToDate')?.value || '';
    
    AppState.pagination.currentPage = 1;
    renderDefectsTable();
}

function clearFilters() {
    document.getElementById('filterDepartment').value = '';
    document.getElementById('filterStatus').value = '';
    document.getElementById('filterSeverity').value = '';
    document.getElementById('filterFromDate').value = '';
    document.getElementById('filterToDate').value = '';
    
    AppState.filters = { department: '', status: '', severity: '', fromDate: '', toDate: '' };
    AppState.pagination.currentPage = 1;
    renderDefectsTable();
}

// ============================================
// Defects Table
// ============================================

function renderDefectsTable() {
    const tbody = document.getElementById('defectsTableBody');
    if (!tbody) return;
    
    const filtered = getFilteredDefects();
    const { currentPage, itemsPerPage } = AppState.pagination;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = filtered.slice(start, end);
    
    const deptNames = {
        production: AppState.currentLang === 'ar' ? 'الإنتاج' : 'Production',
        assembly: AppState.currentLang === 'ar' ? 'التجميع' : 'Assembly',
        packaging: AppState.currentLang === 'ar' ? 'التعبئة' : 'Packaging',
        quality: AppState.currentLang === 'ar' ? 'الجودة' : 'Quality',
        warehouse: AppState.currentLang === 'ar' ? 'المستودع' : 'Warehouse'
    };
    
    const categoryNames = {
        dimensional: AppState.currentLang === 'ar' ? 'بعدي' : 'Dimensional',
        visual: AppState.currentLang === 'ar' ? 'بصري' : 'Visual',
        functional: AppState.currentLang === 'ar' ? 'وظيفي' : 'Functional',
        material: AppState.currentLang === 'ar' ? 'مادي' : 'Material',
        assembly: AppState.currentLang === 'ar' ? 'تجميع' : 'Assembly',
        other: AppState.currentLang === 'ar' ? 'أخرى' : 'Other'
    };
    
    tbody.innerHTML = paginated.map(defect => `
        <tr>
            <td>${defect.id}</td>
            <td>${formatDate(defect.date)}</td>
            <td>${deptNames[defect.department] || defect.department}</td>
            <td>${defect.partCode}</td>
            <td>${categoryNames[defect.category] || defect.category}</td>
            <td>${defect.description.substring(0, 40)}${defect.description.length > 40 ? '...' : ''}</td>
            <td><span class="badge badge-${defect.severity}">${t(defect.severity)}</span></td>
            <td><span class="badge badge-${defect.status}">${t(defect.status)}</span></td>
            <td>${defect.responsiblePerson || '-'}</td>
            <td>
                <button class="btn btn-icon btn-sm" onclick="viewDefect('${defect.id}')" title="${t('view')}">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn btn-icon btn-sm" onclick="editDefect('${defect.id}')" title="${t('edit')}">
                    <i class="fas fa-edit"></i>
                </button>
                ${defect.status !== 'closed' ? `
                <button class="btn btn-icon btn-sm" onclick="closeDefect('${defect.id}')" title="${t('close')}">
                    <i class="fas fa-check"></i>
                </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
    
    renderPagination(filtered.length);
}

function renderPagination(totalItems) {
    const container = document.getElementById('pagination');
    if (!container) return;
    
    const { currentPage, itemsPerPage } = AppState.pagination;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
            <i class="fas fa-chevron-${AppState.currentLang === 'ar' ? 'right' : 'left'}"></i>
        </button>
    `;
    
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="goToPage(${i})">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += `<span>...</span>`;
        }
    }
    
    html += `
        <button ${currentPage === totalPages ? 'disabled' : ''} onclick="goToPage(${currentPage + 1})">
            <i class="fas fa-chevron-${AppState.currentLang === 'ar' ? 'left' : 'right'}"></i>
        </button>
    `;
    
    container.innerHTML = html;
}

function goToPage(page) {
    AppState.pagination.currentPage = page;
    renderDefectsTable();
}

// ============================================
// Defect Actions
// ============================================

function viewDefect(id) {
    const defect = AppState.defects.find(d => d.id === id);
    if (!defect) return;
    
    const content = `
        <div class="defect-details">
            <div class="detail-row">
                <span class="detail-label">${t('id')}:</span>
                <span class="detail-value">${defect.id}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">${t('date')}:</span>
                <span class="detail-value">${formatDate(defect.date)} ${defect.time}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">${t('department')}:</span>
                <span class="detail-value">${defect.department}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">${t('defectDescription')}:</span>
                <span class="detail-value">${defect.description}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">${t('rootCause')}:</span>
                <span class="detail-value">${defect.rootCause || '-'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">${t('correctiveAction')}:</span>
                <span class="detail-value">${defect.correctiveAction || '-'}</span>
            </div>
            <div class="detail-row">
                <span class="detail-label">${t('preventiveAction')}:</span>
                <span class="detail-value">${defect.preventiveAction || '-'}</span>
            </div>
            ${defect.image ? `<div class="detail-row"><img src="${defect.image}" style="max-width:100%;border-radius:8px;"></div>` : ''}
        </div>
    `;
    
    openModal(content);
}

function editDefect(id) {
    const defect = AppState.defects.find(d => d.id === id);
    if (!defect) return;
    
    const content = `
        <form id="editDefectForm">
            <div class="form-group">
                <label>${t('status')}</label>
                <select id="editStatus" class="form-control">
                    <option value="open" ${defect.status === 'open' ? 'selected' : ''}>${t('open')}</option>
                    <option value="in-progress" ${defect.status === 'in-progress' ? 'selected' : ''}>${t('inProgress')}</option>
                    <option value="closed" ${defect.status === 'closed' ? 'selected' : ''}>${t('closed')}</option>
                </select>
            </div>
            <div class="form-group">
                <label>${t('correctiveAction')}</label>
                <textarea id="editCorrective" class="form-control" rows="2">${defect.correctiveAction || ''}</textarea>
            </div>
            <div class="form-group">
                <label>${t('preventiveAction')}</label>
                <textarea id="editPreventive" class="form-control" rows="2">${defect.preventiveAction || ''}</textarea>
            </div>
            <div class="form-group">
                <label>${t('targetDate')}</label>
                <input type="date" id="editTargetDate" class="form-control" value="${defect.targetDate || ''}">
            </div>
            <input type="hidden" id="editDefectId" value="${defect.id}">
        </form>
    `;
    
    openModal(content);
}

function saveDefectChanges() {
    const id = document.getElementById('editDefectId')?.value;
    if (!id) {
        closeModal();
        return;
    }
    
    const defect = AppState.defects.find(d => d.id === id);
    if (defect) {
        defect.status = document.getElementById('editStatus')?.value || defect.status;
        defect.correctiveAction = document.getElementById('editCorrective')?.value || '';
        defect.preventiveAction = document.getElementById('editPreventive')?.value || '';
        defect.targetDate = document.getElementById('editTargetDate')?.value || '';
        defect.updatedAt = new Date().toISOString();
        
        if (defect.status === 'closed' && !defect.closedDate) {
            defect.closedDate = getTodayDate();
        }
        
        saveToStorage('defects', AppState.defects);
        renderDefectsTable();
        updateDashboard();
        showToast(t('changesSaved'), 'success');
    }
    
    closeModal();
}

function closeDefect(id) {
    const defect = AppState.defects.find(d => d.id === id);
    if (defect) {
        defect.status = 'closed';
        defect.closedDate = getTodayDate();
        defect.updatedAt = new Date().toISOString();
        
        saveToStorage('defects', AppState.defects);
        renderDefectsTable();
        updateDashboard();
        showToast(t('defectClosed'), 'success');
    }
}

// ============================================
// Defect Registration Form
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    const defectForm = document.getElementById('defectForm');
    if (defectForm) {
        defectForm.addEventListener('submit', handleDefectSubmit);
    }
});

function handleDefectSubmit(e) {
    e.preventDefault();
    
    const imageInput = document.getElementById('defectImage');
    let imageData = null;
    
    const processDefect = (imageBase64) => {
        const newDefect = {
            id: generateId(),
            date: document.getElementById('defectDate').value,
            time: document.getElementById('defectTime').value,
            department: document.getElementById('department').value,
            process: document.getElementById('process').value,
            partCode: document.getElementById('partCode').value,
            quantity: parseInt(document.getElementById('quantity').value) || 1,
            category: document.getElementById('defectCategory').value,
            severity: document.getElementById('severity').value,
            description: document.getElementById('defectDescription').value,
            rootCause: document.getElementById('rootCause').value,
            reporterName: document.getElementById('reporterName').value,
            responsiblePerson: document.getElementById('responsiblePerson').value,
            status: 'open',
            correctiveAction: '',
            preventiveAction: '',
            targetDate: '',
            closedDate: '',
            image: imageBase64,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        AppState.defects.unshift(newDefect);
        saveToStorage('defects', AppState.defects);
        
        showToast(t('defectSaved'), 'success');
        e.target.reset();
        
        // Reset date and time
        document.getElementById('defectDate').value = getTodayDate();
        document.getElementById('defectTime').value = getCurrentTime();
        
        // Clear image preview
        document.getElementById('imagePreview').innerHTML = '';
        
        // Update dashboard
        updateDashboard();
    };
    
    if (imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => processDefect(e.target.result);
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        processDefect(null);
    }
}

// Expose functions globally
window.updateDashboard = updateDashboard;
window.updateCharts = updateCharts;
window.applyFilters = applyFilters;
window.clearFilters = clearFilters;
window.goToPage = goToPage;
window.viewDefect = viewDefect;
window.editDefect = editDefect;
window.saveDefectChanges = saveDefectChanges;
window.closeDefect = closeDefect;
window.exportChart = exportChart;
