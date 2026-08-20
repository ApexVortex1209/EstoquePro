(function () {
	function getProdutos() {
		return JSON.parse(localStorage.getItem('listaProdutos')) || [];
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

	function renderAlertas() {
		const tbody = document.getElementById('produtosAlerta');
		if (!tbody) return;

		const produtos = getProdutos();
		tbody.innerHTML = '';

		const avisos = produtos.filter((produto) => {
			const q = Number(produto.quantidade) || 0;
			const min = Number(produto.estoqueMinimo) || 0;
			return q <= min;
		});

		if (avisos.length === 0) {
			tbody.innerHTML = '<tr><td colspan="5">Nenhum produto em alerta.</td></tr>';
			return;
		}

		avisos.forEach((produto) => {
			const q = Number(produto.quantidade) || 0;
			const min = Number(produto.estoqueMinimo) || 0;
			const statusText = q <= 0 ? 'Zerado' : 'Baixo';
			const statusClass = q <= 0 ? 'status-zerado' : 'status-baixo';

			const linha = document.createElement('tr');
			linha.innerHTML = `
				<td>${produto.nome || '-'}</td>
				<td>${produto.codigo || produto.codigoBarras || '-'}</td>
				<td>${formatarEstoque(produto)}</td>
				<td>${min} ${formatarUnidade(produto.unidade)}</td>
				<td class="${statusClass}">${statusText}</td>
			`;

			tbody.appendChild(linha);
		});
	}

	document.addEventListener('DOMContentLoaded', renderAlertas);
	renderAlertas();
})();

