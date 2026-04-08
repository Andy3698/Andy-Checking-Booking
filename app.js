const tables = JSON.parse(localStorage.getItem('tables')) || {};

function saveToLocalStorage() {
    localStorage.setItem('tables', JSON.stringify(tables));
}

function renderTables() {
    document.querySelectorAll('.table').forEach(td => {
        const id = td.dataset.id; // lấy đúng id bàn
        if(tables[id] && tables[id].status === 'Booked'){
            td.classList.add('booked');  // chỉ bàn đó → đỏ
        } else {
            td.classList.remove('booked'); // chỉ bàn đó → màu hạng ban đầu
        }
    });
}

renderTables();

// object lưu thông tin bàn
let bookings = {}; // { "P1": {name, phone, email, guests: 4}, ... }


// mở form khi click bàn
document.querySelectorAll('.table').forEach(table => {
  table.addEventListener('click', () => {
    const id = table.dataset.id;
    document.getElementById('form-table-id').textContent = id;
    const info = bookings[id] || {};
    document.getElementById('name').value = info.name || '';
    document.getElementById('phone').value = info.phone || '';
    document.getElementById('email').value = info.email || '';
    document.getElementById('guests').value = info.guests || 1;
    document.getElementById('booking-form').classList.remove('hidden');
  });
});
//live display
function updateTotalGuests() {
  let total = 0;
  Object.values(bookings).forEach(b => { 
    total += b.guests || 0; 
  });
  document.getElementById('total-guests-display').textContent = `Tổng số khách: ${total}`;
}

// Lưu booking
document.getElementById('save').addEventListener('click', () => {
  const id = document.getElementById('form-table-id').textContent;
  bookings[id] = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    email: document.getElementById('email').value,
    guests: parseInt(document.getElementById('guests').value) || 1
  };
  document.querySelector(`.table[data-id="${id}"]`).classList.add('booked');
  document.getElementById('booking-form').classList.add('hidden');

  updateTotalGuests(); // cập nhật live sau khi lưu
});

// Hủy booking
document.getElementById('delete').addEventListener('click', () => {
  const id = document.getElementById('form-table-id').textContent;
  delete bookings[id];
  document.querySelector(`.table[data-id="${id}"]`).classList.remove('booked');
  document.getElementById('booking-form').classList.add('hidden');

  updateTotalGuests(); // cập nhật live sau khi xóa
});
//xoa
// Delete booking
document.getElementById('delete').addEventListener('click', () => {
  const id = document.getElementById('form-table-id').textContent;
  delete bookings[id];

  // Chỉ thay đổi màu của bàn hiện tại
  const table = document.querySelector(`.table[data-id="${id}"]`);
  if (table) {
    table.classList.remove('booked');
    // Xóa số khách trên bàn
    const span = table.querySelector('.guest-number');
    if (span) table.removeChild(span);
  }

  localStorage.setItem('bookings', JSON.stringify(bookings));
  document.getElementById('booking-form').classList.add('hidden');

  updateTotalGuests();
});
//huy
document.getElementById('cancel').addEventListener('click', () => {
    document.getElementById('booking-form').classList.add('hidden');
});
//tinh tong
document.getElementById('total-guests-btn').addEventListener('click', () => {
  let total = 0;
  Object.values(bookings).forEach(b => { total += b.guests || 0; });
  document.getElementById('total-guests-display').textContent = `Tổng số khách: ${total}`;
});

//custom

interact('.table').draggable({
  modifiers: [
    interact.modifiers.restrictRect({
      restriction: 'parent'
    })
  ],
  listeners: {
    move(event) {
      const target = event.target;

      let x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
      let y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

      target.style.transform = `translate(${x}px, ${y}px)`;

      target.setAttribute('data-x', x);
      target.setAttribute('data-y', y);
    },

    end() {
      savePositions();
    }
  }
});
// Lưu
function savePositions() {
  const positions = {};

  document.querySelectorAll('.table').forEach(table => {
    const id = table.dataset.id;

    positions[id] = {
      x: table.getAttribute('data-x'),
      y: table.getAttribute('data-y')
    };
  });

  localStorage.setItem('tablePositions', JSON.stringify(positions));
}

// Load
function loadPositions() {
  const positions = JSON.parse(localStorage.getItem('tablePositions')) || {};

  document.querySelectorAll('.table').forEach(table => {
    const id = table.dataset.id;

    if (positions[id]) {
      const x = positions[id].x;
      const y = positions[id].y;

      table.style.transform = `translate(${x}px, ${y}px)`;
      table.setAttribute('data-x', x);
      table.setAttribute('data-y', y);
    }
  });
}

// gọi
loadPositions();
window.addEventListener('beforeunload', savePositions);