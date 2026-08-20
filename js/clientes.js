(function() {
    const formCliente = document.getElementById('formCliente');
    if (!formCliente) {
        return;
    }

    const mensagemCliente = document.getElementById('clientesMensagem');
    const listaClientesBody = document.getElementById('listaClientes');
    const botaoSalvar = document.getElementById('btnSalvarCliente');

    function getClientes() {
        return JSON.parse(localStorage.getItem('listaClientes')) || [];
    }

    function saveClientes(clientes) {
        localStorage.setItem('listaClientes', JSON.stringify(clientes));
    }

    function showMessage(text, success) {
        if (!mensagemCliente) return;
        mensagemCliente.textContent = text;
        mensagemCliente.className = success ? 'mensagem-sucesso' : 'mensagem-erro';
    }

    function resetFormCliente() {
        formCliente.reset();
        delete formCliente.dataset.editando;
        if (botaoSalvar) {
            botaoSalvar.textContent = 'Cadastrar Cliente';
        }
    }

    function renderListaClientes() {
        if (!listaClientesBody) return;
        const clientes = getClientes();
        listaClientesBody.innerHTML = '';

        if (clientes.length === 0) {
            listaClientesBody.innerHTML = '<tr><td colspan="6">Nenhum cliente cadastrado.</td></tr>';
            return;
        }

        clientes.forEach(function(cliente, index) {
            const linha = document.createElement('tr');
            linha.innerHTML = `
                <td>${cliente.nome || '-'}</td>
                <td>${cliente.email || '-'}</td>
                <td>${cliente.telefone || '-'}</td>
                <td>${cliente.cidade || '-'}</td>
                <td>${cliente.cadastradoEm || '-'}</td>
                <td>
                    <button type="button" class="btn-editar-cliente" data-index="${index}">Editar</button>
                    <button type="button" class="btn-excluir-cliente" data-index="${index}">Excluir</button>
                </td>
            `;
            listaClientesBody.appendChild(linha);
        });
    }

    listaClientesBody.addEventListener('click', function(event) {
        const botaoEditar = event.target.closest('.btn-editar-cliente');
        const botaoExcluir = event.target.closest('.btn-excluir-cliente');

        if (botaoEditar) {
            const index = Number(botaoEditar.dataset.index);
            const clientes = getClientes();
            const cliente = clientes[index];

            if (!cliente) return;

            document.getElementById('nomeCliente').value = cliente.nome || '';
            document.getElementById('emailCliente').value = cliente.email || '';
            document.getElementById('telefoneCliente').value = cliente.telefone || '';
            document.getElementById('cidadeCliente').value = cliente.cidade || '';

            formCliente.dataset.editando = String(index);
            if (botaoSalvar) {
                botaoSalvar.textContent = 'Salvar Alterações';
            }

            showMessage('Edite os dados e salve as alterações.', true);
            document.getElementById('nomeCliente').focus();
        }

        if (botaoExcluir) {
            const index = Number(botaoExcluir.dataset.index);
            const clientes = getClientes();
            const cliente = clientes[index];

            if (!cliente) return;

            const confirmar = window.confirm(`Deseja excluir o cliente ${cliente.nome}?`);
            if (!confirmar) return;

            clientes.splice(index, 1);
            saveClientes(clientes);
            resetFormCliente();
            showMessage('Cliente excluído com sucesso.', true);
            renderListaClientes();
        }
    });

    formCliente.addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('nomeCliente').value.trim();
        const email = document.getElementById('emailCliente').value.trim();
        const telefone = document.getElementById('telefoneCliente').value.trim();
        const cidade = document.getElementById('cidadeCliente').value.trim();

        if (!nome || !email) {
            showMessage('Preencha nome e e-mail do cliente.', false);
            return;
        }

        const clientes = getClientes();
        const indexEditando = formCliente.dataset.editando;

        if (indexEditando !== undefined) {
            const indice = Number(indexEditando);
            const clienteAtual = clientes[indice];

            if (!clienteAtual) {
                showMessage('Cliente não encontrado para edição.', false);
                return;
            }

            const emailAlterado = clienteAtual.email.toLowerCase() !== email.toLowerCase();
            if (emailAlterado && clientes.some(function(cliente) {
                return cliente.email && cliente.email.toLowerCase() === email.toLowerCase();
            })) {
                showMessage('Já existe um cliente cadastrado com esse e-mail.', false);
                return;
            }

            clientes[indice] = {
                nome: nome,
                email: email,
                telefone: telefone,
                cidade: cidade,
                cadastradoEm: clienteAtual.cadastradoEm || new Date().toLocaleDateString('pt-BR')
            };

            saveClientes(clientes);
            resetFormCliente();
            showMessage('Cliente atualizado com sucesso.', true);
            renderListaClientes();
            return;
        }

        const jaExiste = clientes.some(function(cliente) {
            return cliente.email && cliente.email.toLowerCase() === email.toLowerCase();
        });

        if (jaExiste) {
            showMessage('Já existe um cliente cadastrado com esse e-mail.', false);
            return;
        }

        clientes.push({
            nome: nome,
            email: email,
            telefone: telefone,
            cidade: cidade,
            cadastradoEm: new Date().toLocaleDateString('pt-BR')
        });

        saveClientes(clientes);
        formCliente.reset();
        showMessage('Cliente cadastrado com sucesso.', true);
        renderListaClientes();
    });

    renderListaClientes();
})();
