# 🛍️ Fashion E-Commerce Application

A modern, responsive fashion e-commerce marketplace built with **React**, **TypeScript**, and **Tailwind CSS**. Features a WhatsApp-integrated checkout system and comprehensive admin dashboard for product management.

![React](https://img.shields.io/badge/React-18.3.1-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6.2-3178C6?logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0.3-38B2AC?logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3.0-646CFF?logo=vite&logoColor=white)

---

## ✨ Features

### 🛒 **Customer Features**
- **Product Browsing** - Browse products by categories (Shoes, Pants, Shirts)
- **Product Details** - View detailed product information with image gallery
- **Multi-language Support** - Toggle between English and Indonesian
- **Dark Mode** - Seamless dark/light theme switching
- **WhatsApp Checkout** - Direct checkout via WhatsApp with pre-filled message
- **Responsive Design** - Fully responsive on all devices

### 👨‍💼 **Admin Features**
- **Product Management** - Full CRUD operations for products
- **Category Management** - Create and manage product categories
- **Image Upload** - Upload main product image and multiple gallery images
- **Image Management** - Update/delete main and gallery images
- **Authentication** - Secure admin login with JWT tokens
- **Real-time Updates** - Instant UI updates after data changes

---

## 🚀 Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI Framework |
| **TypeScript** | Type Safety |
| **Vite** | Build Tool & Dev Server |
| **Tailwind CSS** | Styling |
| **Axios** | HTTP Client |
| **React Router** | Navigation |
| **Lucide React** | Icons |
| **Context API** | State Management |

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Backend API** running on server

---

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure API Endpoint
Update the backend API URL in two files:

**`src/services/api.ts`**
```typescript
const API_BASE_URL = 'http://your-backend-ip:5000/api';
```

**`src/utils/image.ts`**
```typescript
const BASE_URL = 'http://your-backend-ip:5000';
```

### 4. Start development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173/`

---

## 📦 Build for Production

```bash
# Build the project
npm run build

# Preview production build
npm run preview
```

The production-ready files will be in the `dist/` directory.

---

## 🌐 Deployment

### Deploy to Netlify/Vercel

1. Build the project:
   ```bash
   npm run build
   ```

2. Upload the `dist/` folder to your hosting service

3. Configure environment variables if needed

---

## 🔧 Configuration

### Backend Integration

The application connects to a backend API. Make sure your backend:

1. **CORS enabled** to accept requests from frontend domain
2. **Static file serving** configured for `/uploads/` directory
3. **JWT authentication** implemented for admin routes

Example backend CORS setup:
```javascript
const cors = require('cors');

app.use(cors({
  origin: '*', // or specify your frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
```

---

## 📁 Project Structure

```
frontend/
├── public/              # Public assets
├── src/
│   ├── components/      # React components
│   │   ├── AdminDashboard.tsx
│   │   ├── AdminProductForm.tsx
│   │   ├── AdminProductList.tsx
│   │   ├── AdminImageManager.tsx
│   │   ├── CategoryShowcase.tsx
│   │   ├── FeaturedCollection.tsx
│   │   ├── ProductCard.tsx
│   │   └── ...
│   ├── context/         # React Context (Language, Theme)
│   │   ├── LanguageContext.tsx
│   │   └── ThemeContext.tsx
│   ├── models/          # TypeScript interfaces
│   │   └── index.ts
│   ├── pages/           # Page components
│   │   ├── LandingPage.tsx
│   │   ├── MarketplacePage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── LoginPage.tsx
│   │   └── AdminDashboard.tsx
│   ├── services/        # API services
│   │   └── api.ts
│   ├── utils/           # Utility functions
│   │   └── image.ts
│   ├── App.tsx          # Main app component
│   ├── index.css        # Global styles
│   └── main.tsx         # App entry point
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## 🎨 Customization

### Colors & Branding
Edit `src/index.css` to customize:
- Color palette
- Typography
- Custom animations

### Languages
Add or modify translations in `src/context/LanguageContext.tsx`

### Categories
Categories are dynamically fetched from the backend API

---

## 🔐 Admin Access

### Default Admin Route
```
/admin
```

### Login
1. Navigate to `/admin/login`
2. Enter admin credentials
3. Access admin dashboard for product management

---

## 📸 Screenshots

### Homepage
Modern landing page with category showcase

### Marketplace
Browse all products with filtering options

### Product Detail
Detailed product view with image gallery and WhatsApp checkout

### Admin Dashboard
Comprehensive product and category management

---

## 🐛 Troubleshooting

### Images not loading
- Check `BASE_URL` in `src/utils/image.ts`
- Ensure backend serves static files from `/uploads/`
- Verify CORS configuration on backend

### API requests failing
- Check `API_BASE_URL` in `src/services/api.ts`
- Ensure backend is running and accessible
- Check browser console for CORS errors

### Token invalid errors
- Clear browser localStorage
- Login again to get new token

---

## 📝 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- Images from [Unsplash](https://unsplash.com/)
- Built with ❤️ using React & TypeScript

---

## 📞 Support

For support, email your.email@example.com or open an issue in the GitHub repository.

---

**⭐ If you find this project helpful, please consider giving it a star on GitHub!**
