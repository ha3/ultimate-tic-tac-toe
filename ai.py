import random

def available_moves(board):
    return [i for i in range(len(board)) if board[i] == None]


def calculate_winner(board):
    lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for i in range(len(lines)):
      [a, b, c] = lines[i]

      if board[a] and board[a] != '-' and board[a] == board[b] and board[a] == board[c]:
        return board[a]

    for i in range(len(lines)):
        if board[i] == None:
            return None

    return '-'


def find_best_move(squares, focus):
    if focus == None:
        focus = 0;

    global_board = [None] * 9

    for i in range(9):
        global_board[i] = calculate_winner(squares[i])

    moves = available_moves(squares[focus])
    c = random.choice(moves)

    return focus, c;
