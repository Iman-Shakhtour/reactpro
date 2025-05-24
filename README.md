# 📘 LMS Frontend (React)

This is the frontend application for the **Learning Management System (LMS)**. It is built using **React.js**, organized by user roles (`admin`, `instructor`, `student`, `donor`), and interacts with the LMS backend via secured REST APIs (Spring Boot microservices).

> ✅ Designed for multi-role access: **Admin, Instructor, Student, Donor**  
> 🔐 Secure authentication using JWT tokens  
> 📡 Inter-service communication is managed via the API Gateway in the backend

---

## 🔧 Project Setup

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Prerequisites

- Node.js (v16+ recommended)
- npm

### Installation

```bash
git clone https://github.com/Iman-Shakhtour/reactpro.git
cd reactpro
npm install
```

### Running the App

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Folder Structure

```
src/
├── api/                      # Axios instance and role-based API service files
│   ├── adminApi.js
│   ├── instructorApi.js
│   ├── studentApi.js
│   └── axiosInstance.js
│
├── components/              # Reusable components (Layout, Sidebar, Navbar, Routes)
│
├── pages/
│   ├── admin/               # Admin dashboard pages
│   ├── instructor/          # Instructor dashboard pages
│   └── student/             # Student-facing pages
│
├── utils/                   # Utility functions and constants
│
├── App.jsx                  # Main app with routing and layout
├── index.js                 # React entry point
```

---

## ✨ Features

### ✅ Admin

* Dashboard with statistics  
* Add/edit/delete users  
* Manage scholarships & applications  
* View system statistics  

### ✅ Instructor

* Upload & manage course content  
* Grade submitted assignments  
* View enrolled students  
* Manage profile & settings  

### ✅ Student

* View assigned courses  
* Submit assignments  
* Track grades and notifications  
* Apply for scholarships  

---

## 🔐 Authentication

* JWT-based secure login/signup  
* Role-based route protection using `PrivateRoute.js` and `ProtectedRoute.js`  
* Axios interceptor automatically attaches the token for authenticated requests  

---

## 📡 Backend Integration

This app connects to a **Spring Boot** backend structured into microservices:

* **User Service** – manages authentication, user profiles, roles  
* **Course Service** – handles courses, content, assignments  
* **Enrollment Service** – tracks enrollments and student-course links  
* **Notification Service** – sends updates to users  
* **API Gateway** – routes and secures all frontend requests  

> Example backend repo: [https://github.com/your-username/lms-backend](https://github.com/your-username/lms-backend)

---

## 🧪 Testing

```bash
npm test
```

Runs unit tests for components and logic.

---

## 🛠 Build for Production

```bash
npm run build
```

Builds the project in production mode.

---

## 📜 License

This project is licensed under the MIT License.
