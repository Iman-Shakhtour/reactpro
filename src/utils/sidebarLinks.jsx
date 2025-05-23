import {
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentList,
  HiOutlineUsers,
  HiOutlineCog6Tooth,
  HiOutlineHome,
} from "react-icons/hi2";
import { HiDocumentText } from "react-icons/hi2";

import { FaUser, FaCog } from "react-icons/fa";

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
  {
  to: "/dashboard/admin/scholarship-applications",
  label: "Scholarship Applications",
  icon: <HiOutlineClipboardDocumentList size={18} />,
 
  
    to: "/dashboard/admin/scholarship-applications",   // المسار الكامل
    label: "Scholarship Applications",
    icon: <HiDocumentText size={18} />,
  },
];
/* ---------- Student links ---------- */
export const studentLinks = [
  {
    to: "/dashboard/student",
    label: "Dashboard",
    icon: <HiOutlineHome size={18} />,
  },
  {
    to: "/dashboard/student/courses",
    label: "My Courses",
    icon: <HiOutlineBookOpen size={18} />,
  },
  {
    to: "/dashboard/student/assignments",
    label: "My Assignments",
    icon: <HiOutlineClipboardDocumentList size={18} />,
  },
  {
    to: "/dashboard/student/profile",
    label: "My Profile",
    icon: <FaUser size={16} />,
  },
  {
    to: "/dashboard/student/scholarships",
    label: "Scholarships",
    icon: <HiOutlineAcademicCap size={18} />,
  },
  {
    to: "/dashboard/student/settings",
    label: "Settings",
    icon: <FaCog size={16} />,
  },
];

/* ---------- Instructor links ---------- */
export const instructorLinks = [
  {
    to: "/dashboard/instructor",
    label: "Dashboard",
    icon: <HiOutlineHome size={18} />,
  },
  {
    to: "/dashboard/instructor/content",
    label: "Manage Content",
    icon: <HiOutlineBookOpen size={18} />,
  },
  {
    to: "/dashboard/instructor/assignments",
    label: "Manage Assignments",
    icon: <HiOutlineClipboardDocumentList size={18} />,
  },
  {
    to: "/dashboard/instructor/submissions",
    label: "Submitted Assignments",
    icon: <HiOutlineChartBar size={18} />,
  },
  {
    to: "/dashboard/instructor/enrolled-students",
    label: "Enrolled Students",
    icon: <HiOutlineUsers size={18} />,
  },
  {
    to: "/dashboard/instructor/profile",
    label: "My Profile",
    icon: <FaUser size={16} />,
  },
  {
    to: "/dashboard/instructor/settings",
    label: "Settings",
    icon: <FaCog size={16} />,
  },
];
