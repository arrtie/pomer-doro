/** @format */

import { Howl } from "howler";

export default class SuccessPlayer {
  source: string;
  sound: Howl;

  constructor(source: string) {
    this.source = source;
    this.sound = new Howl({
      src: [source],
    });
  }

  play() {
    this.sound.play();
  }
}
