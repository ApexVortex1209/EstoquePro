(function () {
    const formProduto = document.getElementById('formProduto');
    const codigoInternoInput = document.getElementById('codigoInterno');

    if (typeof Auth !== 'undefined') {
        Auth.seedDefaultUsers();
    }

    if (!formProduto) {
        return;
    }

    function getProdutos() {
        return JSON.parse(localStorage.getItem('listaProdutos')) || [];
    }

    function salvarProdutos(produtos) {
        localStorage.setItem('listaProdutos', JSON.stringify(produtos));
    }

    function gerarCodigo() {
        const produtos = getProdutos();
        const numeros = produtos
            .map((produto) => Number((produto.codigo || '').replace('EST-', '')))
            .filter((numero) => !Number.isNaN(numero));

        return numeros.length > 0 ? `EST-${String(Math.max(...numeros) + 1).padStart(6, '0')}` : 'EST-000001';
    }

    if (codigoInternoInput) {
        codigoInternoInput.value = gerarCodigo();
    }

    const indiceEditando = localStorage.getItem('produtoEditando');

    if (indiceEditando !== null) {
        const produtos = getProdutos();
        const produto = produtos[Number(indiceEditando)];

        if (produto) {
            document.getElementById('nomeProduto').value = produto.nome || '';
            document.getElementById('codigoInterno').value = produto.codigo || '';
            document.getElementById('codigoBarras').value = produto.codigoBarras || '';
            document.getElementById('categoria').value = produto.categoria || '';
            document.getElementById('precoCusto').value = produto.precoCusto || '';
            document.getElementById('precoVenda').value = produto.precoVenda || '';
            document.getElementById('quantidade').value = produto.quantidade || '';
            document.getElementById('estoqueMinimo').value = produto.estoqueMinimo || 0;
            document.getElementById('unidade').value = produto.unidade || '';
            document.getElementById('localEstoque').value = produto.localEstoque || '';
            document.getElementById('btnSalvarProduto').textContent = 'Salvar Alterações';
            formProduto.dataset.editando = indiceEditando;
        }
    }

    formProduto.addEventListener('submit', function (event) {
        event.preventDefault();

        const produto = {
            nome: document.getElementById('nomeProduto').value.trim(),
            codigoBarras: document.getElementById('codigoBarras').value.trim(),
            categoria: document.getElementById('categoria').value,
            precoCusto: document.getElementById('precoCusto').value,
            precoVenda: document.getElementById('precoVenda').value,
            quantidade: document.getElementById('quantidade').value,
            estoqueMinimo: document.getElementById('estoqueMinimo').value || 0,
            unidade: document.getElementById('unidade').value,
            localEstoque: document.getElementById('localEstoque').value.trim()
        };

        const produtos = getProdutos();

        if (formProduto.dataset.editando !== undefined) {
            const indice = Number(formProduto.dataset.editando);
            const produtoAtual = produtos[indice];

            if (!produtoAtual) {
                alert('Produto não encontrado.');
                return;
            }

            produtoAtual.nome = produto.nome;
            produtoAtual.codigoBarras = produto.codigoBarras;
            produtoAtual.categoria = produto.categoria;
            produtoAtual.precoCusto = produto.precoCusto;
            produtoAtual.precoVenda = produto.precoVenda;
            produtoAtual.quantidade = produto.quantidade;
            produtoAtual.estoqueMinimo = produto.estoqueMinimo;
            produtoAtual.unidade = produto.unidade;
            produtoAtual.localEstoque = produto.localEstoque;

            salvarProdutos(produtos);
            localStorage.removeItem('produtoEditando');
            window.location.href = 'produtos.html';
            return;
        }

        produto.codigo = gerarCodigo();
        produtos.push(produto);
        salvarProdutos(produtos);
        formProduto.reset();
        localStorage.removeItem('produtoEditando');
        alert('Produto cadastrado com sucesso!');
        window.location.href = 'produtos.html';
    });
})();

