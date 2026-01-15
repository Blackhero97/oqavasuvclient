import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import { API_URL as BASE_URL } from "../config";

const API_URL = `${BASE_URL}/api`;

const STAFF_TYPES = [
  { value: "teacher", label: "O'qituvchi" },
  { value: "cleaner", label: "Tozolovchi" },
  { value: "guard", label: "Qorovul" },
  { value: "cook", label: "Oshpaz" },
  { value: "director", label: "Direktor" },
  { value: "vice_director", label: "Zavuch" },
  { value: "hr", label: "HR/Kadrlar" },
];

const SUBJECTS = [
  "Matematika",
  "Fizika",
  "Kimyo",
  "Biologiya",
  "Informatika",
  "Ingliz tili",
  "Rus tili",
  "O'zbek tili",
  "Adabiyot",
  "Tarix",
  "Geografiya",
  "Jismoniy tarbiya",
  "Musiqa",
  "Tasviriy san'at",
];

const SHIFTS = ["Kunduzi", "Kechqurun", "Tungi", "Sutkalik"];

const SPECIALTIES = [
  "Milliy taomlar",
  "Yevropa oshxonasi",
  "Salatlar",
  "Non va qandolat",
  "Dieta ovqatlari",
];

const EditStaffModal = ({ employee, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    staffType: "",
    subject: "",
    shift: "",
    specialty: "",
    department: "",
    salary: "",
    phone: "",
    email: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (employee) {
      setFormData({
        staffType: employee.staffType || "",
        subject: employee.subject || "",
        shift: employee.shift || "",
        specialty: employee.specialty || "",
        department: employee.department || "",
        salary: employee.salary || "",
        phone: employee.phone || "",
        email: employee.email || "",
      });
    }
  }, [employee]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData = {
        role: "staff",
        staffType: formData.staffType,
      };

      // Add relevant fields based on staff type
      if (formData.staffType === "teacher") {
        if (formData.subject) updateData.subject = formData.subject;
        if (formData.salary) updateData.salary = formData.salary;
        if (formData.phone) updateData.phone = formData.phone;
        if (formData.email) updateData.email = formData.email;
      } else if (
        formData.staffType === "cleaner" ||
        formData.staffType === "guard"
      ) {
        if (formData.shift) updateData.shift = formData.shift;
        if (formData.salary) updateData.salary = formData.salary;
        if (formData.phone) updateData.phone = formData.phone;
      } else if (formData.staffType === "cook") {
        if (formData.specialty) updateData.specialty = formData.specialty;
        if (formData.salary) updateData.salary = formData.salary;
        if (formData.phone) updateData.phone = formData.phone;
      } else if (
        formData.staffType === "director" ||
        formData.staffType === "hr"
      ) {
        if (formData.salary) updateData.salary = formData.salary;
        if (formData.phone) updateData.phone = formData.phone;
        if (formData.email) updateData.email = formData.email;
      } else if (formData.staffType === "vice_director") {
        if (formData.department) updateData.department = formData.department;
        if (formData.salary) updateData.salary = formData.salary;
        if (formData.phone) updateData.phone = formData.phone;
        if (formData.email) updateData.email = formData.email;
      }

      const response = await axios.put(
        `${API_URL}/employee/${employee._id}`,
        updateData
      );

      if (response.data) {
        toast.success(`${employee.name} ma'lumotlari yangilandi!`);
        onSave(response.data);
        onClose();
      }
    } catch (error) {
      console.error("Error updating employee:", error);
      toast.error(
        "Xatolik yuz berdi: " + (error.response?.data?.message || error.message)
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !employee) return null;

  const selectedStaffType = STAFF_TYPES.find(
    (type) => type.value === formData.staffType
  );

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-medium text-gray-900">
                Xodim ma'lumotlarini tahrirlash
              </h3>
              <p className="text-xs text-gray-500 mt-1">{employee?.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <form
          onSubmit={handleSubmit}
          className="p-4 overflow-y-auto max-h-[calc(90vh-140px)]"
        >
          {/* Staff Type */}
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Xodim turi
            </label>
            <select
              name="staffType"
              value={formData.staffType}
              onChange={handleInputChange}
              className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="">Xodim turini tanlang</option>
              {STAFF_TYPES.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Dynamic fields based on staff type */}
          {formData.staffType === "teacher" && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fan
                </label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Fan tanlang</option>
                  {SUBJECTS.map((subject) => (
                    <option key={subject} value={subject}>
                      {subject}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Email kiriting"
                />
              </div>
            </>
          )}

          {(formData.staffType === "cleaner" ||
            formData.staffType === "guard") && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ish vaqti
              </label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleInputChange}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Ish vaqtini tanlang</option>
                {SHIFTS.map((shift) => (
                  <option key={shift} value={shift}>
                    {shift}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.staffType === "cook" && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mutaxassislik
              </label>
              <select
                name="specialty"
                value={formData.specialty}
                onChange={handleInputChange}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Mutaxassislik tanlang</option>
                {SPECIALTIES.map((specialty) => (
                  <option key={specialty} value={specialty}>
                    {specialty}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.staffType === "vice_director" && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bo'lim
              </label>
              <input
                type="text"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Bo'lim nomini kiriting"
              />
            </div>
          )}

          {(formData.staffType === "director" ||
            formData.staffType === "vice_director" ||
            formData.staffType === "hr") && (
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Email kiriting"
              />
            </div>
          )}

          {/* Common fields */}
          {formData.staffType && (
            <>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maosh
                </label>
                <input
                  type="number"
                  name="salary"
                  value={formData.salary}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Maosh miqdorini kiriting"
                />
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefon
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Telefon raqamini kiriting"
                />
              </div>
            </>
          )}

          {/* Footer */}
          <div className="flex gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-3 py-1.5 text-xs text-gray-600 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              disabled={!formData.staffType || loading}
              className="flex-1 px-3 py-1.5 text-xs text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-gray-300"
            >
              {loading ? "..." : "Saqlash"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStaffModal;
