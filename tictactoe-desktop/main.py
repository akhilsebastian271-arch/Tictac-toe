

import csv
import os
import re
import socket
import sys
import threading
import time
import tkinter
from datetime import datetime

from flask import Flask, jsonify, request, send_from_directory
import webview


def resource_path(relative_path):
    """Resolve path for both normal Python execution and PyInstaller bundles."""
    base_path = getattr(sys, "_MEIPASS", os.path.dirname(os.path.abspath(__file__)))
    return os.path.join(base_path, relative_path)


def writable_dir():
    """Store results.csv next to the executable (or script) so scores persist."""
    if getattr(sys, "frozen", False):
        return os.path.dirname(os.path.abspath(sys.executable))
    return os.path.dirname(os.path.abspath(__file__))


STATIC_DIR = resource_path("static")
RESULTS_FILE = os.path.join(writable_dir(), "results.csv")
FIELDS = ["match", "timestamp", "player_1", "player_2", "mode", "result", "winner"]

VALID_MODES = {"Classic"}
VALID_WINNERS = {"X", "O", "Draw"}

app = Flask(__name__, static_folder=STATIC_DIR, static_url_path="")
app.config["MAX_CONTENT_LENGTH"] = 4 * 1024
file_lock = threading.Lock()


def clean_name(value, fallback):
    """Trim, drop control chars, cap length, and defuse spreadsheet formulas."""
    text = re.sub(r"[\x00-\x1f\x7f]", "", str(value or "")).strip()[:12]
    if not text:
        return fallback
    if text[0] in "=+-@":
        text = "'" + text
    return text


def count_rows():
    try:
        with open(RESULTS_FILE, newline="", encoding="utf-8") as f:
            return sum(1 for _ in csv.DictReader(f))
    except OSError:
        return 0


@app.get("/")
def index():
    return send_from_directory(STATIC_DIR, "index.html")


@app.post("/api/results")
def save_result():
    data = request.get_json(silent=True) or {}
    winner = data.get("winner")
    mode = data.get("mode")
    if winner not in VALID_WINNERS or mode not in VALID_MODES:
        return jsonify(ok=False, error="invalid winner or mode"), 400

    p1 = clean_name(data.get("player1"), "Player 1")
    p2 = clean_name(data.get("player2"), "Player 2")
    result = "Draw" if winner == "Draw" else f"{p1 if winner == 'X' else p2} won"

    with file_lock:
        match_no = count_rows() + 1
        new_file = not os.path.exists(RESULTS_FILE)
        with open(RESULTS_FILE, "a", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=FIELDS)
            if new_file:
                writer.writeheader()
            writer.writerow({
                "match": match_no,
                "timestamp": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
                "player_1": p1,
                "player_2": p2,
                "mode": mode,
                "result": result,
                "winner": winner,
            })
    return jsonify(ok=True, match=match_no), 201


def find_free_port():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("127.0.0.1", 0))
        return s.getsockname()[1]


def start_server(port):
    app.run(host="127.0.0.1", port=port, debug=False, use_reloader=False)


def wait_for_server(port, timeout=5.0):
    deadline = time.time() + timeout
    while time.time() < deadline:
        try:
            with socket.create_connection(("127.0.0.1", port), timeout=0.2):
                return True
        except OSError:
            time.sleep(0.05)
    return False


if __name__ == "__main__":
    port = find_free_port()
    server_thread = threading.Thread(target=start_server, args=(port,), daemon=True)
    server_thread.start()
    wait_for_server(port)

    webview.create_window(
        title="Tic Tac Toe Ultimate",
        url=f"http://127.0.0.1:{port}",
        width=1180,
        height=760,
        min_size=(460, 620),
        background_color="#170a42",
    )
    webview.start()
