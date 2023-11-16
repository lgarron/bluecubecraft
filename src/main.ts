import { startServer } from "./server";

import { Move } from "cubing/alg";

async function macOSPressKey(keyCode: number, seconds: number) {
  await Bun.spawn([
    "osascript",
    "-e",
    `tell application "System Events"
  # Avoid pressing a key unless Minecraft is in the foreground.
  if (name of application processes whose frontmost is true) as string is not "java" then
    log "Skipping this keystroke…"
    return
  end if

  key down ${keyCode}
  delay ${seconds}
  key up ${keyCode}
end tell`,
  ]).exited;
}

// key codes from https://eastmanreference.com/complete-list-of-applescript-key-codes
const moveMapping: Record<string, number> = {
  L: 0,
  F: 1,
  R: 2,
  B: 13,
};

async function onMove(move: Move) {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const keyCode = moveMapping[move.family];
  macOSPressKey(keyCode, 0.1 * (move.amount + 2));
}

startServer(onMove);
console.log("Visit: https://experiments.cubing.net/cubing.js/play/?go=keyboard&sendingSocketOrigin=ws%3A%2F%2Flocalhost%3A4001")
