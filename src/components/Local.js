import React from 'react';
import Square from './Square';

class Local extends React.Component {
  setMove(i) {
    const squares = this.props.squares;

    if(squares[i] || (!this.props.focus && !this.props.freeMove)) {
        return;
    }

    this.props.onClick(i);
  }

  renderSquares() {
    let parent = [];

    for(let i = 0; i < 3; i++) {
      let children = [];

      for(let j = 0; j < 3; j++) {
        let item = (3 * i) + j;

        children.push(
          <Square
            key={item}
            value={this.props.squares[item]}
            onClick={() => this.setMove(item)}
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
