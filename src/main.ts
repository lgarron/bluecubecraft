import { startServer } from "./server";
import { Move } from "cubing/alg";
import chalk from 'chalk';

// Configuration for each key: true for press-down function, false for single press and release
const keyConfig: Record<string, boolean> = {
  "L": false, // A
  "L'": false, // E
  "F": false, // S
  "R": false, // D
  "B": false, // W
  "D": false, // space
  "U": true, // O (left button)
  "U'": false, // P (right button)
};

// WCA color for each move
const moveC: Record<string, chalk.Chalk> = {
  "L": chalk.hex('#FF8800'),
  "L'": chalk.hex('#FFD580'),
  "F": chalk.green,
  "R": chalk.red,
  "B": chalk.blue,
  "D": chalk.yellow,
  "U": chalk.white,
  "U'": chalk.magenta,
};

let colorOutput = true; // on-off toggle for console color output

// Current state of each key: true for key down, false for key up
const keyState: Record<string, boolean> = {
  "L": false, // A
  "L'": false, // E
  "F": false, // S
  "R": false, // D
  "B": false, // W
  "D": false, // space
  "U": false, // O (left button)
  "U'": false, // P (right button)
};

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

// key codes from https://eastmanreference.com/complete-list-of-applescript-key-codes
const moveMapping: Record<string, number> = {
  "L": 0, // A
  "L'": 14, // E (inventory)
  "F": 1, // S
  "R": 2, // D
  "B": 13, // W
  "D": 49, // space
  "U": 31, // O (left button, map to destroy block in Minecraft keybinds)
  "U'": 35, // P (right button, map to use block in Minecraft keybinds)
};

async function onMove(move: Move) {
  await new Promise((resolve) => setTimeout(resolve, 10));
  let moveKey = move.family;
  if (move.amount === 2 || move.amount === -2) {
    moveKey += "2";
  } else if (move.amount === -1) {
    moveKey += "'";
  }
  const keyCode = moveMapping[moveKey];
  
  if (keyConfig[move.family]) {
    // Toggle the state of the corresponding key and send a key down or key up event accordingly
    keyState[move.family] = !keyState[move.family];
    macOSPressKey(keyCode, keyState[move.family]);
    if (colorOutput) {
      console.log(moveC[move.family](`Toggled key ${keyCode} ${keyState[move.family] ? chalk.bold.underline('down') : chalk.bold.underline('up')}`));
    } else {
      console.log(`Toggled key '${keyCode}' ${keyState[move.family] ? 'down' : 'up'}`);
    }
  } else {
    // Single press and release
    await macOSPressKey(keyCode, true);
    if (colorOutput) {
      console.log(moveC[move.family](`Pressed key ${keyCode} ` + chalk.bold.underline('down')));
    } else {
      console.log(`Pressed key '${keyCode}' down`);
    }
    await macOSPressKey(keyCode, false);
    if (colorOutput) {
      console.log(moveC[move.family](chalk.bold.underline(`Released`) + ` key ${keyCode}`));
    } else {
      console.log(`Released key '${keyCode}'`);
    }
  }
}


startServer(onMove);
console.log("Visit: https://experiments.cubing.net/cubing.js/play/?go=keyboard&sendingSocketOrigin=ws%3A%2F%2Flocalhost%3A4001")
