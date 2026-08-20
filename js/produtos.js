(function () {
    function getProdutos() {
        return JSON.parse(localStorage.getItem('listaProdutos')) || [];
    }

    function salvarProdutos(produtos) {
        localStorage.setItem('listaProdutos', JSON.stringify(produtos));
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

    function criarLinha(produto, indice) {
        const linha = document.createElement('tr');
        linha.innerHTML = `
            <td>${produto.nome || '-'}</td>
            <td>${produto.codigo || '-'}</td>
            <td>${produto.categoria || '-'}</td>
            <td>${formatarEstoque(produto)}</td>
            <td>${formatarMoeda(produto.precoVenda)}</td>
            <td>
                <button type="button" data-indice="${indice}" class="btn-editar">Editar</button>
                <button type="button" data-indice="${indice}" class="btn-excluir">Excluir</button>
            </td>
        `;

        linha.querySelector('.btn-editar').addEventListener('click', () => {
            localStorage.setItem('produtoEditando', indice);
            window.location.href = 'cadastro.html';
        });

        linha.querySelector('.btn-excluir').addEventListener('click', () => {
            const produtos = getProdutos();
            produtos.splice(indice, 1);
            salvarProdutos(produtos);
            renderizarTabela();
        });

        return linha;
    }

    function renderizarTabela() {
        const produtos = getProdutos();
        const tabela = document.getElementById('listaProdutos');
        if (!tabela) return;

        tabela.innerHTML = '';

        if (produtos.length === 0) {
            tabela.innerHTML = '<tr><td colspan="6">Nenhum produto cadastrado.</td></tr>';
            return;
        }

        produtos.forEach((produto, indice) => {
            tabela.appendChild(criarLinha(produto, indice));
        });
    }

    function renderizarFiltros() {
        const categorias = [...new Set(getProdutos().map((produto) => produto.categoria).filter(Boolean))];
        const selectCategoria = document.getElementById('categoria');
        if (selectCategoria) {
            selectCategoria.innerHTML = '<option value="">Todas as categorias</option>';
            categorias.forEach((categoria) => {
                selectCategoria.innerHTML += `<option value="${categoria}">${categoria}</option>`;
            });
        }
    }

    const tabela = document.getElementById('listaProdutos');
    const botaoNovo = document.getElementById('novoProduto');

    if (botaoNovo) {
        botaoNovo.addEventListener('click', () => {
            localStorage.removeItem('produtoEditando');
            window.location.href = 'cadastro.html';
        });
    }

    if (tabela) {
        renderizarFiltros();
        renderizarTabela();
    }
})();

