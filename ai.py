import random

def available_moves(board):
    return [i for i in range(len(board)) if board[i] == None]

def find_best_move(squares, focus):
    if focus == None:
        focus = 0;

    moves = available_moves(squares[focus])
    c = random.choice(moves)
    return focus, c;
