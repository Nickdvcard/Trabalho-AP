/**
 * @typedef {Object} TransicaoAP
 * @property {string} estado       - Estado atual (ex: "q1")
 * @property {string} entrada      - Símbolo lido da entrada ou "ε"
 * @property {string} topo         - Símbolo no topo da pilha ou "ε"
 * @property {string} novoEstado   - Novo estado após a transição
 * @property {string[]} [empilha]  - Símbolos a serem empilhados (opcional)
 * @property {string} [cond]       - Condição opcional (ex: lookahead)
 * @property {string} descricao    - Descrição da regra
 */

/**
 * @typedef {Object} AutomatoPilha
 * @property {string[]} Sigma      - Alfabeto de entrada
 * @property {string[]} Q          - Conjunto de estados
 * @property {string[]} V          - Alfabeto da pilha
 * @property {string} q0           - Estado inicial
 * @property {string[]} F          - Estados finais
 * @property {TransicaoAP[]} delta - Função de transição
 */

/** @type {AutomatoPilha} */
window.AP = {
    Sigma: ["a", "b", "c"],
    Q: ["q0", "q1", "q2"],
    V: ["S","D","C","B","a","b","c"],
    q0: "q0",
    F: ["q2"],
    delta: [
        { estado:"q0", entrada:"ε", topo:"ε", novoEstado:"q1", empilha:["S"], descricao:"início" },
        { estado:"q1", entrada:"ε", topo:"S", cond:"look='a'", novoEstado:"q1", empilha:["a","D"], descricao:"produção S → aD" },
        { estado:"q1", entrada:"ε", topo:"S", cond:"look='c'", novoEstado:"q1", empilha:["c","C"], descricao:"produção S → cC" },
        { estado:"q1", entrada:"ε", topo:"D", cond:"look='a'", novoEstado:"q1", empilha:["a","D","B"], descricao:"produção D → aDB" },
        { estado:"q1", entrada:"ε", topo:"D", cond:"look='c'", novoEstado:"q1", empilha:["c","C","B"], descricao:"produção D → cCB" },
        { estado:"q1", entrada:"ε", topo:"C", novoEstado:"q1", empilha:["c"], descricao:"produção C → c" },
        { estado:"q1", entrada:"ε", topo:"B", novoEstado:"q1", empilha:["b"], descricao:"produção B → b" },
        { estado:"q1", entrada:"a", topo:"a", novoEstado:"q1", descricao:"consome 'a'" },
        { estado:"q1", entrada:"c", topo:"c", novoEstado:"q1", descricao:"consome 'c'" },
        { estado:"q1", entrada:"b", topo:"b", novoEstado:"q1", descricao:"consome 'b'" },
        { estado:"q1", entrada:"ε", topo:"ε", cond:"look='ε'", novoEstado:"q2", descricao:"aceita" }
    ]
};
