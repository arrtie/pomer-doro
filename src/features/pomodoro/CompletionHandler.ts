/** @format */

import { TimeEvent } from "./TimeManagerSubject";
import SuccessPlayer from "./successPlayer";
import Observer from "@src/patterns/Observer";
import { getCurrentTimeManager } from "./TimeManagerHelper";

const successSoundSource = "/success-jingle.ogg";
const timeManager = getCurrentTimeManager();
let playerIsInitialized = false;

let successPlayer: SuccessPlayer | undefined;

const onDone = () => {
  successPlayer?.play();
};

function initializeSuccessPlayer() {
  playerIsInitialized = true;
  successPlayer = new SuccessPlayer(successSoundSource);
}

const onIsPlaying = () => {
  if (playerIsInitialized) return;
  initializeSuccessPlayer();
};

const successObserver = new Observer<TimeEvent>((data) => {
  if (data.isDone) {
    onDone();
  }
  if (!data.isPaused) {
    onIsPlaying();
  }
});

timeManager.attach(successObserver);
