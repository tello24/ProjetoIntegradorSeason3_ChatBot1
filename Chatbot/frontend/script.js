// script.js

document.addEventListener('DOMContentLoaded', () => {
  // ELEMENTOS PRINCIPAIS
  const mainInterface      = document.getElementById('main-interface');
  const loginScreen        = document.getElementById('kitchen-login-screen');
  const chatMessages       = document.getElementById('chat-messages');
  const userInput          = document.getElementById('user-input');
  const sendButton         = document.getElementById('send-button');
  const quickBtns          = document.querySelectorAll('.quick-btn');
  const viewReservationBtn = document.getElementById('view-reservation-btn');
  const orderButton        = document.getElementById('order-button');
  const viewOrderBtn       = document.getElementById('view-order-btn');
  const kitchenLoginBtn    = document.getElementById('kitchen-login-btn');
  const loginBackBtn       = document.getElementById('login-back-btn');

  // DADOS
  const restaurantInfo = {
    hours: [
      'Funcionamos de terça a domingo:',
      '– Almoço: 11:30 às 15:00',
      '– Jantar: 19:00 às 23:00'
    ].join('<br>'),
    address: 'Rua dos Sabores, 123 – Centro',
    phone: '(11) 1234-5678'
  };
  const menu = {
    'Pratos Principais': [
      { name: 'Filé de Frango Grelhado',      price: 'R$ 28,99' },
      { name: 'Linguiça Toscana Grelhada',    price: 'R$ 28,99' },
      { name: 'Linguiça Calabresa Acebolada', price: 'R$ 28,99' },
      { name: 'Nuggets de Frango',            price: 'R$ 28,99' },
      { name: '------------------',           price: '------------------' }
    ],
    'Saladas': [
      { name: 'Salada com Filé de Frango',                  price: 'R$ 26,99' },
      { name: 'Salada com Omelete',                         price: 'R$ 26,99' },
      { name: 'Salada com Atum',                            price: 'R$ 26,99' },
      { name: 'Salada Caesar',                              price: 'R$ 27,99' },
      { name: 'Salada com Kibe Vegano ou Quiche',           price: 'R$ 31,99' }
    ]
  };
  // retorna o menu salvo no localStorage ou, se não existir, usa o menu padrão
  function getActiveMenu() {
    const stored = localStorage.getItem('poliedroMenu');
    try {
      return stored ? JSON.parse(stored) : menu;
    } catch {
      return menu;
    }
  }

  // BOAS-VINDAS
  setTimeout(() => {
    addBotMessage('🍽️ Bem-vindo ao Restaurante Poliedro!');
    addBotMessage('Como posso ajudar? Use os botões rápidos ou digite sua dúvida.');
  }, 500);

  // LISTENERS ESTÁTICOS
  sendButton.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', e => e.key === 'Enter' && sendMessage());
  quickBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      userInput.value = btn.dataset.msg;
      sendMessage();
    });
  });
  viewReservationBtn.addEventListener('click', showReservation);
  orderButton.addEventListener('click', startOrderProcess);
  viewOrderBtn.addEventListener('click', showOrder);
  kitchenLoginBtn.addEventListener('click', () => {
    mainInterface.style.display = 'none';
    loginScreen.style.display   = 'flex';
  });
  loginBackBtn.addEventListener('click', () => {
    loginScreen.style.display   = 'none';
    mainInterface.style.display = 'block';
  });

  // EVENT DELEGATION (BOTÕES DINÂMICOS)
  document.body.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;
    switch (btn.id) {
      // RESERVA
      case 'confirm-res-btn':
        confirmReservation(btn);
        break;
      case 'modify-res-btn':
      case 'edit-res-btn':
        startReservationProcess();
        break;
      case 'cancel-res-btn':
        cancelReservation();
        break;

      // PEDIDO
      case 'confirm-order-btn':
        confirmOrder(btn);
        break;
      case 'modify-order-btn':
      case 'edit-order-btn':
        startOrderProcess();
        break;
      case 'cancel-order-btn':
        cancelOrder();
        break;

      // LOGIN COZINHA
      case 'login-submit-btn':
        handleKitchenLogin();
        break;
    }
  });

  // ─── FUNÇÕES DE CHAT ────────────────────────────────────────────────────────
  function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;
    addUserMessage(text);
    userInput.value = '';
    setTimeout(() => processUserMessage(text), 400);
  }

  function processUserMessage(msg) {
    const m = msg.toLowerCase();
    if (m.includes('cardápio') || m.includes('menu')) showMenu();
    else if (m.includes('horário') || m.includes('funcionamento')) showHours();
    else if (m.includes('reserv') || m.includes('mesa')) startReservationProcess();
    else if (m.includes('minha reserva') || m.includes('ver reserva')) showReservation();
    else if (m.includes('pedido')) startOrderProcess();
    else if (m.includes('ver pedido')) showOrder();
    else addBotMessage('Desculpe, não entendi. Pode reformular?');
  }

  function showMenu() {
    const activeMenu = getActiveMenu();
    let html = '<h3>🍽️ Nosso Cardápio</h3>';
    for (const [cat, items] of Object.entries(activeMenu)) {
      html += `<h4>${cat}</h4><ul style="margin-bottom:16px;">`;
      items.forEach(i => {
        html += `<li style="margin-bottom:6px"><strong>${i.name}</strong> – ${i.price}</li>`;
      });
      html += '</ul>';
    }
    html += '<p>Quer fazer um pedido ou reserva?</p>';
    addBotMessage(html);
  }

  function showHours() {
    addBotMessage(`🕒 Horário:<br>${restaurantInfo.hours}`);
    addBotMessage(`📍 ${restaurantInfo.address}<br>📞 ${restaurantInfo.phone}`);
  }

  // ─── FLUXO DE RESERVA ────────────────────────────────────────────────────────
  function startReservationProcess() {
    const today = new Date().toISOString().split('T')[0];
    const formHTML = `
      <div class="reservation-form">
        <h3>📅 Fazer Reserva</h3>
        <input type="text"    id="res-name"    placeholder="Seu Nome*" />
        <input type="date"    id="res-date"    min="${today}" />
        <select id="res-time">
          <option value="">Horário*</option>
          <optgroup label="Almoço">${generateTimeOptions(11,30,14,30,30)}</optgroup>
          <optgroup label="Jantar">${generateTimeOptions(19,0,22,30,30)}</optgroup>
        </select>
        <select id="res-people">
          <option value="">Nº de Pessoas*</option>
          ${[1,2,3,4,5,6].map(n=>`<option value="${n}">${n}</option>`).join('')}
          <option value="7+">7+</option>
        </select>
        <input type="tel"     id="res-phone"   placeholder="Telefone*" />
        <textarea id="res-notes" placeholder="Observações"></textarea>
        <button id="confirm-res-btn">Confirmar Reserva</button>
      </div>`;
    addBotMessage(formHTML, true);
  }

  function confirmReservation(btn) {
    const f     = btn.closest('.reservation-form');
    const name  = f.querySelector('#res-name').value.trim();
    const date  = f.querySelector('#res-date').value;
    const time  = f.querySelector('#res-time').value;
    const ppl   = f.querySelector('#res-people').value;
    const phone = f.querySelector('#res-phone').value.trim();
    const notes = f.querySelector('#res-notes').value.trim();
    if (!name || !date || !time || !ppl || !phone) {
      addBotMessage('⚠️ Preencha todos os campos obrigatórios!');
      return;
    }
    const reservation = { name, date, time, ppl, phone, notes, status: 'confirmada' };
    localStorage.setItem('poliedroReservation', JSON.stringify(reservation));
    const fmt = new Date(date).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
    addBotMessage(`
      <div class="reservation-confirmation">
        <h3>✅ Reserva Confirmada!</h3>
        <p><strong>Nome:</strong> ${name}</p>
        <p><strong>Data:</strong> ${fmt} às ${time}</p>
        <p><strong>Pessoas:</strong> ${ppl}</p>
        ${notes ? `<p><strong>Obs.:</strong> ${notes}</p>` : ''}
        <button id="modify-res-btn">Alterar Reserva</button>
      </div>`, true);
  }

  function showReservation() {
    const res = JSON.parse(localStorage.getItem('poliedroReservation'));
    if (!res) {
      addBotMessage('Você não tem reservas ativas. Deseja fazer uma?');
      return;
    }
    const fmt = new Date(res.date).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'});
    addBotMessage(`
      <div class="reservation-details">
        <h3>📋 Sua Reserva</h3>
        <p><strong>Status:</strong> ${res.status}</p>
        <p><strong>Nome:</strong> ${res.name}</p>
        <p><strong>Data:</strong> ${fmt} às ${res.time}</p>
        <p><strong>Pessoas:</strong> ${res.ppl}</p>
        ${res.notes ? `<p><strong>Obs.:</strong> ${res.notes}</p>` : ''}
        <div class="reservation-actions">
          <button id="cancel-res-btn">Cancelar Reserva</button>
          <button id="edit-res-btn">Alterar Reserva</button>
        </div>
      </div>`, true);
  }

  function cancelReservation() {
    if (confirm('Deseja cancelar a reserva?')) {
      localStorage.removeItem('poliedroReservation');
      addBotMessage('❌ Reserva cancelada.');
    }
  }

  // ─── FLUXO DE PEDIDO ─────────────────────────────────────────────────────────
  function startOrderProcess() {
    addBotMessage(`
      <div class="order-form">
        <h3>🛒 Fazer Pedido</h3>
        <input type="text"   id="order-cust-name" placeholder="Nome do Cliente*" />
        <input type="text"   id="order-cust-ra"   placeholder="RA do Cliente*" />
        <input type="text"   id="order-item"      placeholder="Nome do Item*" />
        <input type="number" id="order-qty"       placeholder="Quantidade*" min="1" />
        <textarea id="order-notes" placeholder="Observações"></textarea>
        <button id="confirm-order-btn">Confirmar Pedido</button>
      </div>`, true);
  }

  function confirmOrder(btn) {
    const f        = btn.closest('.order-form');
    const custName = f.querySelector('#order-cust-name').value.trim();
    const custRA   = f.querySelector('#order-cust-ra').value.trim();
    const item     = f.querySelector('#order-item').value.trim();
    const qty      = f.querySelector('#order-qty').value;
    const notes    = f.querySelector('#order-notes').value.trim();

    if (!custName || !custRA) {
      addBotMessage('⚠️ Informe o Nome e o RA do cliente!'); 
      return;
    }
    if (!item || !qty) {
      addBotMessage('⚠️ Informe o item e a quantidade!'); 
      return;
    }

    // salva histórico de pedidos
    const orders = JSON.parse(localStorage.getItem('poliedroOrders') || '[]');
    const now    = new Date().toISOString();
    const order  = { custName, custRA, item, qty, notes, status:'enviado', date: now };
    orders.push(order);
    localStorage.setItem('poliedroOrders', JSON.stringify(orders));
    // salva último pedido para cliente
    localStorage.setItem('poliedroOrder', JSON.stringify(order));

    addBotMessage(`
      <div class="order-confirmation">
        <h3>✅ Pedido Recebido!</h3>
        <p><strong>Cliente:</strong> ${custName} (RA ${custRA})</p>
        <p><strong>Item:</strong> ${item}</p>
        <p><strong>Quantidade:</strong> ${qty}</p>
        ${notes ? `<p><strong>Obs.:</strong> ${notes}</p>` : ''}
        <button id="modify-order-btn">Alterar Pedido</button>
      </div>`, true);
  }

  function showOrder() {
    const o = JSON.parse(localStorage.getItem('poliedroOrder'));
    if (!o) {
      addBotMessage('Você não tem pedidos ativos. Deseja fazer um?');
      return;
    }
    addBotMessage(`
      <div class="order-details">
        <h3>📦 Seu Pedido</h3>
        <p><strong>Status:</strong> ${o.status}</p>
        <p><strong>Cliente:</strong> ${o.custName} (RA ${o.custRA})</p>
        <p><strong>Item:</strong> ${o.item}</p>
        <p><strong>Quantidade:</strong> ${o.qty}</p>
        ${o.notes ? `<p><strong>Obs.:</strong> ${o.notes}</p>` : ''}
        <div class="order-actions">
          <button id="cancel-order-btn">Cancelar Pedido</button>
          <button id="edit-order-btn">Alterar Pedido</button>
        </div>
      </div>`, true);
  }

  function cancelOrder() {
    if (confirm('Deseja cancelar o pedido?')) {
      localStorage.removeItem('poliedroOrder');
      addBotMessage('❌ Pedido cancelado.');
    }
  }

  // ─── LOGIN COZINHA ───────────────────────────────────────────────────────────
  function handleKitchenLogin() {
    const user = document.getElementById('kitchen-user').value;
    const pass = document.getElementById('kitchen-pass').value;
    if (user === 'Cozinha@sistemapoliedro.com.br' && pass === 'teste123') {
      window.location.href = 'kitchen.html';
    } else {
      alert('Credenciais inválidas!');
    }
  }

  // ─── UTILITÁRIOS ─────────────────────────────────────────────────────────────
  function generateTimeOptions(sh, sm, eh, em, step) {
    const opts = [];
    for (let h = sh; h <= eh; h++) {
      for (let m = 0; m < 60; m += step) {
        if ((h === sh && m < sm) || (h === eh && m > em)) continue;
        const t = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}`;
        opts.push(`<option value="${t}">${t}</option>`);
      }
    }
    return opts.join('');
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'message user-message';
    div.innerHTML = `<div class="message-content">${text}</div>`;
    chatMessages.appendChild(div);
    scrollToBottom();
  }

  function addBotMessage(html, isHTML = false) {
    const div = document.createElement('div');
    div.className = 'message bot-message';
    div.innerHTML = isHTML ? html : `<div class="message-content">${html}</div>`;
    chatMessages.appendChild(div);
    scrollToBottom();
  }

  function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
