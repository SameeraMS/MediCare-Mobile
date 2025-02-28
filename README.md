# **Medicare Doctor Channeling Mobile App**

## 🏠 **Project Overview**
This is a **Medicare Doctor Channeling Mobile App** that allows patients to book doctor appointments online and provides an admin dashboard for managing appointments, doctors, and users. The project is built using modern mobile technologies with a **React Native** frontend and a **Node.js & Express** backend.

## 🚀 **Tech Stack**
### **Frontend:**
- React Native
- Axios
- Typescript
- Tailwind CSS (for styling)

### **Backend:**
- Node.js
- Express.js
- MongoDB

### **Other Dependencies:**
- JWT for authentication
- Bcrypt for password hashing
- Dotenv for environment variables

---

## 🔧 **Features**
### **Patient Features:**
- User registration & authentication (JWT-based login/logout)
- Browse available doctors and specialties
- Book doctor appointments
- View appointment history


## ⚙️ **Installation & Setup**

### **1️⃣ Clone the Repository**
*FrontEnd Mobile App*
```sh
git clone https://github.com/SameeraMS/MediCare-Mobile.git
```

*Backend*
```sh
git clone https://github.com/SameeraMS/Medi-Care-Backend.git
```

### **2️⃣ Backend Setup**
```sh
npm install
```
#### **Environment Variables:**
Create a `.env` file in the backend directory and add the following:
```env
PORT=3000
DATABASE_URL=mongodb+srv://your-db-url
JWT_SECRET=your-secret-key
REFRESH_TOKEN=your-refresh-token
```
#### **Run Backend Server:**
```sh
npm start
```

#### **Run Frontends:**
```sh
expo start
```

## 👥 Contributors
- **sameera madushan** - [GitHub](https://github.com/SameeraMS)

---

## 📜 License
This project is licensed under the MIT License.

---