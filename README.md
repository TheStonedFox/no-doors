# 💻 Computer Components E-Commerce (Full-Stack)

**Description:**  
A full-stack e-commerce platform for computer components, built with React, Express, and MongoDB. Users can browse products, filter by various criteria, add items to cart and favorites, and make purchases via integrated payment systems. Designed as a portfolio project to showcase modern web development skills. 🚀

---

## 🛠 Tech Stack
- **Frontend:** React, Vite, SCSS, CSS Modules, JavaScript  
- **State Management:** Redux Toolkit  
- **Routing & UI:** React Router, Swiper, React Icons  
- **Backend:** Node.js, Express  
- **Database:** MongoDB, Mongoose  
- **Authentication & Security:** JWT, Google reCAPTCHA, bcrypt  
- **File & Media Handling:** Multer, Cloudinary  
- **Email & Payments:** Nodemailer, LiqPay  
- **Utilities & Dev Tools:** dotenv, cors, crypto, ESLint, Prettier

---

## 🌐 Live Demo & Deployment
- **Client:** Deployed on [Vercel](<https://no-doors-nine.vercel.app/>)  
- **Server:** Deployed on [Render])  
Check out the project live and explore all features! 🎉

---

## ✨ Features

### Product Reviews and Questions

- **Product Reviews** – Users can leave reviews only for products they have purchased. Reviews include a rating in a five-star system. Users can edit their own reviews, and the history of changes is preserved so others can see how opinions evolved over time.  
- **Product Questions** – Any user can ask questions about any product, regardless of purchase history.  
- **Answers to Reviews and Questions** – Any user can post answers to existing reviews and questions.  
- **Product Rating** – The average rating of a product is calculated automatically based on all reviews and displayed with the total number of reviews.

- **Product Catalog with Filters:**
  - Brand, category, device model, device type, price range (slider)
- Cart and Favorites 🛒❤️
- User authentication and email verification 📧
- Password recovery via email link (valid for 5 minutes) 🔒
- Fully responsive UI (desktop & mobile) 📱💻
- Dark and light themes 🌙☀️
- UX enhancements:
  - Product image zoom on hover 🔍
  - Scroll-to-top button ⬆️
  - Skeleton loaders for smoother experience ⚡
- RESTful API for client-server communication 🔗

---

## 🔌 Additional Integrations

- External APIs:
  - **Nova Poshta** — fetch cities and branches 🏤
- **LiqPay** payment system 💳
- **Cloudinary** for avatar uploads 📷

---

## ⚡ Installation & Setup
cd server
npm install          # Install backend dependencies
npm start            # Run the server (Node.js)

cd client
npm install          # Install frontend dependencies
npm run dev          # Start the React app (Vite)

### 1️⃣ Clone the repository
```bash
git clone https://github.com/TheStonedFox/no-doors.git
cd no-doors
