document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const quickButtons = document.querySelectorAll('.quick-btn');
    const viewReservationBtn = document.getElementById('view-reservation-btn');

    // Dados do restaurante
    const restaurantInfo = {
        hours: "Funcionamos de terça a domingo:\n- Almoço: 11:30 às 15:00\n- Jantar: 19:00 às 23:00",
        address: "Rua dos Sabores, 123 - Centro",
        phone: "(11) 1234-5678",
        email: "reservas@poliedro.com"
    };

    // Cardápio completo
    const menu = {
        'Entradas': [
            { name: 'Bruschetta', price: 'R$ 18,90' },
            { name: 'Carpaccio', price: 'R$ 32,90' }
        ],
        'Pratos Principais': [
            { name: 'Filé Mignon', price: 'R$ 89,90' },
            { name: 'Risoto de Funghi', price: 'R$ 65,90' }
        ],
        'Sobremesas': [
            { name: 'Tiramisù', price: 'R$ 24,90' },
            { name: 'Panna Cotta', price: 'R$ 22,90' }
        ]
    };

    // Mensagem de boas-vindas
    setTimeout(() => {
        addBotMessage('🍽️ Bem-vindo ao Restaurante Poliedro!');
        addBotMessage('Como posso ajudar? Veja nossas opções rápidas abaixo ou digite sua dúvida.');
    }, 500);

    // Event Listeners
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => e.key === 'Enter' && sendMessage());

    quickButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            userInput.value = btn.dataset.msg;
            sendMessage();
        });
    });

    viewReservationBtn.addEventListener('click', showReservation);

    // Funções principais
    function sendMessage() {
        const message = userInput.value.trim();
        if (message) {
            addUserMessage(message);
            userInput.value = '';
            setTimeout(() => processUserMessage(message), 800);
        }
    }

    function processUserMessage(message) {
        const lowerMsg = message.toLowerCase();
        
        if (lowerMsg.includes('cardápio') || lowerMsg.includes('menu')) {
            showMenu();
        } 
        else if (lowerMsg.includes('horário') || lowerMsg.includes('funcionamento')) {
            showHours();
        } 
        else if (lowerMsg.includes('reserv') || lowerMsg.includes('mesa')) {
            startReservationProcess();
        }
        else if (lowerMsg.includes('minha reserva') || lowerMsg.includes('ver reserva')) {
            showReservation();
        }
        else {
            addBotMessage('Desculpe, não entendi. Pode reformular?');
        }
    }

    // Sistema de Reservas Aprimorado
    function startReservationProcess() {
        const today = new Date().toISOString().split('T')[0];
        
        const reservationForm = `
            <div class="reservation-form">
                <h3>📅 Fazer Reserva</h3>
                <input type="text" id="res-name" placeholder="Seu Nome*" required>
                <input type="date" id="res-date" min="${today}" required>
                <select id="res-time" required>
                    <option value="">Selecione o horário</option>
                    <optgroup label="Almoço">
                        ${generateTimeOptions(11, 30, 14, 30, 30)}
                    </optgroup>
                    <optgroup label="Jantar">
                        ${generateTimeOptions(19, 0, 22, 30, 30)}
                    </optgroup>
                </select>
                <select id="res-people" required>
                    <option value="">Nº de Pessoas*</option>
                    ${[1, 2, 3, 4, 5, 6].map(n => `<option value="${n}">${n} ${n > 1 ? 'pessoas' : 'pessoa'}</option>`).join('')}
                    <option value="7+">7+ pessoas (grupos)</option>
                </select>
                <input type="tel" id="res-phone" placeholder="Telefone*" required>
                <textarea id="res-notes" placeholder="Observações (alergias, etc.)"></textarea>
                <button id="confirm-res-btn" class="reservation-btn">Confirmar Reserva</button>
            </div>
        `;
        
        addBotMessage(reservationForm, true);
        
        document.getElementById('confirm-res-btn').addEventListener('click', confirmReservation);
    }

    function generateTimeOptions(startHour, startMin, endHour, endMin, interval) {
        let options = [];
        for (let h = startHour; h <= endHour; h++) {
            for (let m = 0; m < 60; m += interval) {
                if (h === startHour && m < startMin) continue;
                if (h === endHour && m > endMin) break;
                const time = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
                options.push(`<option value="${time}">${time}</option>`);
            }
        }
        return options.join('');
    }

    function confirmReservation() {
        const reservation = {
            name: document.getElementById('res-name').value,
            date: document.getElementById('res-date').value,
            time: document.getElementById('res-time').value,
            people: document.getElementById('res-people').value,
            phone: document.getElementById('res-phone').value,
            notes: document.getElementById('res-notes').value,
            status: 'confirmada',
            createdAt: new Date().toISOString()
        };

        // Validação
        if (!reservation.name || !reservation.date || !reservation.time || !reservation.people || !reservation.phone) {
            addBotMessage('⚠️ Por favor, preencha todos os campos obrigatórios!', true);
            return;
        }

        // Salva no localStorage
        localStorage.setItem('poliedroReservation', JSON.stringify(reservation));
        
        // Confirmação
        const formattedDate = new Date(reservation.date).toLocaleDateString('pt-BR', {
            weekday: 'long', day: 'numeric', month: 'long'
        });
        
        const confirmationMsg = `
            <div class="reservation-confirmation">
                <h3>✅ Reserva Confirmada!</h3>
                <p><strong>Nome:</strong> ${reservation.name}</p>
                <p><strong>Data:</strong> ${formattedDate} às ${reservation.time}</p>
                <p><strong>Pessoas:</strong> ${reservation.people}</p>
                ${reservation.notes ? `<p><strong>Observações:</strong> ${reservation.notes}</p>` : ''}
                <p>Enviamos os detalhes para ${reservation.phone}</p>
                <button id="modify-res-btn" class="reservation-btn">Alterar Reserva</button>
            </div>
        `;
        
        addBotMessage(confirmationMsg, true);
        document.getElementById('modify-res-btn').addEventListener('click', startReservationProcess);
    }

    function showReservation() {
        const reservation = JSON.parse(localStorage.getItem('poliedroReservation'));
        
        if (!reservation) {
            addBotMessage('Você não possui reservas ativas. Gostaria de fazer uma?');
            return;
        }
        
        const formattedDate = new Date(reservation.date).toLocaleDateString('pt-BR', {
            weekday: 'long', day: 'numeric', month: 'long'
        });
        
        const reservationDetails = `
            <div class="reservation-details">
                <h3>📋 Sua Reserva</h3>
                <p><strong>Status:</strong> ${reservation.status}</p>
                <p><strong>Nome:</strong> ${reservation.name}</p>
                <p><strong>Data:</strong> ${formattedDate} às ${reservation.time}</p>
                <p><strong>Pessoas:</strong> ${reservation.people}</p>
                ${reservation.notes ? `<p><strong>Observações:</strong> ${reservation.notes}</p>` : ''}
                <div class="reservation-actions">
                    <button id="cancel-res-btn" class="reservation-btn cancel">Cancelar Reserva</button>
                    <button id="edit-res-btn" class="reservation-btn">Alterar</button>
                </div>
            </div>
        `;
        
        addBotMessage(reservationDetails, true);
        
        document.getElementById('cancel-res-btn').addEventListener('click', cancelReservation);
        document.getElementById('edit-res-btn').addEventListener('click', startReservationProcess);
    }

    function cancelReservation() {
        if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
            localStorage.removeItem('poliedroReservation');
            addBotMessage('❌ Reserva cancelada com sucesso. Esperamos vê-lo em outra ocasião!');
        }
    }

    // Funções auxiliares
    function addUserMessage(text) {
        const div = document.createElement('div');
        div.className = 'message user-message';
        div.innerHTML = `<div class="message-content">${text}</div>`;
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function addBotMessage(text, isHTML = false) {
        const div = document.createElement('div');
        div.className = 'message bot-message';
        
        if (isHTML) {
            div.innerHTML = `<div class="message-content">${text}</div>`;
        } else {
            div.innerHTML = `<div class="message-content">${text}</div>`;
        }
        
        chatMessages.appendChild(div);
        scrollToBottom();
    }

    function showMenu() {
        let menuHTML = '<h3>🍽️ Nosso Cardápio</h3>';
        
        for (const [category, items] of Object.entries(menu)) {
            menuHTML += `<h4>${category}</h4><ul>`;
            items.forEach(item => {
                menuHTML += `<li><strong>${item.name}</strong> - ${item.price}</li>`;
            });
            menuHTML += '</ul>';
        }
        
        menuHTML += '<p>Gostaria de fazer uma reserva para experimentar?</p>';
        addBotMessage(menuHTML, true);
    }

    function showHours() {
        addBotMessage(`🕒 Horário de Funcionamento:\n${restaurantInfo.hours}`);
        addBotMessage(`📍 Endereço: ${restaurantInfo.address}\n📞 Telefone: ${restaurantInfo.phone}`);
    }

    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});