/* Pure game logic - no DOM. Works in the browser (window.TTT) and in Node (require). */
(function (root) {
  "use strict";

  const N = 3;   // board is N x N
  const K = 3;   // in a row to win

  const other = (p) => (p === "X" ? "O" : "X");

  // Sorted cells of a winning run (>= k) through idx for player p, else null.
  function findWin(board, n, k, p, idx) {
    const r = Math.floor(idx / n), c = idx % n;
    for (const [dr, dc] of [[0, 1], [1, 0], [1, 1], [1, -1]]) {
      const cells = [idx];
      for (const s of [1, -1]) {
        let rr = r + dr * s, cc = c + dc * s;
        while (rr >= 0 && rr < n && cc >= 0 && cc < n && board[rr * n + cc] === p) {
          cells.push(rr * n + cc);
          rr += dr * s; cc += dc * s;
        }
      }
      if (cells.length >= k) return cells.sort((a, b) => a - b);
    }
    return null;
  }

  const api = { N, K, other, findWin };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.TTT = api;
})(typeof window !== "undefined" ? window : globalThis);
