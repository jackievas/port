fetch('employee.json')
  .then(response => response.json())
  .then(employeeData => {
    // Load schedule data from XML file
    fetch('schedule.xml')
      .then(response => response.text())
      .then(scheduleData => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(scheduleData, "application/xml");

        const shifts = xmlDoc.querySelectorAll("shift");
        const scheduleReportDiv = document.getElementById("scheduleReport");

        // Create a table for the schedule
        const scheduleTable = document.createElement('table');
        scheduleTable.classList.add('scheduleTable');

        // Create table headers
        const tableHeaderRow = scheduleTable.insertRow(0);
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        daysOfWeek.forEach(day => {
          const th = document.createElement('th');
          th.textContent = day;
          tableHeaderRow.appendChild(th);
        });

        const employeeIdToRowIndex = {}; // Map employeeId to rowIndex

        shifts.forEach((shift) => {
          const employeeId = shift.querySelector("employeeId").textContent;
          const day = shift.querySelector("day").textContent;
          const startTime = shift.querySelector("startTime").textContent;
          const endTime = shift.querySelector("endTime").textContent;

          const employee = employeeData.employees.find((emp) => emp.id.toString() === employeeId);

          if (employee) {
            // Check if the employeeId has an assigned rowIndex, if not, create a new row
            if (!employeeIdToRowIndex[employeeId]) {
              employeeIdToRowIndex[employeeId] = scheduleTable.rows.length;
              const scheduleRow = scheduleTable.insertRow(employeeIdToRowIndex[employeeId]);
              daysOfWeek.forEach(() => scheduleRow.insertCell());
            }

            // Find the index of the day and add the schedule information to the corresponding cell
            const dayIndex = daysOfWeek.indexOf(day);
            const rowIndex = employeeIdToRowIndex[employeeId];
            const cell = scheduleTable.rows[rowIndex].cells[dayIndex];
            cell.innerHTML += `
              <div class="scheduleItem">
                <p>${employee.name} (${employee.position}, ${employee.department})</p>
                <p>Shift: ${startTime} - ${endTime}</p>
              </div>
            `;
          }
        });

        // Append the table to the scheduleReportDiv
        scheduleReportDiv.appendChild(scheduleTable);
      })
      .catch(error => console.error('Error loading schedule data:', error));
  })
  .catch(error => console.error('Error loading employee data:', error));


