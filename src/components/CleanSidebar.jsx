import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Bell, Droplets } from "lucide-react";

const CleanSidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: "dashboard", path: "/dashboard", icon: Home, label: "Dashboard" },
    {
      id: "water-usage",
      path: "/water-usage",
      icon: Calendar,
      label: "Davomat",
    },
    {
      id: "notifications",
      path: "/notifications",
      icon: Bell,
      label: "Bildirishnomalar",
    },
  ];

  return (
    <aside className="w-64 h-screen sticky top-0 flex flex-col bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100">
            <img src="/water.png" alt="O'zsuvta'minot" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">Davomat Tizimi</h2>
            <p className="text-xs text-gray-500">Attendance System</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive
                    ? "bg-[rgb(0,74,119)] text-white shadow-lg shadow-blue-900/20"
                    : "text-gray-700 hover:bg-gray-100"
                  }
                `}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default CleanSidebar;
