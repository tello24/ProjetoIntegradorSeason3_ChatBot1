// kitchen.js

document.addEventListener('DOMContentLoaded', () => {
  const tableBody    = document.querySelector('#orders-table tbody');
  const ordersTable  = document.getElementById('orders-table');
  const noOrdersMsg  = document.getElementById('no-orders-msg');
  const logoutBtn    = document.getElementById('kitchen-logout-btn');

  // Renderiza toda a tabela de pedidos
  function renderKitchenOrders() {
    const orders = JSON.parse(localStorage.getItem('poliedroOrders') || '[]');
    tableBody.innerHTML = '';

    if (orders.length === 0) {
      ordersTable.style.display = 'none';
      noOrdersMsg.style.display = 'block';
    } else {
      ordersTable.style.display = 'table';
      noOrdersMsg.style.display = 'none';

      orders.forEach((o, i) => {
        const row    = document.createElement('tr');
        const date   = new Date(o.date).toLocaleString('pt-BR');
        row.innerHTML = `
          <td>${date}</td>
          <td>${o.item}</td>
          <td>${o.qty}</td>
          <td>${o.notes || '-'}</td>
          <td>${o.status}</td>
          <td>
            <button class="action-btn progress" data-index="${i}" data-action="progress">Em andamento</button>
            <button class="action-btn complete" data-index="${i}" data-action="complete">Concluir</button>
            <button class="action-btn delete"   data-index="${i}" data-action="delete">Excluir</button>
          </td>
        `;
        tableBody.appendChild(row);
      });
    }
  }

  // Logout volta para index
  logoutBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // Captura cliques nos botões de ação (event delegation)
  tableBody.addEventListener('click', e => {
    const btn = e.target.closest('button.action-btn');
    if (!btn) return;

    const idx    = Number(btn.dataset.index);
    const action = btn.dataset.action;
    const orders = JSON.parse(localStorage.getItem('poliedroOrders') || '[]');

    if (action === 'delete') {
      orders.splice(idx, 1);
    } else if (action === 'progress') {
      orders[idx].status = 'em andamento';
    } else if (action === 'complete') {
      orders[idx].status = 'concluído';
    }

    localStorage.setItem('poliedroOrders', JSON.stringify(orders));
    renderKitchenOrders();
  });

  // Render inicial
  renderKitchenOrders();
});
