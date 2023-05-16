import React from "react"

const dieImg = ['img/dice-one.png', "img/dice-two.png", 'img/dice-three.png', 'img/dice-four.png', 'img/dice-five.png', 'img/dice-six.png']

export default function Die(props) {
    const styles = {
        backgroundColor: props.isHeld ? "#59E391" : "white",
        backgroundImage:`url(${dieImg[props.value-1]})` 
    }
    return (
        <div 
            className="die-face" 
            style={styles}
            onClick={props.holdDice}
        >
            <h2 className="die-num"></h2>
        </div>
    )
}