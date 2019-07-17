# ultimate-tic-tac-toe

Ultimate tic-tac-toe is a modified version of the well-known tic-tac-toe game. It is played with nine boards arranged in a 3x3 grids. More information and rules can be found [here](https://en.wikipedia.org/wiki/Ultimate_tic-tac-toe).

## Prerequisites

You need these two package managers:

* ```npm```
* ```pip```


## Installation

### Back-end:

Start with activating virtualenv.

OS X & Linux:

```bash
$ virtualenv venv
$ python3.6 -m venv venv
$ . venv/bin/activate
```

Windows:

```bash
> virtualenv venv
> python -m venv venv
> venv/Scripts/activate
```

Install dependencies.

```bash
pip install -r requirements.txt
```

### Front-end:

If you don't have webpack, install it:

```bash
npm install -g webpack
```

Then install the Javascript dependencies.

```bash
npm install
```

## Development

React components are in ```js``` directory. While developing on the front-end run ```webpack --watch ``` to keep re-compiling your Javascript code. It will create a ``` static/bundle.js ``` file, which is the bundled version of your Javascript code.


Back-end part consists of ``` app.py ``` and ``` ai.py ```. 


## Usage

```bash
python -m flask run
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
