import Square from './Square';
import { GAME_STATUS } from '../constants';

type LocalProps = {
  squares: any;
  focus: boolean;
  onClick: Function;
  status: typeof GAME_STATUS[keyof typeof GAME_STATUS] | null;
};

const Local = ({ squares, focus, onClick, status }: LocalProps) => {
  const handleClick = (i: number) => {
    if (squares[i] || !focus) {
      return;
    }

    onClick(i);
  };

  const renderSquares = () => {
    const won: string | false = status && !focus ? 'won-' + status : false;
    let parent = [];

    for (let i = 0; i < 3; i++) {
      let children = [];

      for (let j = 0; j < 3; j++) {
        let item = 3 * i + j;

        children.push(
          <Square
            key={item}
            value={squares[item]}
            onClick={() => handleClick(item)}
            won={won}
          />
        );
      }

      parent.push(
        <div className="board-row" key={i}>
          {children}
        </div>
      );
    }

    return parent;
  };

  const className = 'left ' + (focus ? 'board-focus ' : '');

  return (
    <div className={className}>
      {status && <div className="won">{status}</div>}
      {renderSquares()}
      {
        Array(3).
      }
    </div>
  );
};

export default Local;
