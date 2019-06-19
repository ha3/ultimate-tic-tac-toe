import React from 'react';
import Board from './Board';
import helpers from '../helpers.js';

class Local extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      winInfo: [],
    };
  }

  setMove(i) {
    const history = this.state.history.slice(0, this.props.step + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const move = this.props.turn ? 'X' : 'O';
    let square, winInfo;

    if(move === 'X') {
      if(squares[i] || (!this.props.focus && !this.props.start)) {
        return;
      }
      square = i;
    }

    else {
      square = helpers.findBestMove(squares);
    }

    squares[square] = move;


    if(this.state.winInfo.winner !== 'X' && this.state.winInfo.winner !== 'O' &&
    this.state.winInfo.winner !== '-') {
      winInfo = helpers.calculateWinner(squares);
    }

    else {
      winInfo = this.state.winInfo;
    }

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      winInfo: winInfo,
    });

    this.props.onClick(square, winInfo.winner);
  }

  // When it is O's turn, set move on the proper(focused) board.
  componentDidUpdate(prevProps) {
    if (this.props.focus && !this.props.turn) {
      this.setMove();
    }
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.props.step;
    const current = history[stepNumber];

    return (
      <Board
        squares={current.squares}
        onClick={(i) => this.setMove(i)}
        winLine={this.state.winInfo.line}
        focus={this.props.focus}
      />
    );
  }
}

export default Local;
