// eslint-disable-next-line react/prop-types
const Square = ({ value, onClick, isWinning }) => {
  return (
    <button 
      className={`square ${isWinning ? 'winning' : ''} ${value === 'X' ? 'x' : value === 'O' ? 'o' : ''}`} 
      onClick={onClick}
    >
      {value}
    </button>
  )
}

export default Square