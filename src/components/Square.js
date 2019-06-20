import React from 'react';

function Square(props) {
  const className = 'square ' + (props.value ? props.value : '');

  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default Square;
