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

Install javascript dependencies.

```bash
npm install
```

## Development

React components are in ```src``` directory. While developing on the front-end run ```npm run build ``` to compile your javascript code. It will create a ``` build ``` directory, which contains bundled version of your javascript and css codes.


Back-end part consists of ``` app.py ``` and ``` ai.py ```.


## Usage

```bash
python -m flask run
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
