// Scripts específicos da página de estoque.
// ============================================
// MOVIMENTAÇÕES DE ESTOQUE
// ============================================

(function() {
    const formMovimentacao = document.getElementById('formMovimentacao');
    const produtoSelect = document.getElementById('produtoMovimentacao');
    const listaMovimentacoesBody = document.getElementById('listaMovimentacoes');
    const botaoEnviar = formMovimentacao ? formMovimentacao.querySelector('button[type="submit"]') : null;

    let listaMovimentacoes = JSON.parse(localStorage.getItem('listaMovimentacoes')) || [];
    let movimentoEditando = null;

    function getProdutos() {
        return JSON.parse(localStorage.getItem('listaProdutos')) || [];
    }

    function salvarMovimentacoes() {
        localStorage.setItem('listaMovimentacoes', JSON.stringify(listaMovimentacoes));
    }

    function formatarData(data) {
        return new Date(data).toLocaleString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function carregarProdutos() {
        const produtos = getProdutos();

        if (!produtoSelect) {
            return;
        }

        produtoSelect.innerHTML = '';

        if (produtos.length === 0) {
            const opcao = document.createElement('option');
            opcao.value = '';
            opcao.textContent = 'Nenhum produto cadastrado';
            opcao.disabled = true;
            opcao.selected = true;
            produtoSelect.appendChild(opcao);
            if (botaoEnviar) {
                botaoEnviar.disabled = true;
            }
            return;
        }

        const opcaoPadrao = document.createElement('option');
        opcaoPadrao.value = '';
        opcaoPadrao.textContent = 'Selecione um produto';
        opcaoPadrao.selected = true;
        opcaoPadrao.disabled = true;
        produtoSelect.appendChild(opcaoPadrao);

        produtos.forEach(function(produto) {
            const option = document.createElement('option');
            option.value = produto.codigo || produto.nome || '';
            option.textContent = produto.nome || produto.codigo || 'Produto sem nome';
            produtoSelect.appendChild(option);
        });

        if (botaoEnviar) {
            botaoEnviar.disabled = false;
        }
    }

    function renderizarMovimentacoes() {
        if (!listaMovimentacoesBody) {
            return;
        }

        listaMovimentacoesBody.innerHTML = '';

        if (listaMovimentacoes.length === 0) {
            listaMovimentacoesBody.innerHTML = '<tr><td colspan="6">Nenhuma movimentação registrada.</td></tr>';
            return;
        }

        listaMovimentacoes.forEach(function(movimentacao, indice) {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${formatarData(movimentacao.data)}</td>
                <td>${movimentacao.produto}</td>
                <td>${movimentacao.tipo}</td>
                <td>${movimentacao.quantidade}</td>
                <td>${movimentacao.motivo || '-'}</td>
                <td>
                    <button type="button" class="btn-editar" data-indice="${indice}">Editar</button>
                    <button type="button" class="btn-excluir" data-indice="${indice}">Excluir</button>
                </td>
            `;

            linha.querySelector('.btn-editar').addEventListener('click', function() {
                iniciarEdicaoMovimentacao(indice);
            });

            linha.querySelector('.btn-excluir').addEventListener('click', function() {
                listaMovimentacoes.splice(indice, 1);
                salvarMovimentacoes();
                renderizarMovimentacoes();
            });

            listaMovimentacoesBody.appendChild(linha);
        });
    }

    function iniciarEdicaoMovimentacao(indice) {
        const movimentacao = listaMovimentacoes[indice];
        if (!movimentacao || !formMovimentacao) {
            return;
        }

        const produtos = getProdutos();
        produtoSelect.value = movimentacao.produtoCodigo || '';
        document.getElementById('tipoMovimentacao').value = movimentacao.tipo || 'entrada';
        document.getElementById('quantidadeMovimentacao').value = movimentacao.quantidade || '';
        document.getElementById('motivoMovimentacao').value = movimentacao.motivo || '';
        botaoEnviar.textContent = 'Atualizar Movimentação';
        movimentoEditando = indice;
    }

    if (formMovimentacao) {
        carregarProdutos();
        renderizarMovimentacoes();

        formMovimentacao.addEventListener('submit', function(event) {
            event.preventDefault();

            const produtoCodigo = produtoSelect ? produtoSelect.value : '';
            const tipo = document.getElementById('tipoMovimentacao').value;
            const quantidade = document.getElementById('quantidadeMovimentacao').value;
            const motivo = document.getElementById('motivoMovimentacao').value.trim();
            const produtos = getProdutos();
            const produtoSelecionado = produtos.find(function(produto) {
                return produto.codigo === produtoCodigo;
            });

            if (!produtoSelecionado) {
                alert('Selecione um produto válido.');
                return;
            }

            if (!quantidade || Number(quantidade) <= 0) {
                alert('Informe uma quantidade válida.');
                return;
            }

            const novaMovimentacao = {
                data: movimentoEditando !== null ? listaMovimentacoes[movimentoEditando].data : new Date().toISOString(),
                produtoCodigo: produtoSelecionado.codigo,
                produto: produtoSelecionado.nome || produtoSelecionado.codigo || 'Produto',
                tipo: tipo,
                quantidade: quantidade,
                motivo: motivo
            };

            if (movimentoEditando !== null) {
                listaMovimentacoes[movimentoEditando] = novaMovimentacao;
                movimentoEditando = null;
                botaoEnviar.textContent = 'Registrar Movimentação';
            } else {
                listaMovimentacoes.push(novaMovimentacao);
            }

            salvarMovimentacoes();
            renderizarMovimentacoes();
            formMovimentacao.reset();
            carregarProdutos();
        });
    }
})();