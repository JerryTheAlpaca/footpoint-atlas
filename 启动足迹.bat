@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 我的火车足迹

set "PYTHON="
set "PY_ARGS="

for /f "delims=" %%i in ('where python 2^>nul') do (
  echo %%i | findstr /i /l /c:"WindowsApps" >nul
  if errorlevel 1 (
    set "PYTHON=%%i"
    goto :start
  )
)
for /f "delims=" %%i in ('where py 2^>nul') do (
  echo %%i | findstr /i /l /c:"WindowsApps" >nul
  if errorlevel 1 (
    set "PYTHON=%%i"
    set "PY_ARGS=-3"
    goto :start
  )
)
for %%D in (
  "%USERPROFILE%\anaconda3"
  "%USERPROFILE%\miniconda3"
  "%LOCALAPPDATA%\anaconda3"
  "%LOCALAPPDATA%\miniconda3"
  "D:\Programs\Anaconda"
  "%LOCALAPPDATA%\Programs\Python\Python313"
  "%LOCALAPPDATA%\Programs\Python\Python312"
  "%LOCALAPPDATA%\Programs\Python\Python311"
) do (
  if exist "%%~D\python.exe" (
    set "PYTHON=%%~D\python.exe"
    goto :start
  )
)

echo 未能启动：找不到 Python。
echo 本脚本会用 python 启动本地页；Anaconda 通常没有 py 启动器。
echo 请确认 python.exe 已加入 PATH，然后重新打开本窗口。
pause
exit /b 1

:start
echo 正在启动本地页：http://127.0.0.1:8765/
echo 关闭本窗口即停止服务。
echo.
"%PYTHON%" %PY_ARGS% tools\serve.py 8765 --open
if errorlevel 1 (
  echo.
  echo 未能启动服务。
  pause
)
