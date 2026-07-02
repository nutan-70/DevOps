# Task Board

A simple Dockerized full-stack website with:

- Frontend: HTML, CSS, JavaScript, Nginx
- Backend: Node.js, Express API
- Database: PostgreSQL
- Orchestration: Docker Compose

## Run

```powershell
cd web
docker compose up --build
```

Open the app at:

```text
http://localhost:8080
```

The API is also exposed at:

```text
http://localhost:3000
```

## API

- `GET /health`
- `GET /tasks`
- `POST /tasks` with `{ "title": "Task name" }`
- `PATCH /tasks/:id` with `{ "completed": true }`
- `DELETE /tasks/:id`
