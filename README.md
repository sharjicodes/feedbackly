


# 🌟 Feedbackly

Feedbackly is a modern feedback-sharing platform where users can post anonymous thoughts or image posts and receive constructive feedback from others. It combines a polished UI, responsive design, real-time interaction, and authentication features, all built using the **MERN stack**.

> 🧪 Live Demo: [https://feedbackly-wnx4.vercel.app/]

---

## 🚀 Features

✅ Anonymous posting (image or text)  
✅ Logged-in users can comment on others' posts  
✅ Users cannot comment on their own posts  
✅ Dashboard with:
- My Posts  
- Comments received on my posts  
- Comments I’ve made on others' posts  
✅ Dark mode support  
✅ Mobile-friendly responsive UI  
✅ Cloudinary image uploads  
✅ Email syntax validation using Mailboxlayer  
✅ JWT-based authentication  
✅ Animated reactions and smooth UI interactions

---

## 🧱 Tech Stack

### 🌐 Frontend
- React
- TailwindCSS
- Axios
- React Router DOM
- Cloudinary (image previews)

### 🔧 Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JSON Web Token (JWT)
- dotenv
- Cloudinary SDK
- Mailboxlayer API

---

## 📁 Folder Structure

feedbackly-main/
│
├── backend/         # Express server & MongoDB models
│   ├── controllers/ # Auth, post, comment logic
│   ├── models/      # Mongoose models (User, Post, Comment)
│   ├── routes/      # API endpoints
│   └── server.js    # Main backend entry
│
├── frondend/        # React + Tailwind frontend
│   ├── src/         # Components & pages
│   └── public/      # Static assets
│
├── .gitignore
├── README.md

---

## ⚙️ Prerequisites

- [Node.js](https://nodejs.org/) (v16+)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary account](https://cloudinary.com/)
- [Mailboxlayer API Key](https://mailboxlayer.com/)

---

## 🛠️ Local Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/your-username/feedbackly-main.git
cd feedbackly-main

2. Install Dependencies

🔙 Backend

cd backend
npm install

🌐 Frontend

cd ../frondend
npm install


⸻

🔐 Setup Environment Variables

✅ backend/.env

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
MAILBOXLAYER_API_KEY=your_mailboxlayer_api_key

✅ frondend/.env

REACT_APP_API_BASE_URL=http://localhost:5000/api


⸻

▶️ Run Locally

In two terminal tabs or windows:

Start Backend

cd backend
npm run dev

Start Frontend

cd frondend
npm start

The app will open at:
📍 http://localhost:3000

⸻

📷 Image Uploads

Images are uploaded to Cloudinary. Ensure the environment variables are configured properly for persistent hosting.

⸻

🧪 Optional: Deploy to Production

You can deploy using:
	•	Frontend: Vercel / Netlify
	•	Backend: Render / Railway / Cyclic
	•	Database: MongoDB Atlas
	•	Environment Variables: Set in respective dashboard

⸻

📌 Important Notes
	•	Anonymous users can post but must log in to comment.
	•	Users cannot comment on their own posts.
	•	You can log in to access your dashboard, view personal posts, received comments, and comments made.

⸻

📄 License

This project is licensed under the MIT License.

⸻

🙋‍♂️ Author

Made with ❤️ by Sharjith Ambadi
📧 sharjithambadi@gmail.com
🔗 LinkedIn

---
