//definição do automato de pilha
const AP = {
    Sigma: ["a", "b", "c"],
    Q: ["q0", "q1", "q2"],
    V: ["S","D","C","B","a","b","c"],
    q0: "q0",
    F: ["q2"],

    delta: [

        // Inicial – empilha S
        { estado:"q0", entrada:"ε", topo:"ε", novoEstado:"q1", empilha:["S"], descricao:"início" },

        //cond é uma condição usada quando existem várias regras possíveis
        //para o mesmo símbolo no topo da pilha. olha o próximo caractere
        //da entrada (sem consumir) e só permite aplicar a regra se ele combinar.
        //por exemplo, quando o topo da pilha for D, ele vai usar a cond pra
        //saber qual produção usar, no caso de ser a ou c depois do D

        // S → aD
        { estado:"q1", entrada:"ε", topo:"S", cond:"look='a'", novoEstado:"q1", empilha:["a","D"], descricao:"produção S → aD" },

        // S → cC
        { estado:"q1", entrada:"ε", topo:"S", cond:"look='c'", novoEstado:"q1", empilha:["c","C"], descricao:"produção S → cC" },

        // D → aDB
        { estado:"q1", entrada:"ε", topo:"D", cond:"look='a'", novoEstado:"q1", empilha:["a","D","B"], descricao:"produção D → aDB" },

        // D → cCB
        { estado:"q1", entrada:"ε", topo:"D", cond:"look='c'", novoEstado:"q1", empilha:["c","C","B"], descricao:"produção D → cCB" },

        // C → c
        { estado:"q1", entrada:"ε", topo:"C", novoEstado:"q1", empilha:["c"], descricao:"produção C → c" },

        // B → b
        { estado:"q1", entrada:"ε", topo:"B", novoEstado:"q1", empilha:["b"], descricao:"produção B → b" },

        // consumir terminais da fita
        { estado:"q1", entrada:"a", topo:"a", novoEstado:"q1", descricao:"consome 'a'" },
        { estado:"q1", entrada:"c", topo:"c", novoEstado:"q1", descricao:"consome 'c'" },
        { estado:"q1", entrada:"b", topo:"b", novoEstado:"q1", descricao:"consome 'b'" },

        // transição de sucesso/aceitação
        { estado:"q1", entrada:"ε", topo:"ε", novoEstado:"q2", descricao:"aceita" }
    ]
};


function simular() {

    const entrada = document.getElementById("fita").value.trim();
    const resultadoDiv = document.getElementById("resultado");
    const tabelaDiv = document.getElementById("tabela");

    resultadoDiv.innerHTML = "";
    tabelaDiv.innerHTML = "";

    // validar simbolos de entrada 
    if (!entrada.split("").every(s => AP.Sigma.includes(s))) {
        resultadoDiv.innerHTML = `<div class="erro">Símbolos inválidos na entrada.</div>`;
        return;
    }

    // estado e pilha iniciais + variaveis de controle
    let estado = AP.q0;
    let pilha = [];
    let pos = 0;

    let passos = [];
    let passoNum = 0;

    // função para registrar linha da tabela, definindo cada coluna dela
    function registrar(transicao) {
        passos.push({
            passo: passoNum++,
            estado, //pega o estado atual
            restante: pos < entrada.length ? entrada.substring(pos) : "ε",  // se ainda tem caracteres sendo analisados, pega entrada.substring(pos) que é parte da palavra que ainda não foi processada. Ex: entrada=aaaccbbb e pos=3 -> ccbbb Se pos chegou ao fim da palavra e não tem mais nada pra atualizar, mostra ε ivazio
            pilha: pilha.length > 0 ? pilha.join("") : "ε",
            transicao // = transicao: transicao
        });
    }

    // ================================
    // Linha 0 – configuração inicial
    // ================================
    passos.push({
        passo: passoNum++,
        estado,
        restante: entrada,
        pilha: "ε",
        transicao: "Configuração inicial"
    });

    // ======================================
    // Priemira transição do AP, que vai até q1 e empilha S
    // ======================================

    // Pega no delta/transição todas que partem do estado inicial q0 consomem ε vazio
    let iniciais = AP.delta.filter(
        t => t.estado === AP.q0 && t.entrada === "ε"
    );

    // se não encontrar nehum transição
    if (iniciais.length === 0) {
        resultadoDiv.innerHTML = `<div class="erro">AP não possui transição inicial definida.</div>`;
        return;
    }

    //pega a priemira que acha (pelo grafo de transição só vai ter uma mesmo)
    let t0 = iniciais[0];

    if (t0.empilha) { //ve se a transição inicial tem simbolos para empilhar
        for (let s of [...t0.empilha].reverse()) pilha.push(s); //loop pra cada simbolo que ele tem que empilhar no topo da pilha
        //reverse deixa na ordem correta (do topo pra baixo)
        //loop/ter cada simbolo separado ao inves de junto (a, D, B ao invés de aDB) é necessário pois cada simbolo deve ter a possibilidade de ser tratado separadamente, para aplicar as produções
    }

    //atualiza o estado atual
    estado = t0.novoEstado;

    //registra o passo com essa mensagem, detalhando a transição usada
    registrar(
        `δ(${AP.q0}, ε, ε) → (${estado}, ${(t0.empilha ?? []).join("")})`
    );

    // ===============================
    // LOOP PRINCIPAL DO AP - FICA EXECUTANDO ATÉ QUE ELE NÃO ACHE UMA TRANSIÇÃO VÁLIDA
    // ===============================
    while (true) {

        let topo = pilha.length > 0 ? pilha[pilha.length - 1] : "ε"; //pega o topo da pilha (ou vazio se não tiver nada na pilha)
        let simboloEntrada = pos < entrada.length ? entrada[pos] : "ε"; //pega o próximo que vai ser consumido

        // busca transições compatíveis/que podem ser feitas, com base nos parametros verificados
        let candidatas = AP.delta.filter(t =>
            t.estado === estado &&
            t.topo === topo &&
            (t.entrada === simboloEntrada || t.entrada === "ε")
        );

        //se tiver condição adicional, filtra de non
        candidatas = candidatas.filter(t => {
            if (!t.cond) return true;

            if (t.cond.startsWith("look=")) {
                let esperado = t.cond.split("=")[1].replace(/'/g, "");
                return esperado === simboloEntrada;
            }

            return true;
        });

        //se não tem transição pra ser usada, para o Ap
        if (candidatas.length === 0) break;

        //pega pra usar a primeira transição
        let t = candidatas[0];

        //remove o topo da pilha, pois a transição consome o símbolo usado
        //não remove se o topo for vazio
        if (topo !== "ε") pilha.pop();

        //se tiver simbolo pra empilhar, empilha
        if (t.empilha) {
            for (let s of [...t.empilha].reverse()) pilha.push(s);
        }

        //se a transição consome um simbolo de entrada, então ela avança a posição
        if (t.entrada !== "ε") pos++;

        //atualiza o estado atual
        estado = t.novoEstado;

        //registra o passo com essa mensagem, detalhando a transição usada
        registrar(
            `δ(${t.estado}, ${t.entrada}, ${t.topo}) → ` +
            `(${estado}, ${(t.empilha ?? []).join("") || "ε"}) — ${t.descricao}`
        );

        //verifica a condição de aceitação pra ver se a palavra foi aceita:
        //- estado atual deve ser um final
        //- toda a palavra precisa  ter sido consumida
        //- a pilha deve estar vazia
        if (
            AP.F.includes(estado) &&
            pos === entrada.length &&
            pilha.length === 0
        ) break;
    }

    // ===============================
    // DECISÃO DE ACEITAÇÃO
    // ===============================
    if (
        AP.F.includes(estado) &&
        pos === entrada.length &&
        pilha.length === 0
    ) {
        //se aceita os requisitos da condição de aceitação, então ela é aceita
        resultadoDiv.innerHTML = `<div class="sucesso">Palavra Aceita!</div>`;
    } else {
        //se não atende, então é rejeitada
        resultadoDiv.innerHTML = `<div class="erro">Palavra Rejeitada!</div>`;
    }

    // ===============================
    // MONTAR TABELA
    // ===============================

    //cabeçalho da tabela
    let html = `
    <table>
    <tr>
        <th>Passo</th>
        <th>Estado</th>
        <th>Entrada restante</th>
        <th>Pilha (base → topo)</th>
        <th>Transição</th>
    </tr>`;

    
    //percorre os passo registrados e gera uma linha da tabela para cada um
    passos.forEach(l => {
        html += `
        <tr>
            <td>${l.passo}</td>
            <td>${l.estado}</td>
            <td>${l.restante}</td>
            <td>${l.pilha}</td>
            <td>${l.transicao}</td>
        </tr>`;
    });

    //fecha a tabela e mostra ela no html
    html += "</table>";
    tabelaDiv.innerHTML = html;
}
