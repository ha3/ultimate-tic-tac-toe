import * as React from 'react';
import Local from './Local';
import helpers from '../helpers.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

const getBestMove = async (data: object) => {
  const query = await fetch('http://localhost:5000/response', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json',
    }
  })

  const res = await query.json();
  return res.best_move;
}


type Action =
  | { type: 'SET_MOVE', payload: { board: number, coordinate: number } }
  | { type: 'JUMP_TO', payload: { step: number, move: number } }
  | { type: 'RESET' };

const MOVE = {
  X: "X",
  O: "O"
};

type State = {
  allBoards: Array<Array<[typeof MOVE[keyof typeof MOVE]]>>,
  focus: number | null,
  stepNumber: number,
  xIsNext: boolean
}


const GAME_STATUS = {
  X: "X",
  O: "O",
  "-": "-"
}

const initialState: State = {
  allBoards: Array(9).fill(null).map(x=> Array(9).fill(null)),
  focus: null,
  stepNumber: 0,
  xIsNext: true
};

const getGlobalBoard = (state: State) => {
  return Array(9).map((_, idx) => helpers.calculateWinner(state.allBoards[idx]));

}

const getLocalMovecount = (state: State) => {
  return Array(9).map((_, idx) => state.allBoards[idx].filter(Boolean).length);
}

const getWinner = (state: State) => {
  return helpers.calculateWinner(getGlobalBoard(state));
}


const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_MOVE": {
      const { board, coordinate } = action.payload;
      const { xIsNext, allBoards } = state;

      const move = xIsNext ? MOVE.X : MOVE.O;

      let focus: number | null = null;
      let winner: typeof MOVE | null = null;

      allBoards[board][coordinate] as string = move as string;

      winner = getWinner(state);
      const localMoveCount = getLocalMovecount(state);

      // If all squares are full in a board, then next player can select any board they wish.
      if(!winner && localMoveCount[coordinate] !== 9) {
        focus = coordinate;
      }

      return {
        ...state,
        allBoards: allBoards,
        focus: focus,
        // stepNumber: history.length,
        stepNumber: state.stepNumber + 1,
        xIsNext: !xIsNext,
      }

    }

    case "JUMP_TO": {
      const { step, move } = action.payload;

      if(step < move && step >= 0) {
        return {
          ...state,
          stepNumber: step,
          xIsNext: true,
        };
      }

      return state;
    }

    case "RESET": {
      return initialState;
    }

    default:
      throw new Error("Unknown action type");
  }
}

const Global = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { allBoards, focus, stepNumber, xIsNext } = state;

  React.useEffect(() => {
    const getComputerMove = async () => {
      const data = {allBoards: allBoards, focus: focus, move: stepNumber};

      const move = await getBestMove(data);
      dispatch({
        type: 'SET_MOVE',
        payload: { move, focus }
      });
    }

    getComputerMove();
  }, [xIsNext, allBoards, focus, stepNumber]);

  const handleReset = () => {
    dispatch({
      type: 'RESET'
    });
  }

  const setMove = (coordinate: number, board: number) => {
    dispatch({
      type: 'SET_MOVE',
      payload: {
        coordinate, board
      }
    })
  }

  const renderBoards = () => {
    const globalBoard = getGlobalBoard(state);
    const freeMove = (!winner && focus === null) ? true : false;

    let parent = [];

    for(let i = 0; i < 3; i++) {
      let children = [];

      for(let j = 0; j < 3; j++) {
        let item = (3 * i) + j;

        children.push(
          <Local
            key={item}
            squares={allBoards[item]}
            onClick={(a: number) => setMove(a, item)}
            focus={(item === focus || (!globalBoard[item] && freeMove)) ? true : false}
            win={globalBoard[item]}
          />
        );
      }
      parent.push(<div key={i}>{children}</div>);
    }

    return parent;
  }

  const jumpTo = (step: number, move: number) => {
    dispatch({
      type: 'JUMP_TO',
      payload: {
        step, move
      }
    })
  }

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

    if(winner) {
      if(winner !== GAME_STATUS['-']) {
        status = 'Winner: ' + winner;
      }

      else {
        status = 'It is a draw!';
      }
    }

    else {
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
}

export default Global;
