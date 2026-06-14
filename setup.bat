@echo off
REM PureCoco E-Commerce Quick Setup Script for Windows

echo.
echo ========================================
echo   PureCoco E-Commerce Quick Setup
echo ========================================
echo.

REM Check Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [WARNING] Node.js not found. Please install Node.js 16+
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION%

echo.
echo [INFO] Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% equ 0 (
    echo [OK] Backend dependencies installed
) else (
    echo [ERROR] Failed to install backend dependencies
    pause
    exit /b 1
)

echo.
echo [INFO] Installing Frontend Dependencies...
cd ..\frontend
call npm install
if %errorlevel% equ 0 (
    echo [OK] Frontend dependencies installed
) else (
    echo [ERROR] Failed to install frontend dependencies
    pause
    exit /b 1
)

cd ..

echo.
echo ========================================
echo   Setup Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Copy backend\.env.example to backend\.env
echo    (Add your Stripe, Email, and MongoDB credentials)
echo.
echo 2. Start MongoDB locally OR use MongoDB Atlas
echo.
echo 3. Seed the database:
echo    cd backend
echo    npm run seed
echo.
echo 4. Start the backend (in one terminal):
echo    cd backend
echo    npm run dev
echo.
echo 5. Start the frontend (in another terminal):
echo    cd frontend
echo    npm start
echo.
echo URLs:
echo   Frontend: http://localhost:3000
echo   Backend:  http://localhost:5000
echo.
echo Demo Credentials:
echo   User:  demo@purecoco.com / demo1234
echo   Admin: admin@purecoco.com / admin1234
echo.
pause
