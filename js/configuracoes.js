(function () {
    const STORAGE_KEY = 'configuracoesEstoquePro';

    const configuracoesPadrao = {
        nomeLoja: 'Estoque Pro',
        emailLoja: 'contato@estoquepro.com',
        telefoneLoja: '(11) 99999-9999',
        enderecoLoja: 'Rua da loja, 123',
        descontoPadrao: 5,
        estoqueMinimo: 10,
        temaSistema: 'escuro',
        alertaEstoque: 'true',
        emailDono: 'vitor@gmail.com',
        loginPadrao: 'owner'
    };

    function getConfiguracoes() {
        const salvo = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        return { ...configuracoesPadrao, ...(salvo || {}) };
    }

    function salvarConfiguracoes(configuracoes) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configuracoes));
    }

    function preencherFormulario(configuracoes) {
        const campos = [
            'nomeLoja',
            'emailLoja',
            'telefoneLoja',
            'enderecoLoja',
            'descontoPadrao',
            'estoqueMinimo',
            'temaSistema',
            'alertaEstoque',
            'emailDono',
            'loginPadrao'
        ];

        campos.forEach((campo) => {
            const input = document.getElementById(campo);
            if (!input) return;
            input.value = configuracoes[campo] ?? '';
        });
    }

    function atualizarResumo(configuracoes) {
        const resumoEmpresa = document.getElementById('resumoEmpresa');
        const resumoEstoque = document.getElementById('resumoEstoque');
        const resumoDesconto = document.getElementById('resumoDesconto');

        if (resumoEmpresa) {
            resumoEmpresa.textContent = configuracoes.nomeLoja || 'Estoque Pro';
        }

        if (resumoEstoque) {
            resumoEstoque.textContent = `${Number(configuracoes.estoqueMinimo || 0)} itens`;
        }

        if (resumoDesconto) {
            resumoDesconto.textContent = `${Number(configuracoes.descontoPadrao || 0)}%`;
        }

        if (window.applyCompanyProfile) {
            window.applyCompanyProfile();
        }
    }

    function coletarFormulario() {
        return {
            nomeLoja: document.getElementById('nomeLoja')?.value.trim() || configuracoesPadrao.nomeLoja,
            emailLoja: document.getElementById('emailLoja')?.value.trim() || configuracoesPadrao.emailLoja,
            telefoneLoja: document.getElementById('telefoneLoja')?.value.trim() || configuracoesPadrao.telefoneLoja,
            enderecoLoja: document.getElementById('enderecoLoja')?.value.trim() || configuracoesPadrao.enderecoLoja,
            descontoPadrao: Number(document.getElementById('descontoPadrao')?.value || 0),
            estoqueMinimo: Number(document.getElementById('estoqueMinimo')?.value || 0),
            temaSistema: document.getElementById('temaSistema')?.value || configuracoesPadrao.temaSistema,
            alertaEstoque: document.getElementById('alertaEstoque')?.value || configuracoesPadrao.alertaEstoque,
            emailDono: document.getElementById('emailDono')?.value.trim() || configuracoesPadrao.emailDono,
            loginPadrao: document.getElementById('loginPadrao')?.value || configuracoesPadrao.loginPadrao
        };
    }

    const form = document.getElementById('formConfiguracoes');
    if (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();

            const configuracoes = coletarFormulario();
            salvarConfiguracoes(configuracoes);
            atualizarResumo(configuracoes);
            alert('Configurações salvas com sucesso!');
        });
    }

    const botaoReset = document.getElementById('resetConfiguracoes');
    if (botaoReset) {
        botaoReset.addEventListener('click', function () {
            salvarConfiguracoes(configuracoesPadrao);
            preencherFormulario(configuracoesPadrao);
            atualizarResumo(configuracoesPadrao);
            alert('Configurações restauradas para os valores padrão.');
        });
    }

    const configuracoesAtuais = getConfiguracoes();
    preencherFormulario(configuracoesAtuais);
    atualizarResumo(configuracoesAtuais);
})();
