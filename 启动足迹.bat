@echo off
chcp 65001 >nul
cd /d "%~dp0"
title 我的火车足迹
echo 正在启动本地页：http://127.0.0.1:8765/
echo 关闭本窗口即停止服务。
echo.
start "" cmd /c "timeout /t 1 /nobreak >nul & start http://127.0.0.1:8765/"
py -3 tools\serve.py 8765
if errorlevel 1 python tools\serve.py 8765
if errorlevel 1 (
  echo.
  echo 未能启动，请确认已安装 Python，并已加入 PATH。
  pause
)
