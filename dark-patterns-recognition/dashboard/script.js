// Code for sidebar functionality
const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item => {
    const li = item.parentElement;

    item.addEventListener('click', function () {
        allSideMenu.forEach(i => {
            i.parentElement.classList.remove('active');
        });
        li.classList.add('active');
    });
});

// Toggle sidebar functionality
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
    sidebar.classList.toggle('hide');
});

// Code for search functionality
const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
    if (window.innerWidth < 576) {
        e.preventDefault();
        searchForm.classList.toggle('show');
        if (searchForm.classList.contains('show')) {
            searchButtonIcon.classList.replace('bx-search', 'bx-x');
        } else {
            searchButtonIcon.classList.replace('bx-x', 'bx-search');
        }
    }
});

// Adjustments based on window width
if (window.innerWidth < 768) {
    sidebar.classList.add('hide');
} else if (window.innerWidth > 576) {
    searchButtonIcon.classList.replace('bx-x', 'bx-search');
    searchForm.classList.remove('show');
}

// Resize event listener
window.addEventListener('resize', function () {
    if (this.innerWidth > 576) {
        searchButtonIcon.classList.replace('bx-x', 'bx-search');
        searchForm.classList.remove('show');
    }
});

// Dark mode switch functionality
const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
    if (this.checked) {
        document.body.classList.add('dark');
    } else {
        document.body.classList.remove('dark');
    }
});

// Code for fetching and processing CSV data using Fetch API
window.onload = function () {
    fetch('http://localhost:8080/dark_patterns.csv') // Fetch the CSV file named 'dark_patterns.csv'
        .then(response => response.text()) // Convert the response to text
        .then(data => { // Process the text data
            // Parse the CSV data
            const rows = data.split('\n');
            const headers = rows[0].split(',');
            const jsonData = [];

            for (let i = 1; i < rows.length; i++) {
                const rowData = rows[i].split(',');
                const entry = {};
                for (let j = 0; j < headers.length; j++) {
                    entry[headers[j]] = rowData[j];
                }
                jsonData.push(entry);
            }

            console.log('Fetched Data:', jsonData);

            let newDarkPatternsCount = 0;
            let uniqueWebsites = new Set(); // Using a Set to store unique websites

            jsonData.forEach((row, index) => {
                // Skip the header row and empty rows
                if (index !== 0 && Object.values(row).filter(Boolean).length > 0) {
                    // Assuming the website page column is at index 6
                    if (row['Website Page']) {
                        newDarkPatternsCount++;
                        // Extract the domain name from the URL
                        const domain = extractDomain(row['Website Page']);
                        uniqueWebsites.add(domain); // Store the domain name
                    }
                }
            });

            // Total records in the dataset
            const totalRecords = 1818;

            // New data patterns count
            const newDataPatternsCount = totalRecords;

            // Update the HTML elements with the calculated counts
            document.getElementById('newDarkPatterns').innerHTML = `<h3>1818</h3><p>New Data Patterns</p>`;
            document.getElementById('websites').innerHTML = `<h3>${uniqueWebsites.size}</h3><p>Websites</p>`;
            document.getElementById('totalDetection').innerHTML = `<h3>${totalRecords}</h3><p>Total Records</p>`;

            // Calculate the percentage for each category
            const categories = new Set();
            jsonData.forEach(entry => {
                categories.add(entry['Pattern Category']);
            });

            const categoryPercentages = [];
            categories.forEach(category => {
                const categoryCount = jsonData.filter(entry => entry['Pattern Category'] === category).length;
                const categoryPercentage = (categoryCount / jsonData.length) * 100;
                const categoryPercentageString = `${category}: ${categoryPercentage.toFixed(2)}%`; // Concatenate name and percentage
                categoryPercentages.push(categoryPercentageString);
            });

            updatePercentageInList(jsonData);


            // Populate the HTML table with the dataset
            const tableBody = document.querySelector('.order table tbody'); // Select the table within the ".order" section

            jsonData.forEach(data => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>
                        <img src="img/people.jpg">
                        <p>${extractDomain(data['Website Page'])}</p>
                    </td>
                    <td>${data['Pattern Category']}</td>
                    <td><span class="status">${data['Where in website?']}</span></td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Error loading the CSV file:', error)); // Handle errors
};


// Update the percentages dynamically within the list items
function updatePercentageInList(data) {
    const categories = {}; // Object to store categories and their counts
    const todoList = document.querySelector('.todo-list');

    // Count occurrences of each category
    data.forEach(entry => {
        const category = entry['Pattern Category'];
        categories[category] = categories[category] ? categories[category] + 1 : 1;
    });

    // Clear the existing list items
    todoList.innerHTML = '';

    Object.keys(categories).forEach(category => {
        const count = categories[category];
        const percentage = (count / data.length) * 100;

        // Create a new list item
        const listItem = document.createElement('li');
        listItem.classList.add(percentage >= 50 ? 'completed' : 'not-completed'); // You can adjust this based on your logic

        // Update the HTML content of the list item
        listItem.innerHTML = `
            <p>${percentage.toFixed(2)}%</p>
            <i class='bx bx-dots-vertical-rounded'></i>
        `;

        // Append the list item to the todo list
        todoList.appendChild(listItem);
    });
}






// Function to extract domain name from URL
function extractDomain(url) {
    // Remove protocol (http:// or https://) and www (if present)
    let domain = url.replace(/(^\w+:|^)\/\/(www\.)?/, '');
    // Extract domain name from the remaining URL
    domain = domain.split('/')[0];
    return domain;
}

