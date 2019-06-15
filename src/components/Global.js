import React from 'react';
import Local from './Local';
import calculateWinner from '../helpers.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

class Global extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        localSteps: Array(9).fill(0),
        focus: null,
      }],
      globalBoard: Array(9).fill(null),
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleClick(localCoordinate, localStatus, localBoard) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const localSteps = current.localSteps.slice();
    const globalBoard = this.state.globalBoard;

    localSteps[localBoard] += 1;
    globalBoard[localBoard] = localStatus;

    this.setState({
      history: history.concat([{
        localSteps: localSteps,
        focus: localCoordinate,
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
        children.push(
          <Local
            key={(3*i)+j}
            onClick={(a, b) => this.handleClick(a, b, (3*i)+j)}
            step={localSteps[(3*i)+j]}
            focus={(3*i)+j === focus ? true : false}
            turn={this.state.xIsNext}
            start={this.state.stepNumber === 0 ? true : false}
          />
        );
      }
      parent.push(<div key={i}>{children}</div>);
    }

    return parent;
  }

  jumpTo(step, move) {
    console.log("jumpTo() - Global - Step: " + step + " Move: " + move);
    if(step < move && step >= 0) {
      this.setState({
        stepNumber: step,
        xIsNext: (step % 2) === 0,
      });
    }
  }

  render() {
      const history = this.state.history;
      const stepNumber = this.state.stepNumber;
      const winInfo = calculateWinner(this.state.globalBoard);

      const moves = (
          <div className="game-history">
            <FontAwesomeIcon
              key="left"
              icon={faChevronLeft}
              pull="left"
              size="lg"
              onClick={() => this.jumpTo(stepNumber-1, history.length)}
            />
            <FontAwesomeIcon
              key="right"
              icon={faChevronRight}
              pull="right"
              size="lg"
              onClick={() => this.jumpTo(stepNumber+1, history.length)}
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
