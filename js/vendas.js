(function() {
    const STORAGE_KEY_VENDAS = 'listaVendas';
    const STORAGE_KEY_ITENS = 'itensVendaAtual';
    let vendaEditandoIndex = null;
    let itemEditandoIndex = null;
    const botaoAdicionarItem = document.querySelector('#formVenda button[type="submit"]');

    function getProdutos() {
        return JSON.parse(localStorage.getItem('listaProdutos')) || [];
    }

    function getClientes() {
        return JSON.parse(localStorage.getItem('listaClientes')) || [];
    }

    function getVendas() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_VENDAS)) || [];
    }

    function saveVendas(vendas) {
        localStorage.setItem(STORAGE_KEY_VENDAS, JSON.stringify(vendas));
    }

    function getItensVenda() {
        return JSON.parse(localStorage.getItem(STORAGE_KEY_ITENS)) || [];
    }

    function saveItensVenda(itens) {
        localStorage.setItem(STORAGE_KEY_ITENS, JSON.stringify(itens));
    }

    function formatarMoeda(valor) {
        return Number(valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function montarSelectProdutos() {
        const selectProduto = document.getElementById('produtoVenda');
        if (!selectProduto) return;

        const produtos = getProdutos();
        selectProduto.innerHTML = '<option value="">Selecione um produto</option>';

        produtos.forEach((produto) => {
            const option = document.createElement('option');
            option.value = produto.nome;
            option.textContent = `${produto.nome} - ${formatarMoeda(produto.precoVenda)}`;
            option.dataset.preco = Number(produto.precoVenda) || 0;
            selectProduto.appendChild(option);
        });
    }

    function popularClientesVenda() {
        const inputCliente = document.getElementById('clienteVenda');
        const datalist = document.getElementById('listaClientesVendas');
        if (!inputCliente || !datalist) return;

        const clientes = getClientes();
        datalist.innerHTML = '';

        clientes.forEach((cliente) => {
            const option = document.createElement('option');
            option.value = cliente.nome || '';
            datalist.appendChild(option);
        });

        if (!clientes.length) {
            inputCliente.placeholder = 'Cadastre um cliente primeiro';
        }
    }

    function atualizarPrecoProduto() {
        const selectProduto = document.getElementById('produtoVenda');
        const precoInput = document.getElementById('precoVendaAtual');
        if (!selectProduto || !precoInput) return;

        const option = selectProduto.selectedOptions[0];
        const valor = option ? Number(option.dataset.preco || 0) : 0;

        if (!precoInput.dataset.manual) {
            precoInput.value = valor;
        }
    }

    function calcularSubtotal() {
        const itens = getItensVenda();
        return itens.reduce((soma, item) => soma + Number(item.total || 0), 0);
    }

    function renderItensVenda() {
        const container = document.getElementById('itensVenda');
        const subtotalEl = document.getElementById('subtotalVenda');
        const totalEl = document.getElementById('totalVenda');
        if (!container || !subtotalEl || !totalEl) return;

        const itens = getItensVenda();
        container.innerHTML = '';

        if (itens.length === 0) {
            container.innerHTML = '<p class="vazio">Nenhum item adicionado.</p>';
            subtotalEl.textContent = formatarMoeda(0);
            totalEl.textContent = formatarMoeda(0);
            return;
        }

        itens.forEach((item, index) => {
            const linha = document.createElement('div');
            linha.className = 'item-venda';
            linha.innerHTML = `
                <div>
                    <strong>${item.nome}</strong>
                    <span>${item.quantidade} x ${formatarMoeda(item.precoUnitario)}</span>
                </div>
                <div class="item-acoes">
                    <span>${formatarMoeda(item.total)}</span>
                    <button type="button" data-index="${index}" class="btn-editar-item">Editar</button>
                    <button type="button" data-index="${index}" class="btn-remover-item">X</button>
                </div>
            `;
            container.appendChild(linha);
        });

        const subtotal = calcularSubtotal();
        subtotalEl.textContent = formatarMoeda(subtotal);
        totalEl.textContent = formatarMoeda(subtotal);
    }

    function atualizarResumo() {
        const vendas = getVendas();
        const totalVendas = vendas.reduce((soma, venda) => soma + Number(venda.total || 0), 0);
        const totalItens = vendas.reduce((soma, venda) => soma + Number(venda.quantidadeItens || 0), 0);
        const ticket = vendas.length ? totalVendas / vendas.length : 0;
        const clientes = new Set(vendas.map((venda) => venda.cliente)).size;

        const vendasDiaEl = document.getElementById('vendasDia');
        const produtosVendidosEl = document.getElementById('produtosVendidos');
        const ticketMedioEl = document.getElementById('ticketMedio');
        const clientesAtendidosEl = document.getElementById('clientesAtendidos');

        if (vendasDiaEl) vendasDiaEl.textContent = formatarMoeda(totalVendas);
        if (produtosVendidosEl) produtosVendidosEl.textContent = totalItens;
        if (ticketMedioEl) ticketMedioEl.textContent = formatarMoeda(ticket);
        if (clientesAtendidosEl) clientesAtendidosEl.textContent = clientes;
    }

    function renderHistorico() {
        const tbody = document.getElementById('historicoVendas');
        if (!tbody) return;

        const vendas = getVendas();
        tbody.innerHTML = '';

        if (vendas.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6">Nenhuma venda registrada.</td></tr>';
            return;
        }

        vendas.forEach((venda, index) => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${venda.cliente}</td>
                <td>${venda.itens.length}</td>
                <td>${venda.pagamento}</td>
                <td>${venda.data}</td>
                <td>${formatarMoeda(venda.total)}</td>
                <td>
                    <button type="button" class="btn-editar-venda" data-index="${index}">Editar</button>
                    <button type="button" class="btn-excluir-venda" data-index="${index}">Excluir</button>
                </td>
            `;
            tbody.appendChild(linha);
        });
    }

    function limparVendaAtual() {
        saveItensVenda([]);
        itemEditandoIndex = null;
        const formVenda = document.getElementById('formVenda');
        if (formVenda) {
            const cliente = document.getElementById('clienteVenda')?.value || '';
            const pagamento = document.getElementById('formaPagamento')?.value || 'Dinheiro';
            formVenda.reset();
            const clienteInput = document.getElementById('clienteVenda');
            const pagamentoInput = document.getElementById('formaPagamento');
            if (clienteInput) clienteInput.value = cliente;
            if (pagamentoInput) pagamentoInput.value = pagamento;
        }
        const quantidade = document.getElementById('quantidadeVenda');
        if (quantidade) quantidade.value = 1;
        if (botaoAdicionarItem) botaoAdicionarItem.textContent = 'Adicionar item';
        renderItensVenda();
    }

    const formVenda = document.getElementById('formVenda');
    if (formVenda) {
        formVenda.addEventListener('submit', function(event) {
            event.preventDefault();

            const produtoSelect = document.getElementById('produtoVenda');
            const quantidadeInput = document.getElementById('quantidadeVenda');
            const descontoInput = document.getElementById('descontoVenda');
            const clienteInput = document.getElementById('clienteVenda');

            if (!produtoSelect.value || !clienteInput.value.trim()) {
                alert('Informe o cliente e o produto antes de adicionar.');
                return;
            }

            const produtoSelecionado = produtoSelect.selectedOptions[0];
            const precoInput = document.getElementById('precoVendaAtual');
            const preco = Number(precoInput?.value || produtoSelecionado.dataset.preco || 0);
            const quantidade = Number(quantidadeInput.value || 1);
            const desconto = Number(descontoInput.value || 0);
            const subtotalItem = (preco * quantidade) - desconto;
            const clienteAtual = clienteInput.value.trim();
            const pagamentoAtual = document.getElementById('formaPagamento')?.value || 'Dinheiro';

            const itens = getItensVenda();

            if (itemEditandoIndex !== null && itens[itemEditandoIndex]) {
                itens[itemEditandoIndex] = {
                    nome: produtoSelecionado.value,
                    quantidade,
                    precoUnitario: preco,
                    desconto,
                    total: subtotalItem > 0 ? subtotalItem : 0
                };
            } else {
                itens.push({
                    nome: produtoSelecionado.value,
                    quantidade,
                    precoUnitario: preco,
                    desconto,
                    total: subtotalItem > 0 ? subtotalItem : 0
                });
            }

            saveItensVenda(itens);
            renderItensVenda();
            formVenda.reset();
            itemEditandoIndex = null;
            if (botaoAdicionarItem) botaoAdicionarItem.textContent = 'Adicionar item';

            if (clienteInput) clienteInput.value = clienteAtual;
            const formaPagamento = document.getElementById('formaPagamento');
            if (formaPagamento) formaPagamento.value = pagamentoAtual;

            const quantidadePadrao = document.getElementById('quantidadeVenda');
            if (quantidadePadrao) quantidadePadrao.value = 1;
            const descontoPadrao = document.getElementById('descontoVenda');
            if (descontoPadrao) descontoPadrao.value = 0;
            const precoPadrao = document.getElementById('precoVendaAtual');
            if (precoPadrao) {
                precoPadrao.value = 0;
                delete precoPadrao.dataset.manual;
            }
        });
    }

    const botaoFinalizar = document.getElementById('finalizarVenda');
    if (botaoFinalizar) {
        botaoFinalizar.addEventListener('click', function() {
            const itens = getItensVenda();
            const cliente = document.getElementById('clienteVenda')?.value.trim();
            const pagamento = document.getElementById('formaPagamento')?.value || 'Dinheiro';

            if (!cliente || itens.length === 0) {
                alert('Adicione itens e informe o cliente antes de finalizar a venda.');
                return;
            }

            const total = calcularSubtotal();
            const vendas = getVendas();

            if (vendaEditandoIndex !== null && vendas[vendaEditandoIndex]) {
                vendas[vendaEditandoIndex] = {
                    ...vendas[vendaEditandoIndex],
                    cliente,
                    pagamento,
                    itens,
                    total,
                    quantidadeItens: itens.reduce((soma, item) => soma + Number(item.quantidade || 0), 0),
                    data: vendas[vendaEditandoIndex].data || new Date().toLocaleDateString('pt-BR')
                };
            } else {
                vendas.push({
                    cliente,
                    pagamento,
                    itens,
                    total,
                    quantidadeItens: itens.reduce((soma, item) => soma + Number(item.quantidade || 0), 0),
                    data: new Date().toLocaleDateString('pt-BR')
                });
            }

            saveVendas(vendas);
            limparVendaAtual();
            document.getElementById('clienteVenda').value = '';
            vendaEditandoIndex = null;
            botaoFinalizar.textContent = 'Finalizar venda';
            if (botaoAdicionarItem) botaoAdicionarItem.textContent = 'Adicionar item';
            renderHistorico();
            atualizarResumo();
        });
    }

    document.addEventListener('click', function(event) {
        const editarItem = event.target.closest('.btn-editar-item');
        if (editarItem) {
            const index = Number(editarItem.dataset.index);
            const itens = getItensVenda();
            const item = itens[index];
            if (!item) return;

            itemEditandoIndex = index;
            if (botaoAdicionarItem) botaoAdicionarItem.textContent = 'Salvar item';
            const selectProduto = document.getElementById('produtoVenda');
            if (selectProduto) {
                const option = Array.from(selectProduto.options).find((op) => op.value === item.nome);
                if (option) {
                    selectProduto.value = option.value;
                    atualizarPrecoProduto();
                }
            }
            const quantidadeInput = document.getElementById('quantidadeVenda');
            if (quantidadeInput) quantidadeInput.value = item.quantidade || 1;
            const precoInput = document.getElementById('precoVendaAtual');
            if (precoInput) {
                precoInput.value = item.precoUnitario || 0;
                precoInput.dataset.manual = 'true';
            }
            const descontoInput = document.getElementById('descontoVenda');
            if (descontoInput) descontoInput.value = item.desconto || 0;
            return;
        }

        const removerItem = event.target.closest('.btn-remover-item');
        if (removerItem) {
            const index = Number(removerItem.dataset.index);
            const itens = getItensVenda();
            itens.splice(index, 1);
            saveItensVenda(itens);
            renderItensVenda();
            return;
        }

        const editarVenda = event.target.closest('.btn-editar-venda');
        if (editarVenda) {
            const index = Number(editarVenda.dataset.index);
            const vendas = getVendas();
            const venda = vendas[index];
            if (!venda) return;

            vendaEditandoIndex = index;
            document.getElementById('clienteVenda').value = venda.cliente || '';
            document.getElementById('formaPagamento').value = venda.pagamento || 'Dinheiro';
            saveItensVenda(Array.isArray(venda.itens) ? venda.itens : []);
            renderItensVenda();
            if (botaoFinalizar) botaoFinalizar.textContent = 'Salvar alterações';
            return;
        }

        const excluirVenda = event.target.closest('.btn-excluir-venda');
        if (excluirVenda) {
            const index = Number(excluirVenda.dataset.index);
            const vendas = getVendas();
            vendas.splice(index, 1);
            saveVendas(vendas);
            if (vendaEditandoIndex === index) {
                vendaEditandoIndex = null;
                if (botaoFinalizar) botaoFinalizar.textContent = 'Finalizar venda';
            }
            if (botaoAdicionarItem) botaoAdicionarItem.textContent = 'Adicionar item';
            renderHistorico();
            atualizarResumo();
        }
    });

    const selectProduto = document.getElementById('produtoVenda');
    if (selectProduto) {
        selectProduto.addEventListener('change', atualizarPrecoProduto);
    }

    montarSelectProdutos();
    popularClientesVenda();
    atualizarPrecoProduto();
    renderItensVenda();
    renderHistorico();
    atualizarResumo();
})();
