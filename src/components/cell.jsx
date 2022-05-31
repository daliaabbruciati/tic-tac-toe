import React from "react";

export const Cell = ({board, onClick}) => {
    function renderCells(index) {
        const player = board[index]
        return (
            <button className="board__cells"
                    onClick={() => onClick(index)}>
                {player ? player : '.'}
            </button>
        )
    }

    return (
        <div>
            <div className='board__grid'>
                {renderCells(0)}
                {renderCells(1)}
                {renderCells(2)}
            </div>
            <div className='board__grid'>
                {renderCells(3)}
                {renderCells(4)}
                {renderCells(5)}
            </div>
            <div className='board__grid'>
                {renderCells(6)}
                {renderCells(7)}
                {renderCells(8)}
            </div>
        </div>
    )
}
