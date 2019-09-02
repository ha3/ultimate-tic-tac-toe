import os

from flask import Flask, render_template, jsonify, request, send_from_directory
from flask_cors import CORS, cross_origin
from math import inf

from ai import Game

app = Flask(__name__, static_folder='build/static', template_folder='build')
CORS(app)

def mask(position, player):
    offset = 8 - position

    if player == 'X':
        offset += 9

    return 1 << offset

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/response', methods=['GET', 'POST'])
def response():
    content = request.get_json()

    all_boards = content['allBoards']
    focus = content['focus']
    move = content['move']
    global_board = content['globalBoard']
    local_move_count = content['localMoveCount']

    bit_all_boards = [0] * 9
    bit_global_board = 0
    bit_ended_boards = 0
    bit_full_boards = 0

    for i in range(9):
        for j in range(9):
            if all_boards[i][j] == 'X' or all_boards[i][j] == 'O':
                bit_all_boards[i] = bit_all_boards[i] | mask(j, all_boards[i][j])

        if global_board[i] in ['X', 'O', '-']:
            bit_ended_boards = bit_ended_boards | (1 << i)

            if global_board[i] != '-':
                bit_global_board = bit_global_board | (1 << i)

        if local_move_count[i] == 8:
            bit_full_boards = bit_full_boards | (1 << i)


    game = Game(all_boards=bit_all_boards, global_board=bit_global_board, ended_boards=bit_ended_boards,
                full_boards=bit_full_boards, turn=-1, focus=focus, move=move+1)
    best_move = game.alpha_beta((81-move), -inf, inf, focus)[0]

    jsonResponse = {'best_move': best_move}

    return jsonify(jsonResponse)

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'build'), 'favicon.ico')

@app.route('/manifest.json')
def manifest():
    return send_from_directory(os.path.join(app.root_path, 'build'), 'manifest.json')

if __name__ == '__main__':
    app.run(debug=True)
