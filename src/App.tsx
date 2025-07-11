import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import CustomerForm from './components/CustomerForm';
import CustomerList from './components/CustomerList';
import EmployeeForm from './components/EmployeeForm';
import EmployeeList from './components/EmployeeList';
import EmployeeAttendance from './components/EmployeeAttendance';
import EmployeePerformance from './components/EmployeePerformance';
import CarpetForm from './components/CarpetForm';
import CarpetList from './components/CarpetList';
import CarpetTracking from './components/CarpetTracking';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Header />
        <Navigation />
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/add-customer" element={<CustomerForm />} />
            <Route path="/customers" element={<CustomerList />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/add-employee" element={<EmployeeForm />} />
            <Route path="/attendance" element={<EmployeeAttendance />} />
            <Route path="/performance" element={<EmployeePerformance />} />
            <Route path="/carpets" element={<CarpetList />} />
            <Route path="/add-carpet" element={<CarpetForm />} />
            <Route path="/carpet-tracking" element={<CarpetTracking />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
