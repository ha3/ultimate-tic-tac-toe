import Square from './Square';

type LocalProps = {
  squares: object,
  focus: boolean,
  onClick: Function,
  win: string | null
}

const Local = ({ squares, focus, onClick, win }: LocalProps) => {
  const handleClick = (i) => {
    if(squares[i] || (!focus)) {
        return;
    }

    onClick(i);
  }

  const renderSquares = () => {
    const won = win && !focus ? ('won-' + win) : false;
    let parent = [];

    for(let i = 0; i < 3; i++) {
      let children = [];

      for(let j = 0; j < 3; j++) {
        let item = (3 * i) + j;

        children.push(
          <Square
            key={item}
            value={squares[item]}
            onClick={() => handleClick(item)}
            won={won}
          />
        );
      }

      parent.push(<div className="board-row" key={i}>{children}</div>);
    }
    return parent
  }

  let className = 'left ' + (focus ? 'board-focus ' : '');
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
      {renderSquares()}
    </div>
  );
}

export default Local;
