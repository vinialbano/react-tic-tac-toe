import { useState } from "react";
import GameBoard from "./components/GameBoard.jsx";
import GameOver from "./components/GameOver.jsx";
import Log from "./components/Log.jsx";
import Player from "./components/Player.jsx";
import { WINNING_COMBINATIONS } from "./winning-combinations.js";

const INITIAL_GAME_BOARD = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

const INITIAL_PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

function deriveCurrentGameBoard(gameTurns) {
  const gameBoard = [...INITIAL_GAME_BOARD.map((row) => [...row])];
  for (const turn of gameTurns) {
    const { row, col } = turn.square;
    gameBoard[row][col] = turn.player;
  }
  return gameBoard;
}

function deriveCurrentPlayer(gameTurns) {
  let currentPlayer = "X";
  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
    currentPlayer = "O";
  }
  return currentPlayer;
}

function deriveWinner(gameBoard, players) {
  let winner = null;
  for (const [firstSquare, secondSquare, thirdSquare] of WINNING_COMBINATIONS) {
    const firstSquareSymbol = gameBoard[firstSquare.row][firstSquare.col];
    const secondSquareSymbol = gameBoard[secondSquare.row][secondSquare.col];
    const thirdSquareSymbol = gameBoard[thirdSquare.row][thirdSquare.col];
    if (
      firstSquareSymbol &&
      firstSquareSymbol === secondSquareSymbol &&
      firstSquareSymbol === thirdSquareSymbol
    ) {
      winner = players[firstSquareSymbol];
    }
  }
  return winner;
}

function App() {
  const [gameTurns, setGameTurns] = useState([]);
  const [players, setPlayers] = useState(INITIAL_PLAYERS);

  const currentPlayer = deriveCurrentPlayer(gameTurns);
  const gameBoard = deriveCurrentGameBoard(gameTurns);
  const winner = deriveWinner(gameBoard, players);
  const isDraw = gameTurns.length === 9 && !winner;

  function handleSelectSquare(rowIndex, colIndex) {
    setGameTurns((previousTurns) => {
      const currentPlayer = deriveCurrentPlayer(previousTurns);
      return [
        {
          player: currentPlayer,
          square: { row: rowIndex, col: colIndex },
        },
        ...previousTurns,
      ];
    });
    deriveWinner(gameBoard, players);
  }

  function handleRematch() {
    setGameTurns([]);
  }

  function handlePlayerNameChange(symbol, name) {
    setPlayers((previousPlayers) => {
      return {
        ...previousPlayers,
        [symbol]: name,
      };
    });
  }

  return (
    <>
      <main id="game-container">
        <ol id="players" className="highlight-player">
          <Player
            initialName="Player 1"
            symbol="X"
            isActive={currentPlayer === "X"}
            onNameChange={handlePlayerNameChange}
          />
          <Player
            initialName="Player 2"
            symbol="O"
            isActive={currentPlayer === "O"}
            onNameChange={handlePlayerNameChange}
          />
        </ol>
        {(winner || isDraw) && (
          <GameOver winner={winner} onRematch={handleRematch} />
        )}
        <GameBoard board={gameBoard} onSelectSquare={handleSelectSquare} />
      </main>
      <Log turns={gameTurns} />
    </>
  );
}

export default App;
