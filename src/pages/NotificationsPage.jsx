import React, { useState } from "react";
import { Bell, Send, MessageSquare, Phone, Mail, Plus } from "lucide-react";

const NotificationsPage = () => {
  const [notifications] = useState([
    {
      id: 1,
      type: "sms",
      recipient: "Ali Valiyev ota-onasi",
      message: "Bugun davomat: Kelgan",
      date: "2024-12-16 09:30",
      status: "sent",
    },
    {
      id: 2,
      type: "email",
      recipient: "10-A sinf ota-onalari",
      message: "Yig'ilish: 18-dekabr, 16:00",
      date: "2024-12-15 14:00",
      status: "sent",
    },
    {
      id: 3,
      type: "sms",
      recipient: "Dilnoza Karimova ota-onasi",
      message: "To'lov eslatmasi",
      date: "2024-12-14 10:00",
      status: "pending",
    },
  ]);

  const [templates] = useState([
    {
      id: 1,
      name: "Davomat xabarnomasi",
      content: "Hurmatli ota-ona, bugun {student} darsga {status}",
    },
    {
      id: 2,
      name: "To'lov eslatmasi",
      content: "Hurmatli ota-ona, to'lov muddati {date} gacha",
    },
    {
      id: 3,
      name: "Baho xabarnomasi",
      content: "{student} {subject} fanidan {grade} baho oldi",
    },
  ]);

  return (
    <div className="px-4 py-5 bg-gray-50 min-h-screen">
      <div className="w-full">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bildirishnomalar</h1>
          <p className="text-sm text-gray-500 mt-1">
            SMS va email xabarnomalar boshqaruvi
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Yuborilgan</p>
                <p className="text-3xl font-bold text-gray-900">156</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500">
                <Send className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Kutilmoqda</p>
                <p className="text-3xl font-bold text-gray-900">12</p>
              </div>
              <div className="p-3 rounded-lg bg-yellow-500">
                <Bell className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">SMS</p>
                <p className="text-3xl font-bold text-gray-900">98</p>
              </div>
              <div
                className="p-3 rounded-lg"
                style={{ backgroundColor: "#004A77" }}
              >
                <MessageSquare className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="text-3xl font-bold text-gray-900">58</p>
              </div>
              <div className="p-3 rounded-lg bg-purple-500">
                <Mail className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Send New Notification */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Yangi Xabar Yuborish
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xabar Turi
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>SMS</option>
                  <option>Email</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Qabul qiluvchi
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Barcha ota-onalar</option>
                  <option>10-A sinf</option>
                  <option>Alohida tanlash</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Shablon
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">Shablonsiz</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xabar
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="4"
                  placeholder="Xabaringizni yozing..."
                ></textarea>
              </div>

              <button
                className="w-full py-3 text-white rounded-lg font-medium flex items-center justify-center space-x-2"
                style={{ backgroundColor: "#004A77" }}
                onMouseEnter={(e) =>
                  (e.target.style.backgroundColor = "#003A63")
                }
                onMouseLeave={(e) =>
                  (e.target.style.backgroundColor = "#004A77")
                }
              >
                <Send className="w-5 h-5" />
                <span>Yuborish</span>
              </button>
            </div>
          </div>

          {/* Notification History */}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Xabarlar Tarixi
            </h2>

            <div className="space-y-4">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <div
                        className={`p-2 rounded-lg ${notif.type === "sms" ? "bg-blue-100" : "bg-purple-100"
                          }`}
                      >
                        {notif.type === "sms" ? (
                          <MessageSquare
                            className="w-4 h-4"
                            style={{ color: "#004A77" }}
                          />
                        ) : (
                          <Mail className="w-4 h-4 text-purple-600" />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {notif.recipient}
                      </span>
                    </div>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${notif.status === "sent"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                        }`}
                    >
                      {notif.status === "sent" ? "Yuborildi" : "Kutilmoqda"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{notif.message}</p>
                  <p className="text-xs text-gray-500">{notif.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Templates Section */}
        <div className="mt-6 bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Xabar Shablonlari
            </h2>
            <button
              className="flex items-center space-x-2 px-4 py-2 text-white rounded-lg"
              style={{ backgroundColor: "#004A77" }}
              onMouseEnter={(e) => (e.target.style.backgroundColor = "#003A63")}
              onMouseLeave={(e) => (e.target.style.backgroundColor = "#004A77")}
            >
              <Plus className="w-5 h-5" />
              <span>Yangi Shablon</span>
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h3 className="font-medium text-gray-900 mb-2">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600">{template.content}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
