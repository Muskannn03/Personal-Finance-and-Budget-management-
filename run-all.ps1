# Start Backend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd backend; `$env:PORT='8080'; `$env:SPRING_PROFILES_ACTIVE='dev'; `$env:DB_HOST='localhost'; `$env:DB_PORT='5432'; `$env:DB_NAME='PFBM'; `$env:DB_USERNAME='postgres'; `$env:DB_PASSWORD='9920894980'; `$env:JWT_SECRET='dGhpcy1pcy1hLXZlcnktc2VjdXJlLWFuZC1sb25nLXNlY3JldC1rZXktZm9yLXBjZm0tYXBwbGljYXRpb24tMjAyNg=='; `$env:JWT_EXPIRATION_MS='86400000'; mvn spring-boot:run"

# Start Frontend in a new window
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd frontend; npm run start"

Write-Host "Both servers are starting up!" -ForegroundColor Green
Write-Host "Backend API: http://localhost:8080/swagger-ui/index.html" -ForegroundColor Cyan
Write-Host "Frontend App: http://localhost:4200/" -ForegroundColor Cyan
