import React from 'react';
import Local from './Local';
import helpers from '../helpers.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

class Global extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        localSteps: Array(9).fill(0),
        globalBoard: Array(9).fill(null),
        focus: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(localCoordinate, localStatus, localBoard) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const localSteps = current.localSteps.slice();
    const globalBoard = current.globalBoard.slice();
    let focus = null;

    localSteps[localBoard] += 1;
    globalBoard[localBoard] = localStatus;

    // If all squares are full in a local board, then next player can select any board they wish.
    if(localSteps[localCoordinate] !== 9) {
      focus = localCoordinate
    }

    this.setState({
      history: history.concat([{
        localSteps: localSteps,
        globalBoard: globalBoard,
        focus: focus,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderBoards() {
    const stepNumber = this.state.stepNumber;
    const history = this.state.history;
    const current = history[stepNumber];
    const localSteps = current.localSteps;
    const focus = current.focus;
    
    let parent = [];

    for(let i = 0; i < 3; i++) {
      let children = [];

      for(let j = 0; j < 3; j++) {
        let item = (3*i) + j;
        children.push(
          <Local
            key={item}
            onClick={(a, b) => this.handleClick(a, b, item)}
            step={localSteps[item]}
            focus={item === focus ? true : false}
            turn={this.state.xIsNext}
            globalClick={focus === null ? true : false}
          />
        );
      }
      parent.push(<div key={i}>{children}</div>);
    }

    return parent;
  }

  jumpTo(step, move) {
    if(step < move && step >= 0) {
      this.setState({
        stepNumber: step,
        xIsNext: true,
      });
    }
  }

  render() {
      const history = this.state.history;
      const stepNumber = this.state.stepNumber;
      const current = history[stepNumber];
      const globalBoard = current.globalBoard;
      const winInfo = helpers.calculateWinner(globalBoard);

      const moves = (
          <div className="game-history">
            <FontAwesomeIcon
              key="left"
              icon={faChevronLeft}
              pull="left"
              size="lg"
              onClick={() => this.jumpTo(stepNumber-2, history.length)}
            />
            <FontAwesomeIcon
              key="right"
              icon={faChevronRight}
              pull="right"
              size="lg"
              onClick={() => this.jumpTo(stepNumber+2, history.length)}
            />
          </div>
      );

      let status;

      if(winInfo.winner) {
        if(winInfo.winner !== '-') {
          status = 'Winner: ' + winInfo.winner;
        }

        else {
          status = 'It is a draw!';
        }
      }
      else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

    return (
      <div className="game">
        <div className="game-board">
        {this.renderBoards()}
        {moves}
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
        </div>
      </div>
    );
  }
}

export default Global;
