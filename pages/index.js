"use client";

import { useEffect, useMemo, useState } from "react";

const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const PLAYERS = {
  homem: {
    label: "Homem",
    symbol: "H",
    color: "#3B82F6",
    soft: "#DBEAFE",
  },
  mulher: {
    label: "Mulher",
    symbol: "M",
    color: "#EC4899",
    soft: "#FCE7F3",
  },
};

function getRandomStarter() {
  return Math.random() < 0.5 ? "homem" : "mulher";
}

function getWinner(board) {
  for (const [a, b, c] of WIN_PATTERNS) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        player: board[a],
        line: [a, b, c],
      };
    }
  }
  return null;
}

function Square({ value, onClick, highlight }) {
  const playerStyle = value ? PLAYERS[value] : null;

  return (
    <button
      onClick={onClick}
      disabled={!!value}
      style={{
        width: "92px",
        height: "92px",
        borderRadius: "22px",
        border: highlight ? "3px solid #F59E0B" : "2px solid #E5E7EB",
        background: playerStyle ? playerStyle.soft : "#FFFFFF",
        color: playerStyle ? playerStyle.color : "#111827",
        fontSize: "2rem",
        fontWeight: 800,
        cursor: value ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        boxShadow: highlight
          ? "0 10px 24px rgba(245, 158, 11, 0.25)"
          : "0 8px 20px rgba(0, 0, 0, 0.08)",
      }}
    >
      {playerStyle?.symbol || ""}
    </button>
  );
}

export default function Home() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [startingPlayer, setStartingPlayer] = useState("homem");
  const [currentPlayer, setCurrentPlayer] = useState("homem");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const starter = getRandomStarter();
    setStartingPlayer(starter);
    setCurrentPlayer(starter);
    setMounted(true);
  }, []);

  const winnerData = useMemo(() => getWinner(board), [board]);
  const isDraw = !winnerData && board.every(Boolean);

  function handleClick(index) {
    if (!mounted || board[index] || winnerData) return;

    const nextBoard = [...board];
    nextBoard[index] = currentPlayer;
    setBoard(nextBoard);

    if (!getWinner(nextBoard)) {
      setCurrentPlayer((prev) => (prev === "homem" ? "mulher" : "homem"));
    }
  }

  function restartGame() {
    const newStarter = getRandomStarter();
    setBoard(Array(9).fill(null));
    setStartingPlayer(newStarter);
    setCurrentPlayer(newStarter);
  }

  const statusText = !mounted
    ? "Preparando partida..."
    : winnerData
      ? `${PLAYERS[winnerData.player].label} venceu!`
      : isDraw
        ? "Deu velha! 💫"
        : `Vez de: ${PLAYERS[currentPlayer].label}`;

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background:
          "linear-gradient(180deg, #FFF7FB 0%, #F6F9FF 45%, #FFFFFF 100%)",
        padding: "24px",
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "rgba(255,255,255,0.92)",
          backdropFilter: "blur(8px)",
          border: "1px solid #F1F5F9",
          borderRadius: "28px",
          padding: "28px",
          boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            margin: 0,
            fontSize: "2.2rem",
            color: "#111827",
          }}
        >
          Jogo da Velha fofinho ✨
        </h1>

        <p style={{ marginTop: "10px", color: "#6B7280", fontSize: "0.98rem" }}>
          Quem começa é sorteado aleatoriamente a cada nova partida.
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "12px",
            flexWrap: "wrap",
            marginTop: "20px",
            marginBottom: "18px",
          }}
        >
          <div
            style={{
              background: PLAYERS.homem.soft,
              color: PLAYERS.homem.color,
              border: `2px solid ${PLAYERS.homem.color}`,
              padding: "10px 14px",
              borderRadius: "999px",
              fontWeight: 700,
            }}
          >
            Homem = Azul
          </div>

          <div
            style={{
              background: PLAYERS.mulher.soft,
              color: PLAYERS.mulher.color,
              border: `2px solid ${PLAYERS.mulher.color}`,
              padding: "10px 14px",
              borderRadius: "999px",
              fontWeight: 700,
            }}
          >
            Mulher = Rosa forte
          </div>
        </div>

        <div
          style={{
            marginBottom: "20px",
            padding: "14px 16px",
            borderRadius: "18px",
            background: "#F8FAFC",
            color: "#334155",
            fontWeight: 700,
            minHeight: "72px",
            display: "grid",
            placeItems: "center",
          }}
        >
          <div>
            <div>{statusText}</div>
            {mounted && !winnerData && !isDraw && (
              <div
                style={{
                  marginTop: "6px",
                  fontSize: "0.92rem",
                  color: "#64748B",
                }}
              >
                Começou: {PLAYERS[startingPlayer].label}
              </div>
            )}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 92px)",
            justifyContent: "center",
            gap: "12px",
            marginBottom: "22px",
          }}
        >
          {board.map((value, index) => (
            <Square
              key={index}
              value={value}
              onClick={() => handleClick(index)}
              highlight={winnerData?.line.includes(index)}
            />
          ))}
        </div>

        <button
          onClick={restartGame}
          disabled={!mounted}
          style={{
            background: "linear-gradient(135deg, #60A5FA 0%, #F472B6 100%)",
            color: "#fff",
            border: "none",
            borderRadius: "999px",
            padding: "14px 22px",
            fontSize: "1rem",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 12px 24px rgba(244, 114, 182, 0.25)",
            opacity: mounted ? 1 : 0.7,
          }}
        >
          Nova partida
        </button>
      </section>
    </main>
  );
}
