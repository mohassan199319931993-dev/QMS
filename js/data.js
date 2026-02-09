// ===========================================
// 📊 DATA.JS - إدخال البيانات
// ===========================================

// ========================
// 📦 بيانات الموديلات
// ========================
const models = [
    { code: "MOD001", name: "موديل ألفا", number: "001", type: "نوع أ", mDay: "يوم 1", pdnS: "PDN-001", dftS: "DFT-001", target: 95 },
    { code: "MOD002", name: "موديل بيتا", number: "002", type: "نوع ب", mDay: "يوم 2", pdnS: "PDN-002", dftS: "DFT-002", target: 92 },
    { code: "MOD003", name: "موديل غاما", number: "003", type: "نوع ج", mDay: "يوم 3", pdnS: "PDN-003", dftS: "DFT-003", target: 98 },
    { code: "MOD004", name: "موديل دلتا", number: "004", type: "نوع د", mDay: "يوم 4", pdnS: "PDN-004", dftS: "DFT-004", target: 90 },
    { code: "MOD005", name: "موديل إبسلون", number: "005", type: "نوع أ", mDay: "يوم 5", pdnS: "PDN-005", dftS: "DFT-005", target: 96 },
    { code: "MOD006", name: "موديل زيتا", number: "006", type: "نوع ب", mDay: "يوم 6", pdnS: "PDN-006", dftS: "DFT-006", target: 94 },
    { code: "MOD007", name: "موديل إيتا", number: "007", type: "نوع ج", mDay: "يوم 7", pdnS: "PDN-007", dftS: "DFT-007", target: 97 },
    { code: "MOD008", name: "موديل ثيتا", number: "008", type: "نوع د", mDay: "يوم 8", pdnS: "PDN-008", dftS: "DFT-008", target: 93 }
];

// ========================
// 🚀 تهيئة الصفحة
// ========================
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة نموذج التاريخ
    initDateForm();
    
    // تهيئة البحث التلقائي
    initModelAutocomplete();
    
    // تحميل جدول الموديلات
    loadModelsTable();
    
    // إعداد مستمعي الأحداث
    setupEventListeners();
});

// ========================
// 📅 تهيئة نموذج التاريخ
// ========================
function initDateForm() {
    const dateInput = document.getElementById("datetime");
    if (!dateInput) return;

    dateInput.addEventListener("change", function() {
        if (!this.value) return;

        const selectedDate = new Date(this.value);
        if (isNaN(selectedDate)) return;

        const year = selectedDate.getFullYear();
        document.getElementById("year").value = year;

        // الشهر
        const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
        document.getElementById("month").value = `${year}_${month}`;

        // الربع
        const quarter = Math.floor(selectedDate.getMonth() / 3) + 1;
        document.getElementById("quarter").value = `${year}_Q${quarter}`;

        // الأسبوع
        document.getElementById("week").value = `${year}-W${getWeekNumber(selectedDate)}`;

        // الساعة
        const hours = selectedDate.getHours().toString().padStart(2, "0");
        const minutes = selectedDate.getMinutes().toString().padStart(2, "0");
        document.getElementById("hour").value = `${hours}:${minutes}`;

        // الوردية
        const hour = selectedDate.getHours();
        let shift = "3";
        if (hour >= 7 && hour < 15) shift = "1";
        else if (hour >= 15 && hour < 23) shift = "2";
        document.getElementById("shift").value = shift;
    });
}

// ========================
// 📅 حساب رقم الأسبوع
// ========================
function getWeekNumber(d) {
    const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
    const dayNum = (date.getUTCDay() + 6) % 7;
    date.setUTCDate(date.getUTCDate() - dayNum + 3);
    const firstThursday = new Date(Date.UTC(date.getUTCFullYear(), 0, 4));
    return 1 + Math.round(((date - firstThursday) / 86400000 - 3 + ((firstThursday.getUTCDay() + 6) % 7)) / 7);
}

// ========================
// 🔍 تهيئة البحث التلقائي
// ========================
function initModelAutocomplete() {
    const modelCodeInput = document.getElementById('model-code');
    const suggestionsList = document.getElementById('model-suggestions');

    if (!modelCodeInput || !suggestionsList) return;

    modelCodeInput.addEventListener('input', function() {
        const value = this.value.trim().toUpperCase();
        suggestionsList.innerHTML = '';
        suggestionsList.style.display = 'none';

        if (value.length === 0) return;

        const filteredModels = models.filter(model =>
            model.code.toUpperCase().includes(value)
        );

        if (filteredModels.length > 0) {
            filteredModels.forEach(model => {
                const li = document.createElement('li');
                li.textContent = `${model.code} - ${model.name}`;
                li.addEventListener('click', () => {
                    modelCodeInput.value = model.code;
                    fillModelFields(model);
                    suggestionsList.style.display = 'none';
                });
                suggestionsList.appendChild(li);
            });
            suggestionsList.style.display = 'block';
        }
    });

    // إخفاء القائمة عند النقر خارجها
    document.addEventListener('click', (e) => {
        if (e.target !== modelCodeInput) {
            suggestionsList.style.display = 'none';
        }
    });
}

// ========================
// 📝 تعبئة حقول الموديل
// ========================
function fillModelFields(model) {
    document.getElementById('model-name').value = model.name;
    document.getElementById('model-number').value = model.number;
    document.getElementById('model-type').value = model.type;
    document.getElementById('m-day').value = model.mDay;
    document.getElementById('pdn-s').value = model.pdnS;
    document.getElementById('dft-s').value = model.dftS;
}

// ========================
// 📋 تحميل جدول الموديلات
// ========================
function loadModelsTable() {
    const tableBody = document.getElementById('modelsTable');
    if (!tableBody) return;

    tableBody.innerHTML = models.map(model => `
        <tr>
            <td><strong>${model.code}</strong></td>
            <td>${model.name}</td>
            <td>${model.number}</td>
            <td>${model.type}</td>
            <td>${model.mDay}</td>
            <td>${model.pdnS}</td>
            <td>${model.dftS}</td>
            <td>
                <div class="action-btns">
                    <button class="action-btn view" onclick="viewModel('${model.code}')" title="عرض">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit" onclick="editModel('${model.code}')" title="تعديل">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete" onclick="deleteModel('${model.code}')" title="حذف">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// ========================
// 🎧 إعداد مستمعي الأحداث
// ========================
function setupEventListeners() {
    const form = document.getElementById('qualityForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    // حساب معدل الجودة تلقائياً
    const quantityInput = document.getElementById('quantity');
    const defectCountInput = document.getElementById('defect-count');
    const qualityRateInput = document.getElementById('quality-rate');

    if (quantityInput && defectCountInput && qualityRateInput) {
        const calculateQualityRate = () => {
            const quantity = parseInt(quantityInput.value) || 0;
            const defects = parseInt(defectCountInput.value) || 0;
            
            if (quantity > 0) {
                const rate = ((quantity - defects) / quantity * 100).toFixed(2);
                qualityRateInput.value = rate;
                
                // تحديد النتيجة تلقائياً
                const resultSelect = document.getElementById('result');
                if (resultSelect) {
                    if (rate >= 95) resultSelect.value = 'pass';
                    else if (rate >= 90) resultSelect.value = 'hold';
                    else resultSelect.value = 'fail';
                }
            }
        };

        quantityInput.addEventListener('input', calculateQualityRate);
        defectCountInput.addEventListener('input', calculateQualityRate);
    }
}

// ========================
// 📤 معالجة إرسال النموذج مع Supabase
// ========================
// ========================
// 📤 معالجة إرسال النموذج مع Supabase
// ========================
async function handleFormSubmit(e) {
    e.preventDefault();

    console.log("🚀 Submit Fired");

    // 1️⃣ تأكد إن Supabase Client موجود
    if (!window.supabaseClient) {
        console.error("❌ Supabase Client Not Loaded");
        alert("Supabase غير متصل");
        return;
    }

    const supabase = window.supabaseClient;

    // 2️⃣ قراءة بيانات الفورم
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    console.log("📦 Form Data:", data);

    // 3️⃣ التحقق من الحقول المطلوبة
    if (!data.datetime || !data["model-code"] || !data.quantity) {
        alert("❌ الرجاء ملء جميع الحقول المطلوبة");
        return;
    }

    // 4️⃣ تجهيز البيانات للإدخال (لازم تطابق أعمدة الجدول)
    const record = {
        datetime: data.datetime,
        year: Number(data.year) || null,
        quarter: data.quarter || null,
        month: data.month || null,
        week: data.week || null,
        shift: data.shift || null,
        hour: data.hour || null,

        model_code: data["model-code"],
        model_name: document.getElementById("model-name")?.value || null,
        model_number: document.getElementById("model-number")?.value || null,
        model_type: document.getElementById("model-type")?.value || null,

        m_day: document.getElementById("m-day")?.value || null,
        pdn_s: document.getElementById("pdn-s")?.value || null,
        dft_s: document.getElementById("dft-s")?.value || null,
        target: document.getElementById("target")
            ? Number(document.getElementById("target").value)
            : null,

        quantity: Number(data.quantity),
        defect_count: Number(data["defect-count"] || 0),
        quality_rate: Number(data["quality-rate"] || 0),

        result: data.result || null,
        status: data.status || null,
        notes: data.notes || null
    };

    console.log("🧾 Record To Insert:", record);

    // 5️⃣ الإرسال إلى Supabase
    try {
        const { data: insertedData, error } = await supabase
            .from("records") // ⚠️ لازم اسم الجدول يكون موجود في Supabase
            .insert(record)
            .select();

        if (error) {
            console.error("❌ Supabase Error:", error);
            alert("خطأ في الحفظ: " + error.message);
            return;
        }

        console.log("✅ Inserted Successfully:", insertedData);
        alert("✅ تم حفظ البيانات بنجاح");

        form.reset();

    } catch (err) {
        console.error("🔥 Unexpected Error:", err);
        alert("❌ حصل خطأ غير متوقع");
    }
}


// ========================
// 🕐 تعيين التاريخ الحالي
// ========================
function setCurrentDateTime() {
    const dateInput = document.getElementById('datetime');
    if (!dateInput) return;

    const now = new Date();
    const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    dateInput.value = localDateTime;
    dateInput.dispatchEvent(new Event('change'));
}

// ========================
// 🔄 إعادة تعيين النموذج
// ========================
function resetForm() {
    const form = document.getElementById('qualityForm');
    if (form) {
        form.reset();
        showToast('تم إعادة تعيين النموذج', 'info');
    }
}

// ========================
// 💾 حفظ كمسودة
// ========================
function saveDraft() {
    const form = document.getElementById('qualityForm');
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // حفظ في LocalStorage
    localStorage.setItem('qc_draft', JSON.stringify(data));
    
    showToast('تم حفظ المسودة', 'success');
}

// ========================
// 👁️ عرض موديل
// ========================
function viewModel(code) {
    const model = models.find(m => m.code === code);
    if (!model) return;

    showModal('تفاصيل الموديل', `
        <div style="padding: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
                <div><strong>الكود:</strong> ${model.code}</div>
                <div><strong>الاسم:</strong> ${model.name}</div>
                <div><strong>الرقم:</strong> ${model.number}</div>
                <div><strong>النوع:</strong> ${model.type}</div>
                <div><strong>يوم الإنتاج:</strong> ${model.mDay}</div>
                <div><strong>PDN-S:</strong> ${model.pdnS}</div>
                <div><strong>DFT-S:</strong> ${model.dftS}</div>
                <div><strong>الهدف:</strong> ${model.target}%</div>
            </div>
        </div>
    `);
}

// ========================
// ✏️ تعديل موديل
// ========================
function editModel(code) {
    showToast(`تعديل الموديل ${code}`, 'info');
    // يمكن إضافة منطق التعديل الفعلي
}

// ========================
// 🗑️ حذف موديل
// ========================
function deleteModel(code) {
    if (confirm(`هل أنت متأكد من حذف الموديل ${code}؟`)) {
        showToast(`تم حذف الموديل ${code}`, 'success');
        // يمكن إضافة منطق الحذف الفعلي
    }
}

// ========================
// 📥 تصدير الموديلات
// ========================
function exportModels() {
    const csvContent = [
        ['الكود', 'الاسم', 'الرقم', 'النوع', 'يوم الإنتاج', 'PDN-S', 'DFT-S', 'الهدف'],
        ...models.map(m => [m.code, m.name, m.number, m.type, m.mDay, m.pdnS, m.dftS, m.target])
    ].map(row => row.join(',')).join('\n');

    downloadFile('\uFEFF' + csvContent, 'models.csv', 'text/csv;charset=utf-8;');
    showToast('تم تصدير الموديلات بنجاح', 'success');
}

// ========================
// ➕ إضافة موديل جديد
// ========================
function addNewModel() {
    showModal('إضافة موديل جديد', `
        <div style="padding: 20px;">
            <div class="form-group" style="margin-bottom: 15px;">
                <label>كود الموديل</label>
                <input type="text" id="newModelCode" placeholder="مثال: MOD009" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;">
            </div>
            <div class="form-group" style="margin-bottom: 15px;">
                <label>اسم الموديل</label>
                <input type="text" id="newModelName" placeholder="اسم الموديل" style="width: 100%; padding: 10px; border: 1px solid var(--border-color); border-radius: 8px;">
            </div>
            <button class="btn btn-primary" onclick="saveNewModel()" style="width: 100%;">حفظ</button>
        </div>
    `);
}

function saveNewModel() {
    const code = document.getElementById('newModelCode').value;
    const name = document.getElementById('newModelName').value;
    
    if (!code || !name) {
        showToast('الرجاء ملء جميع الحقول', 'error');
        return;
    }
    
    models.push({
        code: code,
        name: name,
        number: String(models.length + 1).padStart(3, '0'),
        type: "نوع جديد",
        mDay: "يوم جديد",
        pdnS: "PDN-" + String(models.length + 1).padStart(3, '0'),
        dftS: "DFT-" + String(models.length + 1).padStart(3, '0'),
        target: 95
    });
    
    loadModelsTable();
    closeModal();
    showToast('تم إضافة الموديل بنجاح', 'success');
}

// تصدير الدوال
window.setCurrentDateTime = setCurrentDateTime;
window.resetForm = resetForm;
window.saveDraft = saveDraft;
window.viewModel = viewModel;
window.editModel = editModel;
window.deleteModel = deleteModel;
window.exportModels = exportModels;
window.addNewModel = addNewModel;
window.saveNewModel = saveNewModel;
