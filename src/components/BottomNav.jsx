import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Calendar, Bell } from "lucide-react";

const BottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-gray-200 dark:border-slate-800 z-50 px-6 py-3 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.05)] transition-colors duration-300">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${
                isActive
                  ? "text-indigo-600 dark:text-indigo-400 scale-110"
                  : "text-gray-400 dark:text-slate-500 hover:text-gray-600"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-900/30 shadow-sm"
                    : "bg-transparent"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "stroke-[2.5]" : "stroke-[2]"}`} />
              </div>
              <span className={`text-[10px] font-bold uppercase tracking-wider transition-all duration-300 ${isActive ? "opacity-100" : "opacity-60"}`}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-1 w-1 h-1 bg-indigo-600 dark:bg-indigo-400 rounded-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNav;
