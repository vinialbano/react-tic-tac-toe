export default function Log({ turns }) {
  return (
    <ol id="log">
      {turns.map((turn) => {
        return (
          <li key={`${turn.square.row},${turn.square.col}`}>
            <span className="turn">
              {turn.player} played at {turn.square.row},{turn.square.col}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
