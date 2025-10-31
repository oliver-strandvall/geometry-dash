import Input, { Keys, MouseButtons } from './input.js';
import Button from './button.js';
const canvas = document.getElementById("canvas");
const input = new Input(canvas);
const restartButton = new Button(input, {x: canvas.width / 2 - 100, y: canvas.height / 1.35, text: "Restart", fillColor: "rgba(75, 145, 250, 1)", hoverFillColor: "rgba(45, 145, 250, 1)"});
const StartButton = new Button(input, {x: canvas.width / 2 - 100, y: canvas.height / 1.35, text: "Start", fillColor: "rgba(75, 145, 250, 1)", hoverFillColor: "rgba(45, 145, 250, 1)"});
const MenuButton = new Button(input, {x: canvas.width / 2 - 100, y: canvas.height / 1.35, text: "Menu", fillColor: "rgba(75, 145, 250, 1)", hoverFillColor: "rgba(45, 145, 250, 1)"});
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext("2d")

let scrollSpeed = 5;
let allowJump = "no"
let selectedLevel = 0
let collisiondebug = 0
let defaultcolor = "rgba(65, 90, 140, 1)"

let player = {
    x: 0,
    y: canvas.height / 2,
    width: 50,
    height: 50
}

let velocity = {
    y: 0
}

let menuLeft = {
    x: 50,
    y: 250,
    width: 50,
    height: 50,
}

let menuRight = {
    x: canvas.width - 50,
    y: 250,
    width: 50,
    height: 50,
}

// const spikeHitbox = {
//     x: spike.x - spike.width,
//     y: spike.y - spike.height,
//     width: spike.width * 2,
//     height: spike.height
// };

const levelData = [
    {level: 1, distance: 4000, best: 0, cleared: "no", attempts: 0, levelname: "Easy", levelcolor: "rgba(35, 65, 115, 1)"},
    {level: 2, distance: 6000, best: 0, cleared: "no", attempts: 0, levelname: "Medium", levelcolor: "rgba(75, 35, 115, 1)"},
    {level: 3, distance: 8000, best: 0, cleared: "no", attempts: 0, levelname: "Master", levelcolor: "rgba(35, 35, 115, 1)"}
]

const level = [
    [
    {y: 500, width: levelData[0].distance + canvas.width, height: 100, x: canvas.width / 2 - canvas.width / 2, type: "block"},
    {x: 525, y: 475, width: 25, height: 25, type: "spike"},
    {x: 1000, y: 450, width: 250, height: 50, type: "block"},
    {x: 1275, y: 475, width: 25, height: 25, type: "spike"},
    {x: 1325, y: 475, width: 25, height: 25, type: "spike"},
    {x: 1375, y: 475, width: 25, height: 25, type: "spike"},
    {x: 1400, y: 450, width: 250, height: 50, type: "block"},
    {x: 1750, y: 375, width: 100, height: 25, type: "block"},
    {x: 1950, y: 300, width: 100, height: 25, type: "block"},
    {x: 2150, y: 400, width: 50, height: 100, type: "block"},
    {x: 2225, y: 475, width: 25, height: 25, type: "spike"},
    {x: 2275, y: 475, width: 25, height: 25, type: "spike"},
    {x: 2325, y: 475, width: 25, height: 25, type: "spike"},
    {x: 2650, y: 450, width: 50, height: 50, type: "block"},
    {x: 2850, y: 400, width: 50, height: 100, type: "block"},
    {x: 3000, y: 450, width: 50, height: 50, type: "block"},
    {x: 3200, y: 400, width: 50, height: 100, type: "block"},
    {x: 3350, y: 450, width: 50, height: 50, type: "block"},
    {x: 3425, y: 475, width: 25, height: 25, type: "spike"},
    {x: 3475, y: 475, width: 25, height: 25, type: "spike"},
    {x: 3525, y: 475, width: 25, height: 25, type: "spike"},
    {x: 3775, y: 475, width: 25, height: 25, type: "spike"},
    {x: 3825, y: 475, width: 25, height: 25, type: "spike"},
    ],
    [
    {y: 500, width: levelData[1].distance + canvas.width, height: 100, x: canvas.width / 2 - canvas.width / 2, type: "block"},
    {x: 500, y: 450, width: 50, height: 50, type: "block"},
    {x: 700, y: 400, width: 50, height: 100, type: "block"},
    {x: 900, y: 350, width: 50, height: 150, type: "block"},
    {x: 1050, y: 400, width: 50, height: 100, type: "block"},
    {x: 1250, y: 350, width: 50, height: 150, type: "block"},
    {x: 1450, y: 300, width: 50, height: 25, type: "block"},
    {x: 1650, y: 250, width: 50, height: 25, type: "block"},
    {x: 1950, y: 300, width: 350, height: 25, type: "block"},
    {x: 2075, y: 275, width: 25, height: 25, type: "spike"},
    {x: 2275, y: 275, width: 25, height: 25, type: "spike"},
    {x: 2400, y: 350, width: 50, height: 150, type: "block"},
    {x: 2600, y: 400, width: 50, height: 100, type: "block"},
    {x: 2800, y: 450, width: 50, height: 50, type: "block"},
    {x: 3025, y: 475, width: 25, height: 25, type: "spike"},
    {x: 3225, y: 475, width: 25, height: 25, type: "spike"},
    {x: 3275, y: 475, width: 25, height: 25, type: "spike"},
    {x: 3475, y: 475, width: 25, height: 25, type: "spike"},
    {x: 3800, y: 450, width: 50, height: 50, type: "block"},
    {x: 4000, y: 495, width: 50, height: 5, type: "jumpad"},
    {x: 4200, y: 350, width: 50, height: 150, type: "block"},
    {x: 4275, y: 475, width: 25, height: 25, type: "spike"},
    {x: 4325, y: 475, width: 25, height: 25, type: "spike"},
    {x: 4450, y: 495, width: 50, height: 5, type: "jumpad"},
    {x: 4650, y: 495, width: 50, height: 5, type: "jumpad"},
    {x: 4750, y: 475, width: 25, height: 25, type: "spike"},
    {x: 4800, y: 475, width: 25, height: 25, type: "spike"},
    {x: 4850, y: 475, width: 25, height: 25, type: "spike"},
    {x: 4850, y: 300, width: 50, height: 50, type: "jumpblock", radius: 25},
    {x: 4900, y: 475, width: 25, height: 25, type: "spike"},
    {x: 4950, y: 475, width: 25, height: 25, type: "spike"},
    {x: 5000, y: 475, width: 25, height: 25, type: "spike"},
    {x: 5200, y: 495, width: 50, height: 5, type: "jumpad"},
    {x: 5400, y: 350, width: 50, height: 50, type: "block"},
    {x: 5650, y: 300, width: 50, height: 50, type: "jumpblock", radius: 25},
    {x: 5850, y: 350, width: 500 + canvas.width, height: 150, type: "block"},
    ],
    [
    {y: 500, width: levelData[2].distance + canvas.width, height: 100, x: canvas.width / 2 - canvas.width / 2, type: "block"},
    {x: 500, y: 495, width: 50, height: 5, type: "jumpad"},
    {x: 700, y: 300, width: 50, height: 50, type: "jumpblock", radius: 25},
    ]
]

const gravity = 0.5;

let currentScene = "gamestart"

// let lastTime = performance.now();


gameLoop(performance.now());

function gameLoop(timestamp) {
    input.update();

    ctx.fillStyle = levelData[selectedLevel].levelcolor;
    ctx.fillRect(0, 0, 800, 600);

    // const deltaTime = (currentTime - lastTime) / 1000;
    // lastTime = currentTime;

    if(currentScene === "gameplay") {
        updateGame(timestamp)
        renderGame()
    } else if(currentScene === "gameover") {
        updategameOver()
    } else if(currentScene === "gamestart") {
        updateGameStart()
    } else if(currentScene === "levelcleared") {
        updatelevelCleared()
    }


    requestAnimationFrame(gameLoop);

}

function updateGame(deltaTime) {

    // if (countdown < 0) countdown = 0;

    // countdown -= deltaTime;

    player.x += scrollSpeed

    // Check Collisions
    for(let i = 0; i < level[selectedLevel].length; i++) {
        if(isOverlapping(player, level[selectedLevel][i])) {
            if(level[selectedLevel][i].type === "block") {
                if(player.x > levelData[selectedLevel].best) {
                    levelData[selectedLevel].best = player.x
                }
            restartGame()
            }
        }
    }

    if (input.getKeyDown(Keys.W) || input.getKeyDown(Keys.Space) || input.getMouseButtonDown(MouseButtons.Left)) {
        if(allowJump === "yes") {
            velocity.y = -10;
            allowJump = "no"
        }   
    }

    velocity.y += gravity
    player.y += velocity.y

    // Check collision
    for(let i = 0; i < level[selectedLevel].length; i++) {
        if(isOverlapping(player, level[selectedLevel][i])) {
            if(level[selectedLevel][i].type === "spike") {
                   if(player.x > levelData[selectedLevel].best) {
                        levelData[selectedLevel].best = player.x
                   }
            restartGame()
            } else if(level[selectedLevel][i].type === "block") {
                velocity.y = 0
                allowJump = "yes"
                fixOverlapY(player, level[selectedLevel][i])
            } else if(level[selectedLevel][i].type === "jumpad") {
                velocity.y = -15;
                allowJump = "no"
            } else if(level[selectedLevel][i].type === "jumpblock") {
                if (input.getKeyDown(Keys.W) || input.getKeyDown(Keys.Space) || input.getMouseButtonDown(MouseButtons.Left)) {
                    velocity.y = -10; 
                }
            }
        }
    }
    // If Collision detected, Fix player.y

    if(player.x > levelData[selectedLevel].distance) {
        currentScene = "levelcleared"
            levelData[selectedLevel].cleared = "yes"
    }

    if(input.getKeyDown(Keys.E)) {
        if(player.x > levelData[selectedLevel].best) {
            levelData[selectedLevel].best = player.x
        }
        currentScene = "gamestart"
    }

    if(input.getKeyDown(Keys.D)) {
        if(collisiondebug === 0) {
            collisiondebug = 1 
        } else {
            collisiondebug = 0
        }
    }
}

function renderGame() {

    ctx.fillStyle = levelData[selectedLevel].levelcolor;
    ctx.fillRect(0, 0, 800, 600);

    const cameraX = player.x - 80

    // Paint player
    ctx.fillStyle = "rgba(75, 145, 250, 1)"
    ctx.fillRect(player.x - cameraX, player.y, player.width, player.height)
    ctx.strokeRect(player.x - cameraX, player.y, player.width, player.height)


    for(let i = 0; i < level[selectedLevel].length; i++) {
        if(level[selectedLevel][i].type === "block") {
            ctx.fillStyle = "rgba(0, 0, 0, 1)"
            ctx.fillRect(level[selectedLevel][i].x - cameraX, level[selectedLevel][i].y, level[selectedLevel][i].width, level[selectedLevel][i].height)
        }

        if(level[selectedLevel][i].type === "spike") {
            ctx.fillStyle = "rgba(0, 0, 0, 1)"
            ctx.beginPath()
            ctx.moveTo(level[selectedLevel][i].x - cameraX, level[selectedLevel][i].y - level[selectedLevel][i].height)
            ctx.lineTo(level[selectedLevel][i].x - level[selectedLevel][i].width - cameraX, level[selectedLevel][i].y + level[selectedLevel][i].height)
            ctx.lineTo(level[selectedLevel][i].x + level[selectedLevel][i].width - cameraX, level[selectedLevel][i].y + level[selectedLevel][i].height)
            ctx.closePath()
            ctx.fill()
            if(collisiondebug === 1) {
                ctx.fillStyle = "rgba(255, 0, 0, 1)"
                ctx.fillRect(
                    level[selectedLevel][i].x - cameraX - level[selectedLevel][i].width,
                    level[selectedLevel][i].y - level[selectedLevel][i].height,
                    level[selectedLevel][i].width * 2,
                    level[selectedLevel][i].height
                );
                ctx.fillStyle = "rgba(0, 0, 0, 1)"
            }
        }

        if(level[selectedLevel][i].type === "jumpad") {
            ctx.fillStyle = "rgba(255, 235, 0, 1)"
            ctx.fillRect(level[selectedLevel][i].x - cameraX, level[selectedLevel][i].y, level[selectedLevel][i].width, level[selectedLevel][i].height)
        }

        if(level[selectedLevel][i].type === "jumpblock") {
            ctx.fillStyle = "rgba(255, 234, 0, 0.35)"
            ctx.beginPath();
            ctx.arc(level[selectedLevel][i].x - cameraX, level[selectedLevel][i].y, level[selectedLevel][i].radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    }

    ctx.font = "50px Arial";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.textAlign = "center";
    ctx.fillText(player.x + " / " + levelData[selectedLevel].distance, canvas.width / 2, canvas.height / 4);
    ctx.textAlign = "left"
    ctx.font = "40px Arial";
    ctx.fillText("Exit (E)", 15, 40)
}

function updategameOver() {

    ctx.fillStyle = "rgba(0, 0, 0, 1)"
    ctx.fillRect(level[selectedLevel][0].x, level[selectedLevel][0].y, level[selectedLevel][0].width, level[selectedLevel][0].height)

    restartButton.draw(ctx);
    ctx.font = "50px Arial";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.textAlign = "center";
    ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2.5,);
    ctx.textAlign = "left"

    if(restartButton.clicked()) {
        restartGame()
    }
}

function updateGameStart() {

    ctx.fillStyle = "rgba(0, 0, 0, 1)"
    ctx.fillRect(level[selectedLevel][0].x, level[selectedLevel][0].y, level[selectedLevel][0].width, level[selectedLevel][0].height)

    if(input.getKeyDown(Keys.D)) {
        if(collisiondebug === 0) {
            collisiondebug = 1 
        } else {
            collisiondebug = 0
        }
    }
    
    StartButton.draw(ctx);

    ctx.font = "50px Arial";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.textAlign = "center";
    ctx.fillText("Choose Level", canvas.width / 2, canvas.height / 5);
    ctx.font = "40px Arial";
    ctx.fillText("Worse Geometry Dash", canvas.width / 2, canvas.height / 15);
    ctx.font = "25px Arial";
    ctx.textAlign = "left";

    // Left Menu Arrow
    if(selectedLevel > 0) {
    ctx.beginPath()
    ctx.moveTo(menuLeft.x, menuLeft.y);
    ctx.lineTo(menuLeft.x + menuLeft.width, menuLeft.y - menuLeft.height);
    ctx.lineTo(menuLeft.x + menuLeft.width, menuLeft.y + menuLeft.height);
    ctx.closePath()
    ctx.fill()

    if(collisiondebug === 1) {
        ctx.fillStyle = "rgba(255, 0, 0, 1)"
        ctx.fillRect(
            menuLeft.x - menuLeft.width / 2,
            menuLeft.y - menuLeft.height / 2,
            menuLeft.width,
            menuLeft.height
        );
        ctx.fillStyle = "rgba(0, 0, 0, 1)"
    }

    if(input.mousePosition.x > menuLeft.x - menuLeft.width / 2 &&
        input.mousePosition.x < menuLeft.x + menuLeft.width / 2 &&
        input.mousePosition.y > menuLeft.y - menuLeft.height / 2 &&
        input.mousePosition.y < menuLeft.y + menuLeft.height / 2 &&
        input.getMouseButtonDown(MouseButtons.Left)
    ) {
        selectedLevel--
    }
    }

    // Right Menu Arrow
    if(selectedLevel < levelData.length - 1) {
    ctx.beginPath()
    ctx.moveTo(menuRight.x, menuRight.y);
    ctx.lineTo(menuRight.x - menuRight.width, menuRight.y + menuRight.height);
    ctx.lineTo(menuRight.x - menuRight.width, menuRight.y - menuRight.height);
    ctx.closePath()
    ctx.fill()

    if(collisiondebug === 1) {
        ctx.fillStyle = "rgba(255, 0, 0, 1)"
        ctx.fillRect(
            menuRight.x - menuRight.width / 2,
            menuRight.y - menuRight.height / 2,
            menuRight.width,
            menuRight.height
        );
        ctx.fillStyle = "rgba(0, 0, 0, 1)"
    }

    if(
        input.mousePosition.x > menuRight.x - menuRight.width / 2 &&
        input.mousePosition.x < menuRight.x + menuRight.width / 2 &&
        input.mousePosition.y > menuRight.y - menuRight.height / 2 &&
        input.mousePosition.y < menuRight.y + menuRight.height &&
        input.getMouseButtonDown(MouseButtons.Left)
    ) {
        selectedLevel++
    }
    }

    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(200, 150, 400, 250)
    ctx.strokeRect(200, 150, 400, 250)
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(255, 255, 255, 1)";
    ctx.font = "40px Arial";
    ctx.fillText(levelData[selectedLevel].levelname, canvas.width / 2, canvas.height / 2.25);
    ctx.font = "25px Arial";
        if(levelData[selectedLevel].cleared === "yes") {
            ctx.fillStyle = "rgba(65, 200, 0, 1)";
            ctx.fillText("Level Cleared! | Total Attempts: " + levelData[selectedLevel].attempts, canvas.width / 2, canvas.height / 1.4)
        } else {
            if(selectedLevel > 0) {
                if(levelData[selectedLevel - 1].cleared === "yes") {
                    ctx.fillStyle = "rgba(0, 0, 0, 1)";
                    ctx.fillText("Best: " + levelData[selectedLevel].best + " / " + levelData[selectedLevel].distance + " | Attempts: " + levelData[selectedLevel].attempts, canvas.width / 2, canvas.height / 1.4)
                } else {
                    ctx.fillStyle = "rgba(255, 0, 0, 1)";
                    ctx.fillText("Complete Previous Level To Unlock" ,canvas.width / 2, canvas.height / 1.4)
                }
            } else {
                ctx.fillStyle = "rgba(0, 0, 0, 1)";
                ctx.fillText("Best: " + levelData[selectedLevel].best + " / " + levelData[selectedLevel].distance + " | Attempts: " + levelData[selectedLevel].attempts, canvas.width / 2, canvas.height / 1.4)
            }
        }
        ctx.textAlign = "left";

    if(StartButton.clicked()) {
        if(selectedLevel > 0) {
            // if(levelData[selectedLevel - 1].cleared === "yes") {
                restartGame()
            // }
        } else {
            restartGame()
        }
    }
}

function updatelevelCleared() {

    ctx.fillStyle = "rgba(0, 0, 0, 1)"
    ctx.fillRect(level[selectedLevel][0].x, level[selectedLevel][0].y, level[selectedLevel][0].width, level[selectedLevel][0].height)

    MenuButton.draw(ctx);

    ctx.font = "50px Arial";
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.textAlign = "center";
    ctx.fillText("Level Cleared!", canvas.width / 2, canvas.height / 2.5,);
    ctx.textAlign = "left"

    if(MenuButton.clicked()) {
        toMenu()
    }
}

// function clamp(value, min, max) {
//     if(value > min && value < max) {
//         return value

//     } else if(value > max) {
//         return max

//     } else if(value < min) {
//         return min
//     }
// }

// Collision check
// function checkCollision(pipe) {
//   // Player hit top/bottom of pipe
//   if (
//     player.x + player.radius > pipe.x &&
//     player.x - player.radius < pipe.x + pipeWidth
//   ) {
//     if (player.y - player.radius < pipe.topHeight ||
//         player.y + player.radius > pipe.bottomY) {
//             return true;
//         }
//     }
// }

function restartGame() {
    player.x = 80,
    player.y = 450
    velocity.y = 0
    currentScene = "gameplay"
    levelData[selectedLevel].attempts += 1
}

function toMenu() {
    currentScene = "gamestart"
}

// function circleRectOverlaps(coins, player) {
//     closestX = clamp(coins.x, player.x, player.x + player.width)
//     closestY = clamp(coins.y, player.y, player.y + player.height)

//     dx = coins.x - closestX
//     dy = coins.y - closestY

//     if((dx * dx + dy * dy) < (coins.radius * coins.radius)) {
//         return true
//     } else {
//         return false
//     }
// }

// function randomPos() {
//     coin.x = Math.floor(Math.random() * (750 - 50 + 1)) + 50
//     coin.y = Math.floor(Math.random() * (550 - 50 + 1)) + 50 
// }

function isOverlapping(rect1, rect2) {
    if ((rect1.x < rect2.x + rect2.width) &&
        (rect1.x + rect1.width > rect2.x) &&
        (rect1.y < rect2.y + rect2.height) &&
        (rect1.y + rect1.height > rect2.y)) {
        return true
   } else {
        return false
   }
}

// input.mousePosition.x > menuRight.x - menuRight.width / 2 &&
// input.mousePosition.x < menuRight.x + menuRight.width / 2 &&
// input.mousePosition.y > menuRight.y - menuRight.height / 2 &&
// input.mousePosition.y < menuRight.y + menuRight.height &&

function fixOverlapY(rect1, rect2) {
    let rect1middle = rect1.y + rect1.height / 2
    let rect2middle = rect2.y + rect2.height / 2
    if(rect1middle < rect2middle) {
        rect1.y += rect2.y - (rect1.y + rect1.height)
    } else {
        rect1.y = rect2.y + rect2.height
    }
}