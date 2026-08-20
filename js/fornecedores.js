(function() {
    const formFornecedor = document.getElementById('formFornecedor');
    if (!formFornecedor) return;

    const tabelaFornecedores = document.getElementById('listaFornecedores');
    const botaoSalvar = document.getElementById('btnSalvarFornecedor');

    function getFornecedores() {
        return JSON.parse(localStorage.getItem('listaFornecedores')) || [];
    }

    function saveFornecedores(fornecedores) {
        localStorage.setItem('listaFornecedores', JSON.stringify(fornecedores));
    }

    function resetFormFornecedor() {
        formFornecedor.reset();
        delete formFornecedor.dataset.editando;
        if (botaoSalvar) {
            botaoSalvar.textContent = 'Cadastrar Fornecedor';
        }
    }

    function renderFornecedores() {
        if (!tabelaFornecedores) return;
        const fornecedores = getFornecedores();
        tabelaFornecedores.innerHTML = '';

        if (fornecedores.length === 0) {
            tabelaFornecedores.innerHTML = '<tr><td colspan="6">Nenhum fornecedor cadastrado.</td></tr>';
            return;
        }

        fornecedores.forEach((fornecedor, index) => {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${fornecedor.nome || '-'}</td>
                <td>${fornecedor.empresa || '-'}</td>
                <td>${fornecedor.email || '-'}</td>
                <td>${fornecedor.telefone || '-'}</td>
                <td>${fornecedor.cadastradoEm || '-'}</td>
                <td>
                    <button type="button" class="btn-editar-fornecedor" data-index="${index}">Editar</button>
                    <button type="button" class="btn-excluir-fornecedor" data-index="${index}">Excluir</button>
                </td>
            `;
            tabelaFornecedores.appendChild(linha);
        });
    }

    tabelaFornecedores.addEventListener('click', function(event) {
        const editar = event.target.closest('.btn-editar-fornecedor');
        const excluir = event.target.closest('.btn-excluir-fornecedor');

        if (editar) {
            const index = Number(editar.dataset.index);
            const fornecedores = getFornecedores();
            const fornecedor = fornecedores[index];
            if (!fornecedor) return;

            document.getElementById('nomeFornecedor').value = fornecedor.nome || '';
            document.getElementById('empresaFornecedor').value = fornecedor.empresa || '';
            document.getElementById('emailFornecedor').value = fornecedor.email || '';
            document.getElementById('telefoneFornecedor').value = fornecedor.telefone || '';
            formFornecedor.dataset.editando = String(index);
            if (botaoSalvar) botaoSalvar.textContent = 'Salvar Alterações';
        }

        if (excluir) {
            const index = Number(excluir.dataset.index);
            const fornecedores = getFornecedores();
            const fornecedor = fornecedores[index];
            if (!fornecedor) return;

            const confirmar = window.confirm(`Deseja excluir o fornecedor ${fornecedor.nome}?`);
            if (!confirmar) return;

            fornecedores.splice(index, 1);
            saveFornecedores(fornecedores);
            resetFormFornecedor();
            renderFornecedores();
        }
    });

    formFornecedor.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nomeFornecedor').value.trim();
        const empresa = document.getElementById('empresaFornecedor').value.trim();
        const email = document.getElementById('emailFornecedor').value.trim();
        const telefone = document.getElementById('telefoneFornecedor').value.trim();

        if (!nome || !empresa || !email) {
            alert('Preencha nome, empresa e e-mail do fornecedor.');
            return;
        }

        const fornecedores = getFornecedores();
        const indexEditando = formFornecedor.dataset.editando;

        if (indexEditando !== undefined) {
            const indice = Number(indexEditando);
            fornecedores[indice] = {
                nome,
                empresa,
                email,
                telefone,
                cadastradoEm: fornecedores[indice]?.cadastradoEm || new Date().toLocaleDateString('pt-BR')
            };
            saveFornecedores(fornecedores);
            resetFormFornecedor();
            renderFornecedores();
            return;
        }

        fornecedores.push({
            nome,
            empresa,
            email,
            telefone,
            cadastradoEm: new Date().toLocaleDateString('pt-BR')
        });

        saveFornecedores(fornecedores);
        resetFormFornecedor();
        renderFornecedores();
    });

    renderFornecedores();
})();

