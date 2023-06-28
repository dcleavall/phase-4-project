import React from "react";

const Dashboard = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const startDay = new Date(currentYear, currentMonth, 1).getDay();

  const renderCalendarRows = () => {
    const calendarRows = [];
    let calendarRow = [];
    let dayCounter = 1;

    // Add empty cells for days before the start of the month
    for (let i = 0; i < startDay; i++) {
      calendarRow.push(
        <td key={`empty-${i}`}>
          <div className="w-full flex justify-center">
            <span className="text-base font-medium text-center text-gray-800 dark:text-gray-100">
              &nbsp;
            </span>
          </div>
        </td>
      );
    }

    // Add cells for each day of the month
    for (let i = startDay; i < 7; i++) {
      calendarRow.push(
        <td key={`day-${dayCounter}`}>
          <div className="w-full flex justify-center">
            <button
              className={`focus:outline-none flex items-center justify-center h-8 w-8 rounded-full ${
                currentDay === dayCounter ? "bg-blue-500 text-white" : "bg-gray-300"
              }`}
            >
              {dayCounter}
            </button>
          </div>
        </td>
      );

      dayCounter++;

      if (dayCounter > daysInMonth) {
        calendarRows.push(
          <tr key={`row-${calendarRows.length}`}>{calendarRow}</tr>
        );
        break;
      }
    }

    // Add remaining rows
    while (dayCounter <= daysInMonth) {
      calendarRow = [];

      for (let i = 0; i < 7; i++) {
        if (dayCounter > daysInMonth) {
          calendarRow.push(
            <td key={`empty-${dayCounter}`} colSpan={7 - i}>
              <div className="w-full flex justify-center">
                <span className="text-base font-medium text-center text-gray-800 dark:text-gray-100">
                  &nbsp;
                </span>
              </div>
            </td>
          );
          break;
        }

        calendarRow.push(
          <td key={`day-${dayCounter}`}>
            <div className="w-full flex justify-center">
              <button
                className={`focus:outline-none flex items-center justify-center h-8 w-8 rounded-full ${
                  currentDay === dayCounter ? "bg-blue-500 text-white" : "bg-gray-300"
                }`}
              >
                {dayCounter}
              </button>
            </div>
          </td>
        );

        dayCounter++;
      }

      calendarRows.push(
        <tr key={`row-${calendarRows.length}`}>{calendarRow}</tr>
      );
    }

    return calendarRows;
  };

  return (
    <div className="flex items-center justify-center py-8 px-4">
      <div className="max-w-sm w-full shadow-lg">
        <div className="md:p-8 p-5 dark:bg-gray-800 bg-white rounded-t">
          <div className="px-4 flex items-center justify-between">
            <span
              tabIndex="0"
              className="focus:outline-none text-base font-bold dark:text-gray-100 text-gray-800"
            >
              {currentYear}
            </span>
            <div className="flex items-center">
              <button
                aria-label="calendar backward"
                className="focus:text-gray-400 hover:text-gray-400 text-gray-800 dark:text-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-chevron-left"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <polyline points="15 6 9 12 15 18" />
                </svg>
              </button>
              <button
                aria-label="calendar forward"
                className="focus:text-gray-400 hover:text-gray-400 ml-3 text-gray-800 dark:text-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="icon icon-tabler icon-tabler-chevron-right"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                  <polyline points="9 6 15 12 9 18" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between pt-12 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th>
                    <div className="w-full flex justify-center">
                      <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">
                        Mo
                      </p>
                    </div>
                  </th>
                  {/* Add other days of the week */}
                  <th>
                    <div className="w-full flex justify-center">
                      <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">
                        Tu
                      </p>
                    </div>
                  </th>
                  {/* Add other days of the week */}
                  <th>
                    <div className="w-full flex justify-center">
                      <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">
                        We
                      </p>
                    </div>
                  </th>
                  {/* Add other days of the week */}
                  <th>
                    <div className="w-full flex justify-center">
                      <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">
                        Th
                      </p>
                    </div>
                  </th>
                  {/* Add other days of the week */}
                  <th>
                    <div className="w-full flex justify-center">
                      <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">
                        Fr
                      </p>
                    </div>
                  </th>
                  {/* Add other days of the week */}
                  <th>
                    <div className="w-full flex justify-center">
                      <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">
                        Sa
                      </p>
                    </div>
                  </th>
                  {/* Add other days of the week */}
                  <th>
                    <div className="w-full flex justify-center">
                      <p className="text-base font-medium text-center text-gray-800 dark:text-gray-100">
                        Su
                      </p>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {renderCalendarRows()}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


