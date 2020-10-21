import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import cn from 'classnames';

function Square(props) {
    return <button className={props.className} onClick={props.onClick}>
        {props.value}
    </button>;
}

/*
class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: null,
        };
    }

    render() {
        return (
            <button
                className="square"
                onClick={() => this.props.onClick()}
            >
                {this.props.value}
            </button>
        );
    }
}
*/

class Board extends React.Component {
    renderSquare(i) {
        const classes = cn(
            'square',
            { 'square--highlight': this.props.winnerLine?.includes(i) },
        );

        return <Square
            className={classes}
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
        />;
    }

    render() {
        return <div>
            <div className="board-row">
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
            </div>
            <div className="board-row">
                {this.renderSquare(3)}
                {this.renderSquare(4)}
                {this.renderSquare(5)}
            </div>
            <div className="board-row">
                {this.renderSquare(6)}
                {this.renderSquare(7)}
                {this.renderSquare(8)}
            </div>
        </div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                },
            ],
            stepNumber: 0,
            xIsNext: true,
            sortOrder: true, // true = asc, false = desc
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares).winner || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    sortHistory() {
        this.setState({
            sortOrder: !this.state.sortOrder,
        });

        this.jumpTo(this.state.history.length - 1 - this.state.stepNumber);
    }

    render() {
        let history = this.state.history;

        if (!this.state.sortOrder) {
            history = history.slice().reverse();
        }

        const current = history[this.state.stepNumber];
        const { line, winner } = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const fixedMove = this.state.sortOrder ? move : history.length - move - 1;

            const desc = fixedMove ?
                'Go to move #' + fixedMove :
                'Go to game start';

            // const classes = [
            //     'button',
            //     step === current ? 'button--selected' : '',
            // ].join(' ');

            const classes = cn(
                'button',
                { 'button--selected': step === current },
            );

            return <li key={move}>
                <button onClick={() => this.jumpTo(move)} className={classes}>
                    {desc}
                </button>
            </li>;

            // Change style directly
            // const style = {
            //     'fontWeight': step === current ? `bold` : 'inherit',
            // };
            //
            // return <li key={move}>
            //     <button onClick={() => this.jumpTo(move)} style={style}>
            //         {desc}
            //     </button>
            // </li>;
        });

        const status =
            winner
                ? 'Winner: ' + winner
                : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

        // Draw:
        // draw = lista.filter(v => !Boolean(v)).length === 0;
        // draw = lista.filter(Boolean).length === lista.length;

        return <div className="game">
            <div className="game-board">
                <Board
                    winnerLine={line}
                    squares={current.squares}
                    onClick={i => this.handleClick(i)}
                />
            </div>

            <div className="game-info">
                <button onClick={() => this.sortHistory()}>Order {this.state.sortOrder ? 'Desc' : 'Asc'}</button>
                <br/>
                <br/>
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>;
    }
}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root'),
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];

        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                line: lines[i],
                winner: squares[a],
            };
        }
    }

    return {
        line: null,
        winner: false,
    };
}
