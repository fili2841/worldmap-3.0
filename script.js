// Elements and Settings
const populationSlider = document.getElementById("population-slider");
const populationDisplay = document.getElementById("population-display");
const maxPopulationDisplay = document.getElementById("max-population-display");
const detailsBox = document.getElementById("details-box");

const maxPopulation = 20000000000; // Earth's maximum capacity
const initialPopulation = 8000000000; // Starting population for display
const currentYear = 2024;
const baseGrowthRate = 0.011; // approximately 1.1% annual growth rate
const startYear = -300000; // Approximate year when modern humans first appeared
const endYear = 2108; // Added end year 

// Calculate a population for each year using an exponential growth model
function getPredictedPopulation(year) {
    // Initial population for the starting year
    const initialPopulation = 1000; // Adjust as needed
    // Growth rate, adjust to control how fast the population increases
    const growthRate = 0.00005; 
    // Calculate the year difference from the start year
    const yearDifference = year - startYear; 
    // Apply exponential growth formula
    return Math.round(initialPopulation * Math.exp(growthRate * yearDifference));
}

// Population distribution percentages
const populationDistribution = {
    asia: 0.6,
    africa: 0.17,
    europe: 0.1,
    northAmerica: 0.08,
    southAmerica: 0.05,
    australia: 0.01
};

// Land area in square kilometers for each continent
const landArea = {
    asia: 44579000,
    africa: 30370000,
    europe: 10180000,
    northAmerica: 24709000,
    southAmerica: 17840000,
    australia: 7692000
};

// Base water and food per person per day (in liters and kilograms) for each continent
const baseWaterPerPersonPerDay = {
    asia: 3.3,
    africa: 2.5,
    europe: 4.1,
    northAmerica: 4.9,
    southAmerica: 3.6,
    australia: 3.0
};

const baseFoodPerPersonPerDay = {
    asia: 1.6,
    africa: 1.1,
    europe: 1.9,
    northAmerica: 2.2,
    southAmerica: 1.8,
    australia: 1.4
};

// Updated function to calculate predicted year based on population
function calculatePredictedYear(targetPopulation) {
    if (targetPopulation <= initialPopulation) {
        // For populations lower than current, estimate historical year
        // Using rough exponential decline model going backwards
        const ratio = targetPopulation / initialPopulation;
        if (ratio <= 0) return startYear;
        
        // Using logarithmic scaling to estimate historical population decline
        const yearsAgo = Math.log(ratio) / Math.log(1 - baseGrowthRate);
        const estimatedYear = currentYear + yearsAgo;
        
        // Clamp the result between startYear and currentYear
        return Math.max(startYear, Math.min(currentYear, Math.round(estimatedYear)));
    } else {
        // For future populations, use the original growth model
        const yearsToReach = Math.log(targetPopulation / initialPopulation) / Math.log(1 + baseGrowthRate);
        return Math.round(currentYear + yearsToReach);
    }
}

// Function to format year display
function formatYear(year) {
    if (year < 0) {
        return `${Math.abs(year)} BCE`;
    } else {
        return `${year} CE`;
    }
}

// Function to calculate adjusted resources based on population
function calculateAdjustedResources(baseValue, population, basePopulation) {
    // Calculate the resource reduction factor based on population increase
    const reductionFactor = Math.max(0.1, basePopulation / population); // Minimum 10% of base resources
    return (baseValue * reductionFactor).toFixed(2);
}

// Update population info display
function updatePopulation() {
    const sliderPopulation = parseInt(populationSlider.value);

    // Use the getPredictedPopulation function to get population for predicted future years
    const predictedFuturePopulation = getPredictedPopulation(currentYear); // Example call

    if (sliderPopulation < 0) {
        populationDisplay.textContent = `Current Population: 0`;
        document.getElementById("max-year-display").textContent = `Predicted Year: ${formatYear(startYear)}`;
    } else {
        populationDisplay.textContent = `Current Population: ${sliderPopulation.toLocaleString()}`;
        const predictedYear = calculatePredictedYear(sliderPopulation);
        document.getElementById("max-year-display").textContent = `Predicted Year: ${formatYear(predictedYear)}`;
    }
    maxPopulationDisplay.textContent = `Maximum Capacity: ${maxPopulation.toLocaleString()}`;
}

// Show details box with population data for the hovered continent
function showDetailsBox(region) {
    const currentPopulation = parseInt(populationSlider.value);
    
    // Ensure the population is not negative
    if (currentPopulation < 0) {
        detailsBox.innerHTML = `<h3>Population Details</h3><p>Population data is not available for negative values.</p>`;
        detailsBox.style.display = 'block';
        return;
    }

    // Calculate population for each continent
    const asiaPopulation = Math.round(currentPopulation * populationDistribution.asia);
    const africaPopulation = Math.round(currentPopulation * populationDistribution.africa);
    const europePopulation = Math.round(currentPopulation * populationDistribution.europe);
    const northAmericaPopulation = Math.round(currentPopulation * populationDistribution.northAmerica);
    const southAmericaPopulation = Math.round(currentPopulation * populationDistribution.southAmerica);
    const australiaPopulation = Math.round(currentPopulation * populationDistribution.australia);

    // Calculate base populations for each continent
    const baseAsiaPopulation = Math.round(initialPopulation * populationDistribution.asia);
    const baseAfricaPopulation = Math.round(initialPopulation * populationDistribution.africa);
    const baseEuropePopulation = Math.round(initialPopulation * populationDistribution.europe);
    const baseNorthAmericaPopulation = Math.round(initialPopulation * populationDistribution.northAmerica);
    const baseSouthAmericaPopulation = Math.round(initialPopulation * populationDistribution.southAmerica);
    const baseAustraliaPopulation = Math.round(initialPopulation * populationDistribution.australia);

    // Calculate average space per person (in square kilometers)
    const asiaSpacePerPerson = ((landArea.asia * 1e6) / asiaPopulation / 1000).toFixed(2);
    const africaSpacePerPerson = ((landArea.africa * 1e6) / africaPopulation / 1000).toFixed(2);
    const europeSpacePerPerson = ((landArea.europe * 1e6) / europePopulation / 1000).toFixed(2);
    const northAmericaSpacePerPerson = ((landArea.northAmerica * 1e6) / northAmericaPopulation / 1000).toFixed(2);
    const southAmericaSpacePerPerson = ((landArea.southAmerica * 1e6) / southAmericaPopulation / 1000).toFixed(2);
    const australiaSpacePerPerson = ((landArea.australia * 1e6) / australiaPopulation / 1000).toFixed(2);

    // Update the details box based on the hovered region
    switch (region) {
        case 'africa':
            const africaWater = calculateAdjustedResources(baseWaterPerPersonPerDay.africa, africaPopulation, baseAfricaPopulation);
            const africaFood = calculateAdjustedResources(baseFoodPerPersonPerDay.africa, africaPopulation, baseAfricaPopulation);
            detailsBox.innerHTML = `
                <h3>Population Details</h3>
                <p>Africa: ${africaPopulation.toLocaleString()}</p>
                <p>Average Space per Person: ${africaSpacePerPerson} m²</p>
                <p>Average Water per Person per Day: ${africaWater} liters</p>
                <p>Average Food per Person per Day: ${africaFood} kg</p>
            `;
            break;
        case 'asia':
            const asiaWater = calculateAdjustedResources(baseWaterPerPersonPerDay.asia, asiaPopulation, baseAsiaPopulation);
            const asiaFood = calculateAdjustedResources(baseFoodPerPersonPerDay.asia, asiaPopulation, baseAsiaPopulation);
            detailsBox.innerHTML = `
                <h3>Population Details</h3>
                <p>Asia: ${asiaPopulation.toLocaleString()}</p>
                <p>Average Space per Person: ${asiaSpacePerPerson} m²</p>
                <p>Average Water per Person per Day: ${asiaWater} liters</p>
                <p>Average Food per Person per Day: ${asiaFood} kg</p>
            `;
            break;
        case 'europe':
            const europeWater = calculateAdjustedResources(baseWaterPerPersonPerDay.europe, europePopulation, baseEuropePopulation);
            const europeFood = calculateAdjustedResources(baseFoodPerPersonPerDay.europe, europePopulation, baseEuropePopulation);
            detailsBox.innerHTML = `
                <h3>Population Details</h3>
                <p>Europe: ${europePopulation.toLocaleString()}</p>
                <p>Average Space per Person: ${europeSpacePerPerson} m²</p>
                <p>Average Water per Person per Day: ${europeWater} liters</p>
                <p>Average Food per Person per Day: ${europeFood} kg</p>
            `;
            break;
        case 'north-america':
            const naWater = calculateAdjustedResources(baseWaterPerPersonPerDay.northAmerica, northAmericaPopulation, baseNorthAmericaPopulation);
            const naFood = calculateAdjustedResources(baseFoodPerPersonPerDay.northAmerica, northAmericaPopulation, baseNorthAmericaPopulation);
            detailsBox.innerHTML = `
                <h3>Population Details</h3>
                <p>North America: ${northAmericaPopulation.toLocaleString()}</p>
                <p>Average Space per Person: ${northAmericaSpacePerPerson} m²</p>
                <p>Average Water per Person per Day: ${naWater} liters</p>
                <p>Average Food per Person per Day: ${naFood} kg</p>
            `;
            break;
        case 'south-america':
            const saWater = calculateAdjustedResources(baseWaterPerPersonPerDay.southAmerica, southAmericaPopulation, baseSouthAmericaPopulation);
            const saFood = calculateAdjustedResources(baseFoodPerPersonPerDay.southAmerica, southAmericaPopulation, baseSouthAmericaPopulation);
            detailsBox.innerHTML = `
                <h3>Population Details</h3>
                <p>South America: ${southAmericaPopulation.toLocaleString()}</p>
                <p>Average Space per Person: ${southAmericaSpacePerPerson} m²</p>
                <p>Average Water per Person per Day: ${saWater} liters</p>
                <p>Average Food per Person per Day: ${saFood} kg</p>
            `;
            break;
        case 'australia':
            const ausWater = calculateAdjustedResources(baseWaterPerPersonPerDay.australia, australiaPopulation, baseAustraliaPopulation);
            const ausFood = calculateAdjustedResources(baseFoodPerPersonPerDay.australia, australiaPopulation, baseAustraliaPopulation);
            detailsBox.innerHTML = `
                <h3>Population Details</h3>
                <p>Australia: ${australiaPopulation.toLocaleString()}</p>
                <p>Average Space per Person: ${australiaSpacePerPerson} m²</p>
                <p>Average Water per Person per Day: ${ausWater} liters</p>
                <p>Average Food per Person per Day: ${ausFood} kg</p>
            `;
            break;
        default:
            detailsBox.innerHTML = '';
            break;
    }

    // Show the details box
    detailsBox.style.display = 'block';
}

// Hide the details box when not hovering over a continent
function hideDetailsBox() {
    detailsBox.style.display = 'none';
}

// Add event listeners for the slider and continent zones
populationSlider.addEventListener("input", updatePopulation);
document.getElementById("zone-africa").addEventListener("mouseover", () => showDetailsBox('africa'));
document.getElementById("zone-asia").addEventListener("mouseover", () => showDetailsBox('asia'));
document.getElementById("zone-europe").addEventListener("mouseover", () => showDetailsBox('europe'));
document.getElementById("zone-north-america").addEventListener("mouseover", () => showDetailsBox('north-america'));
document.getElementById("zone-south-america").addEventListener("mouseover", () => showDetailsBox('south-america'));
document.getElementById("zone-australia").addEventListener("mouseover", () => showDetailsBox('australia'));

document.getElementById("zone-africa").addEventListener("mouseout", hideDetailsBox);
document.getElementById("zone-asia").addEventListener("mouseout", hideDetailsBox);
document.getElementById("zone-europe").addEventListener("mouseout", hideDetailsBox);
document.getElementById("zone-north-america").addEventListener("mouseout", hideDetailsBox);
document.getElementById("zone-south-america").addEventListener("mouseout", hideDetailsBox);
document.getElementById("zone-australia").addEventListener("mouseout", hideDetailsBox);

// Initialize the population display
updatePopulation();

// Set a practical minimum value for the slider
populationSlider.min = -1000;
