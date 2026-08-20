(function () {
    function getProdutos() {
        return JSON.parse(localStorage.getItem('listaProdutos')) || [];
    }

    function formatarMoeda(valor) {
        return Number(valor || 0).toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        });
    }

    function formatarUnidade(unidade) {
        const unidades = {
            unidade: 'un',
            kg: 'kg',
            litro: 'L',
            caixa: 'caixas',
            pacote: 'pacotes'
        };
        return unidades[unidade] || unidade || 'un';
    }

    function formatarEstoque(produto) {
        const quantidade = Number(produto.quantidade) || 0;
        return `${quantidade} ${formatarUnidade(produto.unidade)}`;
    }

    function atualizarDashboard() {
        const produtos = getProdutos();

        const totalProdutos = document.getElementById('totalProdutos');
        const valorEstoque = document.getElementById('valorEstoque');
        const estoqueBaixo = document.getElementById('estoqueBaixo');
        const estoqueZerado = document.getElementById('estoqueZerado');
        const quantidadeEstoque = document.getElementById('quantidadeEstoque');
        const tabelaAlerta = document.getElementById('produtosAlerta');

        if (totalProdutos) totalProdutos.textContent = produtos.length;
        if (valorEstoque) valorEstoque.textContent = formatarMoeda(produtos.reduce((soma, produto) => soma + (Number(produto.quantidade) || 0) * (Number(produto.precoVenda) || 0), 0));
        if (quantidadeEstoque) quantidadeEstoque.textContent = produtos.reduce((soma, produto) => soma + (Number(produto.quantidade) || 0), 0);

        let baixo = 0;
        let zerado = 0;

        produtos.forEach((produto) => {
            const quantidade = Number(produto.quantidade) || 0;
            const minimo = Number(produto.estoqueMinimo) || 0;
            if (quantidade === 0) zerado += 1;
            if (quantidade > 0 && quantidade <= minimo) baixo += 1;
        });

        if (estoqueBaixo) estoqueBaixo.textContent = baixo;
        if (estoqueZerado) estoqueZerado.textContent = zerado;

        if (tabelaAlerta) {
            tabelaAlerta.innerHTML = '';

            const produtosAlerta = produtos.filter((produto) => {
                const quantidade = Number(produto.quantidade) || 0;
                const minimo = Number(produto.estoqueMinimo) || 0;
                return quantidade === 0 || (quantidade > 0 && quantidade <= minimo);
            });

            if (produtosAlerta.length === 0) {
                tabelaAlerta.innerHTML = '<tr><td colspan="5">Nenhum produto precisa de reposição.</td></tr>';
                return;
            }

            produtosAlerta.forEach((produto) => {
                const linha = document.createElement('tr');
                linha.innerHTML = `
                    <td>${produto.nome || '-'}</td>
                    <td>${produto.codigo || '-'}</td>
                    <td>${formatarEstoque(produto)}</td>
                    <td>${(produto.estoqueMinimo || 0)} ${formatarUnidade(produto.unidade)}</td>
                    <td>${(Number(produto.quantidade) || 0) === 0 ? 'Sem estoque' : 'Estoque baixo'}</td>
                `;
                tabelaAlerta.appendChild(linha);
            });
        }
    }

    atualizarDashboard();
})();
