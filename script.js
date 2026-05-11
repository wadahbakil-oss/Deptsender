// قائمة العملاء الافتراضية (يمكنك تعديلها أو إضافتها من داخل التطبيق)
let customers = [
    { name: "ناصر الضبي", phone: "770066128", debt: 2500 },
    { name: "وليد الزعيمي", phone: "771234567", debt: 2400 },
    { name: "عبدالله شعبان", phone: "772345678", debt: 3950 },
    { name: "محمد عطية اخبار", phone: "773456789", debt: 5200 },
    { name: "مرجان سيف", phone: "774567890", debt: 5820 }
];

// تحميل البيانات من التخزين المحلي
function loadCustomers() {
    const saved = localStorage.getItem('customers');
    if (saved) {
        customers = JSON.parse(saved);
    }
    updateCustomerList();
}

// حفظ البيانات
function saveCustomers() {
    localStorage.setItem('customers', JSON.stringify(customers));
}

// تحديث قائمة العملاء في الواجهة
function updateCustomerList() {
    const select = document.getElementById('customerSelect');
    select.innerHTML = '';
    
    customers.forEach((customer, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = `${customer.name} - رصيد: ${customer.debt} ريال`;
        select.appendChild(option);
    });
    
    if (customers.length > 0) {
        updateDebtDisplay();
    }
}

// عرض الرصيد الحالي
function updateDebtDisplay() {
    const select = document.getElementById('customerSelect');
    const index = select.value;
    if (index && customers[index]) {
        document.getElementById('currentDebt').textContent = 
            `💰 الرصيد الحالي: ${customers[index].debt} ريال`;
    }
}

// إرسال عبر واتساب
function sendViaWhatsApp() {
    const select = document.getElementById('customerSelect');
    const index = select.value;
    if (!index) {
        alert('الرجاء اختيار عميل');
        return;
    }
    
    const customer = customers[index];
    const amount = parseFloat(document.getElementById('amountInput').value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('الرجاء إدخال مبلغ صحيح');
        return;
    }
    
    const newTotal = customer.debt + amount;
    const message = `الاخ ${customer.name}، نود اعلامكم بان تم تقيد مبلغ ${amount} ريال ليصبح اجمالي رصيدكم علينا ${newTotal} ريال.`;
    
    // تحديث الرصيد
    customer.debt = newTotal;
    saveCustomers();
    updateCustomerList();
    
    // فتح واتساب
    const phoneNumber = customer.phone.startsWith('0') ? customer.phone.substring(1) : customer.phone;
    const url = `https://wa.me/967${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
    
    document.getElementById('amountInput').value = '';
    alert('✅ تم فتح واتساب، اضغط إرسال لإرسال الرسالة');
}

// إرسال عبر رسالة نصية
function sendViaSMS() {
    const select = document.getElementById('customerSelect');
    const index = select.value;
    if (!index) {
        alert('الرجاء اختيار عميل');
        return;
    }
    
    const customer = customers[index];
    const amount = parseFloat(document.getElementById('amountInput').value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('الرجاء إدخال مبلغ صحيح');
        return;
    }
    
    const newTotal = customer.debt + amount;
    const message = `الاخ ${customer.name}، نود اعلامكم بان تم تقيد مبلغ ${amount} ريال ليصبح اجمالي رصيدكم علينا ${newTotal} ريال.`;
    
    // تحديث الرصيد
    customer.debt = newTotal;
    saveCustomers();
    updateCustomerList();
    
    // فتح تطبيق الرسائل
    const phoneNumber = customer.phone.startsWith('0') ? customer.phone.substring(1) : customer.phone;
    window.location.href = `sms:+967${phoneNumber}?body=${encodeURIComponent(message)}`;
    
    document.getElementById('amountInput').value = '';
    alert('✅ تم فتح تطبيق الرسائل');
}

// إرفاق PDF مع الرسالة
function attachPDF() {
    const select = document.getElementById('customerSelect');
    const index = select.value;
    if (!index) {
        alert('الرجاء اختيار عميل أولاً');
        return;
    }
    
    const customer = customers[index];
    const amount = parseFloat(document.getElementById('amountInput').value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('الرجاء إدخال المبلغ أولاً');
        return;
    }
    
    const newTotal = customer.debt + amount;
    
    // تحديث الرصيد
    customer.debt = newTotal;
    saveCustomers();
    updateCustomerList();
    
    // إنشاء نص الرسالة
    const message = `الاخ ${customer.name}، نود اعلامكم بان تم تقيد مبلغ ${amount} ريال ليصبح اجمالي رصيدكم علينا ${newTotal} ريال.`;
    
    // فتح نافذة اختيار الملف
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf';
    
    fileInput.onchange = function(e) {
        const file = e.target.files[0];
        if (file) {
            const phoneNumber = customer.phone.startsWith('0') ? customer.phone.substring(1) : customer.phone;
            const whatsappUrl = `https://wa.me/967${phoneNumber}?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
            
            alert('✅ تم فتح واتساب\n📎 قم بالضغط على زر المرفقات (مشبك الورق) ثم اختر ملف PDF');
        }
    };
    
    fileInput.click();
    document.getElementById('amountInput').value = '';
}

// إنشاء وإرسال PDF تلقائي
async function generateAndSendPDF() {
    const select = document.getElementById('customerSelect');
    const index = select.value;
    if (!index) {
        alert('الرجاء اختيار عميل');
        return;
    }
    
    const customer = customers[index];
    const amount = parseFloat(document.getElementById('amountInput').value);
    
    if (isNaN(amount) || amount <= 0) {
        alert('الرجاء إدخال المبلغ');
        return;
    }
    
    const newTotal = customer.debt + amount;
    const oldTotal = customer.debt;
    
    // تحديث الرصيد
    customer.debt = newTotal;
    saveCustomers();
    updateCustomerList();
    
    // إنشاء PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    // عنوان الصيدلية
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("صيدلية العابد", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.text("تعز - الحوبان - مدخل البريد", 105, 28, { align: "center" });
    doc.text("تلفون: 770066128", 105, 34, { align: "center" });
    
    doc.setFontSize(12);
    doc.text(`رقم الطلب: ${Date.now()}`, 20, 45);
    doc.text(`التاريخ: ${new Date().toLocaleDateString('ar-EG')}`, 140, 45);
    
    // جدول الديون
    doc.autoTable({
        startY: 55,
        head: [['اسم العميل', 'الرصيد السابق', 'المبلغ الجديد', 'الرصيد الحالي']],
        body: [
            [customer.name, `${oldTotal} ريال`, `${amount} ريال`, `${newTotal} ريال`]
        ],
        styles: { font: 'helvetica', fontSize: 10, cellPadding: 3, halign: 'center' },
        headStyles: { fillColor: [33, 150, 243], textColor: [255, 255, 255] }
    });
    
    // تذييل
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text("شكراً لتعاملكم مع صيدلية العابد", 105, finalY, { align: "center" });
    
    // حفظ PDF
    const pdfBlob = doc.output('blob');
    const pdfURL = URL.createObjectURL(pdfBlob);
    
    // إرسال الرسالة
    const message = `الاخ ${customer.name}، نود اعلامكم بان تم تقيد مبلغ ${amount} ريال ليصبح اجمالي الرصيد عليكم ${newTotal} ريال.\n(المرفق: فاتورة PDF)`;
    const phoneNumber = customer.phone.startsWith('0') ? customer.phone.substring(1) : customer.phone;
    const whatsappUrl = `https://wa.me/967${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    // تحميل PDF
    const link = document.createElement('a');
    link.href = pdfURL;
    link.download = `فاتورة_${customer.name}_${Date.now()}.pdf`;
    link.click();
    
    alert('✅ تم فتح واتساب وتحميل PDF\n📎 قم بإرفاق ملف PDF الذي تم تحميله');
    
    setTimeout(() => URL.revokeObjectURL(pdfURL), 5000);
    document.getElementById('amountInput').value = '';
}

// إضافة عميل جديد
function addNewCustomer() {
    const name = prompt('أدخل اسم العميل:');
    if (!name) return;
    
    const phone = prompt('أدخل رقم الهاتف (مثال: 770066128):');
    if (!phone) return;
    
    const debt = parseFloat(prompt('أدخل الرصيد الحالي:', '0'));
    
    customers.push({
        name: name,
        phone: phone,
        debt: isNaN(debt) ? 0 : debt
    });
    
    saveCustomers();
    updateCustomerList();
    alert('✅ تم إضافة العميل بنجاح');
}

// عند تغيير العميل
document.getElementById('customerSelect')?.addEventListener('change', updateDebtDisplay);

// تحميل البيانات عند بدء التشغيل
loadCustomers();
