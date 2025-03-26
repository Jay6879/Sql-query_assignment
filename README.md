# Atlan Frontend Assignment

A React-based SQL query simulator that allows users to execute predefined queries on JSON data and visualize the results in a dynamic table format.

## Features

- **Predefined Queries**: A collection of SQL-like queries for different data tables (categories, products, employees, customers)
- **Dynamic Table Display**: Results are shown in a responsive table that automatically adapts to the data structure
- **Query Randomization**: Results can be randomized using the "Run Query" button
- **Real-time Query Editing**: Users can modify queries in the SQL input textarea
- **Reset Functionality**: Clear results and query input with the "Reset Results" button
- **Loading State**: Shows loading indicator while data is being fetched
- **Result Count**: Displays the number of results being shown

## Project Structure

```
src/
├── components/
│   ├── DynamicTable.jsx    # Handles table rendering with dynamic columns
│   ├── QueryControls.jsx   # Query selection and SQL input controls
│   ├── QueryExecutor.jsx   # Query execution button
│   └── QueryResult.jsx     # Results display component
├── App.jsx                 # Main application component
├── App.css                 # Application styles
└── main.jsx               # Application entry point

public/
├── categories.json        # Categories data
├── products.json         # Products data
├── employees.json        # Employees data
└── customers.json        # Customers data
```

## How It Works

1. **Data Loading**:
   - On application start, JSON data is fetched from multiple files in the public directory
   - Data is stored in the application state using the `jsonData` state variable

2. **Query System**:
   - Predefined queries are created using `useMemo` to prevent unnecessary recalculations
   - Each query contains:
     - `label`: Display name in the dropdown
     - `query`: SQL-like query string
     - `data`: Transformed data based on the query

3. **Query Execution**:
   - When a query is selected from the dropdown:
     - The SQL input is updated with the query string
     - The display data is updated with the query's data
   - When "Run Query" is clicked:
     - The current query's data is randomized using the Fisher-Yates shuffle algorithm
     - The randomized data is displayed in the table

4. **Table Display**:
   - The `DynamicTable` component automatically:
     - Flattens nested objects in the data
     - Generates table headers based on the data structure
     - Renders rows with the flattened data

## Available Queries

1. **Categories**:
   - `SELECT * FROM categories`
   - `SELECT categoryName, description FROM categories`

2. **Products**:
   - `SELECT * FROM products`
   - `SELECT name, unitPrice, unitsInStock FROM products`
   - `SELECT name, unitPrice, unitsInStock FROM products WHERE unitPrice > 20`

3. **Employees**:
   - `SELECT * FROM employees`
   - `SELECT firstName, lastName, title FROM employees`

4. **Customers**:
   - `SELECT * FROM customers`
   - `SELECT companyName, contactName, contactTitle FROM customers`
   - `SELECT companyName, contactName, address.city, address.country FROM customers`

## Setup and Running

1. **Prerequisites**:
   - Node.js (v14 or higher)
   - npm (v6 or higher)

2. **Installation**:
   ```bash
   # Clone the repository
   git clone <repository-url>
   cd atlan-project01

   # Install dependencies
   npm install
   ```

3. **Running the Application**:
   ```bash
   # Start development server
   npm run dev

   # Build for production
   npm run build

   # Preview production build
   npm run preview
   ```

4. **Accessing the Application**:
   - Development: Open `http://localhost:5173` in your browser
   - Production: Open `http://localhost:4173` after running `npm run preview`

## Technical Details

- Built with React and Vite
- Uses modern React features (hooks, functional components)
- Implements responsive design
- Handles nested JSON data structures
- Provides real-time query execution and result display

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
