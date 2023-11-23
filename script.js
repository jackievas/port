document.addEventListener('DOMContentLoaded', () => {
  // Fetch employee data
  fetch('employee.json')
    .then(response => response.json())
    .then(employeeData => {
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

          // Process schedule data
          xmlDoc.querySelectorAll('shift').forEach(shift => {
            const employeeId = shift.querySelector('employeeId').textContent;
            const day = shift.querySelector('day').textContent;
            const startTime = shift.querySelector('startTime').textContent;
            const endTime = shift.querySelector('endTime').textContent;

            const employee = employeeData.employees.find(emp => emp.id.toString() === employeeId);

            if (employee) {
              const employeeName = employee.name;

              // Replace spaces with underscores in the employee name for class name
              const className = employeeName.replace(/\s+/g, '_');

              // Check if the employee name has an assigned rowIndex, if not, create a new row
              if (!scheduleTable.querySelector(`.${className}`)) {
                const scheduleRow = scheduleTable.insertRow();
                scheduleRow.classList.add(className); // Add class to the row
                const nameCell = scheduleRow.insertCell(0); // Insert at the beginning
                nameCell.textContent = employeeName;

                // Create cells for all days of the week
                daysOfWeek.forEach(() => {
                  const cell = scheduleRow.insertCell();
                  cell.classList.add('scheduleCell'); // Add class to all cells
                });
              }

              // Find the index of the day and add the schedule information to the corresponding cell
              const dayIndex = daysOfWeek.indexOf(day);
              const rowClass = scheduleTable.querySelector(`.${className}`);
              const cell = rowClass.cells[dayIndex + 1]; // +1 to skip the name cell
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
