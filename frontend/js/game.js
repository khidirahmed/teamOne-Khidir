// game logic
let currentRunStartedAt = null;
let hasSavedCurrentRun = false;

window.addEventListener("message", async (event) => {
  const frame = document.getElementById("godot-frame");
  const isFromGameFrame = frame && event.source === frame.contentWindow;
  const isSameOrigin = !event.origin || event.origin === "null" || event.origin === window.location.origin;

  if (!isFromGameFrame || !isSameOrigin || !event.data || typeof event.data !== "object") {
    return;
  }

  if (event.data.type === "bobcat-go:run-started") {
    currentRunStartedAt = new Date().toISOString();
    hasSavedCurrentRun = false;
    return;
  }

  if (event.data.type !== "bobcat-go:game-over") {
    return;
  }

  if (hasSavedCurrentRun || !currentRunStartedAt || typeof saveRun !== "function") {
    return;
  }

  hasSavedCurrentRun = true;
  await saveRun({
    startedAt: currentRunStartedAt,
    score: event.data.score,
  });
});

function startGame(mapId) {
  currentMapId = mapId;
  currentRunStartedAt = null;
  hasSavedCurrentRun = false;

  showScreen("game");

  const frame = document.getElementById("godot-frame");
  frame.src = "godot/bobcatgo.html?map=" + mapId;
}

function exitGame() {
  const frame = document.getElementById("godot-frame");
  frame.src = "";
  currentRunStartedAt = null;
  hasSavedCurrentRun = false;

  showScreen("mapselect");
}
