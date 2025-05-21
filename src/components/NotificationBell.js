import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "./notification.css";
import dayjs from "dayjs";


const NotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
      console.log("Current userId:", localStorage.getItem("userId")); // ✅ أضف هذا هنا

    if (userId) {
      axiosInstance
        .get(`/api/notifications/user/${userId}`)
        .then(res => setNotifications(res.data))
        .catch(err => console.error("🔔 Failed to fetch notifications", err));
    }
  }, [userId]);

  const markAsRead = async (id) => {
    try {
      await axiosInstance.put(`/api/notifications/${id}/mark-as-read`);
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, status: "READ" } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const unreadCount = notifications.filter(n => n.status === "UNREAD").length;

  return (
    <div className="notification-container">
      <div className="bell-icon" onClick={() => setDropdownOpen(prev => !prev)}>
        🔔
        {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
      </div>

      <div className="dropdown" style={{ display: dropdownOpen ? "block" : "none" }}>
        <h4 className="dropdown-header">Notifications</h4>

        {notifications.length === 0 ? (
          <p className="empty-msg">📭 You have no notifications yet.</p>
        ) : (
        notifications.map(n => (
  <div key={n.id} className={`notification ${n.status === "UNREAD" ? "unread" : ""}`}>
    <strong>{n.title}</strong>
    <p>{n.message}</p>
    <p className="notif-time">
      {dayjs(n.timestamp).format("DD MMM YYYY - hh:mm A")}
    </p>
    <button onClick={() => markAsRead(n.id)}>Mark as Read</button>
  </div>
))

        )}
      </div>
    </div>
  );
};

export default NotificationBell;
