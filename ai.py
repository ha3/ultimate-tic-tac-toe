from random import choice
from math import inf

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

    for i in range(len(board)):
        if board[i] == None:
            return None

    return '-'


def evaluate_score(board):
    result = calculate_winner(board)

    if result == 'X':
        return -10

    elif result == 'O':
        return 10

    elif result == '-':
        return 0

    else:
        return None


def minimax(squares, player, depth=None):
    if depth is None:
        depth = len(available_moves(squares))

    if player == 'O':
        best = [-1, -inf]

    else:
        best = [-1, inf]

    if depth == 0 or evaluate_score(squares) is not None:
        score = evaluate_score(squares)
        return [-1, score]

    for move in available_moves(squares):
        squares[move] = player
        score = minimax(squares, ('X' if player == 'O' else 'O'), depth-1)
        squares[move] = None
        score[0] = move

        if player == 'O':
            if score[1] > best[1]:
                best = score


        else:
            if score[1] < best[1]:
                best = score

    return best

board = [None, None, None, None, None, None, 'X', 'O', 'X']
print(minimax(board, 'O', 6))


def find_best_move(squares, focus):
    if focus == None:
        focus = 0;

    global_board = [None] * 9

    for i in range(9):
        global_board[i] = calculate_winner(squares[i])

    moves = available_moves(squares[focus])
    c = choice(moves)

    return focus, c;
