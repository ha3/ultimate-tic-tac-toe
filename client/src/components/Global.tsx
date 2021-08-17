import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

import Local from './Local';
import { MOVE, GAME_STATUS } from '../constants';
import { calculateWinner } from '../helpers';

const getBestMove = async (data: object) => {
  const response = await fetch(
    `${process.env.REACT_APP_BACKEND_URL}/response`,
    {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      }
    }
  );

  const res = await response.json();
  const { best_move: move, focus } = res;

  return { move, focus };
};

type Action =
  | { type: 'SET_MOVE'; payload: { board: number; coordinate: number } }
  | { type: 'JUMP_TO'; payload: { step: number; move: number } }
  | { type: 'RESET' };

type State = {
  allBoards: Array<Array<typeof MOVE[keyof typeof MOVE] | null>>;
  focus: number | null;
  stepNumber: number;
  xIsNext: boolean;
};

type GlobalBoard = Array<typeof GAME_STATUS[keyof typeof GAME_STATUS] | null>;

const initialState: State = {
  allBoards: Array(9)
    .fill(null)
    .map(x => Array(9).fill(null)),
  focus: null,
  stepNumber: 0,
  xIsNext: true
};

const getGlobalBoard = (state: State): GlobalBoard => {
  return Array(9)
    .fill(null)
    .map((_, idx) => calculateWinner(state.allBoards[idx]));
};

const getLocalMoveCount = (state: State): Array<number> => {
  return Array(9)
    .fill(null)
    .map((_, idx) => state.allBoards[idx].filter(Boolean).length);
};

const getWinner = (state: State) => {
  return calculateWinner(getGlobalBoard(state));
};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_MOVE': {
      const { board, coordinate } = action.payload;
      const { xIsNext, allBoards } = state;

      const move = xIsNext ? MOVE.X : MOVE.O;

      let focus: number | null = null;

      allBoards[board][coordinate] = move;

      const winner = getWinner(state);
      const localMoveCount = getLocalMoveCount(state);

      // If all squares are full in a board, then next player can select any board they wish.
      if (!winner && localMoveCount[coordinate] !== 9) {
        focus = coordinate;
      }

      return {
        ...state,
        allBoards: allBoards,
        focus: focus,
        // stepNumber: history.length,
        stepNumber: state.stepNumber + 1,
        xIsNext: !xIsNext
      };
    }

    case 'JUMP_TO': {
      const { step, move } = action.payload;

      if (step < move && step >= 0) {
        return {
          ...state,
          stepNumber: step,
          xIsNext: true
        };
      }

      return state;
    }

    case 'RESET': {
      return initialState;
    }

    default:
      throw new Error('Unknown action type');
  }
};

const Global = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { allBoards, focus, stepNumber, xIsNext } = state;

  React.useEffect(() => {
    const getComputerMove = async () => {
      const data = { allBoards: allBoards, focus: focus, move: stepNumber };
      const { move, focus: newFocus } = await getBestMove(data);

      dispatch({
        type: 'SET_MOVE',
        payload: { board: newFocus, coordinate: move }
      });
    };

    getComputerMove();
  }, [xIsNext, allBoards, focus, stepNumber]);

  const handleReset = () => {
    dispatch({
      type: 'RESET'
    });
  };

  const setMove = (coordinate: number, board: number) => {
    dispatch({
      type: 'SET_MOVE',
      payload: {
        coordinate,
        board
      }
    });
  };

  const renderBoards = () => {
    const globalBoard = getGlobalBoard(state);
    const freeMove = !winner && focus === null;

    const parent = [];

    for (let i = 0; i < 3; i++) {
      const children = [];

      for (let j = 0; j < 3; j++) {
        let item = 3 * i + j;

        children.push(
          <Local
            key={item}
            squares={allBoards[item]}
            onClick={(a: number) => setMove(a, item)}
            focus={item === focus || (!globalBoard[item] && freeMove)}
            status={globalBoard[item]}
          />
        );
      }
      parent.push(<div key={i}>{children}</div>);
    }

    return parent;
  };

  const jumpTo = (step: number, move: number) => {
    dispatch({
      type: 'JUMP_TO',
      payload: {
        step,
        move
      }
    });
  };

  const winner = getWinner(state);

  const moves = (
    <div className="game-history">
      <FontAwesomeIcon
        key="left"
        icon={faChevronLeft}
        pull="left"
        size="lg"
        //onClick={() => jumpTo(stepNumber-2, history.length)}
      />
      <FontAwesomeIcon
        key="right"
        icon={faChevronRight}
        pull="right"
        size="lg"
        //onClick={() => jumpTo(stepNumber+2, history.length)}
      />
    </div>
  );

  let status;

  if (winner) {
    if (winner !== GAME_STATUS.DRAW) {
      status = 'Winner: ' + winner;
    } else {
      status = 'It is a draw!';
    }
  } else {
    status = 'Next player: ' + (xIsNext ? MOVE.X : MOVE.O);
  }

  return (
    <div className="game">
      <div className="game-board">
        {renderBoards()}
        {moves}
      </div>
      <div className="game-info">
        <div className="status">{status}</div>
        <button onClick={handleReset}>New Game</button>
      </div>
    </div>
  );
};

export default Global;
