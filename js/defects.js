/**
 * QMS - Defects Module
 * Handles defect registration, tracking, and management
 */

// ============================================
// Defect Registration
// ============================================

function initDefectForm() {
    const form = document.getElementById('defectForm');
    if (!form) return;
    
    // Set default date and time
    const dateInput = document.getElementById('defectDate');
    const timeInput = document.getElementById('defectTime');
    
    if (dateInput) dateInput.value = getTodayDate();
    if (timeInput) timeInput.value = getCurrentTime();
    
    // Form submission
    form.addEventListener('submit', handleDefectRegistration);
}

function handleDefectRegistration(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const imageInput = document.getElementById('defectImage');
    
    const processRegistration = (imageBase64) => {
        const defect = {
            id: generateId(),
            date: document.getElementById('defectDate').value,
            time: document.getElementById('defectTime').value,
            department: document.getElementById('department').value,
            process: document.getElementById('process').value || '',
            partCode: document.getElementById('partCode').value || '',
            quantity: parseInt(document.getElementById('quantity').value) || 1,
            category: document.getElementById('defectCategory').value,
            severity: document.getElementById('severity').value,
            description: document.getElementById('defectDescription').value,
            rootCause: document.getElementById('rootCause').value || '',
            reporterName: document.getElementById('reporterName').value,
            responsiblePerson: document.getElementById('responsiblePerson').value || '',
            status: 'open',
            correctiveAction: '',
            preventiveAction: '',
            targetDate: '',
            closedDate: '',
            image: imageBase64,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add to state
        AppState.defects.unshift(defect);
        
        // Save to storage
        saveToStorage('defects', AppState.defects);
        
        // Show success message
        showToast(t('defectSavedSuccess'), 'success');
        
        // Reset form
        e.target.reset();
        document.getElementById('defectDate').value = getTodayDate();
        document.getElementById('defectTime').value = getCurrentTime();
        document.getElementById('imagePreview').innerHTML = '';
        
        // Update dashboard if visible
        if (AppState.currentSection === 'dashboard') {
            updateDashboard();
        }
    };
    
    // Handle image if present
    if (imageInput && imageInput.files && imageInput.files[0]) {
        const reader = new FileReader();
        reader.onload = (event) => {
            processRegistration(event.target.result);
        };
        reader.readAsDataURL(imageInput.files[0]);
    } else {
        processRegistration(null);
    }
}

// ============================================
// Defect Tracking & Filtering
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
    const filterIds = ['filterDepartment', 'filterStatus', 'filterSeverity', 'filterFromDate', 'filterToDate'];
    filterIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = '';
    });
    
    AppState.filters = { department: '', status: '', severity: '', fromDate: '', toDate: '' };
    AppState.pagination.currentPage = 1;
    renderDefectsTable();
}

// ============================================
// Defects Table Rendering
// ============================================

function renderDefectsTable() {
    const tbody = document.getElementById('defectsTableBody');
    if (!tbody) return;
    
    const filtered = getFilteredDefects();
    const { currentPage, itemsPerPage } = AppState.pagination;
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginated = filtered.slice(start, end);
    
    if (paginated.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="text-center" style="padding: 2rem;">
                    <i class="fas fa-inbox" style="font-size: 2rem; color: var(--gray-300); margin-bottom: 1rem; display: block;"></i>
                    ${t('noDefectsFound')}
                </td>
            </tr>
        `;
        renderPagination(0);
        return;
    }
    
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
    
    const severityLabels = {
        low: AppState.currentLang === 'ar' ? 'منخفضة' : 'Low',
        medium: AppState.currentLang === 'ar' ? 'متوسطة' : 'Medium',
        high: AppState.currentLang === 'ar' ? 'عالية' : 'High',
        critical: AppState.currentLang === 'ar' ? 'حرجة' : 'Critical'
    };
    
    const statusLabels = {
        open: AppState.currentLang === 'ar' ? 'مفتوح' : 'Open',
        'in-progress': AppState.currentLang === 'ar' ? 'قيد المعالجة' : 'In Progress',
        closed: AppState.currentLang === 'ar' ? 'مغلق' : 'Closed'
    };
    
    tbody.innerHTML = paginated.map(defect => `
        <tr data-id="${defect.id}">
            <td><strong>${defect.id}</strong></td>
            <td>${formatDate(defect.date)}</td>
            <td>${deptNames[defect.department] || defect.department}</td>
            <td>${defect.partCode || '-'}</td>
            <td>${categoryNames[defect.category] || defect.category}</td>
            <td title="${defect.description}">${defect.description.substring(0, 40)}${defect.description.length > 40 ? '...' : ''}</td>
            <td><span class="badge badge-${defect.severity}">${severityLabels[defect.severity]}</span></td>
            <td><span class="badge badge-${defect.status}">${statusLabels[defect.status]}</span></td>
            <td>${defect.responsiblePerson || '-'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn btn-icon btn-sm" onclick="viewDefectDetails('${defect.id}')" title="${t('view')}">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-icon btn-sm" onclick="editDefectModal('${defect.id}')" title="${t('edit')}">
                        <i class="fas fa-edit"></i>
                    </button>
                    ${defect.status !== 'closed' ? `
                    <button class="btn btn-icon btn-sm" onclick="closeDefectItem('${defect.id}')" title="${t('close')}">
                        <i class="fas fa-check-circle"></i>
                    </button>
                    ` : ''}
                    <button class="btn btn-icon btn-sm" onclick="deleteDefect('${defect.id}')" title="${t('delete')}">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
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
    
    const prevIcon = AppState.currentLang === 'ar' ? 'fa-chevron-right' : 'fa-chevron-left';
    const nextIcon = AppState.currentLang === 'ar' ? 'fa-chevron-left' : 'fa-chevron-right';
    
    let html = `
        <button ${currentPage === 1 ? 'disabled' : ''} onclick="goToPage(${currentPage - 1})">
            <i class="fas ${prevIcon}"></i>
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
            <i class="fas ${nextIcon}"></i>
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

function viewDefectDetails(id) {
    const defect = AppState.defects.find(d => d.id === id);
    if (!defect) return;
    
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
    
    const severityLabels = {
        low: AppState.currentLang === 'ar' ? 'منخفضة' : 'Low',
        medium: AppState.currentLang === 'ar' ? 'متوسطة' : 'Medium',
        high: AppState.currentLang === 'ar' ? 'عالية' : 'High',
        critical: AppState.currentLang === 'ar' ? 'حرجة' : 'Critical'
    };
    
    const statusLabels = {
        open: AppState.currentLang === 'ar' ? 'مفتوح' : 'Open',
        'in-progress': AppState.currentLang === 'ar' ? 'قيد المعالجة' : 'In Progress',
        closed: AppState.currentLang === 'ar' ? 'مغلق' : 'Closed'
    };
    
    const content = `
        <div class="defect-detail-view">
            <div class="detail-section">
                <h4><i class="fas fa-info-circle"></i> ${t('basicInfo')}</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">${t('id')}</span>
                        <span class="detail-value">${defect.id}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${t('date')}</span>
                        <span class="detail-value">${formatDate(defect.date)} ${defect.time}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${t('department')}</span>
                        <span class="detail-value">${deptNames[defect.department] || defect.department}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${t('process')}</span>
                        <span class="detail-value">${defect.process || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${t('partCode')}</span>
                        <span class="detail-value">${defect.partCode || '-'}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${t('quantity')}</span>
                        <span class="detail-value">${defect.quantity}</span>
                    </div>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-exclamation-triangle"></i> ${t('defectInfo')}</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">${t('defectCategory')}</span>
                        <span class="detail-value">${categoryNames[defect.category] || defect.category}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${t('severity')}</span>
                        <span class="detail-value"><span class="badge badge-${defect.severity}">${severityLabels[defect.severity]}</span></span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${t('status')}</span>
                        <span class="detail-value"><span class="badge badge-${defect.status}">${statusLabels[defect.status]}</span></span>
                    </div>
                </div>
                <div class="detail-item full-width">
                    <span class="detail-label">${t('defectDescription')}</span>
                    <span class="detail-value description">${defect.description}</span>
                </div>
            </div>
            
            <div class="detail-section">
                <h4><i class="fas fa-user"></i> ${t('peopleInfo')}</h4>
                <div class="detail-grid">
                    <div class="detail-item">
                        <span class="detail-label">${t('reporterName')}</span>
                        <span class="detail-value">${defect.reporterName}</span>
                    </div>
                    <div class="detail-item">
                        <span class="detail-label">${t('responsiblePerson')}</span>
                        <span class="detail-value">${defect.responsiblePerson || '-'}</span>
                    </div>
                </div>
            </div>
            
            ${defect.rootCause ? `
            <div class="detail-section">
                <h4><i class="fas fa-search"></i> ${t('analysisInfo')}</h4>
                <div class="detail-item full-width">
                    <span class="detail-label">${t('rootCause')}</span>
                    <span class="detail-value">${defect.rootCause}</span>
                </div>
            </div>
            ` : ''}
            
            ${(defect.correctiveAction || defect.preventiveAction) ? `
            <div class="detail-section">
                <h4><i class="fas fa-tools"></i> ${t('actionsInfo')}</h4>
                ${defect.correctiveAction ? `
                <div class="detail-item full-width">
                    <span class="detail-label">${t('correctiveAction')}</span>
                    <span class="detail-value">${defect.correctiveAction}</span>
                </div>
                ` : ''}
                ${defect.preventiveAction ? `
                <div class="detail-item full-width">
                    <span class="detail-label">${t('preventiveAction')}</span>
                    <span class="detail-value">${defect.preventiveAction}</span>
                </div>
                ` : ''}
                ${defect.targetDate ? `
                <div class="detail-item">
                    <span class="detail-label">${t('targetDate')}</span>
                    <span class="detail-value">${formatDate(defect.targetDate)}</span>
                </div>
                ` : ''}
            </div>
            ` : ''}
            
            ${defect.image ? `
            <div class="detail-section">
                <h4><i class="fas fa-image"></i> ${t('attachedImage')}</h4>
                <img src="${defect.image}" alt="Defect" class="defect-image">
            </div>
            ` : ''}
        </div>
    `;
    
    openModal(content);
}

function editDefectModal(id) {
    const defect = AppState.defects.find(d => d.id === id);
    if (!defect) return;
    
    const content = `
        <form id="editDefectForm" onsubmit="saveDefectEdit(event, '${id}')">
            <div class="form-row">
                <div class="form-group">
                    <label>${t('status')}</label>
                    <select id="editStatus" class="form-control" required>
                        <option value="open" ${defect.status === 'open' ? 'selected' : ''}>${t('open')}</option>
                        <option value="in-progress" ${defect.status === 'in-progress' ? 'selected' : ''}>${t('inProgress')}</option>
                        <option value="closed" ${defect.status === 'closed' ? 'selected' : ''}>${t('closed')}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>${t('targetDate')}</label>
                    <input type="date" id="editTargetDate" class="form-control" value="${defect.targetDate || ''}">
                </div>
            </div>
            
            <div class="form-group">
                <label>${t('correctiveAction')}</label>
                <textarea id="editCorrective" class="form-control" rows="3" placeholder="${t('enterCorrectiveAction')}">${defect.correctiveAction || ''}</textarea>
            </div>
            
            <div class="form-group">
                <label>${t('preventiveAction')}</label>
                <textarea id="editPreventive" class="form-control" rows="3" placeholder="${t('enterPreventiveAction')}">${defect.preventiveAction || ''}</textarea>
            </div>
            
            <div class="form-actions">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> ${t('saveChanges')}
                </button>
            </div>
        </form>
    `;
    
    openModal(content);
}

function saveDefectEdit(e, id) {
    e.preventDefault();
    
    const defect = AppState.defects.find(d => d.id === id);
    if (!defect) return;
    
    defect.status = document.getElementById('editStatus').value;
    defect.correctiveAction = document.getElementById('editCorrective').value;
    defect.preventiveAction = document.getElementById('editPreventive').value;
    defect.targetDate = document.getElementById('editTargetDate').value;
    defect.updatedAt = new Date().toISOString();
    
    if (defect.status === 'closed' && !defect.closedDate) {
        defect.closedDate = getTodayDate();
    }
    
    saveToStorage('defects', AppState.defects);
    renderDefectsTable();
    updateDashboard();
    closeModal();
    
    showToast(t('changesSaved'), 'success');
}

function closeDefectItem(id) {
    if (!confirm(t('confirmCloseDefect'))) return;
    
    const defect = AppState.defects.find(d => d.id === id);
    if (!defect) return;
    
    defect.status = 'closed';
    defect.closedDate = getTodayDate();
    defect.updatedAt = new Date().toISOString();
    
    saveToStorage('defects', AppState.defects);
    renderDefectsTable();
    updateDashboard();
    
    showToast(t('defectClosed'), 'success');
}

function deleteDefect(id) {
    if (!confirm(t('confirmDeleteDefect'))) return;
    
    AppState.defects = AppState.defects.filter(d => d.id !== id);
    saveToStorage('defects', AppState.defects);
    renderDefectsTable();
    updateDashboard();
    
    showToast(t('defectDeleted'), 'success');
}

// ============================================
// Excel Export/Import
// ============================================

function exportDefectsToExcel() {
    const filteredDefects = getFilteredDefects();
    
    if (filteredDefects.length === 0) {
        showToast(t('noDataToExport'), 'warning');
        return;
    }
    
    const exportData = filteredDefects.map(d => ({
        [t('id')]: d.id,
        [t('date')]: d.date,
        [t('time')]: d.time,
        [t('department')]: d.department,
        [t('process')]: d.process,
        [t('partCode')]: d.partCode,
        [t('quantity')]: d.quantity,
        [t('defectCategory')]: d.category,
        [t('severity')]: d.severity,
        [t('defectDescription')]: d.description,
        [t('rootCause')]: d.rootCause,
        [t('reporterName')]: d.reporterName,
        [t('responsiblePerson')]: d.responsiblePerson,
        [t('status')]: d.status,
        [t('correctiveAction')]: d.correctiveAction,
        [t('preventiveAction')]: d.preventiveAction,
        [t('targetDate')]: d.targetDate,
        [t('closedDate')]: d.closedDate
    }));
    
    exportToCSV(exportData, `defects_${getTodayDate()}.csv`);
}

function importDefectsFromExcel(input) {
    if (!input.files || !input.files[0]) return;
    
    const file = input.files[0];
    
    importFromCSV(file, (data) => {
        let imported = 0;
        let skipped = 0;
        
        data.forEach(row => {
            // Map column names (handle both Arabic and English)
            const date = row['التاريخ'] || row['Date'] || row['date'];
            const description = row['وصف العيب'] || row['Defect Description'] || row['description'] || row['Description'];
            
            if (date && description) {
                const existingId = row['#'] || row['ID'] || row['id'];
                
                // Check if defect already exists
                if (existingId && AppState.defects.find(d => d.id === existingId)) {
                    skipped++;
                    return;
                }
                
                AppState.defects.push({
                    id: existingId || generateId(),
                    date: date,
                    time: row['الوقت'] || row['Time'] || row['time'] || getCurrentTime(),
                    department: row['القسم'] || row['Department'] || row['department'] || 'production',
                    process: row['العملية'] || row['Process'] || row['process'] || '',
                    partCode: row['كود الجزء / الموديل'] || row['Part Code'] || row['partCode'] || '',
                    quantity: parseInt(row['الكمية المتأثرة'] || row['Quantity'] || row['quantity']) || 1,
                    category: row['فئة العيب'] || row['Category'] || row['category'] || 'other',
                    severity: row['الخطورة'] || row['Severity'] || row['severity'] || 'medium',
                    description: description,
                    rootCause: row['السبب الجذري (أولي)'] || row['Root Cause'] || row['rootCause'] || '',
                    reporterName: row['اسم المبلغ'] || row['Reporter'] || row['reporterName'] || 'System',
                    responsiblePerson: row['الشخص المسؤول'] || row['Responsible'] || row['responsiblePerson'] || '',
                    status: row['الحالة'] || row['Status'] || row['status'] || 'open',
                    correctiveAction: row['الإجراء التصحيحي'] || row['Corrective Action'] || row['correctiveAction'] || '',
                    preventiveAction: row['الإجراء الوقائي'] || row['Preventive Action'] || row['preventiveAction'] || '',
                    targetDate: row['التاريخ المستهدف'] || row['Target Date'] || row['targetDate'] || '',
                    closedDate: row['تاريخ الإغلاق'] || row['Closed Date'] || row['closedDate'] || '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                imported++;
            }
        });
        
        saveToStorage('defects', AppState.defects);
        renderDefectsTable();
        updateDashboard();
        
        showToast(`${imported} ${t('defectsImported')}${skipped > 0 ? `, ${skipped} ${t('skipped')}` : ''}`, 'success');
        input.value = '';
    });
}

// ============================================
// Additional Translations
// ============================================

const additionalTranslations = {
    ar: {
        defectSavedSuccess: 'تم حفظ العيب بنجاح',
        noDefectsFound: 'لا توجد عيوب مطابقة للفلاتر',
        view: 'عرض',
        edit: 'تعديل',
        delete: 'حذف',
        basicInfo: 'المعلومات الأساسية',
        defectInfo: 'معلومات العيب',
        peopleInfo: 'معلومات الأشخاص',
        analysisInfo: 'معلومات التحليل',
        actionsInfo: 'معلومات الإجراءات',
        attachedImage: 'الصورة المرفقة',
        enterCorrectiveAction: 'أدخل الإجراء التصحيحي',
        enterPreventiveAction: 'أدخل الإجراء الوقائي',
        confirmCloseDefect: 'هل أنت متأكد من إغلاق هذا العيب؟',
        confirmDeleteDefect: 'هل أنت متأكد من حذف هذا العيب؟ لا يمكن التراجع عن هذا الإجراء.',
        noDataToExport: 'لا توجد بيانات للتصدير',
        defectsImported: 'عيوب تم استيرادها',
        skipped: 'تم تخطيها',
        inProgress: 'قيد المعالجة',
        opening: 'جاري الفتح',
        defectClosed: 'تم إغلاق العيب بنجاح',
        defectDeleted: 'تم حذف العيب بنجاح',
        changesSaved: 'تم حفظ التغييرات بنجاح'
    },
    en: {
        defectSavedSuccess: 'Defect saved successfully',
        noDefectsFound: 'No defects match the filters',
        view: 'View',
        edit: 'Edit',
        delete: 'Delete',
        basicInfo: 'Basic Information',
        defectInfo: 'Defect Information',
        peopleInfo: 'People Information',
        analysisInfo: 'Analysis Information',
        actionsInfo: 'Actions Information',
        attachedImage: 'Attached Image',
        enterCorrectiveAction: 'Enter corrective action',
        enterPreventiveAction: 'Enter preventive action',
        confirmCloseDefect: 'Are you sure you want to close this defect?',
        confirmDeleteDefect: 'Are you sure you want to delete this defect? This action cannot be undone.',
        noDataToExport: 'No data to export',
        defectsImported: 'defects imported',
        skipped: 'skipped',
        inProgress: 'In Progress',
        opening: 'Opening',
        defectClosed: 'Defect closed successfully',
        defectDeleted: 'Defect deleted successfully',
        changesSaved: 'Changes saved successfully'
    }
};

// Merge additional translations
Object.keys(additionalTranslations).forEach(lang => {
    Object.assign(translations[lang], additionalTranslations[lang]);
});

// ============================================
// Initialize
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initDefectForm();
});

// Expose functions globally
window.handleDefectRegistration = handleDefectRegistration;
window.viewDefectDetails = viewDefectDetails;
window.editDefectModal = editDefectModal;
window.saveDefectEdit = saveDefectEdit;
window.closeDefectItem = closeDefectItem;
window.deleteDefect = deleteDefect;
window.exportDefectsToExcel = exportDefectsToExcel;
window.importDefectsFromExcel = importDefectsFromExcel;
