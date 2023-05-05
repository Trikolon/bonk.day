const DAY_IN_MS = 24 * 60 * 60 * 1000;

// Reset easter egg, if more bonks are needed.
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
  localStorage.setItem("lastBonk", now);

  return { doBonk: true, nextBonk };
}

let { doBonk, nextBonk } = consumeBonk();
document.getElementById("bonkStatus").toggleAttribute("bonk", doBonk);

let bonkStatusMessageEl = document.getElementById("bonkStatusMessage");
if (doBonk) {
  bonkStatusMessageEl.textContent = "BONK!";
} else {
  bonkStatusMessageEl.textContent = "Sorry, out of BONKs.";
}

// Generate the bonk timer message. We only show the timer if the bonk was denied.
if (!doBonk) {
  let timerMessageEl = document.getElementById("timerMessage");
  timerMessageEl.innerText = `Come back for your next BONK tomorrow at ${new Date(
    nextBonk
  ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
}

document.getElementById("linkTryAgain").addEventListener("click", (e) => {
  e.preventDefault();
  location.reload();
});

console.info(
  "Thanks for the inspiration, R.\nMaybe there is() a way to bypass this limit..."
);
