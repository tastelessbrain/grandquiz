const express = require("express");
const sql = require("mssql");

const app = express();

// SQL Server configuration
var config = {
    "user": "project_quiz", // Database username
    "password": "12345678", // Database password
    "server": "localhost", // Server IP address
    "port": 56353,
    "database": "project_quiz", // Database name
    "options": {
        "encrypt": false, // Disable encryption
        "trustservercertificates": true
    }
}

// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("Connection Successful!");
});

// Define route for fetching data from SQL Server
app.get("/answers", (request, response) => {
    // Execute a SELECT query
    new sql.Request().query("SELECT * FROM dbo.answers", (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
        } else {
            response.send(result.recordset); // Send query result as response
            console.dir(result.recordset);
        }
    });
});

app.get("/questions", (request, response) => {
    // Execute a SELECT query
    new sql.Request().query("SELECT * FROM dbo.questions", (err, result) => {
        if (err) {
            console.error("Error executing query:", err);
        } else {
            response.send(result.recordset); // Send query result as response
            console.dir(result.recordset);
        }
    });
});

// Start the server on port 3000
app.listen(3000, () => {
    console.log("Listening on port 3000...");
});