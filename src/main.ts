import "./style.css";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

// DayJS extension needed for generating relative time labels.
dayjs.extend(relativeTime);

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const MESSAGE_BONK = "BONK!";
const MESSAGE_NO_BONK = "Sorry, out of BONKs.";

declare global {
  // Reset easter egg, if more bonks are needed.
  function is(): void;
}

window.is = () => {
  localStorage.removeItem("lastBonk");
  location.reload();
};

function consumeBonk() {
  let lastBonkStr = localStorage.getItem("lastBonk");
  let nextBonk;
  let now = Date.now();

  if (lastBonkStr) {
    let lastBonk = Number.parseInt(lastBonkStr, 10);

    nextBonk = lastBonk + DAY_IN_MS;

    if (now < nextBonk) {
      return { doBonk: false, nextBonk };
    }
  } else {
    nextBonk = now + DAY_IN_MS;
  }
  localStorage.setItem("lastBonk", now.toString());

  return { doBonk: true, nextBonk };
}

let { doBonk, nextBonk } = consumeBonk();
document.getElementById("bonkStatus")!.toggleAttribute("bonk", doBonk);

let bonkStatusMessageEl = document.getElementById("bonkStatusMessage")!;

let message;
if (doBonk) {
  message = MESSAGE_BONK;
} else {
  message = MESSAGE_NO_BONK;
}
bonkStatusMessageEl.textContent = message;
document.title = message;

// Generate the bonk timer message. We only show the timer if the bonk was denied.
if (!doBonk) {
  let timerMessageEl = document.getElementById("timerMessage")!;
  let timeLabel = dayjs().to(nextBonk);

  timerMessageEl.innerText = `Come back for your next BONK ${timeLabel}.`;
}

document.getElementById("linkTryAgain")!.addEventListener("click", (e) => {
  e.preventDefault();
  location.reload();
});

console.info(
  "Thanks for the inspiration, R.\nMaybe there is() a way to bypass this limit..."
);
console.info("Are you a robot? Try https://api.bonk.day");
