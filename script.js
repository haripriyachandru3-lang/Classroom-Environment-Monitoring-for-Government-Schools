let classroomData = [];

// Load JSON Data
fetch("data.json")
  .then(response => response.json())
  .then(data => {
    classroomData = data;
    displayTable(classroomData);
    updateSummary(classroomData);
  });

// Display Table
function displayTable(data) {

  const tableBody = document.getElementById("tableBody");
  tableBody.innerHTML = "";

  document.getElementById("recordCount").textContent = data.length;
  document.getElementById("totalReadings").textContent = data.length;

  data.forEach(reading => {

    let status = "";

    if (reading.temperature_c >= 35 || reading.air_quality >= 150) {
      status = "Critical";
    } else if (reading.temperature_c >= 30 || reading.air_quality >= 100) {
      status = "Warning";
    } else {
      status = "Normal";
    }

    const row = `
      <tr>
        <td>${reading.reading_id}</td>
        <td>${reading.room_id}</td>
        <td>${reading.temperature_c} °C</td>
        <td>${reading.air_quality}</td>
        <td>${reading.period}</td>
        <td>${reading.recorded_at}</td>

        <td class="${status.toLowerCase()}">
            ${status}
        </td>

        <td>
          <button onclick="viewDetails(${reading.reading_id})">
            View
          </button>
        </td>
      </tr>
    `;

    tableBody.innerHTML += row;

  });

}

// Summary Cards
function updateSummary(data) {

  let totalTemp = 0;
  let totalAir = 0;
  let critical = 0;

  data.forEach(reading => {

    totalTemp += reading.temperature_c;
    totalAir += reading.air_quality;

    if (
      reading.temperature_c >= 35 ||
      reading.air_quality >= 150
    ) {
      critical++;
    }

  });

  document.getElementById("avgTemp").textContent =
      (totalTemp / data.length).toFixed(1) + " °C";

  document.getElementById("avgAir").textContent =
      (totalAir / data.length).toFixed(0);

  document.getElementById("criticalCount").textContent =
      critical;

}

// Search
document.getElementById("searchInput")
.addEventListener("keyup", function(){

    const value = this.value.toLowerCase();

    const filtered = classroomData.filter(reading =>
        reading.room_id.toLowerCase().includes(value)
    );

    displayTable(filtered);

});

// Filter
document.getElementById("roomFilter")
.addEventListener("change", function(){

    const value = this.value;

    if(value===""){
        displayTable(classroomData);
        return;
    }

    const filtered = classroomData.filter(reading =>
        reading.room_id===value
    );

    displayTable(filtered);

});

// View Details
function viewDetails(id){

    const reading = classroomData.find(item =>
        item.reading_id==id
    );

    document.getElementById("dId").textContent =
        reading.reading_id;

    document.getElementById("dRoom").textContent =
        reading.room_id;

    document.getElementById("dTemp").textContent =
        reading.temperature_c + " °C";

    document.getElementById("dAir").textContent =
        reading.air_quality;

    document.getElementById("dPeriod").textContent =
        reading.period;

    document.getElementById("dTime").textContent =
        reading.recorded_at;

    let status="Normal";

    if(reading.temperature_c>=35 ||
       reading.air_quality>=150){

        status="Critical";

    }
    else if(reading.temperature_c>=30 ||
            reading.air_quality>=100){

        status="Warning";

    }

    document.getElementById("dStatus").textContent =
        status;

    document.getElementById("popup").style.display="flex";

}

// Close Popup
document.getElementById("closeBtn")
.addEventListener("click",function(){

    document.getElementById("popup").style.display="none";

});

// Close Popup on Outside Click
window.onclick=function(event){

    const popup=document.getElementById("popup");

    if(event.target===popup){

        popup.style.display="none";

    }

}
