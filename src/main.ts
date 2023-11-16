import { startServer } from "./server";
import { Move } from "cubing/alg";

// Configuration for each key: true for press-down function, false for single press and release
const keyConfig: Record<string, boolean> = {
  L: false, // A
  F: false, // S
  R: false, // D
  B: false, // W
  D: false, // space
  U: true, // O (left button)
};

// Current state of each key: true for key down, false for key up
const keyState: Record<string, boolean> = {
  L: false, // A
  F: false, // S
  R: false, // D
  B: false, // W
  D: false, // space
  U: false, // O (left button)
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
  L: 0, // A
  F: 1, // S
  R: 2, // D
  B: 13, // W
  D: 49, // space
  U: 31, // O (left button)
};

async function onMove(move: Move) {
  await new Promise((resolve) => setTimeout(resolve, 10));
  const keyCode = moveMapping[move.family];

  if (keyConfig[move.family]) {
    // Toggle the state of the corresponding key and send a key down or key up event accordingly
    keyState[move.family] = !keyState[move.family];
    macOSPressKey(keyCode, keyState[move.family]);
    console.log(`Toggled key '${move.family}' ${keyState[move.family] ? 'down' : 'up'}`);
  } else {
    // Single press and release
    await macOSPressKey(keyCode, true);
    console.log(`Pressed key '${move.family}' down`);
    await macOSPressKey(keyCode, false);
    console.log(`Released key '${move.family}'`);
  }
}

startServer(onMove);
console.log("Visit: https://experiments.cubing.net/cubing.js/play/?go=keyboard&sendingSocketOrigin=ws%3A%2F%2Flocalhost%3A4001")
