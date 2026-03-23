FinanceTracker
A High-Performance Financial Analytics Dashboard & Automated Expense Tracker.

FinanceTracker is a full-stack web application designed to simplify personal finance management. It combines automated data entry (OCR scanning) with powerful visual analytics to provide real-time insights into your financial health.

Key Features:
Executive Dashboard: Real-time overview of Balance, Income, Expenses, and Burn Rate.

OCR Receipt Scanning: Automates transaction entry by extracting data from receipt images using AI.

Smart Budgeting: Predictive analytics using the 50/30/20 rule to suggest budget adjustments.

Visual Analytics: Interactive "Spending vs. Budget" trend analysis and "Cash Flow Health" donuts powered by Chart.js.

Secure Auth: Industry-standard JWT (JSON Web Token) authentication for protected user sessions.

Reporting Engine: One-click downloads for financial summaries in Excel and PDF formats.

Tech Stack
Frontend
Framework: React (Vite)

Styling: Tailwind CSS + Shadcn UI

State Management: TanStack Query (React Query)

Visualization: Chart.js / Recharts

Backend
Framework: FastAPI (Python 3.12+)

Database: PostgreSQL

ORM: SQLModel (SQLAlchemy + Pydantic)

Security: Passlib (Bcrypt), PyJWT

AI/OCR: OpenAI Vision API / Google Cloud Vision

Project Setup
Prerequisites
Python 3.12 or higher

Node.js & npm

PostgreSQL instance

1. Backend Configuration
Navigate to the backend directory:

Bash
cd backend
Create and activate a virtual environment:

Bash
python -m venv venv
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate
Install dependencies:

Bash
pip install -r requirements.txt
Create a .env file and add your credentials:

Code snippet
DATABASE_URL=postgresql://user:password@localhost:5432/finance_db
SECRET_KEY=your_super_secret_key
OPENAI_API_KEY=your_api_key_here
Run the server:

Bash
uvicorn main:app --reload
2. Frontend Configuration
Navigate to the frontend directory:

Bash
cd frontend
Install packages:

Bash
npm install
Start the development server:

Bash
npm run dev