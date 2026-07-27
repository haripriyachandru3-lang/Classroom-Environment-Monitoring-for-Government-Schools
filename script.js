let classroomData = [];

// Load JSON Data
fetch("data.json")
    .then(response => response.json())
    .then(data => {
        classroomData = data;
        displayTable(classroomData);
        updateSummary(classroomData);
    })
    .catch(error => {
        console.error("Error loading JSON:", error);
    });

// Display Table
function displayTable(data) {

    const tableBody = document.getElementById("tableBody");
    tableBody.innerHTML = "";

    document.getElementById("recordCount").textContent = data.length;
    document.getElementById("totalReadings").textContent = data.length;

    data.forEach(reading => {

        let status = "Normal";

        // Detect faulty sensor readings
        if (
            reading.temperature_c === null ||
            reading.temperature_c < 0 ||
            reading.temperature_c > 50 ||
            reading.air_quality < 0 ||
            reading.air_quality > 500
        ) {
            status = "Sensor Fault";
        }
        else if (
            reading.temperature_c >= 35 ||
            reading.air_quality >= 150
        ) {
            status = "Critical";
        }
        else if (
            reading.temperature_c >= 30 ||
            reading.air_quality >= 100
        ) {
            status = "Warning";
        }

        tableBody.innerHTML += `
        <tr>
            <td>${reading.reading_id}</td>
            <td>${reading.room_id}</td>
            <td>${reading.temperature_c ?? "N/A"} °C</td>
            <td>${reading.air_quality}</td>
            <td>${reading.period}</td>
            <td>${reading.recorded_at}</td>

            <td class="${status === "Sensor Fault" ? "fault" : status.toLowerCase()}">
                ${status}
            </td>

            <td>
                <button onclick="viewDetails(${reading.reading_id})">
                    View
                </button>
            </td>
        </tr>
        `;
    });
}

// Update Summary Cards
function updateSummary(data) {

    let totalTemp = 0;
    let totalAir = 0;

    let validTemp = 0;
    let validAir = 0;

    let critical = 0;

    data.forEach(reading => {

        // Count only valid temperatures
        if (
            reading.temperature_c !== null &&
            reading.temperature_c >= 0 &&
            reading.temperature_c <= 50
        ) {
            totalTemp += reading.temperature_c;
            validTemp++;
        }

        // Count only valid air quality
        if (
            reading.air_quality >= 0 &&
            reading.air_quality <= 500
        ) {
            totalAir += reading.air_quality;
            validAir++;
        }

        // Critical count
        if (
            reading.temperature_c !== null &&
            reading.temperature_c >= 35 &&
            reading.temperature_c <= 50
        ) {
            critical++;
        }

        if (
            reading.air_quality >= 150 &&
            reading.air_quality <= 500
        ) {
            critical++;
        }

    });

    // Valid Sensor Readings
    document.getElementById("validReadings").textContent = validTemp;

    // Average Air Quality
    document.getElementById("avgAir").textContent =
        validAir ? (totalAir / validAir).toFixed(0) : "N/A";

    // Critical Rooms
    document.getElementById("criticalCount").textContent = critical;

    // Total Readings
    document.getElementById("totalReadings").textContent = data.length;

    // Average Temperature
    document.getElementById("currentAverage").textContent =
        validTemp ? (totalTemp / validTemp).toFixed(1) + " °C" : "N/A";
}

// Live Search
document.getElementById("searchInput").addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const filtered = classroomData.filter(reading =>
        reading.room_id.toLowerCase().includes(value)
    );

    displayTable(filtered);
    updateSummary(filtered);

});

// Room Filter
document.getElementById("roomFilter").addEventListener("change", function () {

    const value = this.value;

    if (value === "") {
        displayTable(classroomData);
        updateSummary(classroomData);
        return;
    }

    const filtered = classroomData.filter(reading =>
        reading.room_id === value
    );

    displayTable(filtered);
    updateSummary(filtered);

});

// View Details
function viewDetails(id) {

    const reading = classroomData.find(item => item.reading_id == id);

    document.getElementById("dId").textContent = reading.reading_id;
    document.getElementById("dRoom").textContent = reading.room_id;
    document.getElementById("dTemp").textContent = (reading.temperature_c ?? "N/A") + " °C";
    document.getElementById("dAir").textContent = reading.air_quality;
    document.getElementById("dPeriod").textContent = reading.period;
    document.getElementById("dTime").textContent = reading.recorded_at;

    let status = "Normal";

    if (
        reading.temperature_c === null ||
        reading.temperature_c < 0 ||
        reading.temperature_c > 50 ||
        reading.air_quality < 0 ||
        reading.air_quality > 500
    ) {
        status = "Sensor Fault";
    }
    else if (
        reading.temperature_c >= 35 ||
        reading.air_quality >= 150
    ) {
        status = "Critical";
    }
    else if (
        reading.temperature_c >= 30 ||
        reading.air_quality >= 100
    ) {
        status = "Warning";
    }

    document.getElementById("dStatus").textContent = status;

    document.getElementById("popup").style.display = "flex";
}

// Close Popup
document.getElementById("closeBtn").addEventListener("click", function () {

    document.getElementById("popup").style.display = "none";

});

// Close Popup when clicking outside
window.addEventListener("click", function (event) {

    const popup = document.getElementById("popup");

    if (event.target === popup) {
        popup.style.display = "none";
    }

});
