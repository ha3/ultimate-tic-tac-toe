from flask import Flask, render_template, jsonify, request
from flask_cors import CORS, cross_origin

from ai import *

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/response', methods=['GET', 'POST'])
def response():
    content = request.get_json()

    allBoards = content['allBoards']
    focus = content['focus']

    board, coordinate = find_best_move(allBoards, focus)

    jsonResponse = {'board': board, 'coordinate': coordinate}
    return jsonify(jsonResponse)

if __name__ == '__main__':
    app.run(debug=True)
