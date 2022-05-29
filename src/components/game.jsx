import React, {useState, useEffect, useRef} from 'react'
import {Cell} from "./cell";


const PL1 = 'X'
const PL2 = 'O'

const initialBoard = Array(9).fill('')

const initialState = {
    board: initialBoard,
    turn: PL1,
    winner: '',
    isBoardFull: false,
    history: [0],
    newHistoryValue: [0]
}

const useLocalStorageState = (key, initialValue) => {
    const [state, setState] = useState(() => {
        const localData = localStorage.getItem(key)
        if (localData) {
            try {
                return JSON.parse(localData)
            } catch (error) {
                localStorage.removeItem(key)
            }
        }
        return initialValue
    })

    const prevKeyRef = useRef(key)

    useEffect(() => {
        const prevKey = prevKeyRef.current
        if (prevKey !== key) {
            localStorage.removeItem(prevKey)
        }
        prevKeyRef.current = key
        localStorage.setItem(key, JSON.stringify(state))
    }, [key, state])

    return [state, setState]
}


export const Game = () => {

    const [gameState, setGameState] = useLocalStorageState('gameState', initialState)

    const {board, turn, winner, isBoardFull, history, newHistoryValue} = gameState

    const checkWinner = (index) => {
        const combos = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ]

        for (let combo of combos) {
            const [a, b, c] = combo.map(index => board[index])
            if (a !== '' && a === b && b === c) {
                return setGameState({...gameState, winner: `Winner: player ${board[index]} 🎉🥳`})
            }

            const checkBoardFull = board.every(item => {
                return item !== ''
            })

            if (checkBoardFull) {
                setGameState({...gameState, isBoardFull: true})
            }
        }
    }


    const onClickBoard = (index) => {

        if (board[index] !== '') {
            return alert('Already clicked')
        }

        if (turn === PL1) {
            board[index] = PL1
            setGameState({
                ...gameState,
                turn: PL2,
                history: [...history, [...board]],
                newHistoryValue: history.slice(0, index + 1),
            })
        } else {
            board[index] = PL2
            setGameState({
                ...gameState,
                turn: PL1,
                history: [...history, [...board]],
                newHistoryValue: history.slice(0, index + 1)
            })
        }

        checkWinner(index);

        console.log(history)
        console.log(newHistoryValue)
        console.log(board)
    }

    const onClickShowHistory = (index) => {

        setGameState({
            ...gameState,
            board: JSON.parse(JSON.stringify(history[index])),
            turn: index % 2 === 0 ? PL1 : PL2,
            winner: '',
            newHistoryValue: history.slice(0, index + 1),
            // history: history.slice(0, index + 1)
        })


        //TODO:
        // 1. per troncare la storia quando clicco sul bottone indice della storia,
        // ma devo fare in modo che accada solo quando riclicco sulla board
        // setGameState({..gameState, history: history.slice(0, index + 1) });
        // 2. sistemare caso in cui clicco sull'indice 0 e mi dice 'already clicked'


        console.log(history[index])
        console.log(newHistoryValue)
        console.log(board)
        console.log(index)
    }

    const onClickRestart = () => setGameState(initialState)


    console.log('render in Game.js')
    return (
        <div className='board'>
            {winner ? <h2>{winner}</h2> : <h2>Player {turn}, it's your turn</h2>}
            {isBoardFull && <h2>Nobody won</h2>}
            <Cell board={board} onClick={winner ? (e) => e.preventDefault : onClickBoard}/>
            <p>history</p>
            <div className='board__snapshot'>
                {history.map((item, index) => (
                        <button key={index} className='board__btn-snapshot'
                                onClick={() => onClickShowHistory(index)}>{index}</button>
                    )
                )}
            </div>
            <p>new history value</p>
            <div className='board__snapshot'>
                {newHistoryValue.map((item, index) => (
                        <button key={index} className='board__btn-snapshot'
                                onClick={() => onClickShowHistory(index)}>{index}</button>
                    )
                )}
            </div>
            <button className='board__btn-restart' onClick={onClickRestart}>Restart!</button>
        </div>
    )
}


