# Carwash Customer & Employee Management System

A comprehensive React application for managing customers and employees at your carwash business.

## Features

### Customer Management
- **Customer Registration**: Capture customer contact information and vehicle details
- **Service Selection**: Choose from predefined carwash services
- **Customer Database**: View, search, and manage all customers
- **Export Functionality**: Export customer data to CSV

### Employee Management
- **Employee Registration**: Register employees with personal information and National ID image capture
- **Daily Attendance**: Mark employees as present/absent for each day
- **Work Assignment**: Assign employees to specific vehicles/customers
- **Performance Tracking**: Daily performance reports and statistics

### Dashboard
- **Customer Statistics**: Total customers, visits, and averages
- **Employee Statistics**: Total employees, daily attendance, and active jobs
- **Quick Actions**: Easy access to common tasks

## Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation
1. Clone or download the project
2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application
1. Start the development server:
   ```bash
   npm run dev
   ```
2. Open your browser and navigate to `http://localhost:5173`

### Building for Production
```bash
npm run build
```

## Usage Guide

### Employee Workflow
1. **Register Employees**: Go to "Add Employee" to register new staff members
   - Upload National ID image (required)
   - Enter personal contact information
   
2. **Mark Daily Attendance**: Use "Attendance" tab each day
   - Mark employees as present or absent
   - Add optional notes for each employee
   
3. **Assign Work**: When adding customers, select an employee from present staff
   - Only employees marked as present today will appear in the dropdown
   
4. **Track Performance**: Use "Performance" tab to view daily reports
   - See completion rates, average service times
   - Export performance data to CSV

### Customer Workflow
1. **Add Customer**: Use "Add Customer" form
   - Enter customer and vehicle information
   - Select services required
   - Assign an employee who is present today
   
2. **View Customers**: See all customers with assigned employees
   - Search by name, email, phone, or license plate
   - Export customer data including employee assignments

## Data Storage
- All data is stored locally in the browser's localStorage
- Data persists between sessions
- No external database required

## Technical Details
- **Frontend**: React 18 with TypeScript
- **Routing**: React Router
- **Styling**: CSS with responsive design
- **Build Tool**: Vite
- **Image Handling**: Base64 encoding for National ID images

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design

## Security Notes
- National ID images are stored locally in the browser
- No data is transmitted to external servers
- Consider implementing proper security measures for production use

## Support
For issues or questions, please refer to the application's built-in help features or contact your system administrator.
