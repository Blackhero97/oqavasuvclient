import React, { useState, useEffect } from "react";
import { Library, Users, Clock, Plus, Edit, Trash2, X, BookOpen, GraduationCap, TrendingUp } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { io } from "socket.io-client";
import { API_URL as BASE_URL } from "../config";

const API_URL = BASE_URL;

const DepartmentsPage = () => {
  const [departmentes, setdepartmentes] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [selecteddepartmentForStudents, setSelecteddepartmentForStudents] =
    useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    grade: "",
    section: "",
    departmentTeacherName: "",
    roomNumber: "",
    maxStudents: 30,
  });

  const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const sections = ["A", "B", "C", "D", "Blue", "Red", "Green"];

  useEffect(() => {
    loadData();

    // Socket.IO real-time updates uchun
    const socket = io(BASE_URL);

    // Student yangilanganida yoki qo'shilganda Bo'limlar ro'yxatini yangilash
    socket.on("student:added", (newStudent) => {
      console.log("🔄 [departmentES] Student added:", newStudent.name, "to", newStudent.departmentName);
      setTimeout(() => {
        loaddepartmentes(); // Update department counts
      }, 500);
    });

    socket.on("student:updated", (updatedStudent) => {
      console.log("🔄 [departmentES] Student updated:", updatedStudent.name, "department:", updatedStudent.departmentName);
      setTimeout(() => {
        loaddepartmentes(); // Update department counts
      }, 500);
    });

    socket.on("student:deleted", (deletedInfo) => {
      console.log("🔄 [departmentES] Student deleted:", deletedInfo.id);
      setTimeout(() => {
        loaddepartmentes(); // Update department counts
      }, 500);
    });

    socket.on("department:added", (newdepartment) => {
      console.log("🔄 [departmentES] department added:", newdepartment.name);
      loadData(); // Reload all data
    });

    socket.on("department:updated", (updateddepartment) => {
      console.log("🔄 [departmentES] department updated:", updateddepartment.name);
      loadData(); // Reload all data
    });

    socket.on("department:deleted", (deleteddepartment) => {
      console.log("🔄 [departmentES] department deleted:", deleteddepartment.name);
      loadData(); // Reload all data
    });

    // Auto-refresh har 10 soniyada Bo'limlar va o'quvchilar ma'lumotlarini yangilash
    const interval = setInterval(() => {
      loaddepartmentes(); // Faqat Bo'limlar ma'lumotlarini yangilash
    }, 10000);

    // Sahifa focus bo'lganda ma'lumotlarni yangilash
    const handleFocus = () => {
      loadData();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        loadData();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      socket.disconnect();
    };
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([loaddepartmentes(), loadStudents()]);
    } finally {
      setLoading(false);
    }
  };

  const loaddepartmentes = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/departmentes`);
      setdepartmentes(response.data);
      console.log("departmentes loaded:", response.data.length);
    } catch (error) {
      console.error("Error loading departmentes:", error);
      // Fallback mock data
      setdepartmentes([
        {
          _id: "1",
          name: "10-A",
          studentCount: 28,
          departmentTeacherName: "Aziza Rahimova",
          roomNumber: "201",
          maxStudents: 30,
          grade: 10,
          section: "A",
        },
        {
          _id: "2",
          name: "10-B",
          studentCount: 25,
          departmentTeacherName: "Jasur Karimov",
          roomNumber: "202",
          maxStudents: 30,
          grade: 10,
          section: "B",
        },
        {
          _id: "3",
          name: "9-A",
          studentCount: 30,
          departmentTeacherName: "Dilnoza Tosheva",
          roomNumber: "105",
          maxStudents: 30,
          grade: 9,
          section: "A",
        },
      ]);
    }
  };

  const loadStudents = async () => {
    try {
      console.log("🏫 [departmentES] Loading students...");

      // GET /api/students endpoint ishlatish (attendance ma'lumotlari bilan)
      const response = await axios.get(`${API_URL}/api/students`);
      const studentsFromApi = response.data || [];

      console.log("🔍 [departmentES] Students from API:", studentsFromApi.length);

      const studentsData = studentsFromApi.map((student) => ({
        _id: student._id,
        id: student._id,
        name: student.name || "Ism ko'rsatilmagan",
        departmentName: student.departmentName || student.department || "Bo'lim ko'rsatilmagan",
        age: student.age || "-",
        phone: student.phone || "-",
        email: student.email || "-",
        parentName: student.parentName || "-",
        parentPhone: student.parentPhone || "-",
        address: student.address || "-",
        status: student.status || "active",
        hikvisionEmployeeId: student.hikvisionEmployeeId || "",
        keldi: student.keldi || null,
        ketdi: student.ketdi || null,
      }));

      console.log("💾 [departmentES] Formatted students:", studentsData.length);
      setStudents(studentsData);
    } catch (error) {
      console.error("❌ [departmentES] Error loading students:", error);
    }
  };

  const handleAddOrEdit = async () => {
    if (!formData.grade || !formData.section) {
      toast.error("Bo'lim darajasi va bolimi talab qilinadi");
      return;
    }

    try {
      setLoading(true);
      const departmentName = `${formData.grade}-${formData.section}`;

      if (editingId) {
        // Edit mode
        await axios.put(`${API_URL}/api/departmentes/${editingId}`, {
          name: departmentName,
          grade: parseInt(formData.grade),
          section: formData.section,
          departmentTeacherName: formData.departmentTeacherName,
          roomNumber: formData.roomNumber,
          maxStudents: parseInt(formData.maxStudents) || 30,
        });
        toast.success("Bo'lim malumotlari yangilandi");
      } else {
        // Add mode
        await axios.post(`${API_URL}/api/departmentes`, {
          name: departmentName,
          grade: parseInt(formData.grade),
          section: formData.section,
          departmentTeacherName: formData.departmentTeacherName,
          roomNumber: formData.roomNumber,
          maxStudents: parseInt(formData.maxStudents) || 30,
        });
        toast.success("Yangi Bo'lim qoshildi");
      }

      resetForm();
      loaddepartmentes();
    } catch (error) {
      console.error("Error saving department:", error);
      toast.error(error.response?.data?.error || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      grade: "",
      section: "",
      departmentTeacherName: "",
      roomNumber: "",
      maxStudents: 30,
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (departmentItem) => {
    setFormData({
      grade: departmentItem.grade?.toString() || "",
      section: departmentItem.section || "",
      departmentTeacherName: departmentItem.departmentTeacherName || "",
      roomNumber: departmentItem.roomNumber || "",
      maxStudents: departmentItem.maxStudents || 30,
    });
    setEditingId(departmentItem._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (departmentItem) => {
    if (
      !window.confirm(`"${departmentItem.name}" Bo'limini ochirishni tasdiqlaysizmi?`)
    ) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/departmentes/${departmentItem._id}`);
      toast.success("Bo'lim ochirildi");
      loaddepartmentes();
    } catch (error) {
      console.error("Error deleting department:", error);
      toast.error(error.response?.data?.error || "Bo'limni ochirishda xato");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const getStudentsFordepartment = (departmentName) => {
    return students.filter((s) => s.departmentName === departmentName);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "present":
        return "bg-green-100 text-green-800";
      case "late":
        return "bg-orange-100 text-orange-800";
      case "absent":
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalStudents = departmentes.reduce(
    (acc, c) => acc + (c.studentCount || 0),
    0
  );

  if (loading && departmentes.length === 0) {
    return (
      <div departmentName="flex items-center justify-center min-h-screen">
        <div departmentName="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div departmentName="bg-white border border-gray-200 rounded-lg p-6">
      <div departmentName="flex items-center justify-between">
        <div>
          <p departmentName="text-sm text-gray-500 mb-1">{title}</p>
          <p departmentName="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          style={
            color === "bg-blue-500"
              ? {
                backgroundColor: "#004A77",
                padding: "12px",
                borderRadius: "8px",
              }
              : { departmentName: color }
          }
        >
          <Icon departmentName="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div departmentName="px-6 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div departmentName="mb-8 flex items-center justify-between">
        <div>
          <h1 departmentName="text-2xl font-bold text-gray-900">Bo'limlar</h1>
          <p departmentName="text-sm text-gray-500 mt-1">Bo'limlar va guruhlar boshqaruvi</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
          departmentName="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
        >
          <Plus departmentName="w-4 h-4" />
          Yangi Bo'lim
        </button>
      </div>

      {/* Stats - Dashboard style */}
      <div departmentName="grid grid-cols-3 gap-5 mb-6">
        {/* Jami Bo'limlar */}
        <div departmentName="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div departmentName="flex items-center justify-between mb-4">
            <div departmentName="p-2.5 bg-blue-50 rounded-xl">
              <BookOpen departmentName="w-5 h-5 text-blue-600" />
            </div>
            <span departmentName="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
              Faol
            </span>
          </div>
          <p departmentName="text-2xl font-bold text-gray-900">{departmentes.length}</p>
          <p departmentName="text-sm text-gray-500 mt-1">Jami Bo'limlar</p>
          <div departmentName="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span departmentName="text-xs text-gray-500">Guruhlar:</span>
            <span departmentName="text-sm font-semibold text-blue-600">{departmentes.length} ta</span>
          </div>
        </div>

        {/* Jami O'quvchilar */}
        <div departmentName="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div departmentName="flex items-center justify-between mb-4">
            <div departmentName="p-2.5 bg-emerald-50 rounded-xl">
              <Users departmentName="w-5 h-5 text-emerald-600" />
            </div>
            <span departmentName="text-xs font-medium px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
              {totalStudents > 0 ? '100%' : '0%'}
            </span>
          </div>
          <p departmentName="text-2xl font-bold text-gray-900">{totalStudents}</p>
          <p departmentName="text-sm text-gray-500 mt-1">Jami O'quvchilar</p>
          <div departmentName="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span departmentName="text-xs text-gray-500">Barcha:</span>
            <span departmentName="text-sm font-semibold text-emerald-600">{totalStudents} ta</span>
          </div>
        </div>

        {/* O'rtacha */}
        <div departmentName="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div departmentName="flex items-center justify-between mb-4">
            <div departmentName="p-2.5 bg-violet-50 rounded-xl">
              <TrendingUp departmentName="w-5 h-5 text-violet-600" />
            </div>
            <span departmentName="text-xs font-medium px-2 py-1 rounded-full bg-violet-50 text-violet-700">
              O'rtacha
            </span>
          </div>
          <p departmentName="text-2xl font-bold text-gray-900">
            {departmentes.length > 0 ? Math.round(totalStudents / departmentes.length) : 0}
          </p>
          <p departmentName="text-sm text-gray-500 mt-1">O'rtacha Bo'lim To'lishi</p>
          <div departmentName="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span departmentName="text-xs text-gray-500">Har biri:</span>
            <span departmentName="text-sm font-semibold text-violet-600">
              {departmentes.length > 0 ? Math.round(totalStudents / departmentes.length) : 0} ta
            </span>
          </div>
        </div>
      </div>

      {/* departmentes Grid */}
      <div departmentName="grid grid-cols-3 gap-5">
        {departmentes.map((departmentItem) => (
          <div
            key={departmentItem._id}
            departmentName="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div departmentName="flex items-center justify-between mb-4">
              <div>
                <h3 departmentName="text-xl font-bold text-gray-900">
                  {departmentItem.name}
                </h3>
                <p departmentName="text-sm text-gray-500">
                  Xona {departmentItem.roomNumber || "-"}
                </p>
              </div>
              <div departmentName="flex space-x-2">
                <button
                  onClick={() => handleEdit(departmentItem)}
                  departmentName="p-2 rounded-lg"
                  style={{ color: "#004A77", backgroundColor: "transparent" }}
                  onMouseEnter={(e) =>
                    (e.target.style.backgroundColor = "#e0f2ff")
                  }
                  onMouseLeave={(e) =>
                    (e.target.style.backgroundColor = "transparent")
                  }
                >
                  <Edit departmentName="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(departmentItem)}
                  departmentName="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                  <Trash2 departmentName="w-5 h-5" />
                </button>
              </div>
            </div>

            <div departmentName="space-y-3">
              <div departmentName="flex items-center justify-between">
                <span departmentName="text-sm text-gray-500">Bo'lim rahbari:</span>
                <span departmentName="text-sm font-medium text-gray-900">
                  {departmentItem.departmentTeacherName || "Belgilanmagan"}
                </span>
              </div>
              <div departmentName="flex items-center justify-between">
                <span departmentName="text-sm text-gray-500">Oquvchilar:</span>
                <span departmentName="text-sm font-medium text-gray-900">
                  {departmentItem.studentCount || 0} /{" "}
                  {departmentItem.maxStudents || 30}
                </span>
              </div>
              <div departmentName="w-full bg-gray-200 rounded-full h-2">
                <div
                  departmentName={`h-2 rounded-full ${(departmentItem.studentCount || 0) >=
                    (departmentItem.maxStudents || 30)
                    ? "bg-red-500"
                    : "bg-green-500"
                    }`}
                  style={{
                    width: `${Math.min(
                      ((departmentItem.studentCount || 0) /
                        (departmentItem.maxStudents || 30)) *
                      100,
                      100
                    )}%`,
                  }}
                />
              </div>
            </div>

            <div departmentName="mt-4 pt-4 border-t border-gray-200">
              <button
                onClick={() => {
                  setSelecteddepartmentForStudents(departmentItem);
                  setIsStudentsModalOpen(true);
                }}
                departmentName="w-full py-2 text-sm font-medium rounded-lg"
                style={{ color: "#004A77", backgroundColor: "transparent" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#e0f2ff")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "transparent")
                }
              >
                Oquvchilarni korish
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit department Modal */}
      {isModalOpen && (
        <div departmentName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div departmentName="bg-white rounded-lg p-8 max-w-md w-full">
            <h2 departmentName="text-2xl font-bold text-gray-900 mb-6">
              {editingId
                ? "Bo'lim Malumotlarini Tahrirlash"
                : "Yangi Bo'lim Qoshish"}
            </h2>

            <div departmentName="space-y-4">
              <div departmentName="grid grid-cols-2 gap-4">
                <div>
                  <label departmentName="block text-sm font-medium text-gray-700 mb-2">
                    Bo'lim Darajasi *
                  </label>
                  <select
                    name="grade"
                    value={formData.grade}
                    onChange={handleInputChange}
                    departmentName="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tanlang</option>
                    {grades.map((g) => (
                      <option key={g} value={g}>
                        {g}-Bo'lim
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label departmentName="block text-sm font-medium text-gray-700 mb-2">
                    Bolim *
                  </label>
                  <select
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    departmentName="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tanlang</option>
                    {sections.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label departmentName="block text-sm font-medium text-gray-700 mb-2">
                  Bo'lim Rahbari
                </label>
                <input
                  type="text"
                  name="departmentTeacherName"
                  value={formData.departmentTeacherName}
                  onChange={handleInputChange}
                  placeholder="Masalan: Aziza Rahimova"
                  departmentName="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div departmentName="grid grid-cols-2 gap-4">
                <div>
                  <label departmentName="block text-sm font-medium text-gray-700 mb-2">
                    Xona Raqami
                  </label>
                  <input
                    type="text"
                    name="roomNumber"
                    value={formData.roomNumber}
                    onChange={handleInputChange}
                    placeholder="Masalan: 201"
                    departmentName="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label departmentName="block text-sm font-medium text-gray-700 mb-2">
                    Max Oquvchilar
                  </label>
                  <input
                    type="number"
                    name="maxStudents"
                    value={formData.maxStudents}
                    onChange={handleInputChange}
                    placeholder="30"
                    departmentName="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            <div departmentName="mt-6 flex space-x-3">
              <button
                onClick={resetForm}
                departmentName="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleAddOrEdit}
                disabled={loading}
                departmentName="flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50"
                style={{ backgroundColor: "#004A77" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#003A63")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#004A77")
                }
              >
                {loading
                  ? "Saqlanmoqda..."
                  : editingId
                    ? "Saqlash"
                    : "Qoshish"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Students Details Modal */}
      {isStudentsModalOpen && selecteddepartmentForStudents && (
        <div departmentName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div departmentName="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div departmentName="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <div>
                <h2 departmentName="text-2xl font-bold text-gray-900">
                  {selecteddepartmentForStudents.name} - Oquvchilar
                </h2>
                <p departmentName="text-sm text-gray-500 mt-1">
                  Jami:{" "}
                  {getStudentsFordepartment(selecteddepartmentForStudents.name).length}{" "}
                  ta oquvchi
                </p>
              </div>
              <button
                onClick={() => {
                  setIsStudentsModalOpen(false);
                  setSelecteddepartmentForStudents(null);
                }}
                departmentName="p-2 text-gray-400 hover:text-gray-600"
              >
                <X departmentName="w-6 h-6" />
              </button>
            </div>

            <div departmentName="p-6">
              {getStudentsFordepartment(selecteddepartmentForStudents.name).length >
                0 ? (
                <table departmentName="w-full text-sm">
                  <thead>
                    <tr departmentName="bg-gray-50 border-b border-gray-200">
                      <th departmentName="text-left py-3 px-4 font-semibold text-gray-700">
                        #
                      </th>
                      <th departmentName="text-left py-3 px-4 font-semibold text-gray-700">
                        Oquvchi
                      </th>
                      <th departmentName="text-left py-3 px-4 font-semibold text-gray-700">
                        Telefon
                      </th>
                      <th departmentName="text-center py-3 px-4 font-semibold text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody departmentName="divide-y divide-gray-100">
                    {getStudentsFordepartment(selecteddepartmentForStudents.name).map(
                      (student, index) => (
                        <tr key={student._id} departmentName="hover:bg-gray-50">
                          <td departmentName="py-3 px-4 text-gray-500">
                            {index + 1}
                          </td>
                          <td departmentName="py-3 px-4 text-gray-900 font-medium">
                            {student.name}
                          </td>
                          <td departmentName="py-3 px-4 text-gray-600">
                            {student.phone || "-"}
                          </td>
                          <td departmentName="text-center py-3 px-4">
                            <span
                              departmentName={`inline-flex px-2.5 py-1 rounded text-xs font-semibold ${getStatusColor(
                                student.status
                              )}`}
                            >
                              {student.status === "active"
                                ? "Faol"
                                : "Nofaol"}
                            </span>
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              ) : (
                <div departmentName="text-center py-8 text-gray-500">
                  <Users departmentName="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p>Bu Bo'limda oquvchi yoq</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;


