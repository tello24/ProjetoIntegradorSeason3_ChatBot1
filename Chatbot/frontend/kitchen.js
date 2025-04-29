// kitchen.js

document.addEventListener('DOMContentLoaded', () => {
  // ─── Elementos ─────────────────────────────────────────────────────────────
  const tableBody   = document.querySelector('#orders-table tbody');
  const ordersTable = document.getElementById('orders-table');
  const noOrdersMsg = document.getElementById('no-orders-msg');
  const logoutBtn   = document.getElementById('kitchen-logout-btn');
  const editMenuBtn = document.getElementById('edit-menu-btn');
  const menuEditor  = document.getElementById('menu-editor');
  const editor      = document.getElementById('editor-categories');
  const addCatBtn   = document.getElementById('add-category-btn');
  const saveMenuBtn = document.getElementById('save-menu-btn');

  // ─── Cardápio padrão ─────────────────────────────────────────────────────────
  const defaultMenu = {
    "Entradas": [],
    "Pratos Principais": [],
    "Saladas": [],
    "Sobremesas": []
  };

  // ─── Carrega cardápio do localStorage ────────────────────────────────────────
  function loadMenu() {
    try {
      const json = localStorage.getItem('poliedroMenu');
      return json ? JSON.parse(json) : JSON.parse(JSON.stringify(defaultMenu));
    } catch {
      return JSON.parse(JSON.stringify(defaultMenu));
    }
  }

  // ─── Renderiza pedidos na tabela, incluindo Cliente e RA ─────────────────────
  function renderKitchenOrders() {
    const orders = JSON.parse(localStorage.getItem('poliedroOrders') || '[]');
    tableBody.innerHTML = '';

    if (!orders.length) {
      ordersTable.style.display = 'none';
      noOrdersMsg.style.display = 'block';
    } else {
      ordersTable.style.display = 'table';
      noOrdersMsg.style.display = 'none';

      orders.forEach((o, i) => {
        const row = document.createElement('tr');
        const dt  = new Date(o.date).toLocaleString('pt-BR');
        row.innerHTML = `
          <td>${dt}</td>
          <td>${o.item}</td>
          <td>${o.qty}</td>
          <td>${o.notes || '-'}</td>
          <td>${o.status}</td>
          <td>${o.custName || '-'}</td>
          <td>${o.custRA   || '-'}</td>
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

  // ─── Funções de edição do cardápio (inalteradas) ────────────────────────────
  function renderMenuEditor() {
    editor.innerHTML = '';
    const menu = loadMenu();
    Object.entries(menu).forEach(([cat, items]) => addCategoryBlock(cat, items));
  }
  function addCategoryBlock(catName = '', items = []) {
    const block = document.createElement('div');
    block.className = 'category-block';

    // Título
    const titleInput = document.createElement('input');
    titleInput.placeholder = 'Nome da categoria';
    titleInput.value = catName;
    titleInput.style.fontWeight = '600';
    titleInput.style.marginBottom = '8px';
    block.appendChild(titleInput);

    // Itens
    const list = document.createElement('div');
    items.forEach(it => addItemRow(list, it.name, it.price));
    block.appendChild(list);

    // Botão + Item
    const btnAddItem = document.createElement('button');
    btnAddItem.textContent = '+ Item';
    btnAddItem.addEventListener('click', () => addItemRow(list));
    block.appendChild(btnAddItem);

    // Botão Excluir Categoria
    const btnRemoveCat = document.createElement('button');
    btnRemoveCat.textContent = 'Excluir Categoria';
    btnRemoveCat.style.marginLeft = '8px';
    btnRemoveCat.addEventListener('click', () => block.remove());
    block.appendChild(btnRemoveCat);

    editor.appendChild(block);
  }
  function addItemRow(container, name = '', price = '') {
    const row = document.createElement('div');
    row.className = 'item-row';

    const nameIn = document.createElement('input');
    nameIn.placeholder = 'Nome do prato';
    nameIn.value = name;

    const priceIn = document.createElement('input');
    priceIn.placeholder = 'Preço';
    priceIn.value = price;

    const btnRem = document.createElement('button');
    btnRem.className = 'remove-item';
    btnRem.textContent = '✕';
    btnRem.addEventListener('click', () => row.remove());

    row.append(nameIn, priceIn, btnRem);
    container.appendChild(row);
  }

  editMenuBtn.addEventListener('click', () => {
    if (menuEditor.style.display === 'block') {
      menuEditor.style.display = 'none';
    } else {
      renderMenuEditor();
      menuEditor.style.display = 'block';
    }
  });
  addCatBtn .addEventListener('click', () => addCategoryBlock('', []));
  saveMenuBtn.addEventListener('click', () => {
    const newMenu = {};
    Array.from(editor.children).forEach(block => {
      const catName = block.querySelector('input').value.trim();
      if (!catName) return;
      const items = [];
      block.querySelectorAll('.item-row').forEach(r => {
        const [nIn, pIn] = r.querySelectorAll('input');
        const n = nIn.value.trim(),
              p = pIn.value.trim();
        if (n && p) items.push({ name: n, price: p });
      });
      newMenu[catName] = items;
    });
    localStorage.setItem('poliedroMenu', JSON.stringify(newMenu, null, 2));
    alert('Cardápio atualizado com sucesso!');
    menuEditor.style.display = 'none';
  });

  // ─── Logout ─────────────────────────────────────────────────────────────────
  logoutBtn.addEventListener('click', () => {
    window.location.href = 'index.html';
  });

  // ─── Delegação de ações nos pedidos ─────────────────────────────────────────
  tableBody.addEventListener('click', e => {
    const btn = e.target.closest('button.action-btn');
    if (!btn) return;
    const idx    = Number(btn.dataset.index);
    const action = btn.dataset.action;
    const orders = JSON.parse(localStorage.getItem('poliedroOrders') || '[]');

    if (action === 'delete')        orders.splice(idx, 1);
    else if (action === 'progress') orders[idx].status = 'em andamento';
    else if (action === 'complete') orders[idx].status = 'concluído';

    localStorage.setItem('poliedroOrders', JSON.stringify(orders));
    renderKitchenOrders();
  });

  // ─── Inicialização ─────────────────────────────────────────────────────────
  menuEditor.style.display = 'none';
  renderKitchenOrders();
});
