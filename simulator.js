
window.simular = function(AP, entrada) {

    if (!window.simbolosValidos(entrada, AP.Sigma)) {
        return { erro: "Símbolos inválidos na entrada." };
    }

    let estado = AP.q0;
    let pilha = [];
    let pos = 0;
    let passos = [];
    let passoNum = 0;

    function registrar(t) {
        passos.push({
            passo: passoNum++,
            estado,
            restante: pos < entrada.length ? entrada.substring(pos) : "ε",
            pilha: pilha.length ? pilha.join("") : "ε",
            transicao: t
        });
    }

    registrar("Configuração inicial");

    // Transição inicial
    let t0 = AP.delta.find(t => t.estado === AP.q0 && t.entrada === "ε");
    if (!t0) return { erro: "AP não possui transição inicial." };

    if (t0.empilha) for (let s of [...t0.empilha].reverse()) pilha.push(s);

    estado = t0.novoEstado;
    registrar(`δ(${AP.q0}, ε, ε) → (${estado}, ${t0.empilha.join("")})`);

    while (true) {
        let topo = window.topoDaPilha(pilha);
        let simbolo = pos < entrada.length ? entrada[pos] : "ε";

        if ("abc".includes(topo) && topo !== simbolo) {
            registrar(`ERRO: topo='${topo}' mas entrada='${simbolo}' — mismatch, rejeita.`);
            break;
        }


        let candidatas = AP.delta.filter(t =>
            t.estado === estado &&
            t.topo === topo &&
            (t.entrada === simbolo || t.entrada === "ε")
        );

        // filtros de condicional lookahead
        candidatas = candidatas.filter(t => {
            if (!t.cond) return true;
            if (t.cond.startsWith("look=")) {
                let esperado = t.cond.split("=")[1].replace(/'/g, "");
                return esperado === simbolo;
            }
        });

        if (candidatas.length === 0) {
            if (pos < entrada.length || pilha.length > 0) {
                registrar(`ERRO: nenhuma transição possível. estado=${estado}, topo=${topo}, entrada=${simbolo}`);
            }
            break;
        }
            
        if (candidatas.length === 0) break;

        let t = candidatas[0];

        if (topo !== "ε") pilha.pop();
        if (t.empilha) for (let s of [...t.empilha].reverse()) pilha.push(s);
        if (t.entrada !== "ε") pos++;

        estado = t.novoEstado;

        registrar(
            `δ(${t.estado}, ${t.entrada}, ${t.topo}) → (${estado}, ${(t.empilha ?? []).join("") || "ε"}) — ${t.descricao}`
        );

        if (AP.F.includes(estado) && pos === entrada.length && pilha.length === 0)
            break;
        
    }

    let aceita =
        AP.F.includes(estado) &&
        pos === entrada.length &&
        pilha.length === 0;

    return { aceita, passos };
}
