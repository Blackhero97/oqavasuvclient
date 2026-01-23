import React, { useState, useEffect } from "react";
import {
  Edit2,
  ChevronLeft,
  ChevronRight,
  Search,
  Users,
  DollarSign,
  Filter,
  SortAsc,
  RefreshCw,
  Briefcase,
  Award,
  Clock,
  ChefHat,
  CheckCircle,
  XCircle,
  Wallet,
  TrendingUp,
} from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import EditStaffModal from "../components/EditStaffModal.jsx"; // ✅ YANGI MODAL
import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/api`;
const ITEMS_PER_PAGE = 10;

const DEPARTMENTS = [
  { value: "O'qituvchi", label: "O'qituvchi (Teacher)" },
  {
    value: "Boshlangich sinf o'qituvchi",
    label: "Boshlangich sinf o'qituvchi (Primary Teacher)",
  },
  { value: "Qorovul", label: "Qorovul (Guard)" },
  { value: "Oshpaz", label: "Oshpaz (Cook)" },
  { value: "HR", label: "HR" },
  { value: "Zavuch", label: "Zavuch (Principal)" },
  { value: "Direktor", label: "Direktor (Director)" },
  { value: "Hizmatchi", label: "Hizmatchi (Cleaner)" },
];

const StaffPage = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [sortBy, setSortBy] = useState("name"); // "name", "department", "salary"
  const [sortOrder, setSortOrder] = useState("asc"); // "asc", "desc"
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [salaryStats, setSalaryStats] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
  });

  // Load staff (teachers and staff only) from API
  const loadEmployees = async () => {
    try {
      setLoading(true);
      // Use new staff endpoint that returns only teachers and staff
      const response = await axios.get(`${API_URL}/staff`);

      console.log(
        `👥 [STAFF PAGE] Loaded ${response.data.employees.length} staff members`
      );

      setEmployees(response.data.employees);

      // Load salary stats
      loadSalaryStats();
    } catch (error) {
      console.error("Load error:", error);
      toast.error("Xodimlarni yuklashda xato");
    } finally {
      setLoading(false);
    }
  };

  // Load salary statistics
  const loadSalaryStats = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/salary/stats?month=${currentMonth}`
      );
      setSalaryStats(response.data);
    } catch (error) {
      console.error("Salary stats error:", error);
    }
  };

  // Toggle salary status
  const toggleSalaryStatus = async (employeeId, currentStatus) => {
    try {
      const newStatus = currentStatus === "paid" ? "unpaid" : "paid";
      await axios.patch(`${API_URL}/employee/${employeeId}/salary-status`, {
        salaryStatus: newStatus,
        salaryMonth: currentMonth,
      });

      toast.success(
        `Maosh holati yangilandi: ${newStatus === "paid" ? "To'landi" : "To'lanmadi"
        }`
      );
      loadEmployees(); // Reload to update stats
    } catch (error) {
      console.error("Salary status error:", error);
      toast.error("Maosh holatini yangilashda xato");
    }
  };

  useEffect(() => {
    loadEmployees();

    // Auto-refresh har 5 soniyada
    const interval = setInterval(() => {
      loadEmployees();
    }, 5000);

    // Sahifa focus bo'lganda ma'lumotlarni yangilash
    const handleFocus = () => {
      loadEmployees();
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        loadEmployees();
      }
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  // Сортировка и фильтр
  const sortedEmployees = [...employees].sort((a, b) => {
    let aValue, bValue;

    if (sortBy === "name") {
      aValue = a.name || "";
      bValue = b.name || "";
    } else if (sortBy === "department") {
      aValue = a.department || "";
      bValue = b.department || "";
    } else if (sortBy === "salary") {
      aValue = a.salary || 0;
      bValue = b.salary || 0;
    }

    if (typeof aValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Filter va search
  const filteredEmployees = sortedEmployees.filter((emp) => {
    const matchSearch =
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.hikvisionEmployeeId?.includes(searchTerm);
    const matchDept = !filterDept || emp.department === filterDept;
    return matchSearch && matchDept;
  });

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / ITEMS_PER_PAGE);
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEmployees = filteredEmployees.slice(
    startIdx,
    startIdx + ITEMS_PER_PAGE
  );

  const handleEdit = (emp) => {
    setSelectedEmployee(emp);
    setEditModalOpen(true);
  };

  const handleSave = (updatedEmployee) => {
    console.log("✅ Employee updated:", updatedEmployee);
    setEmployees((prev) =>
      prev.map((emp) =>
        emp._id === updatedEmployee._id ? { ...emp, ...updatedEmployee } : emp
      )
    );
    // Reload to ensure all data is fresh
    setTimeout(() => loadEmployees(), 500);
  };

  const paidPercentage = salaryStats && salaryStats.totalSalary > 0
    ? Math.round((salaryStats.paidAmount / salaryStats.totalSalary) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Xodimlar</h1>
        <p className="text-sm text-gray-500 mt-1">{filteredEmployees.length} xodim topildi</p>
      </div>

      {/* Salary Statistics - Dashboard style */}
      {salaryStats && (
        <div className="grid grid-cols-4 gap-5 mb-6">
          {/* Jami Maosh */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-blue-50 rounded-xl">
                <Wallet className="w-5 h-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                Jami
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(salaryStats.totalSalary / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-500 mt-1">Jami Maosh</p>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">So'm:</span>
              <span className="text-sm font-semibold text-blue-600">
                {salaryStats.totalSalary.toLocaleString()}
              </span>
            </div>
          </div>

          {/* To'langan */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-emerald-50 rounded-xl">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                {paidPercentage}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(salaryStats.paidAmount / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-500 mt-1">To'langan</p>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Xodimlar:</span>
              <span className="text-sm font-semibold text-emerald-600">
                {salaryStats.paidCount} ta
              </span>
            </div>
          </div>

          {/* To'lanmagan */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-red-50 rounded-xl">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-red-50 text-red-700">
                {100 - paidPercentage}%
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {(salaryStats.unpaidAmount / 1000000).toFixed(1)}M
            </p>
            <p className="text-sm text-gray-500 mt-1">To'lanmagan</p>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Xodimlar:</span>
              <span className="text-sm font-semibold text-red-600">
                {salaryStats.unpaidCount} ta
              </span>
            </div>
          </div>

          {/* Foiz */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2.5 bg-violet-50 rounded-xl">
                <TrendingUp className="w-5 h-5 text-violet-600" />
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${paidPercentage >= 80 ? 'bg-green-50 text-green-700' :
                paidPercentage >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                }`}>
                {paidPercentage >= 80 ? 'Yaxshi' : paidPercentage >= 50 ? 'O\'rtacha' : 'Past'}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-900">{paidPercentage}%</p>
            <p className="text-sm text-gray-500 mt-1">To'langan Foiz</p>
            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-500">Status:</span>
              <span className="text-sm font-semibold text-violet-600">
                {paidPercentage >= 80 ? 'A\'lo' : paidPercentage >= 50 ? 'Yaxshi' : 'Qoniqarsiz'}
              </span>
            </div>
          </div>
        </div>
      )}
      {/* Toolbar - All in one line */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-4 h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Qidirish..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Department Filter */}
          <select
            value={filterDept}
            onChange={(e) => {
              setFilterDept(e.target.value);
              setCurrentPage(1);
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Barcha bo'limlar</option>
            {DEPARTMENTS.map((dept) => (
              <option key={dept.value} value={dept.value}>
                {dept.value}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="name">Ism</option>
            <option value="department">Bo'lim</option>
            <option value="salary">Maosh</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="asc">A → Z</option>
            <option value="desc">Z → A</option>
          </select>

          {/* Reset Button */}
          <button
            onClick={() => {
              setSortBy("name");
              setSortOrder("asc");
              setSearchTerm("");
              setFilterDept("");
            }}
            className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Tozalash
          </button>
        </div>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : paginatedEmployees.length > 0 ? (
        <>
          {/* Table-like Grid Layout - Professional & Minimal */}
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
              <div className="col-span-2">Xodim</div>
              <div className="col-span-2">Bo'lim</div>
              <div className="col-span-2">Vazifa</div>
              <div className="col-span-2 text-right">Maosh</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-1 text-center">Maosh</div>
              <div className="col-span-1 text-right">Amal</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-100">
              {paginatedEmployees.map((emp) => (
                <div
                  key={emp._id}
                  className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors items-center"
                >
                  {/* Employee Info */}
                  <div className="col-span-2 flex items-center space-x-3">
                    <div className="relative flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center text-sm font-semibold">
                        {emp.name?.charAt(0).toUpperCase()}
                      </div>
                      <div
                        className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${emp.status === "active"
                          ? "bg-green-500"
                          : "bg-gray-400"
                          }`}
                      ></div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {emp.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        ID: {emp.hikvisionEmployeeId || "—"}
                      </p>
                    </div>
                  </div>

                  {/* Department */}
                  <div className="col-span-2">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                      {emp.department}
                    </span>
                  </div>

                  {/* Role-specific */}
                  <div className="col-span-2 text-sm text-gray-600">
                    {emp.subject && (
                      <span className="flex items-center gap-1.5">
                        <span className="text-blue-500">📚</span>
                        {emp.subject}
                      </span>
                    )}
                    {emp.shift && (
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-orange-500" />
                        {emp.shift}
                      </span>
                    )}
                    {emp.specialty && (
                      <span className="flex items-center gap-1.5">
                        <ChefHat className="w-3.5 h-3.5 text-green-500" />
                        {emp.specialty}
                      </span>
                    )}
                    {!emp.subject && !emp.shift && !emp.specialty && (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>

                  {/* Salary */}
                  <div className="col-span-2 text-right">
                    {emp.salary ? (
                      <div className="inline-flex items-baseline">
                        <span className="text-lg font-bold text-gray-900">
                          {(emp.salary / 1000000).toFixed(1)}
                        </span>
                        <span className="text-xs font-medium text-gray-500 ml-1">
                          mln
                        </span>
                      </div>
                    ) : (
                      <span className="text-gray-400">—</span>
                    )}
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium ${emp.status === "active"
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-gray-50 text-gray-600 border border-gray-200"
                        }`}
                    >
                      {emp.status === "active" ? "Aktiv" : "Nofaol"}
                    </span>
                  </div>

                  {/* Salary Status Toggle */}
                  <div className="col-span-1 text-center">
                    <button
                      onClick={() =>
                        toggleSalaryStatus(
                          emp._id,
                          emp.salaryStatus || "unpaid"
                        )
                      }
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${emp.salaryStatus === "paid"
                        ? "bg-green-100 text-green-600 hover:bg-green-200"
                        : "bg-red-100 text-red-600 hover:bg-red-200"
                        }`}
                      title={
                        emp.salaryStatus === "paid" ? "To'landi" : "To'lanmadi"
                      }
                    >
                      {emp.salaryStatus === "paid" ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                    </button>
                  </div>

                  {/* Actions */}
                  <div className="col-span-1 text-right">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                      title="Tahrirlash"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pagination - Minimal */}
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-gray-600">
              {startIdx + 1}-
              {Math.min(startIdx + ITEMS_PER_PAGE, filteredEmployees.length)} /{" "}
              {filteredEmployees.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`min-w-[32px] h-8 px-3 rounded-lg text-sm font-medium transition-colors ${currentPage === page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 hover:bg-gray-50 text-gray-700"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Xodimlar topilmadi
          </h3>
          <p className="text-sm text-gray-500">
            Qidiruv bo'yicha natija yo'q. Filtrlarni o'zgartiring.
          </p>
        </div>
      )}

      {/* Edit Modal - YANGI STAFF MODAL */}
      {selectedEmployee && (
        <EditStaffModal
          employee={selectedEmployee}
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedEmployee(null);
          }}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default StaffPage;
