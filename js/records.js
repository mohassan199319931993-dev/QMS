// ===========================================
// 📋 RECORDS.JS - السجلات
// ===========================================

// ========================
// 📊 بيانات السجلات
// ========================
let records = [];
let currentPage = 1;
const recordsPerPage = 10;

// ========================
// 🚀 تهيئة الصفحة
// ========================
document.addEventListener('DOMContentLoaded', function() {
    // توليد بيانات تجريبية
    generateSampleRecords();
    
    // تحميل السجلات
    loadRecords();
    
    // إعداد البحث والفلاتر
    setupSearchAndFilters();
    
    // إحداثيات التحديد الكل
    document.getElementById('selectAll')?.addEventListener('change', function() {
        document.querySelectorAll('.record-checkbox').forEach(cb => {
            cb.checked = this.checked;
        });
    });
});

// ========================
// 📊 توليد بيانات تجريبية
// ========================
function generateSampleRecords() {
    const models = ['MOD-001', 'MOD-002', 'MOD-003', 'MOD-004', 'MOD-005'];
    const statuses = ['approved', 'pending', 'rejected'];
    
    for (let i = 1; i <= 100; i++) {
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 30));
        
        records.push({
            id: `QC-2024-${String(i).padStart(5, '0')}`,
            date: date.toISOString().split('T')[0],
            model: models[Math.floor(Math.random() * models.length)],
            quantity: Math.floor(Math.random() * 3000) + 1000,
            qualityRate: (Math.random() * 15 + 85).toFixed(1),
            status: statuses[Math.floor(Math.random() * statuses.length)]
        });
    }
}

// ========================
// 📋 تحميل السجلات
// ========================
function loadRecords() {
    const tableBody = document.getElementById('recordsTable');
    if (!tableBody) return;
    
    const filteredRecords = getFilteredRecords();
    const startIndex = (currentPage - 1) * recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const pageRecords = filteredRecords.slice(startIndex, endIndex);
    
    tableBody.innerHTML = pageRecords.map(record => `
        <tr>
            <td><input type="checkbox" class="record-checkbox" value="${record.id}"></td>
            <td><strong>${record.id}</strong></td>
            <td>${formatDate(record.date)}</td>
            <td>${record.model}</td>
            <td>${record.quantity.toLocaleString()}</td>
            <td><span class="quality-rate ${getQualityRateClass(record.qualityRate)}">${record.qualityRate}%</span></td>
            <td><span class="status-badge ${record.status}">${getStatusLabel(record.status)}</span></td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewRecord('${record.id}')" title="عرض"><i class="fas fa-eye"></i></button>
                    <button class="action-btn edit" onclick="editRecord('${record.id}')" title="تعديل"><i class="fas fa-edit"></i></button>
                    <button class="action-btn delete" onclick="deleteRecord('${record.id}')" title="حذف"><i class="fas fa-trash"></i></button>
                </div>
            </td>
        </tr>
    `).join('');
    
    updatePagination(filteredRecords.length);
}

// ========================
// 🔍 الحصول على السجلات المفلترة
// ========================
function getFilteredRecords() {
    const searchQuery = document.getElementById('recordsSearch')?.value.toLowerCase() || '';
    const statusFilter = document.getElementById('statusFilter')?.value || '';
    const dateFilter = document.getElementById('dateFilter')?.value || '';
    
    return records.filter(record => {
        const matchesSearch = !searchQuery || 
            record.id.toLowerCase().includes(searchQuery) ||
            record.model.toLowerCase().includes(searchQuery);
        
        const matchesStatus = !statusFilter || record.status === statusFilter;
        
        const matchesDate = !dateFilter || record.date === dateFilter;
        
        return matchesSearch && matchesStatus && matchesDate;
    });
}

// ========================
// 🎧 إعداد البحث والفلاتر
// ========================
function setupSearchAndFilters() {
    const searchInput = document.getElementById('recordsSearch');
    const statusFilter = document.getElementById('statusFilter');
    const dateFilter = document.getElementById('dateFilter');
    
    const handleFilterChange = () => {
        currentPage = 1;
        loadRecords();
    };
    
    searchInput?.addEventListener('input', debounce(handleFilterChange, 300));
    statusFilter?.addEventListener('change', handleFilterChange);
    dateFilter?.addEventListener('change', handleFilterChange);
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
// 🏷️ الحصول على فئة معدل الجودة
// ========================
function getQualityRateClass(rate) {
    if (rate >= 95) return 'high';
    if (rate >= 90) return 'medium';
    return 'low';
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
// 📄 تحديث الترقيم
// ========================
function updatePagination(totalRecords) {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    
    document.getElementById('pageInfo').textContent = `صفحة ${currentPage} من ${totalPages}`;
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

// ========================
// ⬅️ الصفحة السابقة
// ========================
function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        loadRecords();
    }
}

// ========================
// ➡️ الصفحة التالية
// ========================
function nextPage() {
    const totalPages = Math.ceil(getFilteredRecords().length / recordsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        loadRecords();
    }
}

// ========================
// 👁️ عرض سجل
// ========================
function viewRecord(recordId) {
    const record = records.find(r => r.id === recordId);
    if (!record) return;
    
    showModal('تفاصيل السجل', `
        <div style="padding: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div><strong>رقم السجل:</strong> ${record.id}</div>
                <div><strong>التاريخ:</strong> ${formatDate(record.date)}</div>
                <div><strong>الموديل:</strong> ${record.model}</div>
                <div><strong>الكمية:</strong> ${record.quantity.toLocaleString()}</div>
                <div><strong>معدل الجودة:</strong> ${record.qualityRate}%</div>
                <div><strong>الحالة:</strong> <span class="status-badge ${record.status}">${getStatusLabel(record.status)}</span></div>
            </div>
        </div>
    `);
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
        records = records.filter(r => r.id !== recordId);
        loadRecords();
        showToast('تم حذف السجل بنجاح', 'success');
    }
}

// ========================
// 📥 تصدير السجلات
// ========================
function exportRecords() {
    const filteredRecords = getFilteredRecords();
    const csvContent = [
        ['رقم السجل', 'التاريخ', 'الموديل', 'الكمية', 'معدل الجودة', 'الحالة'],
        ...filteredRecords.map(r => [r.id, r.date, r.model, r.quantity, r.qualityRate, getStatusLabel(r.status)])
    ].map(row => row.join(',')).join('\n');

    downloadFile('\uFEFF' + csvContent, 'records.csv', 'text/csv;charset=utf-8;');
    showToast('تم تصدير السجلات بنجاح', 'success');
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
window.prevPage = prevPage;
window.nextPage = nextPage;
window.viewRecord = viewRecord;
window.editRecord = editRecord;
window.deleteRecord = deleteRecord;
window.exportRecords = exportRecords;
