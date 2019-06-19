import React from 'react';
import Square from './Square';

class Local extends React.Component {
  setMove(i) {
    const squares = this.props.squares;

    if(squares[i] || (!this.props.focus && !this.props.globalClick)) {
        return;
    }

    this.props.onClick(i);
  }

  renderSquares() {
    let parent = [];
    const winLine = this.props.winLine;

    for(let i = 0; i <= 6; i += 3) {
      let children = [];

      for(let j = 0; j < 3; j++) {
        children.push(
          <Square
            key={i+j}
            value={this.props.squares[i+j]}
            onClick={() => this.setMove(i+j)}
            highlight={winLine && winLine.includes(i+j)}
          />
        );
      }

      parent.push(<div className="board-row" key={i}>{children}</div>);
    }
    return parent
  }

  render() {
    const className = 'left' + (this.props.focus ? ' board-focus' : '');

    return (
      <div className={className}>
        {this.renderSquares()}
      </div>
    );
  }
}

export default Local;
