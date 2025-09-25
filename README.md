# 💻 Computer Components E-Commerce (Full-Stack)

**Description:**  
A full-stack e-commerce platform for mobile components, built with React, Express, and MongoDB. Users can browse products, filter by various criteria, add items to cart and favorites, and make purchases via integrated payment systems. Designed as a portfolio project to showcase modern web development skills. 

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
Deployed on Vercel free tier, so the first request might take ~20–30s to start
- **Client:** Deployed on Vercel (<https://no-doors-nine.vercel.app/>)  
- **Server:** Deployed on Render)  
Check out the project live and explore all features! 🎉

---

## ✨ Features
- **Reviews & Q&A:**
  - Users can leave **reviews** only for products they purchased  
  - Users can ask **questions** about products (any registered user)  
  - **Answers** to reviews and questions can be written by any registered user  
  - **Likes** can be added to reviews and questions  
  - **Five-star rating system** for reviews, with average rating automatically calculated ⭐⭐⭐⭐⭐
  - Reviews **cannot be deleted**, only edited; answers **can be deleted** by any registered user at any time
- **Toast Notifications:**
  - Custom toast notifications for user feedback  
  - Can pass a **route** parameter:
    - If a route is provided, clicking the notification navigates to that route  
    - If no route is provided, clicking simply dismisses the notification  
  - Swipe gestures on mobile devices:
    - **Swipe right:** navigates to route if provided; disabled if no route  
    - **Swipe left:** always dismisses the notification  
  - Notifications automatically disappear after 5–7 seconds
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
- **Mobile swipe interactions:**
  - In certain parts of the app, such as filter panels and site menu, swipe gestures are implemented for easier interaction on mobile devices

- RESTful API for client-server communication 🔗

- **Performance & UX Optimizations:**
  - Worked on improving CLS (Cumulative Layout Shift) in some parts of the app  
  - Ensured minimal layout shifting during page load, keeping metrics within green (good) thresholds in DevTools

---

## 🔌 Additional Integrations

- External APIs:
  - **Nova Poshta** — fetch cities and branches 🏤
- **LiqPay** payment system 💳
- **Cloudinary** for avatar uploads 📷

---

## ⚡ Installation & Setup
# Install server dependencies
```npm install```

# Run the server (Node.js)
```npm start```

# Or for development with auto-restart
```npm run dev```

# Install client dependencies
```npm install```

# Start the React app (Vite)
```npm run dev```

### 1️⃣ Clone the repository
```bash
git clone https://github.com/TheStonedFox/no-doors.git
cd no-doors
