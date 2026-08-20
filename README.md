# Estoque Pro

Sistema web para controle de estoque de pequenos negócios. O projeto permite cadastrar produtos, registrar movimentações e vendas, acompanhar clientes e fornecedores e consultar relatórios gerenciais.

## Funcionalidades

- Dashboard com indicadores de produtos, valor do estoque e alertas de reposição.
- Cadastro, edição e exclusão de produtos.
- Registro de entradas, saídas e ajustes de estoque.
- Registro de vendas com itens, cliente, desconto e forma de pagamento.
- Cadastro e consulta de clientes e fornecedores.
- Relatórios de faturamento, produtos mais vendidos, estoque crítico e produtos sem movimentação.
- Exportação do relatório de vendas em CSV.
- Configurações da empresa e preferências do sistema.
- Tela de login e criação de contas de acesso.

## Tecnologias

- HTML5
- CSS3
- JavaScript puro
- `localStorage` do navegador para armazenar os dados localmente

## Como executar

1. Baixe ou clone este repositório.
2. Abra o arquivo `index.html` em um navegador.
3. Você será direcionado ao dashboard do sistema.

> Os dados são salvos apenas no navegador utilizado. Ao limpar os dados do navegador, os cadastros e registros também serão removidos.

## Estrutura do projeto

```text
EstoquePro/
├── assets/       # Imagens, fundos e ícones
├── css/          # Estilos da aplicação
├── js/           # Scripts e regras de cada página
├── pages/        # Telas do sistema
├── partials/     # Componentes reutilizáveis, como a barra lateral
├── index.html    # Página inicial e redirecionamento
└── README.md
```

## Páginas disponíveis

- Dashboard
- Produtos
- Cadastro de Produto
- Movimentação de Estoque
- Vendas
- Clientes
- Fornecedores
- Relatórios
- Configurações

## Próximas melhorias sugeridas

- Integração com banco de dados e servidor.
- Controle de usuários com autenticação segura.
- Gráficos de vendas e estoque.
- Impressão de comprovantes de venda.
- Importação de produtos por planilha.

## Autor

Desenvolvido por [ApexVortex1209](https://github.com/ApexVortex1209).
