// قائمة العملاء (تعدل هنا مرة واحدة فقط)
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
