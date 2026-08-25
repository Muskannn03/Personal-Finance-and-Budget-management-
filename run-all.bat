@echo off
echo Starting Backend (Spring Boot)...
start cmd /k "cd backend && set PORT=8080&& set SPRING_PROFILES_ACTIVE=dev&& set DB_HOST=localhost&& set DB_PORT=5432&& set DB_NAME=PFBM&& set DB_USERNAME=postgres&& set DB_PASSWORD=9920894980&& set JWT_SECRET=dGhpcy1pcy1hLXZlcnktc2VjdXJlLWFuZC1sb25nLXNlY3JldC1rZXktZm9yLXBjZm0tYXBwbGljYXRpb24tMjAyNg==&& set JWT_EXPIRATION_MS=86400000&& mvn spring-boot:run"

echo Starting Frontend (Angular)...
start cmd /k "cd frontend && npm run start"

echo Both servers are starting up!
echo Backend API: http://localhost:8080/swagger-ui/index.html
echo Frontend App: http://localhost:4200/
pause
