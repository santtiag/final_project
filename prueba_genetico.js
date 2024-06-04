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

// Función para inicializar la población
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

// Función para evolucionar la población
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

// Función para seleccionar un individuo
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

// Función para realizar el cruce
function crossover(parent1, parent2) {
    let crossoverPoint = Math.floor(Math.random() * parent1.length);
    let offspring = parent1.slice(0, crossoverPoint).concat(parent2.slice(crossoverPoint));
    return offspring;
}

// Función para mutar un individuo
function mutate(individual) {
    let index1 = Math.floor(Math.random() * individual.length);
    let index2 = Math.floor(Math.random() * individual.length);
    [individual[index1], individual[index2]] = [individual[index2], individual[index1]];
}

// Función para evaluar la aptitud de un individuo
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

// Función para mezclar un array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Función principal para ejecutar el algoritmo genético
function executeGeneticAlgorithm(orders, rollLength) {
    const populationSize = 50;
    const generations = 100;
    const mutationRate = 0.1;
    let population = initializePopulation(orders, populationSize, rollLength);

    for (let generation = 0; generation < generations; generation++) {
        population = evolvePopulation(population, orders, rollLength, mutationRate);
    }

    const bestSolution = population.reduce((best, individual) => {
        return (evaluateFitness(individual, rollLength) < evaluateFitness(best, rollLength)) ? individual : best;
    });

    return bestSolution;
}

// Ejecutamos la función y obtenemos los resultados
let bestSolution = executeGeneticAlgorithm(orders, rollLength);

// Mostramos los resultados
console.log('Resultado de la aplicación del Algoritmo Genético:');
let currentRoll = [];
let currentLength = 0;
let rolls = [];

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

rolls.forEach((roll, index) => {
    let usedLength = roll.reduce((sum, piece) => sum + piece, 0);
    console.log(`Rollo ${index + 1}: ${roll.join(', ')} (Sobran ${rollLength - usedLength} metros)`);
});
