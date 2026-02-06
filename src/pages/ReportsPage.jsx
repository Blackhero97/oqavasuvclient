import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config";
import {
  BarChart3,
  Download,
  TrendingUp,
  Users,
  UserCheck,
  Clock,
  Calendar,
  FileText,
  Loader2,
  AlertCircle,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    stats: {
      avgAttendance: 0,
      bestClass: "N/A",
      bestClassRate: 0,
      totalStudents: 0,
      latePercentage: 0
    },
    charts: {
      monthlyTrend: [],
      attendanceDistribution: [],
      weeklyTrendData: [],
      classPerformance: []
    },
    topStudents: []
  });

  useEffect(() => {
    fetchData();
  }, [dateRange]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      console.log('🔍 [REPORTS] Fetching data from:', `${API_URL}/api/reports/stats`);
      console.log('🔍 [REPORTS] Token:', token ? 'Present' : 'Missing');

      const response = await axios.get(`${API_URL}/api/reports/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('✅ [REPORTS] Response received:', response.data);

      if (response.data.success) {
        console.log('✅ [REPORTS] Setting data:', {
          stats: response.data.stats,
          chartsCount: Object.keys(response.data.charts).length,
          topStudentsCount: response.data.topStudents.length
        });
        setData({
          stats: response.data.stats,
          charts: response.data.charts,
          topStudents: response.data.topStudents
        });
        setError(null);
      }
    } catch (err) {
      console.error("❌ [REPORTS] Error fetching report stats:", err);
      console.error("❌ [REPORTS] Error response:", err.response?.data);
      console.error("❌ [REPORTS] Error status:", err.response?.status);
      setError("Ma'lumotlarni yuklashda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    alert("PDF export funksiyasi tez orada...");
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Hisobotlar tayyorlanmoqda...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <p className="text-gray-800 font-bold text-center mb-2">{error}</p>
        <button
          onClick={fetchData}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          Qayta urinish
        </button>
      </div>
    );
  }

  const { stats, charts, topStudents } = data;

  return (
    <div className="px-4 py-5 bg-gray-50 min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Hisobotlar</h1>
              <p className="text-sm text-gray-500 mt-1">
                suv istamoli va istamolchilar statistikasi
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
              <span className="text-sm text-gray-500">O'rtacha suv istamoli</span>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.avgAttendance}%</div>
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
            <div className="text-3xl font-bold text-gray-900 mb-2 truncate" title={stats.bestClass}>{stats.bestClass}</div>
            <div className="text-xs text-gray-500">{stats.bestClassRate}% suv istamoli</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Jami istamolchilar</span>
              <UserCheck className="w-5 h-5 text-gray-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.totalStudents}</div>
            <div className="text-xs text-gray-500">+5 yangi</div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-500">Kech Kelish</span>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-2">{stats.latePercentage}%</div>
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
                Oylik suv istamoli Trendi
              </h3>
              <BarChart3 className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.monthlyTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "suv istamoli"]}
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
                Bugungi suv istamoli Taqsimoti
              </h3>
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.attendanceDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {charts.attendanceDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, "istamolchilar"]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center space-x-4 mt-4">
              {charts.attendanceDistribution.map((item, index) => (
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
                <BarChart data={charts.weeklyTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
                  <YAxis stroke="#6b7280" fontSize={12} domain={[0, 100]} />
                  <Tooltip
                    formatter={(value) => [`${value}%`, ""]}
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
                Sinflar Bo'yicha suv istamoli
              </h3>
              <FileText className="w-5 h-5 text-gray-400" />
            </div>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.classPerformance} layout="horizontal">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="class"
                    stroke="#6b7280"
                    fontSize={12}
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    domain={[0, 100]}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "suv istamoli"]}
                    contentStyle={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "6px",
                    }}
                  />
                  <Bar
                    dataKey="attendance"
                    fill="#22c55e"
                    radius={[4, 4, 0, 0]}
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
              Eng Yaxshi istamolchilar (suv istamoli Bo'yicha)
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
                    istamolchi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sinf
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    suv istamoli
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kunlar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {topStudents.map((student, index) => (
                  <tr key={index} className={index % 2 === 1 ? "bg-gray-50/50" : "bg-white"}>
                    <td className="px-6 py-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xs shadow-sm">
                        {index + 1}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm">
                          {student.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-sm font-semibold text-gray-900">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        {student.class}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold rounded-full ${student.attendance > 95 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {student.attendance}%
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {student.days} kun kelgan
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

