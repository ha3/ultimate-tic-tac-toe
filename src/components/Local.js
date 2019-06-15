import React from 'react';
import Board from './Board';
import calculateWinner from '../helpers.js'

class Local extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.props.step + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const move = this.props.turn ? 'X' : 'O';

    if(calculateWinner(squares).winner || squares[i] || (!this.props.focus && !this.props.start)) {
      return;
    }

    if(this.props.focus && move === 'O') {
      console.log(squares);
    }

    squares[i] = move;

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
    });

    this.props.onClick(i, calculateWinner(squares).winner);
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.props.step;
    const current = history[stepNumber];
    const winInfo = calculateWinner(current.squares);

    return (
      <Board
        squares={current.squares}
        onClick={(i) => this.handleClick(i)}
        winLine={winInfo.line}
        focus={this.props.focus}
      />
    );
  }
}

export default Local;
