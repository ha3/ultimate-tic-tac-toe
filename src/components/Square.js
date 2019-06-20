import React from 'react';

function Square(props) {
  const className = 'square ' + (props.highlight ? 'highlight ' : '') + (props.value ? props.value : '');

  return (
    <button className={className} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

export default Square;
