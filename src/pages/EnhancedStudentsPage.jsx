import React, { useState, useEffect } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Download,
  MoreVertical,
  X,
  Users,
  UserCheck,
  GraduationCap,
  CheckCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/api`;

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState({}); // Store attendance for each student

  useEffect(() => {
    loadStudents();

    // Auto-refresh har 5 soniyada
    const interval = setInterval(() => {
      loadStudents(false);
    }, 5000);

    // Sahifa focus bo'lganda ma'lumotlarni yangilash
    const handleFocus = () => {
      loadStudents(false);
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        loadStudents(false);
      }
    });

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const loadStudents = async (showLoadingIndicator = true) => {
    try {
      if (showLoadingIndicator) setLoading(true);
      console.log("📚 [ENHANCED] O'quvchilarni yuklash...");

      // GET /api/students endpoint'dan foydalanish - attendance bilan birga keladi
      const response = await axios.get(`${API_URL}/students`);
      const studentsFromApi = response.data || [];

      console.log(
        "🔍 [ENHANCED] API javobidagi o'quvchilar:",
        studentsFromApi.length,
        "ta"
      );

      const studentsData = studentsFromApi.map((student) => ({
        id: student._id,
        name: student.name || "Ism ko'rsatilmagan",
        class:
          student.className ||
          student.class ||
          student.department?.replace(/o'quvchi/gi, "").trim() ||
          "Sinf ko'rsatilmagan",
        age: student.age || "-",
        phone: student.phone || "-",
        email: student.email || "-",
        parentName: student.parentName || "-",
        parentPhone: student.parentPhone || "-",
        address: student.address || "-",
        avatar:
          student.name
            ?.split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase() || "?",
        status: student.status || "active",
        enrollDate: student.createdAt || new Date().toISOString(),
        hikvisionEmployeeId: student.hikvisionEmployeeId || "",
        // Attendance ma'lumotlari to'g'ridan-to'g'ri API'dan keladi
        keldi: student.keldi || null,
        ketdi: student.ketdi || null,
        attendanceStatus: student.attendanceStatus || "absent",
      }));

      console.log("💾 [ENHANCED] Formatted students:", studentsData);
      setStudents(studentsData);

      // Attendance data already included from API, no need for separate calls
      const attendanceMap = {};
      studentsData.forEach((student) => {
        attendanceMap[student.id] = {
          checkIn: student.keldi,
          checkOut: student.ketdi,
          status: student.keldi ? "Keldi" : "Kelmagan",
        };
      });
      setAttendanceData(attendanceMap);
    } catch (error) {
      console.error("❌ [ENHANCED] Error loading students:", error);
      toast.error("O'quvchilarni yuklashda xato");
    } finally {
      setLoading(false);
    }
  };

  // Attendance data for students
  const getStudentAttendance = async (hikvisionEmployeeId) => {
    try {
      if (!hikvisionEmployeeId) {
        console.log("🔍 No hikvisionEmployeeId provided");
        return { checkIn: null, checkOut: null, status: "Kelmagan" };
      }

      console.log("🔍 Getting attendance for employeeId:", hikvisionEmployeeId);
      const response = await axios.get(`${API_URL}/attendance`);
      const data = response.data || {};
      const attendanceRecords = data.records || [];

      console.log("📊 Total attendance records:", attendanceRecords.length);
      console.log("🔎 Looking for hikvisionEmployeeId:", hikvisionEmployeeId);
      console.log("🔎 Sample attendance hikvisionEmployeeIds:",
        attendanceRecords.slice(0, 3).map(r => r.hikvisionEmployeeId)
      );

      // Find today's attendance for this student
      const studentRecord = attendanceRecords.find(
        (record) => {
          const idMatch = record.hikvisionEmployeeId === hikvisionEmployeeId;
          const roleMatch = record.role === "student";
          console.log(`🔍 Checking record: ${record.name}`);
          console.log(`   hikvisionEmployeeId: "${record.hikvisionEmployeeId}" vs "${hikvisionEmployeeId}" => ${idMatch}`);
          console.log(`   role: "${record.role}" vs "student" => ${roleMatch}`);
          return idMatch && roleMatch;
        }
      );

      console.log("🎓 Student record found:", studentRecord);

      if (!studentRecord) {
        return { checkIn: null, checkOut: null, status: "Kelmagan" };
      }

      const checkInTime = studentRecord.firstCheckIn;
      const checkOutTime = studentRecord.lastCheckOut;

      let status = "Maktabda";
      if (checkOutTime) {
        status = "Tugagan";
      }

      console.log("✅ Attendance data:", {
        checkIn: checkInTime,
        checkOut: checkOutTime,
        status,
      });

      return {
        checkIn: checkInTime,
        checkOut: checkOutTime,
        status,
      };
    } catch (error) {
      console.error("❌ Error getting attendance:", error);
      return { checkIn: null, checkOut: null, status: "Ma'lumot yo'q" };
    }
  };

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // 'add' or 'edit'
  const [currentStudent, setCurrentStudent] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    class: "",
    age: "",
    phone: "",
    email: "",
    parentName: "",
    parentPhone: "",
    address: "",
  });

  const classes = [
    "Barcha sinflar",
    "1 blue",
    "1 green",
    "2 blue",
    "2 green",
    "3 blue",
    "4 blue",
    "5 blue",
    "6 blue",
    "6 green",
    "7 blue",
    "8 blue",
    "8 green",
    "9 blue",
    "10 blue",
    "11 blue",
    "1-tibbiyot guruhi",
    "2-tibbiyot guruhi",
  ];

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.class.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass =
      selectedClass === "" ||
      selectedClass === "Barcha sinflar" ||
      student.class === selectedClass;

    return matchesSearch && matchesClass;
  });

  const handleAddStudent = () => {
    setModalMode("add");
    setFormData({
      name: "",
      class: "",
      age: "",
      phone: "",
      email: "",
      parentName: "",
      parentPhone: "",
      address: "",
    });
    setShowModal(true);
  };

  const handleEditStudent = (student) => {
    setModalMode("edit");
    setCurrentStudent(student);
    setFormData({
      name: student.name,
      class: student.class,
      age: student.age,
      phone: student.phone,
      email: student.email,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      address: student.address,
    });
    setShowModal(true);
  };

  const handleDeleteStudent = async (studentId) => {
    if (window.confirm("O'quvchini o'chirishni xohlaysizmi?")) {
      try {
        console.log("🗑️ [ENHANCED] Deleting student:", studentId);
        await axios.delete(`${API_URL}/employee/${studentId}`);
        console.log("✅ [ENHANCED] Student deleted");

        toast.success("O'quvchi o'chirildi");
        loadStudents(false); // Refresh list
      } catch (error) {
        console.error("❌ [ENHANCED] Error deleting student:", error);
        toast.error(
          error.response?.data?.error || "O'quvchini o'chirishda xato"
        );
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (modalMode === "add") {
      try {
        console.log("📝 [ENHANCED] Adding new student:", formData);

        const newStudentData = {
          name: formData.name,
          class: formData.class,
          department: `O'quvchi - ${formData.class}`,
          role: "student",
          age: parseInt(formData.age) || undefined,
          phone: formData.phone,
          email: formData.email,
          parentName: formData.parentName,
          parentPhone: formData.parentPhone,
          address: formData.address,
          status: "active",
        };

        const response = await axios.post(
          `${API_URL}/employees`,
          newStudentData
        );
        console.log("✅ [ENHANCED] Student added:", response.data);

        toast.success("Yangi o'quvchi qo'shildi");
        setShowModal(false);
        loadStudents(false); // Refresh list
      } catch (error) {
        console.error("❌ [ENHANCED] Error adding student:", error);
        toast.error(error.response?.data?.error || "O'quvchi qo'shishda xato");
      }
    } else {
      try {
        console.log(
          "📝 [ENHANCED] Updating student:",
          currentStudent.id,
          formData
        );

        const updateData = {
          name: formData.name,
          className: formData.class,
          department: `O'quvchi - ${formData.class}`,
          role: "student",
          age: parseInt(formData.age) || undefined,
          phone: formData.phone,
          email: formData.email,
          parentName: formData.parentName,
          parentPhone: formData.parentPhone,
          address: formData.address,
        };

        const response = await axios.put(
          `${API_URL}/students/${currentStudent.id}`,
          updateData
        );
        console.log("✅ [ENHANCED] Student updated:", response.data);

        toast.success("O'quvchi ma'lumotlari yangilandi");
        setShowModal(false);
        loadStudents(false); // Refresh list
      } catch (error) {
        console.error("❌ [ENHANCED] Error updating student:", error);
        toast.error(
          error.response?.data?.error || "Ma'lumotlarni yangilashda xato"
        );
      }
    }
  };

  // Excel formatida eksport qilish (sinflar kesimida)
  const handleExportToExcel = () => {
    try {
      // O'quvchilarni sinf bo'yicha guruhlash
      const studentsByClass = {};

      students.forEach((student) => {
        const className = student.class || "Sinf ko'rsatilmagan";
        if (!studentsByClass[className]) {
          studentsByClass[className] = [];
        }
        studentsByClass[className].push(student);
      });

      // Workbook yaratish
      const workbook = XLSX.utils.book_new();

      // Umumiy ma'lumotlar sheeti
      const summaryData = [
        ["BM Maktab - O'quvchilar Ro'yxati"],
        ["Sana:", new Date().toLocaleDateString("uz-UZ")],
        ["Jami o'quvchilar:", students.length],
        [""],
        ["Sinflar bo'yicha taqsimot:"],
      ];

      Object.keys(studentsByClass).sort().forEach((className) => {
        summaryData.push([className, studentsByClass[className].length + " ta o'quvchi"]);
      });

      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      summarySheet["!cols"] = [{ wch: 30 }, { wch: 20 }];
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Umumiy");

      // Barcha o'quvchilar sheeti
      const allStudentsData = [
        ["#", "Ism Familiya", "Sinf", "Yosh", "Telefon", "Email", "Ota-ona", "Ota-ona Tel", "KELDI", "KETDI", "Status"]
      ];

      let index = 1;
      Object.keys(studentsByClass).sort().forEach((className) => {
        studentsByClass[className].forEach((student) => {
          allStudentsData.push([
            index++,
            student.name || "-",
            student.class || "-",
            student.age || "-",
            student.phone || "-",
            student.email || "-",
            student.parentName || "-",
            student.parentPhone || "-",
            student.keldi || "-",
            student.ketdi || "-",
            student.status === "active" ? "Faol" : "Nofaol"
          ]);
        });
      });

      const allStudentsSheet = XLSX.utils.aoa_to_sheet(allStudentsData);
      allStudentsSheet["!cols"] = [
        { wch: 5 },   // #
        { wch: 25 },  // Ism
        { wch: 20 },  // Sinf
        { wch: 8 },   // Yosh
        { wch: 15 },  // Telefon
        { wch: 20 },  // Email
        { wch: 20 },  // Ota-ona
        { wch: 15 },  // Ota-ona Tel
        { wch: 8 },   // KELDI
        { wch: 8 },   // KETDI
        { wch: 10 },  // Status
      ];
      XLSX.utils.book_append_sheet(workbook, allStudentsSheet, "Barcha O'quvchilar");

      // Har bir sinf uchun alohida sheet
      Object.keys(studentsByClass).sort().forEach((className) => {
        const classStudents = studentsByClass[className];
        const classData = [
          [`${className} - O'quvchilar ro'yxati`],
          [`Jami: ${classStudents.length} ta o'quvchi`],
          [""],
          ["#", "Ism Familiya", "Yosh", "Telefon", "Email", "KELDI", "KETDI"]
        ];

        classStudents.forEach((student, idx) => {
          classData.push([
            idx + 1,
            student.name || "-",
            student.age || "-",
            student.phone || "-",
            student.email || "-",
            student.keldi || "-",
            student.ketdi || "-"
          ]);
        });

        const classSheet = XLSX.utils.aoa_to_sheet(classData);
        classSheet["!cols"] = [
          { wch: 5 },
          { wch: 25 },
          { wch: 8 },
          { wch: 15 },
          { wch: 20 },
          { wch: 8 },
          { wch: 8 },
        ];

        // Sheet nomi uchun maxsus belgilarni olib tashlash
        const safeSheetName = className.replace(/[\\\/\?\*\[\]]/g, "-").substring(0, 31);
        XLSX.utils.book_append_sheet(workbook, classSheet, safeSheetName);
      });

      // Faylni saqlash
      const today = new Date().toISOString().split("T")[0];
      XLSX.writeFile(workbook, `Oquvchilar_${today}.xlsx`);

      toast.success("Excel fayl muvaffaqiyatli yuklandi!");
    } catch (error) {
      console.error("❌ Export error:", error);
      toast.error("Eksport qilishda xatolik yuz berdi");
    }
  };

  const activeCount = filteredStudents.filter(
    (s) => s.status === "active"
  ).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const kelganlar = Object.values(attendanceData).filter(a => a.checkIn).length;
  const davomat = students.length > 0 ? Math.round((kelganlar / students.length) * 100) : 0;

  return (
    <div className="px-6 py-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">O'quvchilar</h1>
          <p className="text-sm text-gray-500 mt-1">O'quvchilarni boshqarish va ro'yxatdan o'tkazish</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportToExcel}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={handleAddStudent}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Yangi O'quvchi
          </button>
        </div>
      </div>

      {/* Statistics Cards - Dashboard style */}
      <div className="grid grid-cols-4 gap-5 mb-6">
        {/* Jami */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-blue-50 rounded-xl">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
              100%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{students.length}</p>
          <p className="text-sm text-gray-500 mt-1">Jami O'quvchilar</p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Ro'yxatda:</span>
            <span className="text-sm font-semibold text-blue-600">{students.length} ta</span>
          </div>
        </div>

        {/* Faol */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-emerald-50 rounded-xl">
              <UserCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <span className={`text-xs font-medium px-2 py-1 rounded-full ${davomat >= 80 ? 'bg-green-50 text-green-700' : davomat >= 50 ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
              }`}>
              {davomat}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{kelganlar}</p>
          <p className="text-sm text-gray-500 mt-1">Bugun Kelganlar</p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Faol:</span>
            <span className="text-sm font-semibold text-emerald-600">{activeCount} ta</span>
          </div>
        </div>

        {/* 9-sinf */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-orange-50 rounded-xl">
              <GraduationCap className="w-5 h-5 text-orange-600" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-50 text-orange-700">
              {students.length > 0 ? Math.round((students.filter(s => s.class.startsWith("9")).length / students.length) * 100) : 0}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{students.filter(s => s.class.startsWith("9")).length}</p>
          <p className="text-sm text-gray-500 mt-1">9-Sinf</p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Bitiruvchi:</span>
            <span className="text-sm font-semibold text-orange-600">2025</span>
          </div>
        </div>

        {/* 10-11 sinf */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2.5 bg-violet-50 rounded-xl">
              <GraduationCap className="w-5 h-5 text-violet-600" />
            </div>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-violet-50 text-violet-700">
              {students.length > 0 ? Math.round((students.filter(s => s.class.startsWith("10") || s.class.startsWith("11")).length / students.length) * 100) : 0}%
            </span>
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {students.filter(s => s.class.startsWith("10") || s.class.startsWith("11")).length}
          </p>
          <p className="text-sm text-gray-500 mt-1">10-11 Sinf</p>
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">Abiturient:</span>
            <span className="text-sm font-semibold text-violet-600">2025-26</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Table Toolbar */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Qidirish..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {classes.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="w-2 h-2 bg-green-500 rounded-full"></span>
            {filteredStudents.length} ta o'quvchi
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    className="rounded border-gray-300"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  O'quvchi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sinf
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yosh
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Telefon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ota-ona
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keldi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ketdi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredStudents.map((student, index) => (
                <tr
                  key={student.id}
                  className={index % 2 === 1 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                        {student.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {student.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {student.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.class}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.age}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.phone}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {student.parentName}
                    </div>
                    <div className="text-xs text-gray-500">
                      {student.parentPhone}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {attendanceData[student.id]?.checkIn ? (
                      <span className="text-green-600 font-medium">
                        {attendanceData[student.id].checkIn}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {attendanceData[student.id]?.checkOut ? (
                      <span className="text-blue-600 font-medium">
                        {attendanceData[student.id].checkOut}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {(() => {
                      const attendance = attendanceData[student.id];
                      if (!attendance || attendance.status === "Kelmagan") {
                        return (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                            Kelmagan
                          </span>
                        );
                      }
                      if (attendance.status === "Maktabda") {
                        return (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            Maktabda
                          </span>
                        );
                      }
                      if (attendance.status === "Tugagan") {
                        return (
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                            Tugagan
                          </span>
                        );
                      }
                      return (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                          Ma'lumot yo'q
                        </span>
                      );
                    })()}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEditStudent(student)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing per page:{" "}
            <select className="border border-gray-300 rounded px-2 py-1 text-sm">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
              {"<"}
            </button>
            <button className="px-3 py-1 bg-orange-500 text-white rounded text-sm">
              1
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
              2
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
              3
            </button>
            <span className="px-2 text-sm text-gray-500">...</span>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
              25
            </button>
            <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
              {">"}
            </button>
          </div>
        </div>
      </div>

      {filteredStudents.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200 mt-6">
          <div className="text-gray-400 mb-4">
            <Search className="w-12 h-12 mx-auto" />
          </div>
          <p className="text-gray-500">O'quvchi topilmadi</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {modalMode === "add"
                  ? "Yangi O'quvchi Qo'shish"
                  : "O'quvchini Tahrirlash"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ism Familiya
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sinf
                  </label>
                  <select
                    required
                    value={formData.class}
                    onChange={(e) =>
                      setFormData({ ...formData, class: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Tanlang</option>
                    {classes
                      .filter((c) => c !== "Barcha sinflar")
                      .map((cls) => (
                        <option key={cls} value={cls}>
                          {cls}
                        </option>
                      ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yosh
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ota-ona Ismi
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) =>
                      setFormData({ ...formData, parentName: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ota-ona Telefoni
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.parentPhone}
                    onChange={(e) =>
                      setFormData({ ...formData, parentPhone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Manzil
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {modalMode === "add" ? "Qo'shish" : "Saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentsPage;
