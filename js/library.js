// ===========================================
// 📚 LIBRARY.JS - المكتبة
// ===========================================

// ========================
// 📄 بيانات المستندات
// ========================
const documents = [
    { id: 1, name: 'دليل ISO 9001:2015', description: 'الدليل الشامل لمعيار إدارة الجودة', type: 'pdf', category: 'iso', size: '2.5 MB', date: '2024-01-15' },
    { id: 2, name: 'إجراءات فحص الجودة', description: 'الإجراءات المعتمدة لفحص جودة الإنتاج', type: 'word', category: 'procedures', size: '1.2 MB', date: '2024-02-10' },
    { id: 3, name: 'تقرير الجودة السنوي 2023', description: 'تقرير شامل عن أداء الجودة للعام الماضي', type: 'excel', category: 'reports', size: '3.8 MB', date: '2024-01-05' },
    { id: 4, name: 'دليل التدريب على SPC', description: 'مواد تدريبية للتحكم الإحصائي في العمليات', type: 'powerpoint', category: 'training', size: '5.2 MB', date: '2024-03-01' },
    { id: 5, name: 'معايير FMEA', description: 'دليل تحليل أنماط الفشل وآثاره', type: 'pdf', category: 'iso', size: '1.8 MB', date: '2024-02-20' },
    { id: 6, name: 'خطة التدقيق الداخلي', description: 'خطة التدقيق الداخلي للربع الأول', type: 'excel', category: 'procedures', size: '890 KB', date: '2024-03-15' }
];

// ========================
// 🚀 تهيئة الصفحة
// ========================
document.addEventListener('DOMContentLoaded', function() {
    loadDocuments();
    setupSearchAndFilters();
});

// ========================
// 📋 تحميل المستندات
// ========================
function loadDocuments() {
    const grid = document.getElementById('documentsGrid');
    if (!grid) return;
    
    const filteredDocs = getFilteredDocuments();
    
    grid.innerHTML = filteredDocs.map(doc => `
        <div class="document-card">
            <div class="document-icon ${doc.type}">
                <i class="fas fa-file-${getFileIcon(doc.type)}"></i>
            </div>
            <h4>${doc.name}</h4>
            <p>${doc.description}</p>
            <div class="document-meta">
                <span><i class="fas fa-calendar"></i> ${formatDate(doc.date)}</span>
                <span><i class="fas fa-hdd"></i> ${doc.size}</span>
            </div>
            <div class="document-actions">
                <button class="btn-view" onclick="viewDocument(${doc.id})"><i class="fas fa-eye"></i> عرض</button>
                <button class="btn-download" onclick="downloadDocument(${doc.id})"><i class="fas fa-download"></i> تحميل</button>
            </div>
        </div>
    `).join('');
}

// ========================
// 🔍 الحصول على المستندات المفلترة
// ========================
function getFilteredDocuments() {
    const searchQuery = document.getElementById('librarySearch')?.value.toLowerCase() || '';
    const categoryFilter = document.getElementById('categoryFilter')?.value || '';
    
    return documents.filter(doc => {
        const matchesSearch = !searchQuery || 
            doc.name.toLowerCase().includes(searchQuery) ||
            doc.description.toLowerCase().includes(searchQuery);
        
        const matchesCategory = !categoryFilter || doc.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
}

// ========================
// 🎧 إعداد البحث والفلاتر
// ========================
function setupSearchAndFilters() {
    const searchInput = document.getElementById('librarySearch');
    const categoryFilter = document.getElementById('categoryFilter');
    
    const handleFilterChange = () => loadDocuments();
    
    searchInput?.addEventListener('input', debounce(handleFilterChange, 300));
    categoryFilter?.addEventListener('change', handleFilterChange);
}

// ========================
// 📎 الحصول على أيقونة الملف
// ========================
function getFileIcon(type) {
    const icons = {
        'pdf': 'pdf',
        'word': 'word',
        'excel': 'excel',
        'powerpoint': 'powerpoint'
    };
    return icons[type] || 'alt';
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
// 👁️ عرض مستند
// ========================
function viewDocument(id) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    
    showModal(doc.name, `
        <div style="padding: 20px; text-align: center;">
            <div style="font-size: 64px; margin-bottom: 20px;">
                <i class="fas fa-file-${getFileIcon(doc.type)}"></i>
            </div>
            <p>${doc.description}</p>
            <p><strong>الحجم:</strong> ${doc.size}</p>
            <p><strong>تاريخ الرفع:</strong> ${formatDate(doc.date)}</p>
        </div>
    `);
}

// ========================
// 📥 تحميل مستند
// ========================
function downloadDocument(id) {
    const doc = documents.find(d => d.id === id);
    if (!doc) return;
    
    showToast(`جاري تحميل ${doc.name}...`, 'info');
    setTimeout(() => {
        showToast('تم التحميل بنجاح', 'success');
    }, 1500);
}

// ========================
// ⬆️ رفع مستند
// ========================
function uploadDocument() {
    showModal('رفع مستند جديد', `
        <div style="padding: 20px;">
            <div class="form-group" style="margin-bottom: 15px;">
                <label>اسم المستند</label>
                <input type="text" id="uploadDocName" placeholder="اسم المستند" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;">
            </div>
            <div class="form-group" style="margin-bottom: 15px;">
                <label>الفئة</label>
                <select id="uploadDocCategory" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;">
                    <option value="iso">معايير ISO</option>
                    <option value="procedures">إجراءات العمل</option>
                    <option value="training">مواد تدريبية</option>
                    <option value="reports">تقارير</option>
                </select>
            </div>
            <div class="form-group" style="margin-bottom: 15px;">
                <label>اختر الملف</label>
                <input type="file" id="uploadDocFile" style="width: 100%; padding: 10px; border: 1px dashed var(--border-color); border-radius: 8px;">
            </div>
            <button class="btn btn-primary" onclick="saveDocument()" style="width: 100%;">رفع</button>
        </div>
    `);
}

function saveDocument() {
    const name = document.getElementById('uploadDocName').value;
    const category = document.getElementById('uploadDocCategory').value;
    const file = document.getElementById('uploadDocFile').files[0];
    
    if (!name || !file) {
        showToast('الرجاء ملء جميع الحقول', 'error');
        return;
    }
    
    documents.push({
        id: documents.length + 1,
        name: name,
        description: 'مستند جديد',
        type: file.name.split('.').pop(),
        category: category,
        size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
        date: new Date().toISOString().split('T')[0]
    });
    
    loadDocuments();
    closeModal();
    showToast('تم رفع المستند بنجاح', 'success');
}

// ========================
// ⏱️ Debounce
// ========================
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

// تصدير الدوال
window.viewDocument = viewDocument;
window.downloadDocument = downloadDocument;
window.uploadDocument = uploadDocument;
window.saveDocument = saveDocument;
