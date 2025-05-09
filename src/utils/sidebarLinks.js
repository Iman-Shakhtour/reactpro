// src/utils/sidebarLinks.js
import {
  HiOutlineUserGroup,
  HiOutlineBookOpen,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
} from "react-icons/hi2";

export const adminLinks = [
  { to: "/dashboard/manage-users",        label: "Manage Users",        icon: HiOutlineUserGroup  },
  { to: "/dashboard/manage-courses",      label: "Manage Courses",      icon: HiOutlineBookOpen   },
  { to: "/dashboard/manage-scholarships", label: "Manage Scholarships", icon: HiOutlineAcademicCap},
  { to: "/dashboard/stats",               label: "System Stats",        icon: HiOutlineChartBar   },
];

export const studentLinks = [
  { to: "/dashboard/student/courses",      label: "My Courses",      icon: HiOutlineBookOpen    },
  { to: "/dashboard/student/profile",      label: "My Profile",      icon: HiOutlineUserGroup   },
  { to: "/dashboard/student/scholarships", label: "Scholarships", icon: HiOutlineAcademicCap },
  { to: "/dashboard/student/assignments",  label: "My Assignments",  icon: HiOutlineBookOpen    },
  { to: "/dashboard/student/settings",     label: "Settings",        icon: HiOutlineChartBar    }, // ✅ أضف هذا السطر

];
