// components/Table.js

import { FaPlus, FaTimes } from 'react-icons/fa';

const Table = ({
  title,
  headers,
  rows,
  handleChange,
  removeRow,
  addItem,
  inputName,
  buttonIcon = <FaPlus />,  // Default button icon is a "+" sign
}) => {
  // Define an array to match headers to state properties
  const headerToStateKey = {
    Ingredient: 'name',
    Quantity: 'quantity',
    Unit: 'unit'
  };

  // Handle the Enter key press inside the Table component
  const handleKeyPress = (index, e) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission

      const row = rows[index];
      const isRowComplete = Object.values(row).every((value) => value !== ''); // Check if all fields are filled

      if (isRowComplete) {
        if (index === rows.length - 1) {
          addItem(); // If it's the last row, add a new row
          setTimeout(() => focusFirstInput(rows.length), 0); // Focus on the first input of the new row
        } else {
          const nextInput = document.querySelectorAll('input')[index + 3]; // Focus the next input field
          nextInput?.focus();
        }
      }
    }
  };

  // Function to focus the first input field of the new row
  const focusFirstInput = (newRowIndex) => {
    const firstInput = document.querySelector(`input[data-index='${newRowIndex}-0']`);
    if (firstInput) {
      firstInput.focus();
    }
  };

  return (
    <section aria-labelledby="table-heading" className="space-y-4">
      <h2 id="table-heading" className="text-2xl font-semibold">{title}</h2>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-500">
          <thead className="text-xs uppercase bg-gray-200">
            <tr>
              {headers.map((header, index) => (
                <th key={index} className="px-4 py-2">{header}</th>
              ))}
              <th className="px-4 py-2">
                {/* Placeholder for "remove" button column */}
                <span className="inline-block w-full" />
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((data, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    <input
                      type={typeof data === 'number' ? 'number' : 'text'}
                      name={headerToStateKey[headers[colIndex]]} // Match header to state key
                      value={data}
                      onChange={(e) => handleChange(index, e)}
                      onKeyDown={(e) => handleKeyPress(index, e)} // Handle Enter key press
                      placeholder={headers[colIndex]}
                      className="w-full bg-transparent border-b border-[var(--other-text)] outline-none"
                      data-index={`${index}-${colIndex}`} // Add data-index for targeting
                    />
                  </td>
                ))}
                <td className="px-4 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => removeRow(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Item Button */}
      <button
        type="button"
        onClick={addItem}
        className="inline-block bg-[var(--secondary-dark)] hover:bg-[var(--primary)] text-[var(--main-text)] font-medium py-2 px-4 rounded-md shadow transition mt-4"
      >
        {buttonIcon} {/* Display the passed icon */}
      </button>
    </section>
  );
};

export default Table;
