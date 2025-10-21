import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return <button className="square" onClick={onSquareClick}> {value} </button>;
}

function isAdjacent(i, j) {
  if (i === j) return false;
  if (i < 0 || i > 8 || j < 0 || j > 8) return false;

  const row1 = Math.floor(i / 3); 
  const col1 = i % 3;
  const row2 = Math.floor(j / 3);
  const col2 = j % 3;
  return ( Math.max(Math.abs(row1 - row2), Math.abs(col1 - col2)) ) === 1;
}

export default function Board() {
  const [xIsNext, setXIsNext] = useState(true);
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [moveCount, setMoveCount] = useState(0);
  const [selectedPiece, setSelectedPiece] = useState(null);

  function handleClick(i) {
    if (calculateWinner(squares)) {
      return; //Game Won
    }
    const nextSquares = squares.slice();
    if (moveCount < 6) {
      if (squares[i]) {
        return; //Can't place on a non-null square
      }

    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    setMoveCount(moveCount + 1);
  }
  else {
    if (selectedPiece === null) {
      if (squares[i] === (xIsNext ? "X" : "O")) {
        setSelectedPiece(i); //select piece to move
      }
    }
    else {
      if (squares[i] === (xIsNext ? "X" : "O")) {
        setSelectedPiece(i); //select a different piece and return
        return;
      }

      if (squares[i]) {
        return; //can't move to a non-empty square
      }
      if (isAdjacent(selectedPiece, i) ) {
        //Check center square condition
        if (squares[4] === 'X' && xIsNext) {
          // If it is X's turn and has a piece at the center, it must win or vacate the center square
          const tempBoard = squares.slice(); 
          tempBoard[selectedPiece] = null; //attempt to vacate selected
          tempBoard[i] = "X";
          if (!calculateWinner(tempBoard) && tempBoard[4] === 'X') {
            return; //Invalid move
          }
        }
        else if (squares[4] === 'O' && !xIsNext) {
          // If it is O's turn and has a piece at the center, it must win or vacate the center square
          const tempBoard = squares.slice(); 
          tempBoard[selectedPiece] = null; //attempt to vacate selected
          tempBoard[i] = "O";
          if (!calculateWinner(tempBoard) && tempBoard[4] === 'O') {
            return; //Invalid move
          }
        }
        //move the selected piece
        const piece = xIsNext ? "X" : "O";
        nextSquares[i] = piece;
        nextSquares[selectedPiece] = null;
        setSquares(nextSquares);
        setXIsNext(!xIsNext);
        setSelectedPiece(null);
      }
      else {
        return; //not adjacent
      }
    }
  }
}

  const winner = calculateWinner(squares);
  let status;
  if(winner) { 
    status = "Winner: " + winner;
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O"); 
  }
  return(
  <>
   <div className='status'>{status}</div>
   <div className = "board-row">
    <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
    <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
    <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
   </div>
   <div className= "board-row">
    <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
    <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
    <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
   </div>
   <div className= "board-row">
    <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
    <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
    <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
   </div>
  </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,4,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [2,4,6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}