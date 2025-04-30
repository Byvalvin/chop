// components/Table.js

import { FaPlus, FaTimes } from 'react-icons/fa'; // We can add more icons if needed

const Table = ({
  title,
  headers,
  rows,
  handleChange,
  handleKeyPress,
  removeRow,
  addItem,
  inputName,
  buttonIcon = <FaPlus />,  // Default button icon is a "+" sign
}) => {
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
                      name={inputName}
                      value={data}
                      onChange={(e) => handleChange(index, e)}
                      onKeyDown={(e) => handleKeyPress(index, e)}
                      placeholder={headers[colIndex]}
                      className="w-full bg-transparent border-b border-[var(--other-text)] outline-none"
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
