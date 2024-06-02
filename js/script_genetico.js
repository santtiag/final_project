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


function executeGeneticAlgorithm() {
    const rollLength = 100;
    const orders = [];

    for (let i = 1; i <= orderCount; i++) {
        const length = parseInt(document.getElementById(`length-${i}`).value);
        const quantity = parseInt(document.getElementById(`quantity-${i}`).value);
        orders.push({ length, quantity });
    }

    orders.sort((a, b) => b.length - a.length);

    // Inicializar población
    const populationSize = 50;
    const generations = 100;
    const mutationRate = 0.1;
    let population = initializePopulation(orders, populationSize, rollLength);

    // Iterar sobre generaciones
    for (let generation = 0; generation < generations; generation++) {
        population = evolvePopulation(population, orders, rollLength, mutationRate);
    }

    // Seleccionar el mejor individuo de la población final
    const bestSolution = population.reduce((best, individual) => {
        return (evaluateFitness(individual, rollLength) < evaluateFitness(best, rollLength)) ? individual : best;
    });

    displayResults(bestSolution);
}

function initializePopulation(orders, populationSize, rollLength) {
    let population = [];
    for (let i = 0; i < populationSize; i++) {
        let individual = [];
        orders.forEach(order => {
            for (let j = 0; j < order.quantity; j++) {
                individual.push(order.length);
            }
        });
        shuffleArray(individual);
        population.push(individual);
    }
    return population;
}

function evolvePopulation(population, orders, rollLength, mutationRate) {
    let newPopulation = [];

    for (let i = 0; i < population.length; i++) {
        let parent1 = selectIndividual(population, rollLength);
        let parent2 = selectIndividual(population, rollLength);
        let offspring = crossover(parent1, parent2);
        if (Math.random() < mutationRate) {
            mutate(offspring);
        }
        newPopulation.push(offspring);
    }

    return newPopulation;
}

function selectIndividual(population, rollLength) {
    const tournamentSize = 5;
    let tournament = [];
    for (let i = 0; i < tournamentSize; i++) {
        let randomIndex = Math.floor(Math.random() * population.length);
        tournament.push(population[randomIndex]);
    }
    return tournament.reduce((best, individual) => {
        return (evaluateFitness(individual, rollLength) < evaluateFitness(best, rollLength)) ? individual : best;
    });
}

function crossover(parent1, parent2) {
    let crossoverPoint = Math.floor(Math.random() * parent1.length);
    let offspring = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
    return offspring;
}

function mutate(individual) {
    let index1 = Math.floor(Math.random() * individual.length);
    let index2 = Math.floor(Math.random() * individual.length);
    [individual[index1], individual[index2]] = [individual[index2], individual[index1]];
}

function evaluateFitness(individual, rollLength) {
    let rolls = [];
    let currentRoll = [];
    let currentLength = 0;

    individual.forEach(piece => {
        if (currentLength + piece <= rollLength) {
            currentRoll.push(piece);
            currentLength += piece;
        } else {
            rolls.push(currentRoll);
            currentRoll = [piece];
            currentLength = piece;
        }
    });

    if (currentRoll.length > 0) {
        rolls.push(currentRoll);
    }

    let waste = rolls.reduce((total, roll) => {
        let usedLength = roll.reduce((sum, piece) => sum + piece, 0);
        return total + (rollLength - usedLength);
    }, 0);

    return waste;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function displayResults(bestSolution) {
    const rollLength = 100;
    let rolls = [];
    let currentRoll = [];
    let currentLength = 0;

    bestSolution.forEach(piece => {
        if (currentLength + piece <= rollLength) {
            currentRoll.push(piece);
            currentLength += piece;
        } else {
            rolls.push(currentRoll);
            currentRoll = [piece];
            currentLength = piece;
        }
    });

    if (currentRoll.length > 0) {
        rolls.push(currentRoll);
    }

    const resultsDiv = document.getElementById('results');
    let resultText = 'Resultado de la aplicación del Algoritmo Genético:\n';
    rolls.forEach((roll, index) => {
        let usedLength = roll.reduce((sum, piece) => sum + piece, 0);
        resultText += `Rollo ${index + 1}: ${roll.join(', ')} (Sobran ${rollLength - usedLength} metros)\n`;
    });
    resultsDiv.textContent = resultText;
}
