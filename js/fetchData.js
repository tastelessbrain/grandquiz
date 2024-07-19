const axios = require('axios');


// get data from endpoint and store it in var data
async function fetchData() {
    try {
        var response = await axios.get('http://localhost:3000/CombinedData');
        var fetchedData = response.data;
        // console.log(fetchedData);
        // Use the 'answers' variable as needed
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    return fetchedData
}