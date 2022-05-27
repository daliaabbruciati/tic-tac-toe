import React, {useState,useEffect} from 'react'
import {Cell} from "./cell";

// const [board, setBoard] = useState(initialBoard)
// const [turn, setTurn] = useState('X')
// const [winner, setWinner] = useState('')
// const [isBoardFull, setIsBoardFull] = useState(false)
// const [history, setHistory] = useState([0])


let boot = false;

const PL1 = 'X'
const PL2 = 'O'



export const Game = () => {

    const initialBoard = Array(9).fill('')

    const initialState = {
        board: initialBoard,
        turn: PL1,
        winner: '',
        isBoardFull: false,
        history: [0],
        newHistoryValue: initialBoard
    }

    const [gameState, setGameState] = useState(initialState)

    // const [gameStateStorage, setGameStateStorage] = useState(() => {
    //     const localData = localStorage.getItem('gameState')
    //     const initialValue = JSON.parse(localData)
    //     if(initialValue) return setGameState(initialValue)
    // })

    const {board, turn, winner, isBoardFull, history, newHistoryValue} = gameState

    useEffect(() => {
      console.log('useeffect 1');
      if (!boot) {
        boot = true
        return
      }
      localStorage.setItem('gameState', JSON.stringify(gameState))
    }, [gameState])


    useEffect(() => {
      console.log('useeffect 2')
      const localData = localStorage.getItem('gameState')
      const initialValue = JSON.parse(localData)
      if (initialValue) return setGameState(initialValue)
    }, [])


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

    const onClickCell = (index) => {

        if (board[index] !== '') {
            alert('Already clicked')
            return
        }

        if (turn === PL1) {
            board[index] = PL1
            setGameState({...gameState,
                turn: PL2,
                history: [...history, [...board]]})
        } else {
            board[index] = PL2
            setGameState({...gameState,
                turn: PL1,
                history: [...history, [...board]]})
        }


        checkWinner(index);

        console.log(history)
        console.log(newHistoryValue)
    }

    const onClickShowHistory = (index) => {
        setGameState({
            ...gameState,
            board: JSON.parse(JSON.stringify(history[index])),
            history: history.slice(0, index + 1),
        })

        //TODO:
        // 1. aggiungere il local storage
        // 2. per troncare la storia quando clicco sul bottone indice della storia,
        // ma devo fare in modo che accada solo quando riclicco sulla board
        // setGameState({..gameState, history: history.slice(0,indexClicked) });
        // 3. sistemare caso in cui clicco sull'indice 0 e mi dice 'already clicked'


        console.log(history[index])
        console.log(newHistoryValue)
        console.log(index)
    }

    const onClickRestart = () => {
        setGameState(initialState)
    }


    console.log('render in Game.js')
    return (
        <div className='board'>
            {winner ? <h2>{winner}</h2> : <h2>Player {turn}, it's your turn</h2>}
            {isBoardFull && <h2>Nobody won</h2>}
            <Cell board={board} onClick={winner ? (e) => e.preventDefault : onClickCell}/>
            <div className='board__snapshot'>
                {history?.map((item, index) => (
                        <button key={index} className='board__btn-snapshot'
                                onClick={() => onClickShowHistory(index)}>{index}</button>
                    )
                )}
            </div>
            <button className='board__btn-restart' onClick={onClickRestart}>Restart!</button>
        </div>
    )
}


