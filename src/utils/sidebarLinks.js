// src/utils/sidebarLinks.js
import {
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
} from "react-icons/hi2";

export const adminLinks = [
  { to: "/dashboard/admin/manage-users",        label: "Manage Users",        icon: HiOutlineUserGroup },
  { to: "/dashboard/admin/manage-courses",     label: "Manage Courses",      icon: HiOutlineBookOpen },
  { to: "/dashboard/admin/manage-scholarships",label: "Manage Scholarships", icon: HiOutlineAcademicCap },
  { to: "/dashboard/admin/stats",              label: "System Stats",        icon: HiOutlineChartBar },
];
export const studentLinks = [
  { to: "/dashboard/student/courses",      label: "My Courses",      icon: HiOutlineBookOpen    },
  { to: "/dashboard/student/progress",     label: "My Progress",     icon: HiOutlineChartBar    },
  { to: "/dashboard/student/profile",      label: "My Profile",      icon: HiOutlineUserGroup   },
  { to: "/dashboard/student/scholarships", label: "My Scholarships", icon: HiOutlineAcademicCap },
];
