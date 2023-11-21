// Load employee data from JSON file
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

        shifts.forEach((shift) => {
          const employeeId = shift.querySelector("employeeId").textContent;
          const day = shift.querySelector("day").textContent;
          const startTime = shift.querySelector("startTime").textContent;
          const endTime = shift.querySelector("endTime").textContent;

          const employee = employeeData.employees.find((emp) => emp.id.toString() === employeeId);

          if (employee) {
            const scheduleInfo = `
              <p>${employee.name} (${employee.position}, ${employee.department})</p>
              <p>Day: ${day}</p>
              <p>Shift: ${startTime} - ${endTime}</p>
              <hr>
            `;
            scheduleReportDiv.innerHTML += scheduleInfo;
          }
        });
      })
      .catch(error => console.error('Error loading schedule data:', error));
  })
