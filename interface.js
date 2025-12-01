const simular= () => {
    console.log("iniciando simulação...");
    
    const entrada = document.getElementById("fita").value.trim();
    const resultadoDiv = document.getElementById("resultado");
    const tabelaDiv = document.getElementById("tabela");

    const resp = window.simular(window.AP, entrada);

    if (resp.erro) {
        resultadoDiv.innerHTML = `<div class="erro">${resp.erro}</div>`;
        tabelaDiv.innerHTML = "";
        return;
    }

    resultadoDiv.innerHTML = resp.aceita
        ? `<div class="sucesso">Palavra Aceita!</div>`
        : `<div class="erro">Palavra Rejeitada!</div>`;

    let html = `<table>
        <tr>
        <th>Passo</th><th>Estado</th><th>Entrada restante</th><th>Pilha</th><th>Transição</th>
        </tr>`;

    resp.passos.forEach(l => {
        html += `<tr>
        <td>${l.passo}</td><td>${l.estado}</td><td>${l.restante}</td><td>${l.pilha}</td><td>${l.transicao}</td>
        </tr>`;
    });

    html += "</table>";
    tabelaDiv.innerHTML = html;
};
