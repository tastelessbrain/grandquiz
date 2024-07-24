import axios from "axios"


// get data from endpoint and store it in var data
export async function fetchData() {
    try {
        var response = await axios.get('http://localhost:3000/GetData');
        var fetchedData = response.data;
        // console.log(fetchedData);
        // Use the 'answers' variable as needed
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    return fetchedData
}