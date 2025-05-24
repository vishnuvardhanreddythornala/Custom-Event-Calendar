# 📅 Custom Event Calendar

Custom Event Calendar is a React.js-based application designed to help users efficiently manage their schedules. It offers a clean monthly calendar view where users can add, edit, delete, and drag-and-drop events to reschedule them. The app supports recurring events with customizable patterns and handles event conflicts gracefully. Built with responsiveness in mind, it works smoothly across devices. Data persistence ensures events are saved locally for seamless user experience.

---

## 📑 Table of Contents
- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Project Structure](#-project-structure)
- [Limitations and Future Work](#-limitations-and-future-work)
- [License](#-license)
- [Contact](#-contact)

---

## 📖 About the Project

Managing personal or team events can become overwhelming without a dedicated tool.  
This Custom Event Calendar offers a clean and intuitive interface to add, edit, and manage your events efficiently.  
The project is built with modern frontend tools and demonstrates effective component-based architecture with Tailwind CSS styling.

---

## ✨ Features

- Add, edit, and delete calendar events
- Interactive and responsive calendar UI
- Day, week, and month view modes *(if applicable)*
- Lightweight performance using Vite
- TypeScript support for code reliability and clarity

---

## 🛠️ Tech Stack

- TypeScript  
- React  
- Tailwind CSS  
- Vite  
- Node.js

---

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/vishnuvardhanreddythornala/Custom-Event-Calendar.git

# Navigate to the project directory
cd Custom-Event-Calendar

# Install dependencies
npm install

# Start the development server
npm run dev

# After running the above command, you should see output similar to this in your terminal:

  ➜  Local:   http://localhost:5173/     -->open your browser and go to http://localhost:5173 to view the app.
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```
## 🚀 Usage
    1.Launch the app with npm run dev.
    
    2.Click on a date to create a new event.
    
    3.Edit or delete existing events using the interface.
  
  4.Navigate through the calendar to view events across days or months.
## 📁 Project Structure
```
Custom-Event-Calendar/
├── configuration/
│   └── config.json
├── dist/
│   ├── assets/
│   └── index.html
├── node_modules/
├── src/
│   ├── components/
│   │   ├── Calendar/
│   │   ├── Events/
│   │   └── UI/
│   ├── types/
│   │   └── index.ts
│   ├── utils/
│   │   ├── dateUtils.ts
│   │   └── eventUtils.ts
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts

```

## ⚡ Limitations and Future Work
  - Events are not currently stored persistently (no backend or database)
  
  - No authentication or multi-user support
  
## Future Enhancements:
  
  - Add login and user accounts
  
  - Integrate calendar API (e.g., Google Calendar)
  
  - Persistent storage using Firebase or Supabase
  
  - Event reminders and notifications

## 📜 License
  This project is licensed under the MIT License.

## 📞 Contact
- **Name**: Thornala Vishnu Vardhan Reddy
- **GitHub**: [@vishnuvardhanreddythornala](https://github.com/vishnuvardhanreddythornala)
- **Email**: [vishnuvardhanreddythornala@gmail.com]
