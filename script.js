document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username === 'admin' && password === 'admin') {
        document.getElementById('login-page').style.display = 'none';
        document.getElementById('main-page').style.display = 'flex';
        updateClock();
        updateDate();
    } else {
        alert('Invalid username or password');
    }
});

document.getElementById('add-customer-btn').addEventListener('click', function() {
    document.getElementById('main-page').style.display = 'none';
    document.getElementById('customer-page').style.display = 'flex';
});

document.getElementById('back-btn').addEventListener('click', function() {
    document.getElementById('customer-page').style.display = 'none';
    document.getElementById('main-page').style.display = 'flex';
});

document.getElementById('customer-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const customerId = document.getElementById('customer-id').value;
    const customerName = document.getElementById('customer-name').value;
    const customerPhone = document.getElementById('customer-phone').value;
    const customerAddress = document.getElementById('customer-address').value;
    const customerType = document.getElementById('customer-type').value;

    addCustomerToTable(customerId, customerName, customerPhone, customerAddress, customerType);
});

document.getElementById('save-customers-btn').addEventListener('click', function() {
    saveCustomersToLocalStorage();
});

document.getElementById('delete-customers-btn').addEventListener('click', function() {
    deleteCustomersFromLocalStorage();
});

document.getElementById('restore-customers-btn').addEventListener('click', function() {
    restoreCustomersFromLocalStorage();
});

document.getElementById('print-customers-btn').addEventListener('click', function() {
    window.print();
});

function updateClock() {
    const clockElement = document.getElementById('clock');
    function update() {
        const now = new Date();
        const hours = now.getHours() % 12 || 12; // 12-hour format
        const minutes = now.getMinutes();
        const seconds = now.getSeconds();
        clockElement.textContent = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    update();
    setInterval(update, 1000);
}

function updateDate() {
    const dateElement = document.getElementById('date');
    function update() {
        const now = new Date();
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const gregorianDate = now.toLocaleDateString('ar-EG', options);

        // Hijri Date Calculation (simplified)
        const hijriDate = new Intl.DateTimeFormat('ar-SA-u-ca-islamic', options).format(now);

        dateElement.textContent = `التاريخ الميلادي: ${gregorianDate}\nالتاريخ الهجري: ${hijriDate}`;
    }
    update();
    setInterval(update, 1000 * 60 * 60 * 24); // Update once a day
}

function addCustomerToTable(id, name, phone, address, type) {
    const tableBody = document.querySelector('#customer-table tbody');
    const newRow = tableBody.insertRow();
    newRow.insertCell(0).textContent = id;
    newRow.insertCell(1).textContent = name;
    newRow.insertCell(2).textContent = phone;
    newRow.insertCell(3).textContent = address;
    newRow.insertCell(4).textContent = type;
}

function saveCustomersToLocalStorage() {
    const tableBody = document.querySelector('#customer-table tbody');
    const customers = [];
    for (let i = 0; i < tableBody.rows.length; i++) {
        const row = tableBody.rows[i];
        const customer = {
            id: row.cells[0].textContent,
            name: row.cells[1].textContent,
            phone: row.cells[2].textContent,
            address: row.cells[3].textContent,
            type: row.cells[4].textContent
        };
        customers.push(customer);
    }
    localStorage.setItem('customers', JSON.stringify(customers));
    alert('تم حفظ البيانات بنجاح');
}

function deleteCustomersFromLocalStorage() {
    localStorage.removeItem('customers');
    const tableBody = document.querySelector('#customer-table tbody');
    tableBody.innerHTML = '';
    alert('تم حذف البيانات بنجاح');
}

function restoreCustomersFromLocalStorage() {
    const customers = JSON.parse(localStorage.getItem('customers'));
    if (customers) {
        const tableBody = document.querySelector('#customer-table tbody');
        tableBody.innerHTML = '';
        customers.forEach(customer => {
            addCustomerToTable(customer.id, customer.name, customer.phone, customer.address, customer.type);
        });
        alert('تم استعادة البيانات بنجاح');
    } else {
        alert('لا توجد بيانات محفوظة');
    }
}

// Restore customers on page load
window.addEventListener('load', restoreCustomersFromLocalStorage);
