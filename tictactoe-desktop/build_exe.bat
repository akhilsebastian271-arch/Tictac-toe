@echo off
echo Installing dependencies...
pip install -r requirements.txt pyinstaller
echo Building standalone TicTacToeUltimate.exe...
pyinstaller --noconfirm --onefile --windowed --name "TicTacToeUltimate" --add-data "static;static" main.py
echo Done! Check the dist\TicTacToeUltimate.exe folder.
pause
