import { API_URL } from "../config";

const API_BASE_URL = `${API_URL}/api`;

export const api = {
  // Health check
  health: () => fetch(`${API_BASE_URL}/health`).then((res) => res.json()),

  // Students
  getStudents: () =>
    fetch(`${API_BASE_URL}/students`).then((res) => res.json()),

  addStudent: (studentData) =>
    fetch(`${API_BASE_URL}/students`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(studentData),
    }).then((res) => res.json()),

  checkInStudent: (studentId) =>
    fetch(`${API_BASE_URL}/students/${studentId}/checkin`, {
      method: "POST",
    }).then((res) => res.json()),

  checkOutStudent: (studentId) =>
    fetch(`${API_BASE_URL}/students/${studentId}/checkout`, {
      method: "POST",
    }).then((res) => res.json()),

  // Statistics
  getAttendanceStats: () =>
    fetch(`${API_BASE_URL}/attendance/stats`).then((res) => res.json()),
  getClassStats: () =>
    fetch(`${API_BASE_URL}/classes/stats`).then((res) => res.json()),
  getWeeklyData: () =>
    fetch(`${API_BASE_URL}/attendance/weekly`).then((res) => res.json()),
};
