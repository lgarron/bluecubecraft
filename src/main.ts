import { startServer } from "./server";
import { Move } from "cubing/alg";
import chalk from 'chalk';


// Move Configuration: pressdown (true = hold key toggle, false = single press), color: Colour shown in console, Applescript KeyCode
const keyConfig = {
  "L": { pressDown: false, color: chalk.hex('#FF8800'), keyCode: 0 }, // A
  "L'": { pressDown: false, color: chalk.hex('#FFD580'), keyCode: 14 }, // E
  "F": { pressDown: false, color: chalk.green, keyCode: 1 }, // S
  "R": { pressDown: false, color: chalk.red, keyCode: 2 }, // D
  "B": { pressDown: false, color: chalk.blue, keyCode: 13 }, // W
  "D": { pressDown: false, color: chalk.yellow, keyCode: 49 }, // space
  "U": { pressDown: true, color: chalk.white, keyCode: 31 }, // O (map to destroy block in Minecraft)
  "U'": { pressDown: false, color: chalk.magenta, keyCode: 35 }, // P (map to use block in Minecraft)
};

let colorOutput = true; // on-off toggle for console color output

// Current state of each key: true for key down, false for key up
const keyState: Record<string, boolean> = {};

for (let key in keyConfig) {
  keyState[key] = false;
}

async function macOSPressKey(keyCode: number, isKeyDown: boolean) {
  await Bun.spawn([
    "osascript",
    "-e",
    `tell application "System Events"
  # Avoid pressing a key unless Minecraft is in the foreground.
  if (name of application processes whose frontmost is true) as string is not "java" then
    log "Skipping this keystroke…"
    return
  end if

  ${isKeyDown ? 'key down' : 'key up'} ${keyCode}  
end tell`,
  ]).exited;
}

async function onMove(move: Move) {
  await new Promise((resolve) => setTimeout(resolve, 5));
  let moveKey = move.family;
  if (move.amount === 2 || move.amount === -2) {
    moveKey += "2";
  } else if (move.amount === -1) {
    moveKey += "'";
  }

  // Check if the move is defined
  if (!keyConfig[moveKey]) {
    console.log(`Move '${moveKey}' is not defined. Attempting to perform the opposite move.`);

    // Try to perform the opposite move
    if (moveKey.includes("'")) {
      moveKey = moveKey.replace("'", "");
    } else {
      moveKey += "'";
    }

    // Check if the opposite move is defined
    if (!keyConfig[moveKey]) {
      console.log(`Opposite move '${moveKey}' is also not defined. Skipping this move.`);
      return;
    }
  }

  const keyCode = keyConfig[moveKey].keyCode;
  
  if (keyConfig[move.family].pressDown) {
    // Toggle the state of the corresponding key and send a key down or key up event accordingly
    keyState[move.family] = !keyState[move.family];
    macOSPressKey(keyCode, keyState[move.family]);
    if (colorOutput) {
      console.log(keyConfig[move.family].color(`Toggled key ${keyCode} ${keyState[move.family] ? chalk.bold.underline('down') : chalk.bold.underline('up')}`));
    } else {
      console.log(`Toggled key '${keyCode}' ${keyState[move.family] ? 'down' : 'up'}`);
    }
  } else {
    // Single press and release
    await macOSPressKey(keyCode, true);
    if (colorOutput) {
      console.log(keyConfig[move.family].color(`Pressed key ${keyCode} ` + chalk.bold.underline('down')));
    } else {
      console.log(`Pressed key '${keyCode}' down`);
    }
    await macOSPressKey(keyCode, false);
    if (colorOutput) {
      console.log(keyConfig[move.family].color(chalk.bold.underline(`Released`) + ` key ${keyCode}`));
    } else {
      console.log(`Released key '${keyCode}'`);
    }
  }
}

startServer(onMove);
console.log("Visit: https://experiments.cubing.net/cubing.js/play/?go=keyboard&sendingSocketOrigin=ws%3A%2F%2Flocalhost%3A4001")
