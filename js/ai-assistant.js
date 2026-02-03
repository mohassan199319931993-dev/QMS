// ===========================================
// 🤖 AI-ASSISTANT.JS - المساعد الذكي
// ===========================================

// ========================
// 💬 الردود المعدة مسبقاً
// ========================
const responses = {
    'معدل الجودة': 'معدل الجودة الحالي هو 98.2%، وهو أعلى من الهدف المحدد بنسبة 95%.',
    'سجل جديد': 'لإضافة سجل جديد، انتقل إلى صفحة "إدخال البيانات" واملأ النموذج المطلوب.',
    'ISO 9001': 'ISO 9001:2015 هو المعيار الدولي لنظام إدارة الجودة. يركز على تحقيق رضا العملاء وتحسين الأداء المستمر.',
    'تقرير': 'يمكنك إنشاء تقارير مفصلة من صفحة "التحليلات" مع إمكانية تصديرها بصيغ مختلفة.',
    'default': 'شكراً لسؤالك! يمكنني مساعدتك في: الاستفسارات عن الجودة، إرشادات الاستخدام، أو تفسير البيانات.'
};

// ========================
// 🚀 تهيئة الصفحة
// ========================
document.addEventListener('DOMContentLoaded', function() {
    // إعداد إدخال الرسائل
    const messageInput = document.getElementById('messageInput');
    if (messageInput) {
        messageInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });
    }
});

// ========================
// 📤 إرسال رسالة
// ========================
function sendMessage() {
    const input = document.getElementById('messageInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // إضافة رسالة المستخدم
    addMessage(message, 'user');
    input.value = '';
    
    // إظهار مؤشر الكتابة
    showTypingIndicator();
    
    // إنشاء رد بعد تأخير
    setTimeout(() => {
        hideTypingIndicator();
        const response = generateResponse(message);
        addMessage(response, 'ai');
    }, 1500);
}

// ========================
// ❓ طرح سؤال سريع
// ========================
function askQuestion(question) {
    document.getElementById('messageInput').value = question;
    sendMessage();
}

// ========================
// ➕ إضافة رسالة
// ========================
function addMessage(text, sender) {
    const chatMessages = document.getElementById('chatMessages');
    const time = new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    messageDiv.innerHTML = `
        <div class="message-content">
            <p>${text}</p>
        </div>
        <span class="message-time">${time}</span>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ========================
// ⌨️ إظهار مؤشر الكتابة
// ========================
function showTypingIndicator() {
    const chatMessages = document.getElementById('chatMessages');
    
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message typing';
    typingDiv.id = 'typingIndicator';
    typingDiv.innerHTML = `
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// ========================
// 🗑️ إخفاء مؤشر الكتابة
// ========================
function hideTypingIndicator() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.remove();
    }
}

// ========================
// 🧠 توليد رد
// ========================
function generateResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key.toLowerCase())) {
            return response;
        }
    }
    
    return responses.default;
}

// تصدير الدوال
window.sendMessage = sendMessage;
window.askQuestion = askQuestion;
