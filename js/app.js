$(document).foundation()


let doors = [{
        winner: false,
        open: false,
        chosen: false,
        element: null
    },
    {
        winner: false,
        open: false,
        chosen: false,
        element: null
    },
    {
        winner: false,
        open: false,
        chosen: false,
        element: null
    }]

let gameState = {
    phase: 0,
    winningDoor: -1
}

let closedDoorImages = []
let openLoserImages = []
let openWinnerImages = []

let doorImages
let switchButtons

let phaseMessage

const start = () => {
    console.log("Hello")

    phaseMessage = document.getElementById("phaseMessage")

    doors[0].element = document.getElementById("door_1")
    doors[1].element = document.getElementById("door_2")
    doors[2].element = document.getElementById("door_3")

    closedDoorImages[0] = document.getElementById("1_closed")
    closedDoorImages[1] = document.getElementById("2_closed")
    closedDoorImages[2] = document.getElementById("3_closed")

    closedDoorImages[0].onclick = function() { clickDoor(0)}
    closedDoorImages[1].onclick = function() { clickDoor(1)}
    closedDoorImages[2].onclick = function() { clickDoor(2)}

    openLoserImages[0] = document.getElementById("1_loser")
    openLoserImages[1] = document.getElementById("2_loser")
    openLoserImages[2] = document.getElementById("3_loser")

    openWinnerImages[0] = document.getElementById("1_winner")
    openWinnerImages[1] = document.getElementById("2_winner")
    openWinnerImages[2] = document.getElementById("3_winner")

    openLoserImages.map(imageElement => {imageElement.style.display = "none"})
    openWinnerImages.map(imageElement => {imageElement.style.display = "none"})

    switchButtons = document.getElementsByClassName("switch_button")
    for(var i=0; i<switchButtons.length; i++) {
        hideSwitchButtons()
    }

    doorImages = document.getElementsByClassName("door_img")
    for(var i=0; i<doorImages.length; i++) {
        doorImages[i].style.border = "5px solid #000004"
    }



    // hide open door images

    // pick a winning door
    // set up the three door objects

    let winningNumber = Math.floor(Math.random() * doors.length)
    gameState.winningDoor = winningNumber
    doors[winningNumber].winner = true

    gameState.phase = 1;

    console.log(gameState.winningDoor)

    // prompt to pick a door
    // doors must be clickable as buttons


}

function clickDoor(doorNumber) {
    if(doorNumber < 3 && doorNumber >= 0 && gameState.phase == 1){
        // select the door
        console.log("YOU CHOSE: " + doorNumber)
        doors[doorNumber].chosen = true
        closedDoorImages[doorNumber].style.border = "5px solid #fff"

        // remove hover pointer capability
        closedDoorImages.map(imgElement => imgElement.classList.remove("hover_door"))

        let allDoorNumbers = [0, 1, 2]
        let nonChosenDoorsNumbers = []

        allDoorNumbers.map(number => number != doorNumber && nonChosenDoorsNumbers.push(number))
        console.log(nonChosenDoorsNumbers.length + " non-chosens")

        let randomNonChosenDoorNumberIndex = Math.floor(Math.random() * nonChosenDoorsNumbers.length)
        let doorToOpenIndex = -1

        if(!doors[nonChosenDoorsNumbers[randomNonChosenDoorNumberIndex]].winner){
            doorToOpenIndex = nonChosenDoorsNumbers[randomNonChosenDoorNumberIndex]
        } else {
            for(let i=0; i<nonChosenDoorsNumbers.length; i++) {
                let thisDoor = doors[nonChosenDoorsNumbers[i]]
                if(!thisDoor.winner && !thisDoor.chosen){
                    console.log("more complicated option")
                    doorToOpenIndex = nonChosenDoorsNumbers[i]
                }
            }
        }

        doors[doorToOpenIndex].open = true
        showOpenDoors()

        // OPEN one LOSER door

        for(var i=0; i<switchButtons.length; i++) {
            switchButtons[i].style.visibility = "visible"
        }

        phaseMessage.innerHTML = "YOU CHOSE DOOR #" + doorNumber + ". <span class='yell'>DO YOU WANT TO SWITCH DOORS?</span>"
        gameState.phase = 2;
    }
}

const showOpenDoors = () => {
    for(let i=0; i<doors.length; i++){
        let thisDoor = doors[i]
        if(thisDoor.open) {
            closedDoorImages[i].style.display = "none"
            if(thisDoor.winner) {
                openWinnerImages[i].style.display = ""
            } else {
                openLoserImages[i].style.display = ""
            }
        } else {
            closedDoorImages[i].style.display = ""
        }
    }
}

const hideSwitchButtons = () => {
    for(var i=0; i<switchButtons.length; i++) {
        switchButtons[i].style.visibility = "hidden"
    }
}

document.onload = start()

/**
 * TO DO:
 * 
 * Put NUMBERS over the doors.
 * Make the NUMBER light up too when a door is selected
 */