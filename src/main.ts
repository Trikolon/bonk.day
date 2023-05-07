import "./style.css";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import fingerprintjs from "@fingerprintjs/fingerprintjs";

(async () => {
  console.debug("loading fingerprinter library");
  let fp = await fingerprintjs.load();
  let fpResult = await fp.get();
  console.debug("fp result", fpResult);

  // TODO: send this computed fingerprint to the backend. Could combine it with
  // ip address?

  // From now on ask the backend for lastBonk timestamps, no longer use local
  // browser storage. Can use cloudflare workers with their KV store. But make
  // sure to expire data, we don't need the identifier past the bonk threshold!
})();

// DayJS extension needed for generating relative time labels.
dayjs.extend(relativeTime);

const DAY_IN_MS = 24 * 60 * 60 * 1000;

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
if (doBonk) {
  bonkStatusMessageEl.textContent = "BONK!";
} else {
  bonkStatusMessageEl.textContent = "Sorry, out of BONKs.";
}

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
