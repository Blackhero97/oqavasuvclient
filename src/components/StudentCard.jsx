import React from "react";
import { Users, Clock, UserCheck, UserX } from "lucide-react";

const StudentCard = ({ student }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case "present":
        return "bg-green-50 border-green-200 text-green-700";
      case "late":
        return "bg-orange-50 border-orange-200 text-orange-700";
      case "absent":
        return "bg-red-50 border-red-200 text-red-700";
      default:
        return "bg-gray-50 border-gray-200 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "present":
        return <UserCheck className="w-4 h-4" />;
      case "late":
        return <Clock className="w-4 h-4" />;
      case "absent":
        return <UserX className="w-4 h-4" />;
      default:
        return <Users className="w-4 h-4" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "present":
        return "Keldi";
      case "late":
        return "Kech keldi";
      case "absent":
        return "Kelmadi";
      default:
        return "Noma'lum";
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-3 md:p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center space-x-2 md:space-x-3">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm md:text-base">
          {student.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-sm md:text-base truncate">
            {student.name}
          </h3>
          <p className="text-xs md:text-sm text-gray-500">{student.class}</p>
        </div>
        <div
          className={`px-2 md:px-3 py-1 rounded-full text-xs md:text-sm font-medium border ${getStatusColor(
            student.status
          )} flex items-center space-x-1`}
        >
          {getStatusIcon(student.status)}
          <span className="hidden sm:inline">
            {getStatusText(student.status)}
          </span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm">
        <div className="flex items-center text-gray-600">
          <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
          <span>Keldi: {student.checkInTime || "—"}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="w-3 h-3 md:w-4 md:h-4 mr-1" />
          <span>Ketdi: {student.checkOutTime || "—"}</span>
        </div>
      </div>
    </div>
  );
};

export default StudentCard;
