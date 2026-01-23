import React, { useState } from "react";
import {
  BarChart3,
  Download,
  TrendingUp,
  Users,
  UserCheck,
  Clock,
  Calendar,
  FileText,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ReportsPage = () => {
  const [dateRange, setDateRange] = useState("thisMonth");

  // Mock data
  const monthlyAttendanceData = [
    { month: "Yan", attendance: 94.2 },
    { month: "Fev", attendance: 92.8 },
    { month: "Mar", attendance: 95.1 },
    { month: "Apr", attendance: 93.7 },
    { month: "May", attendance: 96.3 },
    { month: "Iyn", attendance: 91.5 },
    { month: "Iyl", attendance: 89.2 },
    { month: "Avg", attendance: 93.8 },
    { month: "Sen", attendance: 95.6 },
    { month: "Okt", attendance: 94.4 },
  ];

  const classPerformanceData = [
    { class: "9-A", attendance: 96.2 },
    { class: "9-B", attendance: 94.8 },
    { class: "10-A", attendance: 95.5 },
    { class: "10-B", attendance: 93.2 },
    { class: "11-A", attendance: 97.1 },
    { class: "11-B", attendance: 92.7 },
  ];

  const attendanceDistribution = [
    { name: "Keldi", value: 230, color: "#22c55e" },
    { name: "Kech", value: 8, color: "#f59e0b" },
    { name: "Yo'q", value: 15, color: "#ef4444" },
  ];

  const weeklyTrendData = [
    { day: "Du", thisWeek: 95, lastWeek: 92 },
    { day: "Se", thisWeek: 94, lastWeek: 94 },
    { day: "Ch", thisWeek: 96, lastWeek: 93 },
    { day: "Pa", thisWeek: 93, lastWeek: 95 },
    { day: "Ju", thisWeek: 92, lastWeek: 91 },
    { day: "Sh", thisWeek: 89, lastWeek: 88 },
  ];

  const handleExport = () => {
    alert("PDF export funksiyasi tez orada...");
  };

  return (
    <div className="px-4 py-5 bg-gray-50 min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hisobotlar</h1>
              <p className="text-sm text-gray-500 mt-1">
                Davomat va o'quvchilar statistikasi
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="thisWeek">Bu hafta</option>
                <option value="thisMonth">Bu oy</option>
                <option value="thisYear">Bu yil</option>
                <option value="custom">Boshqa davr</option>
              </select>
              <button
                onClick={handleExport}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800"
              >
                <Download className="w-4 h-4" />
                <span>Export PDF</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">O'rtacha Davomat</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">94.4%</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">vs last month</span>
              <span className="text-xs font-semibold text-green-600">+2.1%</span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Eng Yaxshi Sinf</span>
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">11-A</div>
            <div className="text-xs text-gray-500">97.1% davomat</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Jami O'quvchilar</span>
              <UserCheck className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">267</div>
            <div className="text-xs text-gray-500">+5 yangi</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Kech Kelish</span>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">3.2%</div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">vs last month</span>
              <span className="text-xs font-semibold text-green-600">-0.8%</span>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Monthly Attendance Trend */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Oylik Davomat Trendi
              </h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyAttendanceData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} domain={[85, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Davomat"]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="attendance"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Distribution */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Bugungi Davomat Taqsimoti
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={attendanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {attendanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "O'quvchilar"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {attendanceDistribution.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">
                    {item.name}: {item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Weekly Comparison */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Haftalik Taqqoslash
              </h3>
              <Calendar className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} domain={[80, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar
                    dataKey="thisWeek"
                    fill="#3b82f6"
                    name="Bu hafta"
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="lastWeek"
                    fill="#94a3b8"
                    name="O'tgan hafta"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Class Performance */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Sinflar Bo'yicha Davomat
              </h3>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={classPerformanceData} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    type="number"
                    domain={[90, 100]}
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis
                    dataKey="class"
                    type="category"
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Davomat"]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar
                    dataKey="attendance"
                    fill="#22c55e"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Top Performing Students */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Eng Yaxshi O'quvchilar (Davomat Bo'yicha)
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    O'quvchi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sinf
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Davomat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kunlar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { name: "Olimjon Karimov", class: "10-A", attendance: 100, days: 30 },
                  { name: "Malika Tursunova", class: "9-B", attendance: 98.3, days: 29 },
                  { name: "Bobur Aliyev", class: "11-A", attendance: 96.7, days: 29 },
                  { name: "Sarvar Umarov", class: "9-A", attendance: 95.0, days: 28 },
                ].map((student, index) => (
                  <tr key={index} className={index % 2 === 1 ? "bg-gray-50" : "bg-white"}>
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-sm font-medium text-gray-900">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">{student.class}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
                        {student.attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {student.days}/30 kun
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
