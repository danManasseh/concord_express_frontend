# 🚀 Concord Express Frontend

Welcome to the frontend repository for **Concord Express**, a modern delivery and logistics management platform. This project provides the user interface for tracking parcels, managing stations, and handling user authentication.

## 💻 Tech Stack

This project was initially generated using Anima and utilizes the following key technologies:

- **Frontend Framework:** React 
- **Package Manager:** npm
- **Build Tool:** Vite

## 🛠️ Local Development Setup

Follow these steps to get the project running on your local machine.

### Prerequisites

You must have the following installed:

- Node.js (LTS recommended)
- A running instance of the **Concord Express Backend** API (default: http://localhost:8000/api/)

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a file named **.env.local** in the project root:

```
VITE_API_BASE_URL="http://localhost:8000/api/"
```

### 3. Run the Development Server

```bash
npm run dev
```

Your project should now be accessible at:

```
http://localhost:5173/
```

## 📦 Building for Production

Create an optimized production build:

```bash
npm run build
```

Output will be located in the **/dist** directory.

## 🤝 Contribution Guidelines

We use a protected-branch workflow:

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```
2. Commit changes normally.
3. Push your branch:
   ```bash
   git push origin feature/your-feature-name
   ```
4. Open a Pull Request (PR) into `main`.

---
