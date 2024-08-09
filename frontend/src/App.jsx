import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './component/Login';
import ProtectedRoute from './component/ProtectedRoute';
import AdminDashboard from './component/AdminDashboard';
import StudentManager from './component/StudentManager';
import FacultyManager from './component/FacultyManager';
import FacultyDashboard from './component/FacultyDashboard';
import StudentDashboard from './component/StudentDashboard';
import SubjectManager from './component/SubjectManager'

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute roles={['admin']} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/admin/students" element={<StudentManager />} />
            <Route path="/admin/faculty" element={<FacultyManager />} />
            <Route path="/admin/subjects" element={<SubjectManager />} />
          </Route>
          <Route element={<ProtectedRoute roles={['student']} />}>
            <Route path="/student-dashboard" element={<StudentDashboard />} />
          </Route>
          <Route element={<ProtectedRoute roles={['faculty']} />}>
            <Route path="/faculty-dashboard" element={<FacultyDashboard />} />
          </Route>
          <Route path="/" element={<h1>Home Page</h1>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
