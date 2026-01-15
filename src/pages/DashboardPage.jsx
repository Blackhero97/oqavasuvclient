import { useState, useEffect } from "react";
import {
  Users,
  GraduationCap,
  CheckCircle,
  Activity,
  Clock,
} from "lucide-react";
import { API_URL } from "../config";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalStaff: 0,
    studentsPresent: 0,
    teachersPresent: 0,
    staffPresent: 0,
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    const interval = setInterval(fetchDashboardData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log("Fetching dashboard data...");
      const [employeesRes, attendanceRes] = await Promise.all([
        fetch(`${API_URL}/api/all-staff`),
        fetch(`${API_URL}/api/attendance`),
      ]);

      if (!employeesRes.ok || !attendanceRes.ok) {
        throw new Error("Network response was not ok");
      }

      const employeesData = await employeesRes.json();
      const attendanceData = await attendanceRes.json();

      console.log("Employees data:", employeesData);
      console.log("Attendance data:", attendanceData);

      const employees =
        employeesData.employees || employeesData.data || employeesData || [];
      const attendance =
        attendanceData.records || attendanceData.data || attendanceData || [];

      console.log("Processed employees:", employees.length);
      console.log("Processed attendance:", attendance.length);

      // Filter today's attendance by date field instead of timestamp
      const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
      const todayAttendance = attendance.filter(
        (record) => record.date === today
      );

      console.log("Today attendance:", todayAttendance.length, todayAttendance);

      const students = employees.filter((emp) => emp.role === "student");
      const teachers = employees.filter((emp) => emp.role === "teacher");
      const staff = employees.filter((emp) => emp.role === "staff");

      console.log(
        "Students:",
        students.length,
        "Teachers:",
        teachers.length,
        "Staff:",
        staff.length
      );

      // Match attendance records with employees by hikvisionEmployeeId
      const studentsPresent = todayAttendance.filter((record) =>
        students.some(
          (s) => s.hikvisionEmployeeId === record.hikvisionEmployeeId
        )
      ).length;

      const teachersPresent = todayAttendance.filter((record) =>
        teachers.some(
          (t) => t.hikvisionEmployeeId === record.hikvisionEmployeeId
        )
      ).length;

      const staffPresent = todayAttendance.filter((record) =>
        staff.some((s) => s.hikvisionEmployeeId === record.hikvisionEmployeeId)
      ).length;

      console.log(
        "Present today - Students:",
        studentsPresent,
        "Teachers:",
        teachersPresent,
        "Staff:",
        staffPresent
      );

      setStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalStaff: staff.length,
        studentsPresent,
        teachersPresent,
        staffPresent,
      });

      // Recent Activity
      const recentRecords = todayAttendance
        .slice(-10)
        .reverse()
        .map((record) => {
          const employee = employees.find(
            (emp) => emp.hikvisionEmployeeId === record.hikvisionEmployeeId
          );
          return {
            id: record._id,
            name: employee?.name || record.name || "Unknown",
            role: employee?.role || record.role || "unknown",
            action: record.lastCheckOut ? "Chiqdi" : "Kirdi", // If has checkout, show last action as checkout
            time: record.lastCheckOut
              ? record.lastCheckOut
              : record.firstCheckIn,
            avatar:
              employee?.name?.substring(0, 2).toUpperCase() ||
              record.name?.substring(0, 2).toUpperCase() ||
              "?",
          };
        });

      setRecentActivity(recentRecords);
    } catch (error) {
      console.error("Dashboard ma'lumotlarini olishda xatolik:", error);
    }
  };

  const currentTime = new Date().toLocaleString("uz-UZ", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600">{currentTime}</p>
          </div>
        </div>

        {/* Красивые карточки статистики рядом */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 w-full">
          {/* Students Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm hover:shadow-md transition-all duration-200 min-h-[120px] lg:min-h-[140px] flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3 lg:mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">
                  O'quvchilar
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-2">
                  {stats.totalStudents}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Bugun:{" "}
                  <span className="font-semibold text-blue-600">
                    {stats.studentsPresent}/{stats.totalStudents}
                  </span>
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-blue-50 rounded-xl flex-shrink-0 ml-2">
                <Users className="w-5 h-5 lg:w-6 lg:h-6 text-blue-600" />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    stats.totalStudents > 0
                      ? (stats.studentsPresent / stats.totalStudents) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
          {/* Teachers Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm hover:shadow-md transition-all duration-200 min-h-[120px] lg:min-h-[140px] flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3 lg:mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">
                  O'qituvchilar
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-2">
                  {stats.totalTeachers}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Bugun:{" "}
                  <span className="font-semibold text-green-600">
                    {stats.teachersPresent}/{stats.totalTeachers}
                  </span>
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-green-50 rounded-xl flex-shrink-0 ml-2">
                <GraduationCap className="w-5 h-5 lg:w-6 lg:h-6 text-green-600" />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    stats.totalTeachers > 0
                      ? (stats.teachersPresent / stats.totalTeachers) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
          {/* Staff Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm hover:shadow-md transition-all duration-200 min-h-[120px] lg:min-h-[140px] flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3 lg:mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">
                  Xodimlar
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-2">
                  {stats.totalStaff}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Bugun:{" "}
                  <span className="font-semibold text-purple-600">
                    {stats.staffPresent}/{stats.totalStaff}
                  </span>
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-purple-50 rounded-xl flex-shrink-0 ml-2">
                <CheckCircle className="w-5 h-5 lg:w-6 lg:h-6 text-purple-600" />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${
                    stats.totalStaff > 0
                      ? (stats.staffPresent / stats.totalStaff) * 100
                      : 0
                  }%`,
                }}
              ></div>
            </div>
          </div>
          {/* Overall Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 lg:p-6 shadow-sm hover:shadow-md transition-all duration-200 min-h-[120px] lg:min-h-[140px] flex flex-col justify-between">
            <div className="flex items-start justify-between mb-3 lg:mb-4">
              <div className="flex-1 min-w-0">
                <p className="text-xs lg:text-sm font-medium text-gray-600 mb-1">
                  Jami Faollik
                </p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1 lg:mb-2">
                  {stats.studentsPresent +
                    stats.teachersPresent +
                    stats.staffPresent}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Kirish:{" "}
                  <span className="font-semibold text-indigo-600">
                    {Math.round(
                      ((stats.studentsPresent +
                        stats.teachersPresent +
                        stats.staffPresent) /
                        Math.max(
                          stats.totalStudents +
                            stats.totalTeachers +
                            stats.totalStaff,
                          1
                        )) *
                        100
                    )}
                    %
                  </span>
                </p>
              </div>
              <div className="p-2 lg:p-3 bg-indigo-50 rounded-xl flex-shrink-0 ml-2">
                <Activity className="w-5 h-5 lg:w-6 lg:h-6 text-indigo-600" />
              </div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${Math.round(
                    ((stats.studentsPresent +
                      stats.teachersPresent +
                      stats.staffPresent) /
                      Math.max(
                        stats.totalStudents +
                          stats.totalTeachers +
                          stats.totalStaff,
                        1
                      )) *
                      100
                  )}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                <Activity className="w-5 h-5 mr-2 text-green-600" />
                So'nggi Faollik
              </h2>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div
                    key={activity.id || index}
                    className="flex items-center p-3 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold mr-3">
                      {activity.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.name}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <span className="mr-2">{activity.role}</span>
                        <span
                          className={`px-2 py-1 rounded ${
                            activity.action === "Kirdi"
                              ? "bg-green-100 text-green-700"
                              : "bg-orange-100 text-orange-700"
                          }`}
                        >
                          {activity.action}
                        </span>
                        <span className="ml-auto">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <Clock className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p>Bugun hali faollik yo'q</p>
                </div>
              )}
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
              Tizim Holati
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Davomat tizimi
                  </span>
                </div>
                <span className="text-sm text-green-600 font-medium">Faol</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Ma'lumotlar bazasi
                  </span>
                </div>
                <span className="text-sm text-green-600 font-medium">Faol</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm font-medium text-gray-700">
                    Hikvision API
                  </span>
                </div>
                <span className="text-sm text-green-600 font-medium">
                  Ulangan
                </span>
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Bugungi Statistika
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Umumiy davomat</span>
                    <span className="font-medium text-blue-600">
                      {stats.totalStudents +
                        stats.totalTeachers +
                        stats.totalStaff >
                      0
                        ? Math.round(
                            ((stats.studentsPresent +
                              stats.teachersPresent +
                              stats.staffPresent) /
                              (stats.totalStudents +
                                stats.totalTeachers +
                                stats.totalStaff)) *
                              100
                          )
                        : 0}
                      %
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Jami hodimlar</span>
                    <span className="font-medium">
                      {stats.totalStudents +
                        stats.totalTeachers +
                        stats.totalStaff}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Hozir mavjud</span>
                    <span className="font-medium text-green-600">
                      {stats.studentsPresent +
                        stats.teachersPresent +
                        stats.staffPresent}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
