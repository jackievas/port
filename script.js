document.addEventListener('DOMContentLoaded', () => {
  // Fetch employee data
  fetch('employee.json')
    .then(response => response.json())
    .then(employeeData => {
      // Update employee data for food production
      employeeData.employees.forEach(emp => {
        emp.position = 'Food Production Worker';
        emp.department = (Math.random() > 0.5) ? 'Manufacturing' : 'Warehouse';
      });

      // Display employee data in a table
      displayEmployeeTable(employeeData);

      // Fetch schedule data
      fetch('schedule.xml')
        .then(response => response.text())
        .then(scheduleData => {
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(scheduleData, 'application/xml');

          // Create a table for the schedule
          const scheduleTable = document.createElement('table');
          scheduleTable.classList.add('scheduleTable');

          // ... (rest of the existing code for the schedule table)

          // Append the table to the scheduleReportDiv
          const scheduleReportDiv = document.getElementById('scheduleReport');
          scheduleReportDiv.appendChild(scheduleTable);
        })
        .catch(error => console.error('Error loading schedule data:', error));
    })
    .catch(error => console.error('Error loading employee data:', error));
});

// Function to display employee data in a table
function displayEmployeeTable(employeeData) {
  const employeeTableContainer = document.getElementById('employeeTable');
  const employeeTable = document.createElement('table');
  employeeTable.classList.add('employeeTable');

  // Create table headers
  const tableHeaderRow = employeeTable.insertRow(0);
  const headers = ['ID', 'Name', 'Position', 'Department'];
  headers.forEach(headerText => {
    const th = document.createElement('th');
    th.textContent = headerText;
    tableHeaderRow.appendChild(th);
  });

  // Populate the table with employee data
  employeeData.employees.forEach(employee => {
    const row = employeeTable.insertRow();
    Object.values(employee).forEach(value => {
      const cell = row.insertCell();
      cell.textContent = value;
    });
  });

  // Append the employee table to the container
  employeeTableContainer.appendChild(employeeTable);
}
