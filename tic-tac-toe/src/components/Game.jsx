import { useState, useEffect, useMemo } from 'react'
import Board from './Board'
import gameOverSoundAsset from "../sounds/src_sounds_game_over.wav";
import clickSoundAsset from "../sounds/src_sounds_click.wav";

const Game = () => {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [isXNext, setIsXNext] = useState(true)
  const [isGameActive, setIsGameActive] = useState(true)
  const [gameMode, setGameMode] = useState('ai') 

  
  const gameOverSound = useMemo(() => {
    const gameOverSound = new Audio(gameOverSoundAsset);
    gameOverSound.volume = 0.2;
    return gameOverSound;
  }, []);

  const clickSound = useMemo(() => {
    const clickSound = new Audio(clickSoundAsset);
    clickSound.volume = 0.5;
    return clickSound;
  }, []);
 
  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          winner: squares[a],
          line: lines[i]
        }
      }
    }
    return null
  }

  const minimax = (squares, depth, isMaximizing) => {
    const winner = calculateWinner(squares)?.winner
    
    if (winner === 'O') return 10 - depth
    if (winner === 'X') return depth - 10
    if (squares.every(square => square !== null)) return 0
    
    if (isMaximizing) {
      let bestScore = -Infinity
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'O'
          const score = minimax(squares, depth + 1, false)
          squares[i] = null
          bestScore = Math.max(score, bestScore)
        }
      }
      return bestScore
    } else {
      let bestScore = Infinity
      for (let i = 0; i < squares.length; i++) {
        if (squares[i] === null) {
          squares[i] = 'X'
          const score = minimax(squares, depth + 1, true)
          squares[i] = null
          bestScore = Math.min(score, bestScore)
        }
      }
      return bestScore
    }
  }

  const findBestMove = (squares) => {
    let bestScore = -Infinity
    let bestMove = null
    
    for (let i = 0; i < squares.length; i++) {
      if (squares[i] === null) {
        squares[i] = 'O'
        const score = minimax(squares, 0, false)
        squares[i] = null
        
        if (score > bestScore) {
          bestScore = score
          bestMove = i
        }
      }
    }
    
    return bestMove
  }

  const handleClick = (i) => {
    if (!isGameActive || calculateWinner(board) || board[i]) return
    
    const newBoard = [...board]
    newBoard[i] = isXNext ? 'X' : 'O'
    setBoard(newBoard)
    clickSound.play(); 

    if (gameMode === 'human') {
      setIsXNext(!isXNext)
    } else if (gameMode === 'ai' && isXNext) {
      setIsXNext(false)
      // AI move
      setTimeout(() => {
        if (!calculateWinner(newBoard) && newBoard.some(square => square === null)) {
          const bestMove = findBestMove(newBoard)
          if (bestMove !== null) {
            newBoard[bestMove] = 'O'
            setBoard(newBoard)
            clickSound.play(); 
            setIsXNext(true)
          }
        }
      }, 500)
    }
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setIsXNext(true)
    setIsGameActive(true)
  }

  const toggleGameMode = () => {
    setGameMode(gameMode === 'ai' ? 'human' : 'ai')
    resetGame()
  }

  useEffect(() => {
    const winInfo = calculateWinner(board)
    if (winInfo) {
      gameOverSound.play(); 
      setIsGameActive(false)
    } else if (board.every(square => square !== null)) {
      gameOverSound.play(); 
      setIsGameActive(false)
    }
  }, [board,gameOverSound,clickSound])

  let statusClass = ''
  let status
  if (calculateWinner(board)) {
    statusClass = 'winner'
    status = `Winner: ${calculateWinner(board).winner}`
  } else if (board.every(square => square !== null)) {
    statusClass = 'draw'
    status = 'Draw!'
  } else {
    status = `Next player: ${isXNext ? 'X' : 'O'}`
  }

  return (
    <div className="game">
      <div className="game-mode">
        <button 
          className={`mode-button ${gameMode === 'ai' ? 'active' : ''}`}
          onClick={toggleGameMode}
        >
          {gameMode === 'ai' ? '🤖 Playing with AI' : '👥 Playing with Human'}
        </button>
      </div>
      <div className={`status ${statusClass}`}>{status}</div>
      <Board 
        squares={board} 
        onClick={handleClick}
        winLine={calculateWinner(board)?.line}
      />
      <button className="reset-button" onClick={resetGame}>
        Play Again
      </button>
    </div>
  )
}

export default Game