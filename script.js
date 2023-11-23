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

          // Create table headers
          const tableHeaderRow = scheduleTable.insertRow(0);
          const employeeNameHeader = document.createElement('th');
          employeeNameHeader.textContent = 'Employee Name';
          tableHeaderRow.appendChild(employeeNameHeader);

          const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
          daysOfWeek.forEach(day => {
            const th = document.createElement('th');
            th.textContent = day;
            th.classList.add('dayOfWeek'); // Add class to days of the week cells
            tableHeaderRow.appendChild(th);
          });

          const employeeNameToRowIndex = {}; // Map employee name to rowIndex

          // Process schedule data
          xmlDoc.querySelectorAll('shift').forEach(shift => {
            const employeeId = shift.querySelector('employeeId').textContent;
            const day = shift.querySelector('day').textContent;
            const startTime = shift.querySelector('startTime').textContent;
            const endTime = shift.querySelector('endTime').textContent;

            const employee = employeeData.employees.find(emp => emp.id.toString() === employeeId);

            if (employee) {
              const employeeName = employee.name;

              // Check if the employee name has an assigned rowIndex, if not, create a new row
              if (!employeeNameToRowIndex[employeeName]) {
                const scheduleRow = scheduleTable.insertRow();
                const nameCell = scheduleRow.insertCell(0); // Insert at the beginning
                nameCell.textContent = `${employeeName} (${employee.position}, ${employee.department})`;
                employeeNameToRowIndex[employeeName] = scheduleRow.rowIndex;
              }

              // Find the index of the day and add the schedule information to the corresponding cell
              const dayIndex = daysOfWeek.indexOf(day);
              const rowIndex = employeeNameToRowIndex[employeeName];

              // Ensure the row has enough cells for the current day
              while (scheduleTable.rows[rowIndex].cells.length <= dayIndex) {
                scheduleTable.rows[rowIndex].insertCell();
              }

              const cell = scheduleTable.rows[rowIndex].cells[dayIndex];
              // Update the cell content without "Shift"
              cell.innerHTML += `
                <div class="scheduleItem">
                  <p>${startTime} - ${endTime}</p>
                </div>
              `;
            }
          });

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
