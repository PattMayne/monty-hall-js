/**
 * Monty Hall Problem.
 * https://github.com/PattMayne/monty-hall-js
 * All code written by Matt Payne.
 */

$(document).foundation()

let doors, gameState

let closedDoorImages = []
let openLoserImages = []
let openWinnerImages = []

let switchButtons, switchButtonYes, switchButtonNo, playAgainButton
let doorSigns, doorSign_1, doorSign_2, doorSign_3

let phaseMessage

var switchWins = 0
var switchLosses = 0
var keepWins = 0
var keepLosses = 0


function start() {
    // Get DOM elements
    doorSigns = document.getElementsByClassName("door_sign")
    doorSign_1 = document.getElementById("door_sign_1")
    doorSign_2 = document.getElementById("door_sign_2")
    doorSign_3 = document.getElementById("door_sign_3")

    closedDoorImages[0] = document.getElementById("1_closed")
    closedDoorImages[1] = document.getElementById("2_closed")
    closedDoorImages[2] = document.getElementById("3_closed")

    openLoserImages[0] = document.getElementById("1_loser")
    openLoserImages[1] = document.getElementById("2_loser")
    openLoserImages[2] = document.getElementById("3_loser")

    openWinnerImages[0] = document.getElementById("1_winner")
    openWinnerImages[1] = document.getElementById("2_winner")
    openWinnerImages[2] = document.getElementById("3_winner")

    playAgainButton = document.getElementById("play_again_button")
    switchButtonYes = document.getElementById("switch_yes_button")
    switchButtonNo = document.getElementById("switch_no_button")
    switchButtons = document.getElementsByClassName("switch_button")
    phaseMessage = document.getElementById("phaseMessage")

    // set onclick functions
    closedDoorImages[0].onclick = function() { clickDoor(0)}
    closedDoorImages[1].onclick = function() { clickDoor(1)}
    closedDoorImages[2].onclick = function() { clickDoor(2)}

    doorSign_1.onclick = function() { clickDoor(0)}
    doorSign_2.onclick = function() { clickDoor(1)}
    doorSign_3.onclick = function() { clickDoor(2)}

    switchButtonYes.onclick = function() { switchDoors() }
    switchButtonNo.onclick = function() { keepDoors() }
    playAgainButton.onclick = function() { setupGame() }

    setupGame()
}

/**
 * Phase 1 functions (Player must choose a door)
 */


/**
 * Phase 1 action. User clicks a door to select that door.
 * Then we open one non-chosen, losing door.
 * @param {int} doorNumber 
 */
function clickDoor(doorNumber) {
    if(doorNumber < 3 && doorNumber >= 0 && gameState.phase == 1){
        // select the door
        chooseDoor(doorNumber)

        // remove hover pointer capability
        closedDoorImages.map(imgElement => imgElement.classList.remove("hover_door"))

        for(let i=0; i<doorSigns.length; i++){
            doorSigns[i].classList.remove("hover_door");
            doorSigns[i].classList.add("normal_pointer");
        }

        let allDoorNumbers = [0, 1, 2]
        let nonChosenDoorsNumbers = []

        // put all NON-chosen door indexes into a list (so we can choose a door to open)
        allDoorNumbers.map(number => number != doorNumber && nonChosenDoorsNumbers.push(number))

        // Now pick a random NON-chosen door (index) to open
        let randomNonChosenDoorNumberIndex = Math.floor(Math.random() * nonChosenDoorsNumbers.length)
        let doorToOpenIndex = -1

        // If that door is actually a winner, get the OTHER door index instead
        if(!doors[nonChosenDoorsNumbers[randomNonChosenDoorNumberIndex]].winner){
            doorToOpenIndex = nonChosenDoorsNumbers[randomNonChosenDoorNumberIndex]
        } else {
            for(let i=0; i<nonChosenDoorsNumbers.length; i++) {
                let thisDoor = doors[nonChosenDoorsNumbers[i]]
                if(!thisDoor.winner && !thisDoor.chosen){
                    doorToOpenIndex = nonChosenDoorsNumbers[i]
                }
            }
        }

        // Open whichever losing door you chose (set door to open, and show the appropriate door image)
        doors[doorToOpenIndex].open = true
        showOpenDoors()

        // show the buttons and text for phase 2
        let doorNumberToDisplay = doorNumber + 1
        showSwitchButtons()
        setSwitchDoor()
        phaseMessage.innerHTML = "<span class='green'>YOU CHOSE DOOR #" + doorNumberToDisplay + ".</span> <span class='orange'>DO YOU WANT TO SWITCH WITH DOOR #" + String(gameState.switchDoor + 1 )+ "?</span>"
        gameState.phase = 2;
    }
}

// Find out the index of the door that the user can switch to
const setSwitchDoor = () => {
    if(gameState.phase == 1){
        for (let i=0; i<doors.length; i++) {
            let door = doors[i]
    
            if(!door.open && !door.chosen){
                gameState.switchDoor = i
            }
        }
    }    
}

/**
 * Phase 2 functions (Player chooses whether to switch doors or keep selection)
 */


// Player is switching their selection.
function switchDoors() {
    if(gameState.phase == 2){
        // reset all signs and unchoose all doors
        for (let i=0; i<doors.length; i++) {
            doorSigns[i].style.backgroundColor = "#000004"
            unchooseDoor(i)
        }

        // choose the NEW door
        chooseDoor(gameState.switchDoor)
        // progress the game
        gameState.switched = true
        gameState.phase = 3
        gameState.switchDoor = -1
        endGame()
    }
}

// Player is keeping their selection. Proceed to endgame.
function keepDoors() {
    if(gameState.phase == 2){
        gameState.phase = 3
        endGame()
    }
}


/**
 * Phase 3 functions (game over, show results)
 */


/**
 * Compare user selection to winning door, display the results, tally the score.
 */
function endGame() {
    if(gameState.phase == 3){
        hideSwitchButtons()
        doors.map(door => {
            door.open = true
        })
    }
    let chosenDoorNumber = -1
    let winningDoorNumber = -1

    // get the chosen and winning door numbers, for DISPLAY
    for(let i=0; i<doors.length; i++) {
        let door = doors[i]
        if(door.chosen){ chosenDoorNumber = i + 1 }
        if(door.winner) { winningDoorNumber = i +1 }
    }

    let playerWon = winningDoorNumber == chosenDoorNumber

    // Tally score
    if(playerWon){
        doorSigns[chosenDoorNumber - 1].style.backgroundColor = "#05a000"
        doorSigns[chosenDoorNumber - 1].style.border = "4px solid #05a000"
        if(gameState.switched){
            switchWins++
        } else {
            keepWins++
        }
    } else {
        doorSigns[chosenDoorNumber - 1].style.backgroundColor = "#c40000"
        doorSigns[chosenDoorNumber - 1].style.border = "4px solid #c40000"
        if(gameState.switched){
            switchLosses++
        } else {
            keepLosses++
        }
    }

    let endGameString = "<span class='orange'>"
    endGameString += gameState.switched ? "YOU SWITCHED TO DOOR #" : "YOU KEPT DOOR #"
    endGameString += chosenDoorNumber.toString() + ".</span> "
    endGameString += playerWon ? "<span class='green'>YOU WON!!" : "<span class='red'>YOU LOST!!"
    endGameString += "</span>"
    phaseMessage.innerHTML = endGameString
    showOpenDoors()
    showScores()
    hideSwitchButtons()
    playAgainButton.style.display = ""
}


/**
 * All phases functions
 */

// I choose you, door
const chooseDoor = doorNumber => {
    doors[doorNumber].chosen = true
    doorSigns[doorNumber].style.backgroundColor = "#ffa700";
    doorSigns[doorNumber].style.border = "4px solid #ffa700";
    doorSigns[doorNumber].style.color = "#000004";
}

// make "chosen" false, and reset the door sign
const unchooseDoor = doorNumber => {
    doors[doorNumber].chosen = false
    doorSigns[doorNumber].style.backgroundColor = "transparent";
    doorSigns[doorNumber].style.border = "4px solid #05a000";
    doorSigns[doorNumber].style.color = "#fff";
}

// Load the stats into the box
const showScores = () => {
    document.getElementById("switch_wins").innerText = switchWins
    document.getElementById("switch_losses").innerText = switchLosses
    document.getElementById("keep_wins").innerText = keepWins
    document.getElementById("keep_losses").innerText = keepLosses
}

// If any doors have been opened, display the correct image
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

// Make the switch buttons visible
const showSwitchButtons = () => {
    for(var i=0; i<switchButtons.length; i++) {
        switchButtons[i].style.display = ""
    }
}

// Make the switch buttons invisible
const hideSwitchButtons = () => {
    for(var i=0; i<switchButtons.length; i++) {
        switchButtons[i].style.display = "none"
    }
}

// When you start a new game (does not clear stats)
function setupGame() {
    // Reset the UI
    hideSwitchButtons()
    closedDoorImages.map(imgElement => imgElement.classList.add("hover_door"))
    openLoserImages.map(imageElement => {imageElement.style.display = "none"})
    openWinnerImages.map(imageElement => {imageElement.style.display = "none"})
    closedDoorImages.map(imageElement => {imageElement.style.display = ""})
    phaseMessage.innerHTML = "<span class='orange'>PICK A DOOR</span>"
    playAgainButton.style.display = "none"

    for(let i=0; i<doorSigns.length; i++){
        doorSigns[i].classList.add("hover_door")
        doorSigns[i].classList.remove("normal_pointer")
        if(!!doors){ unchooseDoor(i) }
    }

    // Reset the game data
    gameState = {
        phase: 0,
        winningDoor: -1,
        switched: false,
        switchDoor: -1
    }

    doors = [{
        winner: false,
        open: false,
        chosen: false
    },
    {
        winner: false,
        open: false,
        chosen: false
    },
    {
        winner: false,
        open: false,
        chosen: false
    }]

    gameState.winningDoor = Math.floor(Math.random() * doors.length)
    doors[gameState.winningDoor].winner = true
    gameState.phase = 1;
}

document.onload = start()
