(function () {
    const getDados = (chave) => JSON.parse(localStorage.getItem(chave)) || [];
    const moeda = (valor) => Number(valor || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    const escapeHtml = (valor) => String(valor ?? '-').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[c]);

    function dataDoRegistro(valor) {
        if (!valor) return null;
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(valor)) {
            const [dia, mes, ano] = valor.split('/').map(Number);
            return new Date(ano, mes - 1, dia);
        }
        const data = new Date(valor);
        return Number.isNaN(data.getTime()) ? null : data;
    }

    function filtrarVendas(vendas, periodo) {
        if (periodo === 'todos') return vendas;
        const hoje = new Date();
        hoje.setHours(0, 0, 0, 0);
        const inicio = new Date(hoje);
        inicio.setDate(hoje.getDate() - (periodo === 'hoje' ? 0 : Number(periodo) - 1));
        return vendas.filter((venda) => {
            const data = dataDoRegistro(venda.data);
            return data && data >= inicio && data <= new Date();
        });
    }

    function preencherTabela(id, linhas, renderizar, colunas, mensagem) {
        const corpo = document.getElementById(id);
        if (!corpo) return;
        corpo.innerHTML = linhas.length ? linhas.map(renderizar).join('') : `<tr><td colspan="${colunas}">${mensagem}</td></tr>`;
    }

    function atualizarRelatorio() {
        const produtos = getDados('listaProdutos');
        const vendas = getDados('listaVendas');
        const movimentacoes = getDados('listaMovimentacoes');
        const periodo = document.getElementById('periodoRelatorio').value;
        const vendasFiltradas = filtrarVendas(vendas, periodo);
        const faturamento = vendasFiltradas.reduce((total, venda) => total + Number(venda.total || 0), 0);
        const itens = vendasFiltradas.reduce((total, venda) => total + Number(venda.quantidadeItens || 0), 0);

        document.getElementById('relatorioFaturamento').textContent = moeda(faturamento);
        document.getElementById('relatorioVendas').textContent = vendasFiltradas.length;
        document.getElementById('relatorioItensVendidos').textContent = itens;
        document.getElementById('periodoDescricao').textContent = periodo === 'todos' ? 'Considerando todos os registros cadastrados.' : `Dados consolidados para ${periodo === 'hoje' ? 'hoje' : `os últimos ${periodo} dias`}.`;

        const ranking = {};
        vendasFiltradas.forEach((venda) => (venda.itens || []).forEach((item) => {
            const nome = item.nome || 'Produto não identificado';
            ranking[nome] ||= { nome, quantidade: 0, faturamento: 0 };
            ranking[nome].quantidade += Number(item.quantidade || 0);
            ranking[nome].faturamento += Number(item.total || 0);
        }));
        const maisVendidos = Object.values(ranking).sort((a, b) => b.quantidade - a.quantidade).slice(0, 5);
        preencherTabela('produtosMaisVendidos', maisVendidos, (item) => `<tr><td>${escapeHtml(item.nome)}</td><td>${item.quantidade}</td><td>${moeda(item.faturamento)}</td></tr>`, 3, 'Nenhuma venda no período.');

        const criticos = produtos.filter((produto) => Number(produto.quantidade || 0) <= Number(produto.estoqueMinimo || 0));
        document.getElementById('totalEstoqueCritico').textContent = `${criticos.length} ${criticos.length === 1 ? 'produto' : 'produtos'}`;
        preencherTabela('estoqueCritico', criticos, (produto) => {
            const zerado = Number(produto.quantidade || 0) === 0;
            return `<tr><td>${escapeHtml(produto.nome)}</td><td>${produto.quantidade || 0}</td><td><span class="${zerado ? 'status-zerado' : 'status-baixo'}">${zerado ? 'Sem estoque' : 'Estoque baixo'}</span></td></tr>`;
        }, 3, 'Nenhum produto em nível crítico.');

        const limite = new Date();
        limite.setDate(limite.getDate() - 30);
        const movimentados = new Set(movimentacoes.filter((movimento) => {
            const data = dataDoRegistro(movimento.data);
            return data && data >= limite;
        }).map((movimento) => movimento.produtoCodigo || movimento.produto));
        const parados = produtos.filter((produto) => !movimentados.has(produto.codigo) && !movimentados.has(produto.nome));
        preencherTabela('produtosParados', parados, (produto) => `<tr><td>${escapeHtml(produto.nome)}</td><td>${escapeHtml(produto.codigo)}</td><td>${produto.quantidade || 0}</td><td>${moeda(Number(produto.quantidade || 0) * Number(produto.precoVenda || 0))}</td></tr>`, 4, 'Todos os produtos tiveram movimentação recente.');
    }

    function exportarVendas() {
        const vendas = filtrarVendas(getDados('listaVendas'), document.getElementById('periodoRelatorio').value);
        const linhas = [['Data', 'Cliente', 'Pagamento', 'Itens', 'Total']];
        vendas.forEach((venda) => linhas.push([venda.data || '', venda.cliente || '', venda.pagamento || '', (venda.itens || []).map((item) => `${item.nome} (${item.quantidade})`).join(' | '), Number(venda.total || 0).toFixed(2)]));
        const csv = '\uFEFF' + linhas.map((linha) => linha.map((valor) => `"${String(valor).replace(/"/g, '""')}"`).join(';')).join('\n');
        const link = document.createElement('a');
        link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
        link.download = 'relatorio-vendas.csv';
        link.click();
        URL.revokeObjectURL(link.href);
    }

    document.getElementById('periodoRelatorio').addEventListener('change', atualizarRelatorio);
    document.getElementById('exportarRelatorio').addEventListener('click', exportarVendas);
    atualizarRelatorio();
})();
