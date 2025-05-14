import {
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
} from "react-icons/hi2";

/* ---------- Admin links ---------- */
export const adminLinks = [
  {
    to: "/dashboard/admin/manage-users",
    label: "Manage Users",
    icon: <HiOutlineUserGroup size={18} />,
  },
  {
    to: "/dashboard/admin/manage-courses",
    label: "Manage Courses",
    icon: <HiOutlineBookOpen size={18} />,
  },
  {
    to: "/dashboard/admin/manage-scholarships",
    label: "Manage Scholarships",
    icon: <HiOutlineAcademicCap size={18} />,
  },
  {
    to: "/dashboard/admin/stats",
    label: "System Stats",
    icon: <HiOutlineChartBar size={18} />,
  },
];

/* ---------- Student links ---------- */
export const studentLinks = [
  {
    to: "/dashboard/student/courses",
    label: "My Courses",
    icon: <HiOutlineBookOpen size={18} />,
  },
  {
    to: "/dashboard/student/assignments",
    label: "My Assignments",
    icon: <HiOutlineBookOpen size={18} />,
  },
  {
    to: "/dashboard/student/profile",
    label: "My Profile",
    icon: <HiOutlineUserGroup size={18} />,
  },
  {
    to: "/dashboard/student/scholarships",
    label: "Scholarships",
    icon: <HiOutlineAcademicCap size={18} />,
  },
  {
    to: "/dashboard/student/settings",
    label: "Settings",
    icon: <HiOutlineChartBar size={18} />,
  },

  
];

export const instructorLinks = [
  
  { to: "/dashboard/instructor/content", label: "Manage Content" },
  { to: "/dashboard/instructor/assignments", label: "Manage Assignments" },
  { to: "/dashboard/instructor/submissions", label: "Submitted Assignments" },
  { to: "/dashboard/instructor/enrolled-students", label: "Enrolled Students" },
  { to: "/dashboard/instructor/edit-profile", label: "Edit Profile" },
];