import React from 'react';
import Square from './Square';

class Local extends React.Component {
  handleClick(i) {
    const squares = this.props.squares;

    if(squares[i] || (!this.props.focus)) {
        return;
    }

    this.props.onClick(i);
  }

  renderSquares() {
    const won = this.props.win && !this.props.focus ? ('won-' + this.props.win) : false;
    let parent = [];

    for(let i = 0; i < 3; i++) {
      let children = [];

      for(let j = 0; j < 3; j++) {
        let item = (3 * i) + j;

        children.push(
          <Square
            key={item}
            value={this.props.squares[item]}
            onClick={() => this.handleClick(item)}
            won={won}
          />
        );
      }

      parent.push(<div className="board-row" key={i}>{children}</div>);
    }
    return parent
  }

  render() {
    const win = this.props.win;
    let className = 'left ' + (this.props.focus ? 'board-focus ' : '');
    let wonParent = '';

    if(win !== null) {
      wonParent = (
        <div className="won">
          {win}
        </div>
      );
    }

    return (
      <div className={className}>
        {wonParent}
        {this.renderSquares()}
      </div>
    );
  }
}

export default Local;
