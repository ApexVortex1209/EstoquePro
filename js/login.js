(function() {
    const formLogin = document.getElementById('formLogin');
    const formCadastroAcesso = document.getElementById('formCadastroAcesso');
    const formRecuperarSenha = document.getElementById('formRecuperarSenha');
    const toggleRecuperarSenha = document.getElementById('toggleRecuperarSenha');
    const recuperarSenhaBox = document.getElementById('recuperarSenhaBox');

    if (!formLogin) {
        return;
    }

    if (toggleRecuperarSenha && recuperarSenhaBox) {
        toggleRecuperarSenha.addEventListener('click', function() {
            const aberto = !recuperarSenhaBox.hidden;
            recuperarSenhaBox.hidden = aberto;
            toggleRecuperarSenha.textContent = aberto ? 'Esquecer senha?' : 'Fechar';
        });
    }

    Auth.seedDefaultUsers();

    let mensagem = document.getElementById('loginMensagem');
    if (!mensagem) {
        mensagem = document.createElement('div');
        mensagem.id = 'loginMensagem';
        mensagem.className = 'login-mensagem';
        formLogin.parentNode.insertBefore(mensagem, formLogin);
    }

    let mensagemCadastro = document.getElementById('cadastroMensagem');
    if (!mensagemCadastro && formCadastroAcesso) {
        mensagemCadastro = document.createElement('div');
        mensagemCadastro.id = 'cadastroMensagem';
        mensagemCadastro.className = 'login-mensagem';
        formCadastroAcesso.parentNode.insertBefore(mensagemCadastro, formCadastroAcesso);
    }

    function showMessage(element, text, success) {
        if (!element) return;
        element.textContent = text;
        element.className = success ? 'login-mensagem sucesso' : 'login-mensagem erro';
    }

    function atualizarOpcoesPerfil() {
        const selects = [document.getElementById('tipoCadastro')];
        const usuarios = Auth.getUsers();

        selects.forEach(function(select) {
            if (!select) return;

            Array.from(select.options).forEach(function(option) {
                const role = option.value;
                const ocupado = role !== 'employee' && usuarios.some(function(usuario) {
                    return usuario.role === role;
                });
                option.disabled = ocupado;
            });

            const optionSelecionada = Array.from(select.options).find(function(option) {
                return !option.disabled;
            });

            if (optionSelecionada && !select.value) {
                select.value = optionSelecionada.value;
            }
        });
    }

    atualizarOpcoesPerfil();

    formLogin.addEventListener('submit', function(event) {
        event.preventDefault();

        const email = document.getElementById('email').value.trim();
        const senha = document.getElementById('senha').value.trim();
        const role = document.getElementById('tipoLogin').value;

        if (!email || !senha) {
            showMessage(mensagem, 'Informe e-mail e senha.', false);
            return;
        }

        const usuario = Auth.findUserByEmail(email);
        if (!usuario || usuario.senha !== senha) {
            showMessage(mensagem, 'E-mail ou senha inválidos.', false);
            return;
        }

        if (usuario.role !== role) {
            showMessage(mensagem, 'Esse e-mail não pertence ao tipo de acesso selecionado.', false);
            return;
        }

        Auth.setCurrentUser({
            nome: usuario.nome,
            email: usuario.email,
            role: usuario.role
        });

        showMessage(mensagem, 'Login realizado com sucesso.', true);

        setTimeout(function() {
            if (usuario.role === 'viewer') {
                window.location.href = 'clientes.html';
            } else {
                window.location.href = 'index.html';
            }
        }, 500);
    });

    if (formRecuperarSenha) {
        formRecuperarSenha.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('emailRecuperar').value.trim();
            const usuario = Auth.findUserByEmail(email);

            if (!usuario) {
                showMessage(mensagem, 'Nenhuma conta encontrada com esse e-mail.', false);
                return;
            }

            const assunto = encodeURIComponent('Recuperação de senha - Estoque Pro');
            const corpo = encodeURIComponent(
                'Olá ' + usuario.nome + ',\n\n' +
                'Sua senha do Estoque Pro é: ' + usuario.senha + '\n\n' +
                'Use esse dado para entrar no sistema.\n\n' +
                'Atenciosamente,\nEstoque Pro'
            );

            window.location.href = 'mailto:' + usuario.email + '?subject=' + assunto + '&body=' + corpo;
            showMessage(mensagem, 'A senha foi enviada para o e-mail cadastrado.', true);
        });
    }

    if (formCadastroAcesso) {
        formCadastroAcesso.addEventListener('submit', function(event) {
            event.preventDefault();

            const nome = document.getElementById('nomeCadastro').value.trim();
            const email = document.getElementById('emailCadastro').value.trim();
            const senha = document.getElementById('senhaCadastro').value.trim();
            const role = document.getElementById('tipoCadastro').value;

            if (!nome || !email || !senha) {
                showMessage(mensagemCadastro, 'Preencha todos os campos da conta.', false);
                return;
            }

            const usuarios = Auth.getUsers();
            const perfilOcupado = role !== 'employee' && usuarios.some(function(usuario) {
                return usuario.role === role;
            });

            if (perfilOcupado) {
                showMessage(mensagemCadastro, 'Esse tipo de acesso já foi cadastrado. Escolha outro.', false);
                atualizarOpcoesPerfil();
                return;
            }

            const cadastrado = Auth.registerUser({
                nome: nome,
                email: email,
                senha: senha,
                role: role
            });

            if (!cadastrado) {
                showMessage(mensagemCadastro, 'Já existe uma conta com esse e-mail ou esse tipo de acesso já foi cadastrado.', false);
                atualizarOpcoesPerfil();
                return;
            }

            showMessage(mensagemCadastro, 'Conta criada com sucesso. Agora faça login.', true);
            formCadastroAcesso.reset();
            document.getElementById('tipoLogin').value = role;
            atualizarOpcoesPerfil();
        });
    }
})();
