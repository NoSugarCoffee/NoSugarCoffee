const fs = require("fs");
const path = require("path");

const compositionPath = path.join(__dirname, "..", "self-intro.hyperframes.html");
const html = fs.readFileSync(compositionPath, "utf8");

const rootDuration = /data-composition-id="self-intro"[\s\S]*?data-duration="([0-9.]+)"/.exec(html);
if (!rootDuration) {
  throw new Error("Missing root composition duration.");
}

if (Number(rootDuration[1]) !== 10) {
  throw new Error(`Expected root duration to be 10 seconds but got ${rootDuration[1]}.`);
}

const scenePattern = /id="scene-(\d+)"[\s\S]*?data-start="([0-9.]+)"[\s\S]*?data-duration="([0-9.]+)"/g;
const scenes = [];
for (;;) {
  const match = scenePattern.exec(html);
  if (!match) {
    break;
  }
  scenes.push({ id: Number(match[1]), start: Number(match[2]), duration: Number(match[3]) });
}

if (scenes.length !== 3) {
  throw new Error(`Expected exactly 3 scenes but found ${scenes.length}.`);
}

const finalEndTime = Math.max(...scenes.map((scene) => scene.start + scene.duration));
if (Math.abs(finalEndTime - 10) > 0.0001) {
  throw new Error(`Scene timings do not end at 10 seconds. Final end time is ${finalEndTime}.`);
}

console.log("check:intro passed - composition duration is exactly 10 seconds.");

