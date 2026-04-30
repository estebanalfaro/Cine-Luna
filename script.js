const ROWS = ['A', 'B', 'C', 'D', 'E'];
const COLS = 8;
const UNAVAILABLE = ['A5', 'B3', 'B4', 'C4', 'C5', 'D7', 'E1', 'E2'];
const PREMIUM_ROW = 'C';
const DISABLED_SEATS = ['A1', 'A2'];

const PRICES = { standard: 4500, premium: 6500 };
const DISCOUNTS = { normal: 0, estudiante: 0.20, mayor: 0.25 };
const IMAX_SURCHARGE = 0.40;
const IVA_RATE = 0.13;
const MAX_TICKETS = 6;
const TIMER_START = 300;

let selectedSeats = [];
let clientTypes = {}; 
let timerInterval = null;
let timeLeft = TIMER_START;
let hasShownImaxWarning = false;

const seatsContainer = document.getElementById('seats-container');
const cartItems = document.getElementById('cart-items');
const timerEl = document.getElementById('timer');
const checkoutBtn = document.getElementById('checkout-btn');

function initCinema() {
    seatsContainer.innerHTML = '';
    ROWS.forEach(row => {
        for (let col = 1; col <= COLS; col++) {
            const id = `${row}${col}`;
            const seat = document.createElement('div');
            seat.className = 'seat';
            seat.textContent = id;
            seat.dataset.id = id;

            if (UNAVAILABLE.includes(id)) {
                seat.classList.add('occupied');
            } else {
                if (DISABLED_SEATS.includes(id)) seat.classList.add('disabled');
                else if (row === PREMIUM_ROW) seat.classList.add('premium');
                else seat.classList.add('standard');
                
                seat.dataset.base = (row === PREMIUM_ROW) ? PRICES.premium : PRICES.standard;
                seat.addEventListener('click', () => toggleSeat(seat));
            }
            seatsContainer.appendChild(seat);
        }
    });
}

function toggleSeat(seatEl) {
    const id = seatEl.dataset.id;

    if (selectedSeats.includes(id)) {
        selectedSeats = selectedSeats.filter(s => s !== id);
        delete clientTypes[id];
        seatEl.classList.remove('selected');
    } else {
        if (selectedSeats.length >= MAX_TICKETS) return alert("Máximo 6 tiquetes.");
        
        if (!hasShownImaxWarning) {
            alert("AVISO: Esta es una función IMAX. Se aplicará un recargo automático del 40% a cada asiento.");
            hasShownImaxWarning = true;
        }

        selectedSeats.push(id);
        clientTypes[id] = 'normal';
        seatEl.classList.add('selected');
        if (selectedSeats.length === 1 && !timerInterval) startTimer();
    }
    updateUI();
}

function startTimer() {
    timeLeft = TIMER_START;
    timerInterval = setInterval(() => {
        timeLeft--;
        const m = String(Math.floor(timeLeft / 60)).padStart(2, '0');
        const s = String(timeLeft % 60).padStart(2, '0');
        timerEl.textContent = `${m}:${s}`;
        if (timeLeft <= 0) resetSelection("Tiempo expirado. Asientos liberados.");
    }, 1000);
}

function resetSelection(msg) {
    if(msg) alert(msg);
    clearInterval(timerInterval);
    timerInterval = null;
    selectedSeats.forEach(id => document.querySelector(`[data-id="${id}"]`).classList.remove('selected'));
    selectedSeats = [];
    clientTypes = {};
    hasShownImaxWarning = false;
    timerEl.textContent = "05:00";
    updateUI();
}

function calculate(id) {
    const seatEl = document.querySelector(`[data-id="${id}"]`);
    const base = parseFloat(seatEl.dataset.base);
    const imax = base * IMAX_SURCHARGE;
    const sub = base + imax;
    const desc = sub * DISCOUNTS[clientTypes[id]];
    const net = sub - desc;
    const iva = net * IVA_RATE;
    return { base, imax, desc, net, iva, total: net + iva, type: seatEl.classList.contains('premium') ? 'Premium' : 'Estándar' };
}

function updateUI() {
    document.getElementById('ticket-count').textContent = selectedSeats.length;
    checkoutBtn.disabled = selectedSeats.length === 0;
    cartItems.innerHTML = selectedSeats.length ? '' : '<p>No hay selección.</p>';

    let st = 0, ds = 0, iv = 0, gt = 0;

    selectedSeats.forEach(id => {
        const d = calculate(id);
        st += (d.base + d.imax); ds += d.desc; iv += d.iva; gt += d.total;

        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `<span>${id}</span>
            <select onchange="clientTypes['${id}']=this.value; updateUI()">
                <option value="normal" ${clientTypes[id]=='normal'?'selected':''}>Normal</option>
                <option value="estudiante" ${clientTypes[id]=='estudiante'?'selected':''}>Estudiante</option>
                <option value="mayor" ${clientTypes[id]=='mayor'?'selected':''}>Adulto Mayor</option>
            </select>`;
        cartItems.appendChild(div);
    });

    const fmt = (n) => `₡${n.toLocaleString('es-CR')}`;
    document.getElementById('subtotal').textContent = fmt(st);
    document.getElementById('total-discounts').textContent = `-${fmt(ds)}`;
    document.getElementById('total-iva').textContent = fmt(iv);
    document.getElementById('grand-total').textContent = fmt(gt);
}

checkoutBtn.onclick = () => {
    const body = document.getElementById('invoice-body');
    body.innerHTML = '';
    let totalFactura = 0;

    selectedSeats.forEach(id => {
        const d = calculate(id);
        totalFactura += d.total;
        body.innerHTML += `<tr>
            <td>${id}</td><td>${d.type}</td><td>${clientTypes[id]}</td>
            <td>₡${d.base}</td><td>₡${d.imax}</td><td>-₡${d.desc.toFixed(0)}</td>
            <td>₡${d.iva.toFixed(0)}</td><td>₡${d.total.toFixed(0)}</td>
        </tr>`;
    });

    document.getElementById('invoice-grand-total').textContent = `₡${totalFactura.toLocaleString('es-CR')}`;
    document.getElementById('invoice-date').textContent = `Emisión: ${new Date().toLocaleString()}`;
    document.getElementById('invoice-modal').classList.remove('hidden');
};

document.getElementById('close-modal-btn').onclick = () => {
    selectedSeats.forEach(id => {
        const s = document.querySelector(`[data-id="${id}"]`);
        s.className = 'seat occupied';
        UNAVAILABLE.push(id);
    });
    document.getElementById('invoice-modal').classList.add('hidden');
    resetSelection();
};

initCinema();