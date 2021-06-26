const helpers = {
  calculateWinner: function(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for(let i = 0; i < lines.length; i++) {
      const[a, b, c] = lines[i];
      if(squares[a] && squares[a] !== '-' && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    for(let i = 0; i < squares.length; i++) {
      if(squares[i] === null) {
        return null;
      }
    }

    return '-';
  },

  findBestMove: function(squares, focus) {
    if(focus === null) {
      focus = 0;
    }

    for(let i = 0; i < squares[focus].length; i++) {
      if(squares[focus][i] === null) {
        return i;
      }
    }
  }
}

export default helpers;
