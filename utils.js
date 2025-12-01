/**
 * Verifica se todos os símbolos da entrada pertencem ao alfabeto Sigma.
 *
 * @param {string} entrada - Palavra a validar.
 * @param {string[]} Sigma - Lista de símbolos válidos.
 * @returns {boolean} True se todos os símbolos são válidos, false caso contrário.
 */
window.simbolosValidos = (entrada, Sigma) => {
    console.log(`Simbolos validos ${entrada} em ${Sigma}`);
    return entrada.split("").every(s => Sigma.includes(s));
};

/**
 * Retorna o símbolo no topo da pilha ou ε se estiver vazia.
 *
 * @param {string[]} pilha - A pilha representada como um array (base → topo).
 * @returns {string} O símbolo do topo ou "ε" se a pilha estiver vazia.
 */
window.topoDaPilha = (pilha) => {
    console.log(`Topo da pilha ${pilha}`);
    return pilha.length ? pilha[pilha.length - 1] : "ε";
};
