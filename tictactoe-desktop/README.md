# Tic Tac Toe Ultimate — Desktop Application

This wraps the exact themed Tic Tac Toe web app (Neon, Minecraft, Among Us, Clash of Clans, and Star Wars themes with custom SVGs and Web Audio sound effects) into a native desktop window using **pywebview** + **Flask**.

## 1. Run as a Desktop App
```powershell
pip install -r requirements.txt
python main.py
```

## 2. Package into a Standalone `.exe` (Optional)
Double-click `build_exe.bat` or run:
```powershell
pip install pyinstaller
pyinstaller --noconfirm --onefile --windowed --name "TicTacToeUltimate" --add-data "static;static" main.py
```
Your standalone executable will be created at `dist\TicTacToeUltimate.exe`. Match history is saved to `results.csv` in the same folder as the app.
