from flask import Flask, render_template, jsonify, request
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/response', methods=['GET', 'POST'])
def response():
    content = request.get_json()

    boards = content['boards']
    focus = content['focus']

    jsonResponse = {'board': 1, 'coordinate': focus}
    return jsonify(jsonResponse)

if __name__ == '__main__':
    app.run(debug=True)
