def find_best_move(squares, focus):
    if focus == None:
      focus = 0;

    for i in range(len(squares[focus])):
      if squares[focus][i] == None:
        return focus, i;
