import React from 'react';
import Board from './Board';

class Local extends React.Component {
  setMove(i) {
    const squares = this.props.squares;

    if(squares[i] || (!this.props.focus && !this.props.globalClick)) {
        return;
    }

    this.props.onClick(i);
  }

  render() {
    const squares = this.props.squares;

    return (
      <Board
        squares={squares}
        onClick={(i) => this.setMove(i)}
        winLine={this.props.winLine}
        focus={this.props.focus}
      />
    );
  }
}

export default Local;
