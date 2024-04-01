// Function to fetch CSV file and process data
async function fetchDataAndPlot() {
    try {
        const response = await fetch('http://localhost:8080/dark_patterns.csv');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.text();
        const parsedData = processData(data);
        plotPatternCategoriesChart(parsedData);
        plotPatternTypePieChart(parsedData);
        plotDeceptivePatternsChart(parsedData);
        plotWhereInWebsiteLineChart(parsedData);
        updateFeedbackProgressBars(parsedData);
    } catch (error) {
        console.error('Error fetching or processing data:', error.message);
    }
}

// Function to process CSV data
function processData(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i].split(',');
        if (currentLine.length === headers.length) {
            const entry = {};
            for (let j = 0; j < headers.length; j++) {
                entry[headers[j].trim()] = currentLine[j].trim();
            }
            data.push(entry);
        }
    }
    return data;
}

// Function to count occurrences of pattern categories
function countPatternCategories(data) {
    const categoryCounts = {};
    data.forEach(entry => {
        const category = entry["Pattern Category"];
        categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    });
    return categoryCounts;
}

// Chart-1: Bar Chart for Pattern Categories
function plotPatternCategoriesChart(data) {
    const categoryCounts = countPatternCategories(data);
    const ctx = document.getElementById('patternCategoriesChart').getContext('2d');
    const patternCategoriesChart = new Chart(ctx, {
        type: 'bar', // Use 'bar3d' for a 3D bar chart
        data: {
            labels: Object.keys(categoryCounts),
            datasets: [{
                label: 'Pattern Categories',
                data: Object.values(categoryCounts),
                backgroundColor: 'rgba(54, 162, 235, 0.5)', // Adjust color as needed
                borderColor: 'rgba(54, 162, 235, 1)', // Adjust color as needed
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Chart-2: Pie Chart for Pattern Types
function plotPatternTypePieChart(data) {
    const typeCounts = countPatternTypes(data);
    const ctx = document.getElementById('patternTypePieChart').getContext('2d');

    // Extract labels and data for the pie chart
    const labels = Object.keys(typeCounts);
    const dataValues = Object.values(typeCounts);

    // Plot Pie Chart
    const patternTypePieChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: dataValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                    'rgba(255, 206, 86, 0.5)',
                    'rgba(75, 192, 192, 0.5)',
                    'rgba(153, 102, 255, 0.5)',
                    'rgba(255, 159, 64, 0.5)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Function to count occurrences of pattern types
function countPatternTypes(data) {
    const typeCounts = {};
    data.forEach(entry => {
        const type = entry["Pattern Type"];
        typeCounts[type] = (typeCounts[type] || 0) + 1;
    });
    return typeCounts;
}


// Chart-3: Pie Chart for Deceptive Patterns
function plotDeceptivePatternsChart(data) {
    const deceptiveCount = data.filter(entry => entry["Deceptive?"] === "Yes").length;
    const nonDeceptiveCount = data.filter(entry => entry["Deceptive?"] === "No").length;

    const ctx = document.getElementById('deceptivePatternsChart').getContext('2d');
    const deceptivePatternsChart = new Chart(ctx, {
        type: 'polarArea', // Use 'pie3d' for a 3D pie chart
        data: {
            labels: ['Deceptive', 'Non-Deceptive'],
            datasets: [{
                data: [deceptiveCount, nonDeceptiveCount],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.5)',
                    'rgba(54, 162, 235, 0.5)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true
        }
    });
}

// Chart-4: Plot Line Chart for Where in Website
function plotWhereInWebsiteLineChart(data) {
    const ctx = document.getElementById('whereInWebsiteLineChart').getContext('2d');

    // Extracting data for the chart
    const labels = data.map(entry => entry["Pattern Type"]);
    const websiteSections = data.map(entry => entry["Where in website?"]);

    // Counting occurrences of website sections
    const sectionCounts = {};
    websiteSections.forEach(section => {
        sectionCounts[section] = (sectionCounts[section] || 0) + 1;
    });

    const datasets = Object.keys(sectionCounts).map(section => {
        return {
            label: section,
            data: Array(data.length).fill(0).map((_, index) => {
                return websiteSections[index] === section ? 1 : 0;
            }),
            borderColor: getRandomColor(), // You can define this function to generate random colors
            borderWidth: 1,
            fill: false
        };
    });

    // Plot Line Chart
    const lineChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Function to generate a random color
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


//message

// Fetch data from feedback.csv and plot charts


fetch('http://localhost:8080/feedback.csv')
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        return response.text();
    })
    .then(data => {
        // Process the CSV data (You can use a CSV parsing library if needed)
        const rows = data.split('\n').slice(1); // Skip the header row
        const feedbackData = rows.map(row => row.split(','));

        // Extract source and sentiment data
        const sources = feedbackData.map(row => row[5]); // Assuming the source is in the first column
        const sentiments = feedbackData.map(row => row[1]); // Assuming the sentiment is in the second column
        const confidenceScores = feedbackData.map(row => parseFloat(row[6])); // Assuming the confidence score is in the seventh column

        // Plot source chart
        plotLocationChartWithConfidence(sources,confidenceScores);

        // Plot sentiment chart
        plotSentimentChart(sentiments);
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

// Function to plot the location chart with confidence score on the x-axis
function plotLocationChartWithConfidence(locations, confidenceScores) {
    const ctx = document.getElementById('locationChart').getContext('2d');
    const locationChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: locations, // Use locations as labels
            datasets: [{
                label: 'Confidence Score', // Adjust the label
                data: confidenceScores, // Use confidenceScores as data
                backgroundColor: 'rgba(54, 162, 235, 0.5)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Location' // Adjust the x-axis title
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Confidence Score' // Adjust the y-axis title
                    }
                }
            }
        }
    });
}


// Function to plot the sentiment chart as a line chart
function plotSentimentChart(sentiments) {
    const sentimentCounts = countOccurrences(sentiments);
    const ctx = document.getElementById('sentimentChart').getContext('2d');
    const sentimentChart = new Chart(ctx, {
        type: 'line', // Change the type to 'line'
        data: {
            labels: Object.keys(sentimentCounts),
            datasets: [{
                label: 'Sentiment',
                data: Object.values(sentimentCounts),
                backgroundColor: 'rgba(255, 99, 132, 0.5)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}


// Function to count occurrences of elements in an array
function countOccurrences(array) {
    const counts = {};
    array.forEach(element => {
        counts[element] = (counts[element] || 0) + 1;
    });
    return counts;
}


// // Function to calculate the percentage of positive and negative feedback and update the progress bars
// function updateFeedbackProgressBars(feedbackData) {
//     // Count positive and negative feedback
//     let positiveCount = 0;
//     let negativeCount = 0;
//     feedbackData.forEach(feedback => {
//         if (feedback.Sentiment === 'Positive') {
//             positiveCount++;
//         } else if (feedback.Sentiment === 'Negative') {
//             negativeCount++;
//         }
//     });
//     console.log(positiveCount);

//     // Calculate percentages
//     const totalCount = positiveCount + negativeCount;
//     const positivePercentage = (positiveCount / totalCount) * 100;
//     const negativePercentage = (negativeCount / totalCount) * 100;

//     // Update progress bars
//     const positiveCtx = document.getElementById('positiveFeedbackCanvas').getContext('2d');
//     const negativeCtx = document.getElementById('negativeFeedbackCanvas').getContext('2d');

//     // Draw positive feedback bar
//     positiveCtx.fillStyle = 'green';
//     positiveCtx.fillRect(0, 0, positivePercentage * 4, 50);

//     // Draw negative feedback bar
//     negativeCtx.fillStyle = 'red';
//     negativeCtx.fillRect(0, 0, negativePercentage * 4, 50);
// }


// Fetch data and plot charts when the page loads
window.onload = fetchDataAndPlot;
