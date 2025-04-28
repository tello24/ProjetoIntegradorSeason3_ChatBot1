document.addEventListener('DOMContentLoaded', () => {
    // Elementos estáticos
    const chatMessages       = document.getElementById('chat-messages');
    const userInput          = document.getElementById('user-input');
    const sendButton         = document.getElementById('send-button');
    const quickButtons       = document.querySelectorAll('.quick-btn');
    const viewReservationBtn = document.getElementById('view-reservation-btn');
  
    // Dados do restaurante
    const restaurantInfo = {
      hours: [
        'Funcionamos de terça a domingo:',
        '– Almoço: 11:30 às 15:00',
        '– Jantar: 19:00 às 23:00'
      ].join('<br>'),
      address: 'Rua dos Sabores, 123 – Centro',
      phone: '(11) 1234-5678'
    };
  
    // Cardápio
    const menu = {
      Entradas: [
        { name: 'Bruschetta', price: 'R$ 18,90' },
        { name: 'Carpaccio',  price: 'R$ 32,90' }
      ],
      'Pratos Principais': [
        { name: 'Filé Mignon',     price: 'R$ 89,90' },
        { name: 'Risoto de Funghi', price: 'R$ 65,90' }
      ],
      Sobremesas: [
        { name: 'Tiramisù',     price: 'R$ 24,90' },
        { name: 'Panna Cotta',  price: 'R$ 22,90' }
      ]
    };
  
    // Mensagem de boas-vindas
    setTimeout(() => {
      addBotMessage('🍽️ Bem-vindo ao Restaurante Poliedro!');
      addBotMessage('Como posso ajudar? Utilize os botões rápidos!');
    }, 500);
  
    // Listeners estáticos
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') sendMessage();
    });
    quickButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        userInput.value = btn.dataset.msg;
        sendMessage();
      });
    });
    viewReservationBtn.addEventListener('click', showReservation);
  
    // Event delegation para botões dinâmicos
    chatMessages.addEventListener('click', e => {
      const btn = e.target.closest('button');
      if (!btn) return;
  
      switch (btn.id) {
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
      }
    });
  
    // Envia mensagem do usuário
    function sendMessage() {
      const text = userInput.value.trim();
      if (!text) return;
      addUserMessage(text);
      userInput.value = '';
      setTimeout(() => processUserMessage(text), 800);
    }
  
    // Decide ação a partir da mensagem
    function processUserMessage(msg) {
      const m = msg.toLowerCase();
      if (m.includes('cardápio') || m.includes('menu')) {
        showMenu();
      } else if (m.includes('horário') || m.includes('funcionamento')) {
        showHours();
      } else if (m.includes('reserv') || m.includes('mesa')) {
        startReservationProcess();
      } else if (m.includes('minha reserva') || m.includes('ver reserva')) {
        showReservation();
      } else {
        addBotMessage('Desculpe, não entendi. Pode reformular?');
      }
    }
  
    // Exibe cardápio
    function showMenu() {
      let html = '<h3>🍽️ Nosso Cardápio</h3>';
      for (const [cat, items] of Object.entries(menu)) {
        html += `<h4>${cat}</h4><ul>`;
        items.forEach(i => {
          html += `<li><strong>${i.name}</strong> – ${i.price}</li>`;
        });
        html += '</ul>';
      }
      html += '<p>Gostaria de fazer uma reserva?</p>';
      addBotMessage(html);
    }
  
    // Exibe horários e endereço
    function showHours() {
      addBotMessage(`🕒 Horário de Funcionamento:<br>${restaurantInfo.hours}`);
      addBotMessage(`📍 Endereço: ${restaurantInfo.address}<br>📞 ${restaurantInfo.phone}`);
    }
  
    // Inicia fluxo de reserva
    function startReservationProcess() {
      const today = new Date().toISOString().split('T')[0];
      const formHTML = `
        <div class="reservation-form">
          <h3>📅 Fazer Reserva</h3>
          <input type="text" id="res-name" placeholder="Seu Nome*" />
          <input type="date" id="res-date" min="${today}" />
          <select id="res-time">
            <option value="">Selecione o horário</option>
            <optgroup label="Almoço">
              ${generateTimeOptions(11, 30, 14, 30, 30)}
            </optgroup>
            <optgroup label="Jantar">
              ${generateTimeOptions(19, 0, 22, 30, 30)}
            </optgroup>
          </select>
          <select id="res-people">
            <option value="">Nº de Pessoas*</option>
            ${[1,2,3,4,5,6].map(n => `<option value="${n}">${n} ${n>1?'pessoas':'pessoa'}</option>`).join('')}
            <option value="7+">7+ pessoas</option>
          </select>
          <input type="tel" id="res-phone" placeholder="Telefone*" />
          <textarea id="res-notes" placeholder="Observações (alergias, etc.)"></textarea>
          <button id="confirm-res-btn">Confirmar Reserva</button>
        </div>
      `;
      addBotMessage(formHTML);
    }
  
    // Gera opções de horário
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
  
    // Confirma a reserva
    function confirmReservation(button) {
      // Busca o container do formulário
      const form = button.closest('.reservation-form');
      const name   = form.querySelector('#res-name').value.trim();
      const date   = form.querySelector('#res-date').value;
      const time   = form.querySelector('#res-time').value;
      const people = form.querySelector('#res-people').value;
      const phone  = form.querySelector('#res-phone').value.trim();
      const notes  = form.querySelector('#res-notes').value.trim();
  
      // Debug no console
      console.log({ name, date, time, people, phone, notes });
  
      // Validação
      if (!name || !date || !time || !people || !phone) {
        addBotMessage('⚠️ Por favor, preencha todos os campos obrigatórios!');
        return;
      }
  
      // Salva e exibe confirmação
      const reservation = { name, date, time, people, phone, notes, status: 'confirmada' };
      localStorage.setItem('poliedroReservation', JSON.stringify(reservation));
  
      const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
        weekday:'long', day:'numeric', month:'long'
      });
      const html = `
        <div class="reservation-confirmation">
          <h3>✅ Reserva Confirmada!</h3>
          <p><strong>Nome:</strong> ${name}</p>
          <p><strong>Data:</strong> ${formattedDate} às ${time}</p>
          <p><strong>Pessoas:</strong> ${people}</p>
          ${notes ? `<p><strong>Obs.:</strong> ${notes}</p>` : ''}
          <p>Entraremos em contato: ${phone}</p>
          <button id="modify-res-btn">Alterar Reserva</button>
        </div>
      `;
      addBotMessage(html);
    }
  
    // Exibe reserva existente
    function showReservation() {
      const data = JSON.parse(localStorage.getItem('poliedroReservation'));
      if (!data) {
        addBotMessage('Você não tem reservas ativas. Quer fazer uma?');
        return;
      }
      const formattedDate = new Date(data.date).toLocaleDateString('pt-BR', {
        weekday:'long', day:'numeric', month:'long'
      });
      const html = `
        <div class="reservation-details">
          <h3>📋 Sua Reserva</h3>
          <p><strong>Status:</strong> ${data.status}</p>
          <p><strong>Nome:</strong> ${data.name}</p>
          <p><strong>Data:</strong> ${formattedDate} às ${data.time}</p>
          <p><strong>Pessoas:</strong> ${data.people}</p>
          ${data.notes ? `<p><strong>Obs.:</strong> ${data.notes}</p>` : ''}
          <div class="reservation-actions">
            <button id="cancel-res-btn">Cancelar Reserva</button>
            <button id="edit-res-btn">Alterar</button>
          </div>
        </div>
      `;
      addBotMessage(html);
    }
  
    // Cancela a reserva
    function cancelReservation() {
      if (confirm('Deseja mesmo cancelar?')) {
        localStorage.removeItem('poliedroReservation');
        addBotMessage('❌ Reserva cancelada. Até breve!');
      }
    }
  
    // Helpers de UI
    function addUserMessage(text) {
      const div = document.createElement('div');
      div.className = 'message user-message';
      div.innerHTML = `<div class="message-content">${text}</div>`;
      chatMessages.appendChild(div);
      scrollToBottom();
    }
  
    function addBotMessage(html) {
      const div = document.createElement('div');
      div.className = 'message bot-message';
      div.innerHTML = `<div class="message-content">${html}</div>`;
      chatMessages.appendChild(div);
      scrollToBottom();
    }
  
    function scrollToBottom() {
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  });
  