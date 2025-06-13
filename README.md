# Carwash Customer & Employee Management System

A comprehensive React application for managing customers, employees, and carpet cleaning services at your carwash business.

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

### Carpet Management
- **Carpet Job Registration**: Register carpet cleaning jobs with detailed specifications
- **Carpet Tracking**: Real-time status tracking from drop-off to delivery
- **Employee Workload Management**: Assign and track carpet cleaning jobs by employee
- **Service Customization**: Multiple cleaning, drying, and protection service options
- **Pricing Calculator**: Automatic pricing based on size, services, and materials
- **Status Management**: Track progress through pending → in-progress → cleaning → drying → completed → delivered
- **Export Functionality**: Export carpet job data to CSV

### Dashboard
- **Customer Statistics**: Total customers, visits, and averages
- **Employee Statistics**: Total employees, daily attendance, and active jobs
- **Carpet Statistics**: Total carpets, today's jobs, in-progress work, and revenue
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
   
3. **Assign Work**: When adding customers or carpets, select an employee from present staff
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

### Carpet Management Workflow
1. **Add Carpet Job**: Use "Add Carpet" form
   - Select existing customer from database
   - Assign present employee for the job
   - Enter carpet details (type, size, material, color, condition)
   - Select cleaning services (basic, deep, stain removal, sanitization)
   - Choose drying method (air dry, dehumidifier, fan-assisted)
   - Add protection services (stain guard, anti-microbial)
   - Set deposit amount
   - Automatic pricing calculation

2. **Track Carpet Progress**: Use "Carpet Tracking" dashboard
   - View all active carpet jobs
   - Filter by employee workload
   - Update job status in real-time
   - Monitor completion timelines

3. **Manage Carpet Jobs**: Use "Carpets" list view
   - View all carpet jobs with detailed information
   - Search and filter by status, material, color, type
   - Update job status
   - Export carpet job data to CSV

4. **Status Progression**:
   - **Pending**: Job registered, waiting to start
   - **In Progress**: Work has begun
   - **Cleaning**: Active cleaning process
   - **Drying**: Carpet is drying
   - **Completed**: Cleaning finished, ready for pickup
   - **Delivered**: Customer has picked up the carpet

## Carpet Service Options

### Cleaning Services
- **Basic Cleaning**: Standard carpet cleaning ($25 base)
- **Deep Cleaning**: Intensive cleaning for heavily soiled carpets ($45 base)
- **Stain Removal**: Specialized stain treatment ($35 base)
- **Sanitization**: Anti-bacterial treatment ($30 base)

### Drying Services
- **Air Dry**: Natural drying (no additional cost)
- **Dehumidifier**: Accelerated drying with dehumidifier ($15)
- **Fan Assisted**: Fan-assisted drying ($10)

### Protection Services
- **No Protection**: Standard service (no additional cost)
- **Stain Guard**: Stain-resistant treatment ($25)
- **Anti-Microbial**: Anti-microbial protection ($20)

### Carpet Types
- Area Rug, Runner, Oriental, Berber, Shag, Other

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
- **Data Management**: Modular storage utilities for customers, employees, and carpets

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile responsive design

## Security Notes
- National ID images are stored locally in the browser
- No data is transmitted to external servers
- Consider implementing proper security measures for production use

## Support
For issues or questions, please refer to the application's built-in help features or contact your system administrator.

## Recent Updates
- **Carpet Management Module**: Added comprehensive carpet cleaning service management
- **Enhanced Dashboard**: Integrated carpet statistics and quick actions
- **Improved Navigation**: Added carpet management navigation links
- **Status Tracking**: Real-time carpet job status management
- **Pricing Calculator**: Automatic pricing based on services and carpet size
