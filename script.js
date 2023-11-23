// Function to fetch JSON data
async function fetchJSONData() {
  const response = await fetch('employee.json');
  const data = await response.json();
  return data;
}

// Function to fetch XML data
async function fetchXMLData() {
  const response = await fetch('schedule.xml');
  const text = await response.text();
  const parser = new DOMParser();
  const xmlDoc = parser.parseFromString(text, 'application/xml');
  return xmlDoc;
}

// Function to create the employee information table
async function createEmployeeTable() {
  const employeeTableDiv = document.getElementById('employeeTable');
  const table = document.createElement('table');
  const headerRow = table.insertRow();

  // Fetch JSON data
  const employeeData = await fetchJSONData();

  // Create table headers
  Object.keys(employeeData.employees[0]).forEach((key) => {
    const th = document.createElement('th');
    th.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Capitalize first letter
    headerRow.appendChild(th);
  });

  // Populate employee data
  employeeData.employees.forEach((employee) => {
    const row = table.insertRow();
    Object.values(employee).forEach((value) => {
      const cell = row.insertCell();
      cell.textContent = value;
    });
  });

  employeeTableDiv.appendChild(table);
}

// Function to create the schedule table
async function createScheduleTable() {
  const scheduleTableDiv = document.getElementById('scheduleReport');
  const table = document.createElement('table');
  const headerRow = table.insertRow();

  // Fetch XML data
  const xmlDoc = await fetchXMLData();

  // Create day headers
  const days = [...xmlDoc.querySelectorAll('shift day')].map((day) => day.textContent);
  days.unshift(''); // Add an empty header for employee names
  days.forEach((day) => {
    const th = document.createElement('th');
    th.textContent = day;
    headerRow.appendChild(th);
  });

  // Fetch JSON data
  const employeeData = await fetchJSONData();

  // Create table rows for each employee
  employeeData.employees.forEach((employee) => {
    const row = table.insertRow();
    const nameCell = row.insertCell();
    nameCell.textContent = employee.name;

    // Populate shifts for each day
    days.slice(1).forEach((day) => {
      const cell = row.insertCell();
      const shift = [...xmlDoc.querySelectorAll(`shift:has(employeeId:contains("${employee.id}")):has(day:contains("${day}"))`)];
      if (shift.length > 0) {
        cell.textContent = `${shift[0].querySelector('startTime').textContent} - ${shift[0].querySelector('endTime').textContent}`;
      } else {
        cell.textContent = 'No shift';
      }
    });
  });

  scheduleTableDiv.appendChild(table);
}

// Call the functions to generate tables
createEmployeeTable();
createScheduleTable();

