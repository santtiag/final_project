// Definimos la longitud de cada rollo
const rollLength = 100;

// Definimos los pedidos
const orders = [
    { length: 5, quantity: 20 },
    { length: 10, quantity: 10 },
    { length: 15, quantity: 15 },
];

// Ordenamos los pedidos de mayor a menor longitud
orders.sort((a, b) => b.length - a.length);

// Función para aplicar el Algoritmo Voraz (First-Fit)
function greedyFirstFit(orders, rollLength) {
    let rolls = [];

    // Iteramos sobre cada pedido
    for (let order of orders) {
        for (let i = 0; i < order.quantity; i++) {
            let placed = false;
            // Intentamos colocar la pieza en el primer rollo donde encaje
            for (let roll of rolls) {
                if (roll.remainingLength >= order.length) {
                    roll.pieces.push(order.length);
                    roll.remainingLength -= order.length;
                    placed = true;
                    break;
                }
            }
            // Si no se pudo colocar la pieza en ningún rollo existente, creamos un nuevo rollo
            if (!placed) {
                rolls.push({
                    pieces: [order.length],
                    remainingLength: rollLength - order.length,
                });
            }
        }
    }
    return rolls;
}

// Ejecutamos la función y obtenemos los resultados
let resultRolls = greedyFirstFit(orders, rollLength);

// Mostramos los resultados
console.log('Resultado de la aplicación del Algoritmo Voraz (First-Fit):');
resultRolls.forEach((roll, index) => {
    console.log(`Rollo ${index + 1}: ${roll.pieces.join(', ')} (Sobran ${roll.remainingLength} metros)`);
});
