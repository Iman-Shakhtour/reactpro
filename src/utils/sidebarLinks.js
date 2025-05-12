// src/utils/sidebarLinks.js

// Links visible to student users
export const studentLinks = [
  { to: "/dashboard/student/courses", label: "My Courses", icon: "📚" },
  { to: "/dashboard/student/progress", label: "My Progress", icon: "📈" },
  { to: "/dashboard/student/profile", label: "My Profile", icon: "🙍‍♂️" },
  { to: "/dashboard/student/scholarships", label: "My Scholarships", icon: "🎓" },
];

// Links visible to admin users
export const adminLinks = [
  { to: "/dashboard/admin/manage-users", label: "Manage Users", icon: "👥" },
  { to: "/dashboard/admin/manage-courses", label: "Manage Courses", icon: "📚" },
  { to: "/dashboard/admin/manage-scholarships", label: "Manage Scholarships", icon: "🎓" },
  { to: "/dashboard/admin/stats", label: "System Stats", icon: "📊" },
];

// Links visible to instructor users
export const instructorLinks = [
  
  { to: "/dashboard/instructor/content", label: "Manage Content" },
  { to: "/dashboard/instructor/assignments", label: "Manage Assignments" },
  { to: "/dashboard/instructor/submissions", label: "Submitted Assignments" },
  { to: "/dashboard/instructor/enrolled-students", label: "Enrolled Students" },
  { to: "/dashboard/instructor/edit-profile", label: "Edit Profile" },
];