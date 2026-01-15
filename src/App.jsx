import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster, toast } from "react-hot-toast";
import Header from "./components/CleanHeader";
import Sidebar from "./components/CleanSidebar";
import DashboardPage from "./pages/DashboardPage";
import StudentsPage from "./pages/EnhancedStudentsPage";
import AttendancePage from "./pages/AttendancePage";
import AttendanceDashboard from "./pages/AttendanceDashboard";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import ClassesPage from "./pages/ClassesPage";
import NotificationsPage from "./pages/NotificationsPage";
import StaffPage from "./pages/StaffPage";
import LoginPage from "./pages/LoginPage";
import ErrorBoundary from "./components/ErrorBoundary";
import "./App.css";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for saved user session on app load
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error("Error parsing saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    toast.success(`Xush kelibsiz, ${userData.username}!`, {
      duration: 4000,
      position: "top-right",
      style: {
        background: "#10B981",
        color: "#fff",
        borderRadius: "8px",
      },
      icon: "👋",
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    toast.success("Tizimdan muvaffaqiyatli chiqildi", {
      duration: 3000,
      position: "top-right",
      style: {
        background: "#004A77",
        color: "#fff",
        borderRadius: "8px",
      },
      icon: "👋",
    });
  };

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div
            className="w-8 h-8 border-4 border-t-transparent rounded-full animate-spin"
            style={{ borderColor: "#004A7733", borderTopColor: "#004A77" }}
          ></div>
          <span className="text-gray-600">Yuklanmoqda...</span>
        </div>
      </div>
    );
  }

  // Show login page if user is not authenticated
  if (!user) {
    return (
      <>
        <LoginPage onLogin={handleLogin} />
        <Toaster />
      </>
    );
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <div className="flex h-screen bg-gray-50 overflow-hidden">
          <Sidebar />

          <div className="flex-1 flex flex-col overflow-hidden">
            <Header user={user} onLogout={handleLogout} />
            <main className="flex-1 overflow-y-auto">
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/students" element={<StudentsPage />} />
                <Route path="/staff" element={<StaffPage />} />
                <Route path="/attendance" element={<AttendancePage />} />
                <Route
                  path="/attendance/dashboard"
                  element={<AttendanceDashboard />}
                />
                <Route path="/classes" element={<ClassesPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/reports" element={<ReportsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </main>
          </div>
        </div>
        <Toaster />
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
