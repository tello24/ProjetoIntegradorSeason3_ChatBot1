document.addEventListener('DOMContentLoaded', function() {
  const chatMessages = document.getElementById('chat-messages');
  const userInput = document.getElementById('user-input');
  const sendButton = document.getElementById('send-button');
  const quickButtons = document.querySelectorAll('.quick-btn');
  
  // Mensagem inicial
  setTimeout(() => {
      addBotMessage('Olá! Bem-vindo ao Restaurante ahn Oruam...ahn . Como posso ajudar?');
      addBotMessage('Você pode perguntar sobre nosso cardápio, horário de funcionamento ou fazer uma reserva.');
  }, 500);
  
  // Event listeners
  sendButton.addEventListener('click', sendMessage);
  userInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());
  quickButtons.forEach(btn => btn.addEventListener('click', (e) => {
      userInput.value = e.target.dataset.msg;
      sendMessage();
  }));
  
  function sendMessage() {
      const message = userInput.value.trim();
      if (message) {
          addUserMessage(message);
          userInput.value = '';
          respondToMessage(message);
      }
  }
  
  function addUserMessage(message) {
      const div = document.createElement('div');
      div.className = 'message user-message';
      div.textContent = message;
      chatMessages.appendChild(div);
      scrollToBottom();
  }
  
  function addBotMessage(message, isHTML = false) {
      const div = document.createElement('div');
      div.className = 'message bot-message';
      if (isHTML) {
          div.innerHTML = message;
      } else {
          div.textContent = message;
      }
      chatMessages.appendChild(div);
      scrollToBottom();
  }
  
  function scrollToBottom() {
      chatMessages.scrollTop = chatMessages.scrollHeight;
  }
  
  // Banco de dados simples do restaurante
  const menu = {
      'Pratos Principais': [
          { name: 'Filé Mignon', price: 'R$ 59,90' },
          { name: 'Risoto de Cogumelos', price: 'R$ 45,90' },
          { name: 'Frango Grelhado', price: 'R$ 39,90' }
      ],
      'Acompanhamentos': [
          { name: 'Batata Frita', price: 'R$ 12,90' },
          { name: 'Arroz Branco', price: 'R$ 8,90' },
          { name: 'Salada Verde', price: 'R$ 10,90' }
      ],
      'Bebidas': [
          { name: 'Refrigerante Lata', price: 'R$ 6,90' },
          { name: 'Suco Natural', price: 'R$ 9,90' },
          { name: 'Água Mineral', price: 'R$ 4,90' }
      ],
      'Sobremesas': [
          { name: 'Pudim', price: 'R$ 14,90' },
          { name: 'Mousse de Chocolate', price: 'R$ 16,90' },
          { name: 'Sorvete', price: 'R$ 12,90' }
      ]
  };
  
  const restaurantInfo = {
      hours: "Funcionamos de terça a domingo:\n- Almoço: 11:30 às 15:00\n- Jantar: 19:00 às 23:00",
      address: "Rua dos bills!, 123 - Centro",
      phone: "(11) 1234-5678"
  };
  
  function respondToMessage(message) {
      const lowerMsg = message.toLowerCase();
      
      setTimeout(() => {
          if (lowerMsg.includes('cardápio') || lowerMsg.includes('menu') || lowerMsg.includes('comida')) {
              showMenu();
          } 
          else if (lowerMsg.includes('horário') || lowerMsg.includes('funcionamento') || lowerMsg.includes('aberto')) {
              showHours();
          }
          else if (lowerMsg.includes('reserva') || lowerMsg.includes('mesa') || lowerMsg.includes('reservar')) {
              startReservation();
          }
          else if (lowerMsg.includes('endereço') || lowerMsg.includes('local')) {
              addBotMessage(`Nosso endereço: ${restaurantInfo.address}`);
          }
          else if (lowerMsg.includes('telefone') || lowerMsg.includes('contato')) {
              addBotMessage(`Telefone para contato: ${restaurantInfo.phone}`);
          }
          else if (lowerMsg.includes('ola') || lowerMsg.includes('olá') || lowerMsg.includes('oi')) {
              addBotMessage('Olá! Bem-vindo ao Restaurante ahn quem?. Em que posso ajudar?');
          }
          else {
              addBotMessage('Desculpe, não entendi. Você pode perguntar sobre nosso cardápio, horário de funcionamento ou fazer uma reserva.');
          }
      }, 800);
  }
  
  function showMenu() {
      let menuHTML = '<h3>Nosso Cardápio</h3>';
      
      for (const category in menu) {
          menuHTML += `<h4>${category}</h4>`;
          menu[category].forEach(item => {
              menuHTML += `
                  <div class="menu-item">
                      <strong>${item.name}</strong> - ${item.price}
                  </div>
              `;
          });
      }
      
      menuHTML += '<p>Gostaria de fazer um pedido ou reserva?</p>';
      addBotMessage(menuHTML, true);
  }
  
  function showHours() {
      addBotMessage(restaurantInfo.hours);
      addBotMessage(`Endereço: ${restaurantInfo.address}`);
  }
  
  function startReservation() {
      const reservationHTML = `
          <h3>Reserva de Mesa</h3>
          <div class="reservation-form">
              <input type="text" id="res-name" placeholder="Seu nome">
              <input type="date" id="res-date">
              <select id="res-time">
                  <option value="19:00">19:00</option>
                  <option value="19:30">19:30</option>
                  <option value="20:00">20:00</option>
                  <option value="20:30">20:30</option>
                  <option value="21:00">21:00</option>
              </select>
              <input type="number" id="res-people" placeholder="Número de pessoas" min="1">
              <button id="confirm-res">Confirmar Reserva</button>
          </div>
      `;
      
      addBotMessage(reservationHTML, true);
      
      document.getElementById('confirm-res')?.addEventListener('click', confirmReservation);
  }
  
  function confirmReservation() {
      const name = document.getElementById('res-name').value;
      const date = document.getElementById('res-date').value;
      const time = document.getElementById('res-time').value;
      const people = document.getElementById('res-people').value;
      
      if (!name || !date || !people) {
          addBotMessage('Por favor, preencha todos os campos para confirmar a reserva.');
          return;
      }
      
      const formattedDate = new Date(date).toLocaleDateString('pt-BR');
      addBotMessage(`✅ Reserva confirmada para ${name}!\n📅 ${formattedDate} às ${time}\n👥 ${people} pessoa(s)`);
      addBotMessage('Obrigado por escolher nosso restaurante!');
  }
});