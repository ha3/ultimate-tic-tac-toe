import React from 'react';

type SquareProps = {
  won: string | false;
  onClick(event: React.MouseEvent<HTMLButtonElement>): void;
  value: string;
};

const Square = ({ won, onClick, value }: SquareProps) => {
  const className = 'square ' + (won ? won + ' ' : '') + (value ? value : '');

  return (
    <button className={className} onClick={onClick}>
      {value}
    </button>
  );
};

export default Square;
