# Startup Simulator

Startup Simulator is a multi-agent AI system that evaluates startup ideas by simulating the work of market researchers, product analysts, investors, and potential customers. The application researches competitors, analyzes customer feedback, identifies market opportunities, generates user personas, predicts adoption, and produces a structured business report.

---

# Features

- Multi-agent workflow built using LangGraph
- Startup understanding and business analysis
- AI-powered competitor identification
- Trustpilot review scraping using Playwright
- Automatic Gemini fallback when Trustpilot reviews are unavailable
- Competitor intelligence extraction from customer reviews
- Market gap identification
- Startup scoring based on multiple business factors
- AI-generated customer personas
- Persona-based product feedback simulation
- Market adoption prediction
- Final investor-style report generation
- JWT authentication
- MongoDB integration
- Request rate limiting
- Structured outputs using Pydantic
- Automatic retry mechanism for LLM failures
- Centralized logging

---

# Workflow

```
                     User Input
                          │
                          ▼
                  Startup Analysis
                     (Agent 1)
                          │
                          ▼
               Competitor Discovery
                     (Agent 2)
                          │
                          ▼
               Competitor Research
                     (Agent 3)
          ┌────────────────────────────┐
          │                            │
          ▼                            ▼
 Search Trustpilot              Company Not Found
          │                            │
          ▼                            ▼
  Scrape Reviews              Gemini Research
          └──────────────┬─────────────┘
                         ▼
             Competitor Intelligence
                    (Agent 4)
                         │
                         ▼
               Market Gap Analysis
                    (Agent 5)
                         │
                         ▼
                 Startup Scoring
                    (Agent 6)
                         │
                         ▼
               Persona Generation
                    (Agent 7)
                         │
                         ▼
                Persona Feedback
                    (Agent 8)
                         │
                         ▼
               Adoption Analytics
                    (Agent 9)
                         │
                         ▼
                 Final Report
                    (Agent 10)
```

---

# Tech Stack

### Backend

- FastAPI
- Python

### AI

- LangGraph
- LangChain
- Gemini 2.5 Flash

### Database

- MongoDB

### Authentication

- JWT

### Web Scraping

- Playwright
- Trustpilot

### Validation

- Pydantic

### Retry Mechanism

- Tenacity

### Rate Limiting

- SlowAPI

---

# Project Structure

```
startup-simulator/
│
├── agents/
├── agent_state/
├── auth/
├── config/
├── database/
├── models/
├── routes/
├── scraper/
├── services/
├── utils/
├── builder.py
├── main.py
└── requirements.txt
```

---

# Running the Project

## 1. Clone the repository

```bash
git clone <repository-url>
cd startup-simulator
```

## 2. Create a virtual environment

```bash
python -m venv myenv
```

Windows

```bash
myenv\Scripts\activate
```

Linux / macOS

```bash
source myenv/bin/activate
```

## 3. Install dependencies

```bash
pip install -r requirements.txt
```

## 4. Create a `.env` file

```env
GOOGLE_API_KEY=your_api_key

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET_KEY=your_secret_key

JWT_ALGORITHM=HS256

ACCESS_TOKEN_EXPIRE_MINUTES=30

REFRESH_TOKEN_EXPIRE_DAYS=7
```

## 5. Install Playwright browser

```bash
playwright install chromium
```

## 6. Start the FastAPI server

```bash
uvicorn main:app --reload
```

The API will be available at

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---


# API Endpoints

The application exposes REST APIs for authentication, startup analysis, analysis management, progress tracking, and execution logs.

---

## Base URL

```
http://127.0.0.1:8000
```

Swagger Documentation

```
http://127.0.0.1:8000/docs
```

---

## Authentication

### Register User

```http
POST /auth/register
```

Creates a new user account.

Authentication Required: **No**

---

### Login

```http
POST /auth/login
```

Authenticates a user and returns an access token and refresh token.

Authentication Required: **No**

---

### Refresh Access Token

```http
POST /auth/refresh
```

Generates a new access token using a valid refresh token.

Authentication Required: **No**

---

### Logout

```http
POST /auth/logout
```

Invalidates the user's refresh token.

Authentication Required: **No**

---

### Get Current User

```http
GET /auth/me
```

Returns the currently authenticated user's information.

Authentication Required: **Yes**

---

## Startup Analysis

### Analyze Startup

```http
POST /analyze
```

Executes the complete LangGraph workflow consisting of all ten AI agents and returns a comprehensive startup validation report.

Authentication Required: **Yes**

Request Body

```json
{
    "startup_name": "...",
    "problem": "...",
    "solution": "...",
    "target_users": "..."
}
```

---

## Analysis Management

### Get All Analyses

```http
GET /analysis
```

Returns every startup analysis created by the authenticated user.

Authentication Required: **Yes**

---

### Get Analysis

```http
GET /analysis/{analysis_id}
```

Returns the complete report for a specific startup analysis.

Authentication Required: **Yes**

---

### Delete Analysis

```http
DELETE /analysis/{analysis_id}
```

Deletes the selected startup analysis along with its execution logs.

Authentication Required: **Yes**

---

### Get Analysis Progress

```http
GET /analysis/{analysis_id}/progress
```

Returns the current execution status of an analysis.

The response contains:

- Current Agent
- Progress Percentage
- Status
- Start Time
- Completion Time
- Total Runtime

Authentication Required: **Yes**

---

## Execution Logs

### Get Analysis Logs

```http
GET /logs/{analysis_id}/logs
```

Returns execution logs generated during the startup analysis.

The logs include:

- Agent execution status
- Progress
- Runtime
- Error information (if any)

Authentication Required: **Yes**

---

## Authentication

All protected endpoints require a JWT access token.

Include the following header with every authenticated request.

```http
Authorization: Bearer <access_token>
```

---

## Token Lifetime

| Token | Expiration |
|-------|------------|
| Access Token | 30 Minutes |
| Refresh Token | 7 Days |

---

## Rate Limits

| Endpoint | Limit |
|----------|-------|
| `/` | 30 requests per minute |
| `/analyze` | 5 requests per hour |

These limits help protect backend resources and prevent excessive API usage.

# Optimizations Implemented

### Parallel Competitor Research

Competitor scraping is performed concurrently to reduce overall execution time.

### Browser Context Reuse

A single Chromium browser instance is launched and reused while multiple pages are opened inside the same browser context. This avoids repeatedly launching Chromium for each competitor.

### Parallel Competitor Intelligence

Competitor review analysis is executed concurrently using `asyncio.gather()`, allowing multiple LLM requests to run in parallel.

### Automatic LLM Fallback

If a competitor is unavailable on Trustpilot, the system automatically switches to Gemini to collect publicly available information.

### Structured Outputs

Every agent returns validated Pydantic models instead of raw JSON, reducing parsing errors and improving reliability.

### Retry Mechanism

Gemini requests automatically retry with exponential backoff whenever temporary API failures occur.

### Logging

Execution time, retries, agent status, and errors are logged throughout the pipeline.

---

# Future Optimizations

### Competitor Cache

Store competitor research in MongoDB or Redis to avoid researching the same company multiple times.

### Trustpilot Review Cache

Save scraped reviews locally to eliminate repeated scraping for frequently analyzed competitors.

### Smarter Company Matching

Replace substring matching with fuzzy matching to reduce incorrect Trustpilot matches.

### Prompt Optimization

Reduce prompt size without affecting output quality to decrease latency and token usage.

### Semantic Review Deduplication

Remove duplicate or highly similar customer reviews before sending them to the LLM.

### Redis Caching

Cache complete startup analyses for repeated requests.

### Streaming Responses

Stream intermediate agent outputs to the frontend while the remaining agents continue execution.

### Dynamic Competitor Selection

Determine the number of competitors dynamically instead of always analyzing a fixed number.

### Batch Database Writes

Reduce MongoDB overhead by storing results in batches instead of multiple individual writes.

---

# Current Performance

Average execution time ranges from **4 to 5 minutes**, depending on Gemini API response times and rate limits.

With caching and additional optimizations, the expected runtime can be reduced to approximately **2.5 to 3 minutes**.

---
