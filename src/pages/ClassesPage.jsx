import React, { useState, useEffect } from "react";
import { Library, Users, Clock, Plus, Edit, Trash2, X } from "lucide-react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { io } from "socket.io-client";
import { API_URL as BASE_URL } from "../config";

const API_URL = BASE_URL;

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isStudentsModalOpen, setIsStudentsModalOpen] = useState(false);
  const [selectedClassForStudents, setSelectedClassForStudents] =
    useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    grade: "",
    section: "",
    classTeacherName: "",
    roomNumber: "",
    maxStudents: 30,
  });

  const grades = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
  const sections = ["A", "B", "C", "D", "Blue", "Red", "Green"];

  useEffect(() => {
    loadData();

    // Socket.IO real-time updates uchun
    const socket = io(BASE_URL);

    // Student yangilanganida yoki qo'shilganda sinflar ro'yxatini yangilash
    socket.on("student:added", (newStudent) => {
      console.log("🔄 [CLASSES] Student added:", newStudent.name, "to", newStudent.className);
      setTimeout(() => {
        loadClasses(); // Update class counts
      }, 500);
    });

    socket.on("student:updated", (updatedStudent) => {
      console.log("🔄 [CLASSES] Student updated:", updatedStudent.name, "class:", updatedStudent.className);
      setTimeout(() => {
        loadClasses(); // Update class counts
      }, 500);
    });

    socket.on("student:deleted", (deletedInfo) => {
      console.log("🔄 [CLASSES] Student deleted:", deletedInfo.id);
      setTimeout(() => {
        loadClasses(); // Update class counts
      }, 500);
    });

    socket.on("class:added", (newClass) => {
      console.log("🔄 [CLASSES] Class added:", newClass.name);
      loadData(); // Reload all data
    });

    socket.on("class:updated", (updatedClass) => {
      console.log("🔄 [CLASSES] Class updated:", updatedClass.name);
      loadData(); // Reload all data
    });

    socket.on("class:deleted", (deletedClass) => {
      console.log("🔄 [CLASSES] Class deleted:", deletedClass.name);
      loadData(); // Reload all data
    });

    // Auto-refresh har 10 soniyada sinflar va o'quvchilar ma'lumotlarini yangilash
    const interval = setInterval(() => {
      loadClasses(); // Faqat sinflar ma'lumotlarini yangilash
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
      await Promise.all([loadClasses(), loadStudents()]);
    } finally {
      setLoading(false);
    }
  };

  const loadClasses = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/classes`);
      setClasses(response.data);
      console.log("Classes loaded:", response.data.length);
    } catch (error) {
      console.error("Error loading classes:", error);
      // Fallback mock data
      setClasses([
        {
          _id: "1",
          name: "10-A",
          studentCount: 28,
          classTeacherName: "Aziza Rahimova",
          roomNumber: "201",
          maxStudents: 30,
          grade: 10,
          section: "A",
        },
        {
          _id: "2",
          name: "10-B",
          studentCount: 25,
          classTeacherName: "Jasur Karimov",
          roomNumber: "202",
          maxStudents: 30,
          grade: 10,
          section: "B",
        },
        {
          _id: "3",
          name: "9-A",
          studentCount: 30,
          classTeacherName: "Dilnoza Tosheva",
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
      console.log("🏫 [CLASSES] Loading students...");
      
      // GET /api/students endpoint ishlatish (attendance ma'lumotlari bilan)
      const response = await axios.get(`${API_URL}/api/students`);
      const studentsFromApi = response.data || [];

      console.log("🔍 [CLASSES] Students from API:", studentsFromApi.length);

      const studentsData = studentsFromApi.map((student) => ({
        _id: student._id,
        id: student._id,
        name: student.name || "Ism ko'rsatilmagan",
        className: student.className || student.class || "Sinf ko'rsatilmagan",
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

      console.log("💾 [CLASSES] Formatted students:", studentsData.length);
      setStudents(studentsData);
    } catch (error) {
      console.error("❌ [CLASSES] Error loading students:", error);
    }
  };

  const handleAddOrEdit = async () => {
    if (!formData.grade || !formData.section) {
      toast.error("Sinf darajasi va bolimi talab qilinadi");
      return;
    }

    try {
      setLoading(true);
      const className = `${formData.grade}-${formData.section}`;

      if (editingId) {
        // Edit mode
        await axios.put(`${API_URL}/api/classes/${editingId}`, {
          name: className,
          grade: parseInt(formData.grade),
          section: formData.section,
          classTeacherName: formData.classTeacherName,
          roomNumber: formData.roomNumber,
          maxStudents: parseInt(formData.maxStudents) || 30,
        });
        toast.success("Sinf malumotlari yangilandi");
      } else {
        // Add mode
        await axios.post(`${API_URL}/api/classes`, {
          name: className,
          grade: parseInt(formData.grade),
          section: formData.section,
          classTeacherName: formData.classTeacherName,
          roomNumber: formData.roomNumber,
          maxStudents: parseInt(formData.maxStudents) || 30,
        });
        toast.success("Yangi sinf qoshildi");
      }

      resetForm();
      loadClasses();
    } catch (error) {
      console.error("Error saving class:", error);
      toast.error(error.response?.data?.error || "Xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      grade: "",
      section: "",
      classTeacherName: "",
      roomNumber: "",
      maxStudents: 30,
    });
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleEdit = (classItem) => {
    setFormData({
      grade: classItem.grade?.toString() || "",
      section: classItem.section || "",
      classTeacherName: classItem.classTeacherName || "",
      roomNumber: classItem.roomNumber || "",
      maxStudents: classItem.maxStudents || 30,
    });
    setEditingId(classItem._id);
    setIsModalOpen(true);
  };

  const handleDelete = async (classItem) => {
    if (
      !window.confirm(`"${classItem.name}" sinfini ochirishni tasdiqlaysizmi?`)
    ) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`${API_URL}/api/classes/${classItem._id}`);
      toast.success("Sinf ochirildi");
      loadClasses();
    } catch (error) {
      console.error("Error deleting class:", error);
      toast.error(error.response?.data?.error || "Sinfni ochirishda xato");
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

  const getStudentsForClass = (className) => {
    return students.filter((s) => s.className === className);
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

  const totalStudents = classes.reduce(
    (acc, c) => acc + (c.studentCount || 0),
    0
  );

  if (loading && classes.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        <div
          style={
            color === "bg-blue-500"
              ? {
                  backgroundColor: "#004A77",
                  padding: "12px",
                  borderRadius: "8px",
                }
              : { className: color }
          }
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sinflar</h1>
            <p className="text-sm text-gray-500 mt-1">
              Sinflar va guruhlar boshqaruvi
            </p>
          </div>
          <button
            onClick={() => {
              resetForm();
              setIsModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg"
            style={{ backgroundColor: "#004A77" }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#003A63")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#004A77")}
          >
            <Plus className="w-5 h-5" />
            <span>Yangi Sinf</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <StatCard
            title="Jami Sinflar"
            value={classes.length}
            icon={Library}
            color="bg-004A77"
          />
          <StatCard
            title="Jami Oquvchilar"
            value={totalStudents}
            icon={Users}
            color="bg-green-500"
          />
          <StatCard
            title="Ortacha sinf tolishi"
            value={
              classes.length > 0
                ? Math.round(totalStudents / classes.length)
                : 0
            }
            icon={Clock}
            color="bg-purple-500"
          />
        </div>

        {/* Classes Grid */}
        <div className="grid grid-cols-2 gap-6">
          {classes.map((classItem) => (
            <div
              key={classItem._id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {classItem.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Xona {classItem.roomNumber || "-"}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEdit(classItem)}
                    className="p-2 rounded-lg"
                    style={{ color: "#004A77", backgroundColor: "transparent" }}
                    onMouseEnter={(e) =>
                      (e.target.style.backgroundColor = "#e0f2ff")
                    }
                    onMouseLeave={(e) =>
                      (e.target.style.backgroundColor = "transparent")
                    }
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(classItem)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Sinf rahbari:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {classItem.classTeacherName || "Belgilanmagan"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Oquvchilar:</span>
                  <span className="text-sm font-medium text-gray-900">
                    {classItem.studentCount || 0} /{" "}
                    {classItem.maxStudents || 30}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      (classItem.studentCount || 0) >=
                      (classItem.maxStudents || 30)
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        ((classItem.studentCount || 0) /
                          (classItem.maxStudents || 30)) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <button
                  onClick={() => {
                    setSelectedClassForStudents(classItem);
                    setIsStudentsModalOpen(true);
                  }}
                  className="w-full py-2 text-sm font-medium rounded-lg"
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

        {/* Add/Edit Class Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId
                  ? "Sinf Malumotlarini Tahrirlash"
                  : "Yangi Sinf Qoshish"}
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sinf Darajasi *
                    </label>
                    <select
                      name="grade"
                      value={formData.grade}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Tanlang</option>
                      {grades.map((g) => (
                        <option key={g} value={g}>
                          {g}-sinf
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Bolim *
                    </label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sinf Rahbari
                  </label>
                  <input
                    type="text"
                    name="classTeacherName"
                    value={formData.classTeacherName}
                    onChange={handleInputChange}
                    placeholder="Masalan: Aziza Rahimova"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xona Raqami
                    </label>
                    <input
                      type="text"
                      name="roomNumber"
                      value={formData.roomNumber}
                      onChange={handleInputChange}
                      placeholder="Masalan: 201"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Max Oquvchilar
                    </label>
                    <input
                      type="number"
                      name="maxStudents"
                      value={formData.maxStudents}
                      onChange={handleInputChange}
                      placeholder="30"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button
                  onClick={resetForm}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  onClick={handleAddOrEdit}
                  disabled={loading}
                  className="flex-1 px-4 py-2 text-white rounded-lg disabled:opacity-50"
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
        {isStudentsModalOpen && selectedClassForStudents && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedClassForStudents.name} - Oquvchilar
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Jami:{" "}
                    {getStudentsForClass(selectedClassForStudents.name).length}{" "}
                    ta oquvchi
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsStudentsModalOpen(false);
                    setSelectedClassForStudents(null);
                  }}
                  className="p-2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6">
                {getStudentsForClass(selectedClassForStudents.name).length >
                0 ? (
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          #
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Oquvchi
                        </th>
                        <th className="text-left py-3 px-4 font-semibold text-gray-700">
                          Telefon
                        </th>
                        <th className="text-center py-3 px-4 font-semibold text-gray-700">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {getStudentsForClass(selectedClassForStudents.name).map(
                        (student, index) => (
                          <tr key={student._id} className="hover:bg-gray-50">
                            <td className="py-3 px-4 text-gray-500">
                              {index + 1}
                            </td>
                            <td className="py-3 px-4 text-gray-900 font-medium">
                              {student.name}
                            </td>
                            <td className="py-3 px-4 text-gray-600">
                              {student.phone || "-"}
                            </td>
                            <td className="text-center py-3 px-4">
                              <span
                                className={`inline-flex px-2.5 py-1 rounded text-xs font-semibold ${getStatusColor(
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
                  <div className="text-center py-8 text-gray-500">
                    <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <p>Bu sinfda oquvchi yoq</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassesPage;
