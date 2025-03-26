import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

// Helper function to shuffle an array (Fisher-Yates algorithm)
function shuffleArray(array) {
  const newArray = array.slice(); // create a copy
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function App() {
  // State to hold JSON data from multiple files
  const [jsonData, setJsonData] = useState({
    categories: [],
    products: [],
    employees: [],
    customers: [],
  });
  const [loading, setLoading] = useState(true);
  // State for the data to display (which can be shuffled)
  const [displayData, setDisplayData] = useState([]);

  // Fetch JSON data concurrently on mount
  useEffect(() => {
    Promise.all([
      fetch('/categories.json').then((res) => res.json()),
      fetch('/products.json').then((res) => res.json()),
      fetch('/employees.json').then((res) => res.json()),
      fetch('/customers.json').then((res) => res.json()),
    ])
      .then(([categoriesData, productsData, employeesData, customersData]) => {
        setJsonData({
          categories: categoriesData,
          products: productsData,
          employees: employeesData,
          customers: customersData,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading JSON data:', error);
        setLoading(false);
      });
  }, []);

  // Define multiple dummy queries using the loaded JSON data.
  // Adjust the conditions as needed.
  const queries = useMemo(() => {
    return [
      {
        label: 'SELECT * FROM categories',
        query: 'SELECT * FROM categories',
        data: jsonData.categories,
      },
      {
        label: 'SELECT categoryName, description FROM categories',
        query: 'SELECT categoryName, description FROM categories',
        data: jsonData.categories.map((row) => ({
          categoryName: row.categoryName,
          description: row.description,
        })),
      },
      {
        label: 'SELECT * FROM products',
        query: 'SELECT * FROM products',
        data: jsonData.products,
      },
      {
        label: 'SELECT name, unitPrice, unitsInStock FROM products',
        query: 'SELECT name, unitPrice, unitsInStock FROM products',
        data: jsonData.products.map((row) => ({
          name: row.name,
          unitPrice: row.unitPrice,
          unitsInStock: row.unitsInStock,
        })),
      },
      {
        label: 'SELECT name, unitPrice, unitsInStock FROM products WHERE unitPrice > 20',
        query: 'SELECT name, unitPrice, unitsInStock FROM products WHERE unitPrice > 20',
        data: jsonData.products
          .filter((row) => {
            const price = parseFloat(row.unitPrice);
            // For debugging: uncomment the next line to log prices
            // console.log(row.ProductName, price);
            return price > 20;
          })
          .map((row) => ({
            name: row.name,
            unitPrice: row.unitPrice,
            unitsInStock: row.unitsInStock,
          })),
      },
      {
        label: 'SELECT * FROM employees',
        query: 'SELECT * FROM employees',
        data: jsonData.employees,
      },
      {
        label: 'SELECT firstName, lastName, title FROM employees',
        query: 'SELECT firstName, lastName, title FROM employees',
        data: jsonData.employees.map((row) => ({
          firstName: row.firstName,
          lastName: row.lastName,
          title: row.title,
        })),
      },
      {
        label: 'SELECT * FROM customers',
        query: 'SELECT * FROM customers',
        data: jsonData.customers,
      },
      {
        label: 'SELECT companyName, contactName, contactTitle FROM customers',
        query: 'SELECT companyName, contactName, contactTitle FROM customers',
        data: jsonData.customers.map((row) => ({
          companyName: row.companyName,
          contactName: row.contactName,
          contactTitle: row.contactTitle,
        })),
      },
      {
        label: 'SELECT companyName, contactName, address.city, address.country FROM customers',
        query: 'SELECT companyName, contactName, address.city, address.country FROM customers',
        data: jsonData.customers.map((row) => ({
          companyName: row.companyName,
          contactName: row.contactName,
          'address.city': row.address.city,
          'address.country': row.address.country,
        })),
      },
    ];
  }, [jsonData]);

  // State for selected query and SQL text area content
  const [selectedQueryIndex, setSelectedQueryIndex] = useState(0);
  const [sqlInput, setSqlInput] = useState('');

  // When queries update, initialize SQL text area and displayData with first query's data
  useEffect(() => {
    if (queries.length > 0) {
      setSqlInput(queries[0].query);
      setDisplayData(queries[0].data);
    }
  }, [queries]);

  // Handler for query dropdown change
  const handleQueryChange = (e) => {
    const index = parseInt(e.target.value, 10);
    setSelectedQueryIndex(index);
    setSqlInput(queries[index].query);
    // Reset displayData to the unshuffled data for the new query
    setDisplayData(queries[index].data);
  };

  // Handler for text area changes (if the user edits the SQL text)
  const handleInputChange = (e) => {
    setSqlInput(e.target.value);
  };

  // When "Run Query" is clicked, randomize the results from the current query
  const runQuery = () => {
    const currentData = queries[selectedQueryIndex].data;
    const randomized = shuffleArray(currentData);
    setDisplayData(randomized);
  };

  return (
    <div className="app-container">
      <h1>Atlan SQL Project</h1>
      {loading ? (
        <div className="loading">Loading data...</div>
      ) : (
        <>
          <div className="query-controls">
            <div className="form-group">
              <label htmlFor="querySelect">Select a Predefined Query:</label>
              <select id="querySelect" value={selectedQueryIndex} onChange={handleQueryChange}>
                {queries.map((q, index) => (
                  <option key={index} value={index}>
                    {q.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="sqlInput">SQL Query:</label>
              <textarea
                id="sqlInput"
                rows="4"
                value={sqlInput}
                onChange={handleInputChange}
              />
            </div>
          </div>

          <div className="query-actions">
            <button onClick={runQuery} style={{ background: 'linear-gradient(135deg, #2563eb, #3b82f6)' }}>
              <span>Run Query</span>
            </button>
            <button 
              onClick={() => {
                setDisplayData([]); // Clear the table data
                setSqlInput(''); // Clear the SQL input
              }} 
              style={{ 
                background: 'linear-gradient(135deg, #64748b, #94a3b8)',
                opacity: displayData.length === 0 ? 0.7 : 1
              }}
            >
              <span>Reset Results</span>
            </button>
          </div>

          <div className="table-container">
            <DynamicTable data={displayData} />
          </div>
          <div className="result-count">
            Showing {displayData.length} results
          </div>
        </>
      )}
    </div>
  );
}

// A helper component to render a table from an array of objects
function DynamicTable({ data }) {
  if (!data || data.length === 0) return <p>No data available.</p>;
  
  // Helper function to flatten nested objects
  const flattenObject = (obj, prefix = '') => {
    return Object.keys(obj).reduce((acc, key) => {
      const pre = prefix.length ? prefix + '.' : '';
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        Object.assign(acc, flattenObject(obj[key], pre + key));
      } else if (Array.isArray(obj[key])) {
        acc[pre + key] = obj[key].join(', ');
      } else {
        acc[pre + key] = obj[key];
      }
      return acc;
    }, {});
  };

  // Flatten the first row to get headers
  const firstRow = flattenObject(data[0]);
  const headers = Object.keys(firstRow);

  return (
    <table>
      <thead>
        <tr>
          {headers.map((header, idx) => (
            <th key={idx}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => {
          const flattenedRow = flattenObject(row);
          return (
            <tr key={rowIndex}>
              {headers.map((header, idx) => (
                <td key={idx}>{flattenedRow[header]}</td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default App;
