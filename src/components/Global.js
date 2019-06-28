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
        allBoards: Array(81).fill(null),
        localMoveCount: Array(9).fill(0),
        globalBoard: Array(9).fill(null),
        focus: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleReset() {
    this.setState({
      history: [{
        allBoards: Array(81).fill(null),
        localMoveCount: Array(9).fill(0),
        globalBoard: Array(9).fill(null),
        focus: null,
      }],
      stepNumber: 0,
      xIsNext: true,
    });
  }

  handleClick(coordinate, board) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];

    const allBoards = current.allBoards.slice();
    const localMoveCount = current.localMoveCount.slice();
    const globalBoard = current.globalBoard.slice();

    const move = this.state.xIsNext ? 'X' : 'O';
    let focus = null;

    allBoards[board * 9 + coordinate] = move;
    localMoveCount[board] += 1;

    if(globalBoard[board] !== 'X' && globalBoard[board] !== 'O' && globalBoard[board] !== '-') {
      globalBoard[board] = helpers.calculateWinner(allBoards.slice(board * 9, board * 9 + 9));
    }

    // If all squares are full in a local board, then next player can select any board they wish.
    if(!helpers.calculateWinner(globalBoard) & localMoveCount[coordinate] !== 9) {
      focus = coordinate;
    }

    this.setState({
      history: history.concat([{
        allBoards: allBoards,
        localMoveCount: localMoveCount,
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

    const allBoards = current.allBoards;
    const globalBoard = current.globalBoard;
    const focus = current.focus;

    const globalWin = helpers.calculateWinner(globalBoard);
    const freeMove = (!globalWin && focus === null) ? true : false;

    let parent = [];

    for(let i = 0; i < 3; i++) {
      let children = [];

      for(let j = 0; j < 3; j++) {
        let item = (3 * i) + j;

        children.push(
          <Local
            key={item}
            squares={allBoards.slice(item * 9, item * 9 + 9)}
            onClick={(a) => this.handleClick(a, item)}
            focus={(item === focus || (!globalBoard[item] && freeMove)) ? true : false}
            win={globalBoard[item]}
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

  componentDidUpdate(prevProps, prevState) {
    /**
    When it is O's turn, pass the related board and focus parameters
    to server and set the returning 'best move'.
    */

    if(!this.state.xIsNext) {
      const history = this.state.history;
      const current = history[history.length - 1];

      const focus = current.focus;
      const allBoards = current.allBoards.slice(focus * 9, focus * 9 + 9);

      const bestMove = helpers.findBestMove(allBoards);

      this.handleClick(bestMove, focus);
    }
  }

  render() {
    const history = this.state.history;
    const stepNumber = this.state.stepNumber;
    const current = history[stepNumber];
    const globalBoard = current.globalBoard;
    const globalWin = helpers.calculateWinner(globalBoard);

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

    if(globalWin) {
      if(globalWin !== '-') {
        status = 'Winner: ' + globalWin;
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
          <button onClick={() => this.handleReset()}>New Game</button>
        </div>
      </div>
    );
  }
}

export default Global;
