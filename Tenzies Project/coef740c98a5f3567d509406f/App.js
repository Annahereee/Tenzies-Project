import React from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from "react-confetti"

export default function App() {
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rollCount, setRollCount] = React.useState(0)
    const [seconds, setSeconds] = React.useState(0)
    const [bestTime, setBestTime] = React.useState(100)
    React.useEffect(() => {
        setBestTime(JSON.parse(localStorage.getItem('bestTime')))
    })

    React.useEffect(() => {
        let interval
        if(!tenzies){
            interval = setInterval(() => {setSeconds(prevState => prevState + 1)}, 1000)}
        else if(tenzies) {
            clearInterval(interval)}
        return () => clearInterval(interval) //Why need to have this? This is a cleanup in use.Effect React
    }
    ,[tenzies])
        
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        const currentTime = seconds
        if (allHeld && allSameValue) {
            setTenzies(true)
            if(currentTime < bestTime) {
                localStorage.setItem('bestTime', JSON.stringify(currentTime)) 
            }
        }        
    }, [dice])
    
    function changeToMinutes(time) {
        const minutes = Math.floor(time/60)
        return time > 60 ? `${minutes}m: ${time - 60}s`  : `${time}s`
    }
    
    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRollCount((prevState) => prevState + 1)  
        } 
        
        else if (tenzies) {
            setTenzies(false)
            setDice(allNewDice())
            setRollCount(0)
            setSeconds(0)
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <h2>Number of rolls: {rollCount}</h2>
            <div className=""></div>
            <p>Current time: {changeToMinutes(seconds)}</p>
            <p>Best time: {changeToMinutes(bestTime)}</p>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}
