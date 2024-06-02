let orderCount = 1;

function addOrder() {
    orderCount++;
    const ordersDiv = document.getElementById('orders');
    const orderContainer = document.createElement('div');
    orderContainer.className = 'order-container';
    orderContainer.innerHTML = `
    <label for="length-${orderCount}">Longitud del Pedido:</label>
    <input type="number" id="length-${orderCount}" name="length-${orderCount}" required>
    <label for="quantity-${orderCount}">Cantidad:</label>
    <input type="number" id="quantity-${orderCount}" name="quantity-${orderCount}" required>
  `;
    ordersDiv.appendChild(orderContainer);
}

function executeGreedyFirstFit() {
    const rollLength = 100;
    const orders = [];

    for (let i = 1; i <= orderCount; i++) {
        const length = parseInt(document.getElementById(`length-${i}`).value);
        const quantity = parseInt(document.getElementById(`quantity-${i}`).value);
        orders.push({ length, quantity });
    }

    orders.sort((a, b) => b.length - a.length);

    let rolls = [];
    for (let order of orders) {
        for (let i = 0; i < order.quantity; i++) {
            let placed = false;
            for (let roll of rolls) {
                if (roll.remainingLength >= order.length) {
                    roll.pieces.push(order.length);
                    roll.remainingLength -= order.length;
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                rolls.push({
                    pieces: [order.length],
                    remainingLength: rollLength - order.length,
                });
            }
        }
    }

    displayResults(rolls);
}

function displayResults(rolls) {
    const resultsDiv = document.getElementById('results');
    let resultText = 'Resultado de la aplicación del Algoritmo Voraz (First-Fit):\n';
    rolls.forEach((roll, index) => {
        resultText += `Rollo ${index + 1}: ${roll.pieces.join(', ')} (Sobran ${roll.remainingLength} metros)\n`;
    });
    resultsDiv.textContent = resultText;
}
