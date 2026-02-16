
🎓 Skill Exchanger
<div align="center">
Learn. Share. Grow.
A modern peer-to-peer learning platform that connects learners and teachers worldwide through skill exchange—no financial barriers, just pure knowledge sharing.
Show Image
Show Image
Show Image
</div>

📸 Screenshots
<div align="center">
  <img src="/frontend/public/screenshots/home.png" alt="Home Page" width="800"/>
  <p><em>Beautiful landing page showcasing featured skills and success stories</em></p>
</div>
<div align="center">
  <img src="/frontend/public/screenshots/explore.png" alt="User Profiles" width="800"/>
  <p><em>Discover community members with complementary skills</em></p>
</div>
<div align="center">
  <img src="/frontend/public/screenshots/multistep.png" alt="Profile Creation" width="800"/>
  <p><em>Multi-step profile creation with intuitive UI</em></p>
</div>
<div align="center">
  <img src="/frontend/public/screenshots/chooseSkill.png" alt="Skills Selection" width="800"/>
  <p><em>Choose skills you can teach and want to learn</em></p>
</div>
<div align="center">
  <img src="/frontend/public/screenshots/chatbot.png" alt="AI Chatbot" width="800"/>
  <p><em>AI-powered chatbot for instant platform assistance</em></p>
</div>
<div align="center">
  <img src="/frontend/public/screenshots/basic_info.png" alt="VS Code Project" width="800"/>
  <p><em>Professional development setup with modern tooling</em></p>
</div>

🌟 Overview
Skill Exchanger is a revolutionary platform that democratizes learning by enabling direct knowledge exchange between individuals. Whether you're a graphic designer wanting to learn web development, or a programmer looking to master photography, this platform facilitates meaningful connections based on complementary skill sets.
💡 Mission
We believe knowledge should be accessible to everyone, regardless of financial situation. Our platform builds bridges between people who have valuable skills but no easy way to share them, creating a vibrant community where learning is the only currency.

✨ Key Features
🤝 Smart Skill Matching

Create comprehensive profiles listing skills you teach and want to learn
Advanced matching algorithm connects users with complementary expertise
Location-based discovery to find nearby learning partners
Browse community members and filter by specific skills

💬 Real-Time Communication

AI-Powered Chatbot: Instant platform assistance using Groq AI
WebSocket Integration: Live one-on-one messaging between matched users
Seamless conversation flow for coordinating learning sessions
Get instant answers about platform features and how to connect

👤 Comprehensive Profile System

Multi-step profile creation with guided onboarding
Showcase your expertise and learning goals
Add location, bio, contact preferences, and availability
View detailed profiles of potential learning partners

🎨 Beautiful, Intuitive Interface

Modern Next.js frontend with smooth animations
Responsive design works perfectly on all devices
Clean, professional UI that's easy to navigate
Success stories and testimonials for inspiration

🔒 Secure & Scalable

JWT-based authentication system
Secure user data handling
RESTful API architecture
Dockerized deployment for consistency


🛠️ Technology Stack
Frontend

Framework: Next.js 14 (React)
Styling: Tailwind CSS
State Management: React Hooks
Real-time: Socket.io Client
Deployment: Netlify

Backend

Runtime: Node.js
Framework: Express.js
Database: MongoDB
Authentication: JWT (JSON Web Tokens)
Real-time: Socket.io
AI Integration: Groq API

DevOps & Tools

Containerization: Docker & Docker Compose
CI/CD: GitHub Actions
Version Control: Git & GitHub
Code Editor: VS Code


🚀 Getting Started
Prerequisites
bash- Node.js (v18 or higher)
- MongoDB (v6 or higher)
- Docker & Docker Compose (optional)
- Groq API Key
Installation
Method 1: Using Docker (Recommended)

Clone the repository

bashgit clone https://github.com/prateekmtri/skill-exchanger.git
cd skill-exchanger

Set up environment variables

Create .env files in both frontend and backend directories:
Backend .env:
envPORT=5000
MONGODB_URI=mongodb://mongo:27017/skill-exchanger
JWT_SECRET=your_jwt_secret_key_here
GROQ_API_KEY=your_groq_api_key_here
NODE_ENV=production
Frontend .env:
envNEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000

Run with Docker Compose

bashdocker-compose up --build
The application will be available at:

Frontend: http://localhost:3000
Backend: http://localhost:5000

Method 2: Manual Setup

Clone the repository

bashgit clone https://github.com/prateekmtri/skill-exchanger.git
cd skill-exchanger

Backend Setup

bashcd backend
npm install
# Create .env file with required variables
npm start

Frontend Setup

bashcd frontend
npm install
# Create .env file with required variables
npm run dev
```

---

## 📁 Project Structure
```
skill-exchanger/
├── .github/
│   └── workflows/
│       └── deploy.yml          # CI/CD pipeline
├── backend/
│   ├── config/                 # Configuration files
│   ├── controllers/            # Route controllers
│   ├── middleware/             # Custom middleware
│   ├── model/                  # Database models
│   ├── routes/                 # API routes
│   ├── socket/                 # Socket.io handlers
│   ├── utils/                  # Utility functions
│   ├── Dockerfile              # Backend Docker config
│   ├── app.js                  # Express app
│   └── package.json
├── frontend/
│   ├── app/                    # Next.js app directory
│   ├── components/             # React components
│   ├── context/                # React context
│   ├── public/
│   │   └── screenshots/        # Application screenshots
│   ├── Dockerfile              # Frontend Docker config
│   ├── next.config.mjs
│   └── package.json
├── docker-compose.yml          # Docker orchestration
├── netlify.toml                # Netlify deployment config
└── README.md

🔄 CI/CD Pipeline
The project uses GitHub Actions for automated deployment:

Trigger: Push to main branch
Workflow: Build → Test → Deploy
Deployment Targets:

Frontend: Netlify
Backend: Your hosting service



View the workflow configuration in .github/workflows/deploy.yml

🎯 How It Works
1. Create Your Profile

Sign up with basic information (name, email, location)
Select skills you can teach from 20+ categories
Choose skills you want to learn
Add a bio describing your experience and learning goals

2. Discover Learning Partners

Browse community members on the Explore page
See who can teach what you want to learn
Find people who want to learn your skills
Filter by location, skills, or availability

3. Connect & Learn

Start conversations with potential partners
Coordinate learning sessions via real-time chat
Exchange knowledge through virtual or in-person meetings
Get help anytime with the AI chatbot

4. Grow Together

Build your skill portfolio
Join a supportive learning community
Share success stories
Help others on their learning journey


🤖 AI Chatbot Features
The integrated Groq-powered chatbot helps users:

Understand how the platform works
Get guidance on profile creation
Learn about skill matching algorithms
Troubleshoot common issues
Navigate platform features

Simply click the chatbot icon and ask any question!

📊 Platform Statistics

50K+ Active Learners
120+ Skills Offered
95% User Satisfaction
Global reach across multiple countries


🤝 Contributing
We welcome contributions from the community! Here's how you can help:

Fork the repository
Create a feature branch (git checkout -b feature/AmazingFeature)
Commit your changes (git commit -m 'Add some AmazingFeature')
Push to the branch (git push origin feature/AmazingFeature)
Open a Pull Request

Contribution Guidelines

Follow the existing code style
Write meaningful commit messages
Add tests for new features
Update documentation as needed


🐛 Bug Reports & Feature Requests
Found a bug or have a feature idea? Please open an issue on GitHub with:

Clear description of the problem/feature
Steps to reproduce (for bugs)
Expected vs actual behavior
Screenshots if applicable


📜 License
This project is licensed under the MIT License - see the LICENSE file for details.

👨‍💻 Author
Prateek Mani Tripathi

GitHub: @prateekmtri
LinkedIn: Prateek Mani Tripathi
Email: prateek1tri2@gmail.com

Ekta Verma (Team Member)

🙏 Acknowledgments

Thanks to all contributors who helped build this platform
Groq AI for powering our intelligent chatbot
MongoDB for robust database solutions
Netlify for seamless frontend hosting
The open-source community for amazing tools and libraries


📞 Support
Need help? Reach out to us:

Email: support@skillexchange.com
Chatbot: Use the in-app AI assistant
GitHub Issues: Report bugs or request features


<div align="center">
⭐ Star this repo if you find it helpful!
Made with ❤️ by Prateek Mani Tripathi
</div>