import React from 'react';

type SquareProps = {
  won: boolean,
  onClick(event: React.MouseEvent<HTMLButtonElement>): void,
  value: string
}

const Square = ({ won, onClick, value }: SquareProps) => {
  const className = 'square ' + (won ? (won + ' ') : '') + (value ? value : '') ;

  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
}

export default Square;
