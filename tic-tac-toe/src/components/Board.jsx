import Square from "./Square";

// eslint-disable-next-line react/prop-types
const Board = ({ squares, onClick, winLine }) => {
  const renderSquare = (i) => {
    // eslint-disable-next-line react/prop-types
    const isWinning = winLine && winLine.includes(i);
    return <Square value={squares[i]} onClick={() => onClick(i)} isWinning={isWinning} />;
  };

  return (
    <div className="board">
      <div className="board-row">
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div className="board-row">
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div className="board-row">
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

export default Board;
