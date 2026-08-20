console.log("Script carregado com sucesso!");


// ======================================================
// LISTA DE PRODUTOS
// ======================================================

let listaProdutos =
    JSON.parse(localStorage.getItem("listaProdutos")) || [];


// ======================================================
// SALVAR PRODUTOS
// ======================================================

function salvarProdutos() {

    localStorage.setItem(
        "listaProdutos",
        JSON.stringify(listaProdutos)
    );

}


// ======================================================
// FORMATAR MOEDA
// ======================================================

function formatarMoeda(valor) {

    return Number(valor || 0).toLocaleString(
        "pt-BR",
        {
            style: "currency",
            currency: "BRL"
        }
    );

}


// ======================================================
// FORMATAR UNIDADE
// ======================================================

function formatarUnidade(unidade) {

    const unidades = {

        unidade: "un",

        kg: "kg",

        litro: "L",

        caixa: "caixas",

        pacote: "pacotes"

    };

    return unidades[unidade] || unidade || "un";

}


// ======================================================
// FORMATAR ESTOQUE
// ======================================================

function formatarEstoque(produto) {

    const quantidade =
        Number(produto.quantidade) || 0;

    const unidade =
        formatarUnidade(produto.unidade);

    return `${quantidade} ${unidade}`;

}


// ======================================================
// GERAR PRÓXIMO CÓDIGO
// ======================================================

let proximoCodigo = 1;


if (listaProdutos.length > 0) {

    const numeros =
        listaProdutos
            .map(function(produto) {

                if (!produto.codigo) {
                    return 0;
                }

                const numero =
                    produto.codigo
                        .replace("EST-", "");

                return Number(numero);

            })
            .filter(function(numero) {

                return !isNaN(numero);

            });


    if (numeros.length > 0) {

        proximoCodigo =
            Math.max(...numeros) + 1;

    }

}


// ======================================================
// FORMULÁRIO
// ======================================================

const formProduto =
    document.getElementById("formProduto");


if (formProduto) {

    // ==================================================
    // VERIFICAR EDIÇÃO
    // ==================================================

    const indiceEditando =
        localStorage.getItem("produtoEditando");


    // ==================================================
    // PREENCHER FORMULÁRIO
    // ==================================================

    if (indiceEditando !== null) {

        const indice =
            Number(indiceEditando);

        const produto =
            listaProdutos[indice];


        if (produto) {

            document.getElementById(
                "nomeProduto"
            ).value =
                produto.nome || "";


            document.getElementById(
                "codigoInterno"
            ).value =
                produto.codigo || "";


            document.getElementById(
                "codigoBarras"
            ).value =
                produto.codigoBarras || "";


            document.getElementById(
                "categoria"
            ).value =
                produto.categoria || "";


            document.getElementById(
                "precoCusto"
            ).value =
                produto.precoCusto || "";


            document.getElementById(
                "precoVenda"
            ).value =
                produto.precoVenda || "";


            document.getElementById(
                "quantidade"
            ).value =
                produto.quantidade || "";


            document.getElementById(
                "estoqueMinimo"
            ).value =
                produto.estoqueMinimo || 0;


            document.getElementById(
                "unidade"
            ).value =
                produto.unidade || "";


            document.getElementById(
                "localEstoque"
            ).value =
                produto.localEstoque || "";


            formProduto.dataset.editando =
                indice;


            const botaoSalvar =
                document.getElementById(
                    "btnSalvarProduto"
                );


            if (botaoSalvar) {

                botaoSalvar.textContent =
                    "Salvar Alterações";

            }


            console.log(
                "Editando produto:",
                produto
            );

        }

    }


    // ==================================================
    // ENVIAR FORMULÁRIO
    // ==================================================

    formProduto.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            // ==========================================
            // PEGAR VALORES
            // ==========================================

            const nomeProduto =
                document
                    .getElementById("nomeProduto")
                    .value
                    .trim();


            const codigoBarras =
                document
                    .getElementById("codigoBarras")
                    .value
                    .trim();


            const categoria =
                document
                    .getElementById("categoria")
                    .value;


            const precoCusto =
                document
                    .getElementById("precoCusto")
                    .value;


            const precoVenda =
                document
                    .getElementById("precoVenda")
                    .value;


            const quantidade =
                document
                    .getElementById("quantidade")
                    .value;


            const estoqueMinimo =
                document
                    .getElementById("estoqueMinimo")
                    .value || 0;


            const unidade =
                document
                    .getElementById("unidade")
                    .value;


            const localEstoque =
                document
                    .getElementById("localEstoque")
                    .value
                    .trim();


            // ==========================================
            // VERIFICAR EDIÇÃO
            // ==========================================

            const indiceEditandoFormulario =
                formProduto.dataset.editando;


            // ==========================================
            // EDITAR PRODUTO
            // ==========================================

            if (
                indiceEditandoFormulario !== undefined
            ) {

                const indice =
                    Number(
                        indiceEditandoFormulario
                    );


                const produto =
                    listaProdutos[indice];


                if (!produto) {

                    alert(
                        "Produto não encontrado."
                    );

                    return;

                }


                produto.nome =
                    nomeProduto;

                produto.codigoBarras =
                    codigoBarras;

                produto.categoria =
                    categoria;

                produto.precoCusto =
                    precoCusto;

                produto.precoVenda =
                    precoVenda;

                produto.quantidade =
                    quantidade;

                produto.estoqueMinimo =
                    estoqueMinimo;

                produto.unidade =
                    unidade;

                produto.localEstoque =
                    localEstoque;


                salvarProdutos();


                delete formProduto.dataset.editando;


                localStorage.removeItem(
                    "produtoEditando"
                );


                console.log(
                    "Produto alterado:",
                    produto
                );


                window.location.href =
                    "produtos.html";


                return;

            }


            // ==========================================
            // NOVO CÓDIGO
            // ==========================================

            const codigoInterno =
                "EST-" +
                String(proximoCodigo)
                    .padStart(6, "0");


            proximoCodigo++;


            // ==========================================
            // CRIAR PRODUTO
            // ==========================================

            const produto = {

                codigo:
                    codigoInterno,

                codigoBarras:
                    codigoBarras,

                nome:
                    nomeProduto,

                categoria:
                    categoria,

                precoCusto:
                    precoCusto,

                precoVenda:
                    precoVenda,

                quantidade:
                    quantidade,

                estoqueMinimo:
                    estoqueMinimo,

                unidade:
                    unidade,

                localEstoque:
                    localEstoque

            };


            // ==========================================
            // ADICIONAR
            // ==========================================

            listaProdutos.push(produto);


            // ==========================================
            // SALVAR
            // ==========================================

            salvarProdutos();


            console.log(
                "Produto cadastrado:",
                produto
            );


            formProduto.reset();


            localStorage.removeItem(
                "produtoEditando"
            );


            alert(
                "Produto cadastrado com sucesso!"
            );


            window.location.href =
                "produtos.html";

        }
    );

}


// ======================================================
// CRIAR LINHA DA TABELA
// ======================================================

function criarLinhaProduto(
    produto,
    indice
) {

    const linha =
        document.createElement("tr");


    // ==================================================
    // IMAGEM
    // ==================================================

    const colunaImagem =
        document.createElement("td");

    colunaImagem.textContent =
        "Sem imagem";

    linha.appendChild(
        colunaImagem
    );


    // ==================================================
    // NOME
    // ==================================================

    const colunaNome =
        document.createElement("td");

    colunaNome.textContent =
        produto.nome || "-";

    linha.appendChild(
        colunaNome
    );


    // ==================================================
    // CÓDIGO
    // ==================================================

    const colunaCodigo =
        document.createElement("td");

    colunaCodigo.textContent =
        produto.codigo || "-";

    linha.appendChild(
        colunaCodigo
    );


    // ==================================================
    // CATEGORIA
    // ==================================================

    const colunaCategoria =
        document.createElement("td");

    colunaCategoria.textContent =
        produto.categoria || "-";

    linha.appendChild(
        colunaCategoria
    );


    // ==================================================
    // ESTOQUE
    // ==================================================

    const colunaEstoque =
        document.createElement("td");

    colunaEstoque.textContent =
        formatarEstoque(produto);

    linha.appendChild(
        colunaEstoque
    );


    // ==================================================
    // PREÇO
    // ==================================================

    const colunaPreco =
        document.createElement("td");

    colunaPreco.textContent =
        formatarMoeda(
            produto.precoVenda
        );

    linha.appendChild(
        colunaPreco
    );


    // ==================================================
    // AÇÕES
    // ==================================================

    const colunaAcoes =
        document.createElement("td");


    // ==================================================
    // EDITAR
    // ==================================================

    const botaoEditar =
        document.createElement("button");

    botaoEditar.textContent =
        "Editar";

    botaoEditar.type =
        "button";


    botaoEditar.addEventListener(
        "click",
        function() {

            editarProduto(indice);

        }
    );


    // ==================================================
    // EXCLUIR
    // ==================================================

    const botaoExcluir =
        document.createElement("button");

    botaoExcluir.textContent =
        "Excluir";

    botaoExcluir.type =
        "button";


    botaoExcluir.addEventListener(
        "click",
        function() {

            excluirProduto(indice);

        }
    );


    colunaAcoes.appendChild(
        botaoEditar
    );


    colunaAcoes.appendChild(
        botaoExcluir
    );


    linha.appendChild(
        colunaAcoes
    );


    return linha;

}


// ======================================================
// ATUALIZAR TABELA
// ======================================================

function atualizarTabela() {

    const tabela =
        document.getElementById(
            "listaProdutos"
        );


    if (!tabela) {

        return;

    }


    tabela.innerHTML = "";


    // ==================================================
    // NENHUM PRODUTO
    // ==================================================

    if (listaProdutos.length === 0) {

        const linha =
            document.createElement("tr");


        const coluna =
            document.createElement("td");


        coluna.textContent =
            "Nenhum produto cadastrado.";


        coluna.colSpan = 7;


        linha.appendChild(
            coluna
        );


        tabela.appendChild(
            linha
        );


        return;

    }


    // ==================================================
    // PRODUTOS
    // ==================================================

    listaProdutos.forEach(
        function(produto, indice) {

            tabela.appendChild(
                criarLinhaProduto(
                    produto,
                    indice
                )
            );

        }
    );

}


// ======================================================
// PESQUISAR PRODUTOS
// ======================================================

function pesquisarProdutos() {

    const tabela =
        document.getElementById(
            "listaProdutos"
        );


    if (!tabela) {

        return;

    }


    const pesquisaInput =
        document.getElementById(
            "pesquisa"
        );


    const categoriaSelect =
        document.getElementById(
            "categoria"
        );


    const estoqueSelect =
        document.getElementById(
            "estoque"
        );


    const textoPesquisa =
        pesquisaInput
            ? pesquisaInput.value
                .toLowerCase()
                .trim()
            : "";


    const categoriaSelecionada =
        categoriaSelect
            ? categoriaSelect.value
            : "";


    const estoqueSelecionado =
        estoqueSelect
            ? estoqueSelect.value
            : "";


    const produtosFiltrados =
        listaProdutos.filter(
            function(produto) {

                const nome =
                    String(
                        produto.nome || ""
                    ).toLowerCase();


                const codigo =
                    String(
                        produto.codigo || ""
                    ).toLowerCase();


                const categoria =
                    String(
                        produto.categoria || ""
                    ).toLowerCase();


                // Pesquisa

                const correspondePesquisa =
                    nome.includes(
                        textoPesquisa
                    ) ||
                    codigo.includes(
                        textoPesquisa
                    ) ||
                    categoria.includes(
                        textoPesquisa
                    );


                // Categoria

                const correspondeCategoria =
                    categoriaSelecionada === "" ||
                    produto.categoria ===
                        categoriaSelecionada;


                // Estoque

                const quantidade =
                    Number(
                        produto.quantidade
                    ) || 0;


                const estoqueMinimo =
                    Number(
                        produto.estoqueMinimo
                    ) || 0;


                let correspondeEstoque =
                    true;


                if (
                    estoqueSelecionado ===
                    "normal"
                ) {

                    correspondeEstoque =
                        quantidade >
                        estoqueMinimo;

                }


                if (
                    estoqueSelecionado ===
                    "baixo"
                ) {

                    correspondeEstoque =
                        quantidade > 0 &&
                        quantidade <=
                            estoqueMinimo;

                }


                if (
                    estoqueSelecionado ===
                    "zerado"
                ) {

                    correspondeEstoque =
                        quantidade === 0;

                }


                return (
                    correspondePesquisa &&
                    correspondeCategoria &&
                    correspondeEstoque
                );

            }
        );


    // ==================================================
    // MOSTRAR RESULTADOS
    // ==================================================

    tabela.innerHTML = "";


    if (
        produtosFiltrados.length === 0
    ) {

        const linha =
            document.createElement("tr");


        const coluna =
            document.createElement("td");


        coluna.textContent =
            "Nenhum produto encontrado.";


        coluna.colSpan = 7;


        linha.appendChild(
            coluna
        );


        tabela.appendChild(
            linha
        );


        return;

    }


    produtosFiltrados.forEach(
        function(produto) {

            const indice =
                listaProdutos.indexOf(
                    produto
                );


            tabela.appendChild(
                criarLinhaProduto(
                    produto,
                    indice
                )
            );

        }
    );

}


// ======================================================
// ATUALIZAR FILTROS
// ======================================================

function atualizarFiltros() {

    const categoriaSelect =
        document.getElementById(
            "categoria"
        );


    const estoqueSelect =
        document.getElementById(
            "estoque"
        );


    // ==================================================
    // CATEGORIAS
    // ==================================================

    if (categoriaSelect) {

        categoriaSelect.innerHTML = "";


        const opcaoTodas =
            document.createElement(
                "option"
            );


        opcaoTodas.value = "";


        opcaoTodas.textContent =
            "Todas as categorias";


        categoriaSelect.appendChild(
            opcaoTodas
        );


        const categorias = [];


        listaProdutos.forEach(
            function(produto) {

                if (
                    produto.categoria &&
                    !categorias.includes(
                        produto.categoria
                    )
                ) {

                    categorias.push(
                        produto.categoria
                    );

                }

            }
        );


        categorias.sort();


        categorias.forEach(
            function(categoria) {

                const opcao =
                    document.createElement(
                        "option"
                    );


                opcao.value =
                    categoria;


                opcao.textContent =
                    categoria;


                categoriaSelect.appendChild(
                    opcao
                );

            }
        );

    }


    // ==================================================
    // ESTOQUE
    // ==================================================

    if (estoqueSelect) {

        estoqueSelect.innerHTML = "";


        const opcoes = [

            {
                valor: "",
                texto: "Todo o estoque"
            },

            {
                valor: "normal",
                texto: "Estoque normal"
            },

            {
                valor: "baixo",
                texto: "Estoque baixo"
            },

            {
                valor: "zerado",
                texto: "Sem estoque"
            }

        ];


        opcoes.forEach(
            function(item) {

                const opcao =
                    document.createElement(
                        "option"
                    );


                opcao.value =
                    item.valor;


                opcao.textContent =
                    item.texto;


                estoqueSelect.appendChild(
                    opcao
                );

            }
        );

    }

}


// ======================================================
// EDITAR PRODUTO
// ======================================================

function editarProduto(indice) {

    const produto =
        listaProdutos[indice];


    if (!produto) {

        alert(
            "Produto não encontrado."
        );

        return;

    }


    localStorage.setItem(
        "produtoEditando",
        indice
    );


    window.location.href =
        "cadastro.html";

}


// ======================================================
// EXCLUIR PRODUTO
// ======================================================

function excluirProduto(indice) {

    const produto =
        listaProdutos[indice];


    if (!produto) {

        alert(
            "Produto não encontrado."
        );

        return;

    }


    const confirmar =
        confirm(
            "Deseja realmente excluir o produto?\n\n" +
            produto.nome +
            "\nCódigo: " +
            produto.codigo
        );


    if (!confirmar) {

        return;

    }


    listaProdutos.splice(
        indice,
        1
    );


    salvarProdutos();


    atualizarFiltros();


    const pesquisa =
        document.getElementById(
            "pesquisa"
        );


    if (
        pesquisa &&
        pesquisa.value.trim() !== ""
    ) {

        pesquisarProdutos();

    } else {

        atualizarTabela();

    }


    atualizarDashboard();

    atualizarProdutosAlerta();


    console.log(
        "Produto excluído:",
        produto
    );

}


// ======================================================
// BOTÃO NOVO PRODUTO
// ======================================================

const botaoNovoProduto =
    document.getElementById(
        "novoProduto"
    );


if (botaoNovoProduto) {

    botaoNovoProduto.addEventListener(
        "click",
        function() {

            localStorage.removeItem(
                "produtoEditando"
            );


            window.location.href =
                "cadastro.html";

        }
    );

}


// ======================================================
// PESQUISA
// ======================================================

const campoPesquisa =
    document.getElementById(
        "pesquisa"
    );


if (campoPesquisa) {

    campoPesquisa.addEventListener(
        "input",
        pesquisarProdutos
    );

}


// ======================================================
// FILTRO CATEGORIA
// ======================================================

const filtroCategoria =
    document.getElementById(
        "categoria"
    );


if (filtroCategoria) {

    filtroCategoria.addEventListener(
        "change",
        pesquisarProdutos
    );

}


// ======================================================
// FILTRO ESTOQUE
// ======================================================

const filtroEstoque =
    document.getElementById(
        "estoque"
    );


if (filtroEstoque) {

    filtroEstoque.addEventListener(
        "change",
        pesquisarProdutos
    );

}


// ======================================================
// DASHBOARD
// ======================================================

function atualizarDashboard() {

    const totalProdutos =
        document.getElementById(
            "totalProdutos"
        );


    const valorEstoque =
        document.getElementById(
            "valorEstoque"
        );


    const estoqueBaixo =
        document.getElementById(
            "estoqueBaixo"
        );


    const estoqueZerado =
        document.getElementById(
            "estoqueZerado"
        );


    const quantidadeEstoque =
        document.getElementById(
            "quantidadeEstoque"
        );


    if (
        !totalProdutos &&
        !valorEstoque &&
        !estoqueBaixo &&
        !estoqueZerado &&
        !quantidadeEstoque
    ) {

        return;

    }


    if (totalProdutos) {

        totalProdutos.textContent =
            listaProdutos.length;

    }


    let quantidadeTotal = 0;

    let valorTotal = 0;

    let quantidadeEstoqueBaixo = 0;

    let quantidadeEstoqueZerado = 0;


    listaProdutos.forEach(
        function(produto) {

            const quantidade =
                Number(
                    produto.quantidade
                ) || 0;


            const precoVenda =
                Number(
                    produto.precoVenda
                ) || 0;


            const estoqueMinimo =
                Number(
                    produto.estoqueMinimo
                ) || 0;


            quantidadeTotal +=
                quantidade;


            valorTotal +=
                quantidade *
                precoVenda;


            if (
                quantidade === 0
            ) {

                quantidadeEstoqueZerado++;

            }


            if (
                quantidade > 0 &&
                quantidade <= estoqueMinimo
            ) {

                quantidadeEstoqueBaixo++;

            }

        }
    );


    if (quantidadeEstoque) {

        quantidadeEstoque.textContent =
            quantidadeTotal;

    }


    if (valorEstoque) {

        valorEstoque.textContent =
            formatarMoeda(
                valorTotal
            );

    }


    if (estoqueBaixo) {

        estoqueBaixo.textContent =
            quantidadeEstoqueBaixo;

    }


    if (estoqueZerado) {

        estoqueZerado.textContent =
            quantidadeEstoqueZerado;

    }

}


// ======================================================
// PRODUTOS EM ALERTA
// ======================================================

function atualizarProdutosAlerta() {

    const tabela =
        document.getElementById(
            "produtosAlerta"
        );


    if (!tabela) {

        return;

    }


    tabela.innerHTML = "";


    const produtosAlerta =
        listaProdutos.filter(
            function(produto) {

                const quantidade =
                    Number(
                        produto.quantidade
                    ) || 0;


                const estoqueMinimo =
                    Number(
                        produto.estoqueMinimo
                    ) || 0;


                return (
                    quantidade === 0 ||
                    (
                        quantidade > 0 &&
                        quantidade <=
                            estoqueMinimo
                    )
                );

            }
        );


    if (
        produtosAlerta.length === 0
    ) {

        const linha =
            document.createElement(
                "tr"
            );


        const coluna =
            document.createElement(
                "td"
            );


        coluna.colSpan = 5;


        coluna.textContent =
            "Nenhum produto precisa de reposição.";


        linha.appendChild(
            coluna
        );


        tabela.appendChild(
            linha
        );


        return;

    }


    produtosAlerta.forEach(
        function(produto) {

            const linha =
                document.createElement(
                    "tr"
                );


            // ======================================
            // NOME
            // ======================================

            const colunaNome =
                document.createElement(
                    "td"
                );


            colunaNome.textContent =
                produto.nome;


            linha.appendChild(
                colunaNome
            );


            // ======================================
            // CÓDIGO
            // ======================================

            const colunaCodigo =
                document.createElement(
                    "td"
                );


            colunaCodigo.textContent =
                produto.codigo;


            linha.appendChild(
                colunaCodigo
            );


            // ======================================
            // ESTOQUE
            // ======================================

            const colunaEstoque =
                document.createElement(
                    "td"
                );


            colunaEstoque.textContent =
                formatarEstoque(
                    produto
                );


            linha.appendChild(
                colunaEstoque
            );


            // ======================================
            // MÍNIMO
            // ======================================

            const colunaMinimo =
                document.createElement(
                    "td"
                );


            colunaMinimo.textContent =
                `${produto.estoqueMinimo || 0} ${
                    formatarUnidade(
                        produto.unidade
                    )
                }`;


            linha.appendChild(
                colunaMinimo
            );


            // ======================================
            // STATUS
            // ======================================

            const colunaStatus =
                document.createElement(
                    "td"
                );


            const quantidade =
                Number(
                    produto.quantidade
                ) || 0;


            if (
                quantidade === 0
            ) {

                colunaStatus.textContent =
                    "Sem estoque";

                colunaStatus.className =
                    "status-zerado";

            } else {

                colunaStatus.textContent =
                    "Estoque baixo";

                colunaStatus.className =
                    "status-baixo";

            }


            linha.appendChild(
                colunaStatus
            );


            tabela.appendChild(
                linha
            );

        }
    );

}


// ======================================================
// INICIALIZAR PRODUTOS
// ======================================================

if (
    document.getElementById(
        "listaProdutos"
    )
) {

    atualizarFiltros();

    atualizarTabela();

}


// ======================================================
// INICIALIZAR DASHBOARD
// ======================================================

atualizarDashboard();

atualizarProdutosAlerta();