# Avocado.ai Portal

A comprehensive cybersecurity and AI company portal built with Next.js frontend and FastAPI backend.

## 🚀 Features

### Frontend (Next.js)
- Modern responsive design with Tailwind CSS
- Home page with company introduction
- Techniques page showcasing cybersecurity and AI technologies
- Products page displaying company solutions
- Cases page with success stories and case studies
- Contact page with inquiry form

### Backend (FastAPI)
- RESTful API endpoints
- Content management system
- Database integration (PostgreSQL)
- Authentication system
- File upload capabilities

## 🛠 Tech Stack

### Frontend
- Next.js 14
- React 18
- Tailwind CSS
- TypeScript
- Framer Motion (animations)

### Backend
- FastAPI
- Python 3.11+
- SQLAlchemy (ORM)
- PostgreSQL
- Pydantic (data validation)
- JWT authentication

## 📁 Project Structure

```
avocado-portal/
├── frontend/          # Next.js application
├── backend/           # FastAPI application
├── docker-compose.yml # Development environment
└── README.md
```

## 🚀 Quick Start

1. Clone the repository
2. Start the development environment:
   ```bash
   docker-compose up
   ```
3. Access the application:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🔧 Development

### Frontend Development
```bash
cd frontend
npm install
npm run dev
```

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

## 📝 Environment Variables

Create `.env` files in both frontend and backend directories with necessary configuration.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License. 