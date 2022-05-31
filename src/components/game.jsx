import React, {useState, useEffect} from 'react'
import {Cell} from "./cell";


const PL1 = 'X'
const PL2 = 'O'

const initialState = {
    board: Array(9).fill(''),
    turn: PL1,
    winner: '',
    isBoardFull: false,
    history: [0],
    currentStep: 0
}

const useLocalStorageState = (key, initialValue) => {
    const [state, setState] = useState(() => {
        const localData = localStorage.getItem(key)
        if (localData) {
            return JSON.parse(localData)
        }
        return initialValue
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(state))
    }, [key, state])

    return [state, setState]
}


export const Game = () => {

    const [gameState, setGameState] = useLocalStorageState('gameState', initialState)

    const {board, turn, winner, isBoardFull, history, currentStep} = gameState

    const newHistory = history.slice(0, currentStep + 1);


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
                return setGameState({
                    ...gameState,
                    winner: `Winner: player ${board[index]} 🎉🥳`,
                    history: [...newHistory, [...board]],
                    currentStep: newHistory.length
                })
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
                history: [...newHistory, [...board]],
                currentStep: newHistory.length
            })
        } else {
            board[index] = PL2
            setGameState({
                ...gameState,
                turn: PL1,
                history: [...newHistory, [...board]],
                currentStep: newHistory.length
            })
        }
        checkWinner(index);
    }

    const onClickRestart = () => {
        setGameState({
            board: Array(9).fill(''),
            turn: PL1,
            winner: '',
            isBoardFull: false,
            history: [0],
            currentStep: 0
        })
    }

    const onClickShowHistory = (index) => {
        setGameState({
            ...gameState,
            board: JSON.parse(JSON.stringify(history[index])),
            turn: index % 2 === 0 ? PL1 : PL2,
            winner: '',
            currentStep: index,
            isBoardFull: false
        })
        console.log([...newHistory])
    }




    return (
        <div className='board'>
            {winner ? <h2>{winner}</h2> : <h2>Player {turn}, it's your turn</h2>}
            {isBoardFull && <h2>Nobody won</h2>}
            <Cell board={board} onClick={winner ? (e) => e.preventDefault : onClickBoard}/>
            <div className='board__snapshot'>
                {history.map((item, index) => {
                        const isCurrentStep = index === currentStep
                        return (
                            <button key={index} className='board__btn-snapshot' disabled={isCurrentStep}
                                    onClick={() => onClickShowHistory(index)}>
                                {currentStep || isCurrentStep ? index : null}
                            </button>
                        )
                    }
                )}
            </div>
            <button className='board__btn-restart' onClick={onClickRestart}>Restart!
            </button>
        </div>
    )
}


