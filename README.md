# RESUMAI — AI-Powered Resume Builder

> AI-powered resume builder that uses RAG pipeline to learn from real hired resumes at your target company, generates ATS-optimized resumes with industry-grade 8-dimension scoring, provides personalized skill gap analysis with learning paths, creates company-specific cover letters, and includes a visual resume editor — built with FastAPI, Next.js, ChromaDB, and Groq LLM.

## Screenshots

### Landing Page
![Landing Page](screenshots/landing.png)

### Features
![Features](screenshots/features.png)

### Dashboard
![Dashboard](screenshots/dashboard.png)

### Resume Generator
![Generate Resume](screenshots/generate.png)

---

## What is RESUMAI?

RESUMAI is an intelligent resume builder that goes beyond simple templates. It uses **Retrieval-Augmented Generation (RAG)** to scrape and learn from real resumes of people who were actually hired at your target company — then generates a tailored, ATS-optimized resume specifically for the role you're applying to.

Unlike generic resume builders, RESUMAI:
- Learns what **Google, Amazon, Microsoft** actually want to see
- Scores your resume across **8 industry-grade dimensions**
- Tells you **exactly what skills you're missing** and how to get them
- Generates **company-specific cover letters** that reference real company values
- Includes a **visual editor** where you can drag, reorder, and edit every section

---

## Features

### 🤖 RAG Resume Generator
Scrapes real hired resumes from Reddit (r/cscareerquestions, r/resumereveal), GitHub profile READMEs, Google Docs, and Common Crawl. Uses ChromaDB vector database to retrieve the most similar resumes for your target role and company. Generates an ATS-optimized resume using Groq LLM with a self-improving loop that regenerates until ATS score ≥ 80.

###  Industry-Grade ATS Checker
8-dimension scoring system used by real ATS platforms:
1. **Keyword Match** (25%) — exact and semantic keyword matching
2. **Skills Match** (20%) — required vs nice-to-have skills
3. **Experience Relevance** (20%) — job title, years, domain match
4. **Education Match** (10%) — degree level and field
5. **Format Compliance** (10%) — ATS-readable structure
6. **Quantified Achievements** (8%) — metrics and impact statements
7. **Action Verbs** (4%) — strong verbs at bullet start
8. **Completeness** (3%) — all sections present

Returns grade (A+ to D), verdict, matched/missing keywords, strengths, improvements with priority, and recruiter tips.

### 📊 Skill Gap Analyzer
Compares your current profile against the target role and returns:
- Matched, missing critical, and nice-to-have skills
- Transferable skills analysis
- Experience gap (required vs current years)
- Personalized learning path with resources, URLs, and milestones
- Timeline (optimistic / realistic / conservative)
- Immediate actions and company-specific interview tips

### ✉️ Cover Letter Generator
Researches company culture, values, and interview process. Generates tailored cover letters in 3 tones:
- **Professional** — formal and structured
- **Conversational** — warm and approachable
- **Bold** — confident and direct

### 🔍 Smart Resume Parser
Upload any PDF or DOCX resume. Extracts all sections with LLM precision — name, contact, summary, experience with bullet points, projects with tech stack, skills, education, certifications, and achievements.

###  Visual Resume Editor
Canva-like resume editor with:
- Click any text to edit inline
- Drag-and-drop to reorder sections
- 5 color themes (Classic, Navy, Forest, Rose, Purple)
- 5 font choices (Inter, Georgia, Merriweather, Playfair Display, Roboto)
- Font size controls
- Add/remove bullet points, skills, experiences
- Live preview
- One-click PDF download

###  Multi-Source Scraper
Scrapes real resumes from:
- **Reddit** — r/resumereveal, r/cscareerquestions, r/jobs
- **GitHub** — profile READMEs with career info
- **Google Docs** — public resume documents
- **Common Crawl** — web-scale resume data

Each resume is scored for authenticity before being ingested into ChromaDB.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, TypeScript, Tailwind CSS |
| Backend | FastAPI, Python 3.11 |
| Database | PostgreSQL 18 |
| Vector DB | ChromaDB |
| LLM | Groq (llama-3.3-70b-versatile) |
| Embeddings | SentenceTransformers (all-MiniLM-L6-v2) |
| Auth | JWT (HTTPBearer) |
| ORM | SQLAlchemy (async) |
| Migrations | Alembic |

---

## Project Structure
```
ai-resume-builder/
├── backend/
│   ├── app/
│   │   ├── api/routes/
│   │   │   ├── auth.py          # Register, login, JWT
│   │   │   ├── resume.py        # Upload, generate, ATS, skill gap, cover letter
│   │   │   └── companies.py     # Scraper endpoints
│   │   ├── core/
│   │   │   ├── config.py        # Settings
│   │   │   ├── database.py      # Async PostgreSQL
│   │   │   ├── security.py      # JWT + bcrypt
│   │   │   └── dependencies.py  # Auth middleware
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   └── services/
│   │       ├── resume_parser.py        # PDF/DOCX parser
│   │       ├── resume_generator.py     # RAG + ATS loop
│   │       ├── ats_checker.py          # 8-dimension scorer
│   │       ├── skill_gap_analyzer.py   # Gap analysis
│   │       ├── cover_letter_generator.py
│   │       ├── rag/
│   │       │   ├── embeddings.py
│   │       │   ├── ingest.py
│   │       │   └── retriever.py
│   │       └── scraper/
│   │           ├── reddit_scraper.py
│   │           ├── github_scraper.py
│   │           ├── google_docs_scraper.py
│   │           ├── common_crawl_scraper.py
│   │           ├── authenticity_scorer.py
│   │           └── unified_scraper.py
│   ├── alembic/                 # DB migrations
│   ├── requirements.txt
│   └── .python-version          # Python 3.11.9
└── frontend/
    ├── app/
    │   ├── page.tsx             # Landing page
    │   ├── login/               # Login with space canvas
    │   ├── register/            # Register page
    │   ├── dashboard/           # Main dashboard
    │   ├── upload/              # Resume upload
    │   ├── generate/            # Resume generator
    │   ├── ats-check/           # ATS checker
    │   ├── skill-gap/           # Skill gap analyzer
    │   ├── cover-letter/        # Cover letter
    │   └── resume-editor/       # Visual editor
    └── lib/
        ├── api.ts               # Axios client
        └── auth.tsx             # Auth context
```

---

## Getting Started

### Prerequisites
- Python 3.11
- Node.js 18+
- PostgreSQL 16+
- Groq API key (free at [console.groq.com](https://console.groq.com))

### 1. Clone the repository
```bash
git clone https://github.com/Vedansh-Chandak/ai-resume-builder.git
cd ai-resume-builder
```

### 2. Backend Setup
```bash
cd backend
python3.11 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file in `backend/`:
```env
APP_NAME=AI Resume Builder
APP_ENV=development
DEBUG=True
DATABASE_URL=postgresql+asyncpg://postgres:password123@localhost:5432/ai_resume_db
GROQ_API_KEY=your_groq_api_key_here
JWT_SECRET_KEY=your_secret_key_here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
FRONTEND_URL=http://localhost:3000
```

Create the database:
```bash
psql -U postgres -c "CREATE DATABASE ai_resume_db;"
```

Run migrations:
```bash
alembic upgrade head
```

Start the backend:
```bash
uvicorn app.main:app --reload
```

Backend runs at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env.local` in `frontend/`:
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Start the frontend:
```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/resume/upload` | Upload PDF/DOCX |
| GET | `/api/resume/` | List all resumes |
| POST | `/api/resume/generate` | Generate ATS resume |
| POST | `/api/resume/ats-check` | Run ATS analysis |
| POST | `/api/resume/skill-gap` | Analyze skill gap |
| POST | `/api/resume/cover-letter` | Generate cover letter |
| POST | `/api/companies/scrape` | Scrape resumes |

---

## Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Clone** your fork:
```bash
   git clone https://github.com/YOUR_USERNAME/ai-resume-builder.git
```
3. **Create a branch:**
```bash
   git checkout -b feature/your-feature-name
```
4. **Make your changes** and test them
5. **Commit** with a clear message:
```bash
   git commit -m "feat: add your feature description"
```
6. **Push** to your fork:
```bash
   git push origin feature/your-feature-name
```
7. **Open a Pull Request** on GitHub

### Commit Convention
- `feat:` — new feature
- `fix:` — bug fix
- `docs:` — documentation
- `chore:` — maintenance

### Areas to Contribute
- Add more scraper sources
- Improve ATS scoring prompts
- Add more resume themes to visual editor
- Add resume comparison feature
- Add LinkedIn profile import
- Add job description auto-fetch from URL

---

## License

MIT License — feel free to use this project for personal or commercial purposes.

-
