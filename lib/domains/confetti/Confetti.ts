import confetti from "canvas-confetti";
import throttle from "lodash/throttle";

export const Confetti = {
  fireConfetti() {
    try {
      fireCone();
    } catch (error) {}
  },
  fireCannon() {
    try {
      fireCanon(2000, ["#bb0000"]);
    } catch (error) {}
  },
};

const fireCone = throttle(
  () => {
    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  },
  500,
  { leading: true }
);

const fireCanon = throttle(
  (durationMS: number, colors: Array<string>) => {
    const end = Date.now() + durationMS;

    function frame() {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: colors,
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }
    frame();
  },
  2000,
  { leading: true }
);

function fire(
  particleRatio: number,
  options: {
    spread: number;
    startVelocity?: number;
    colors?: Array<string>;
    decay?: number;
  }
) {
  /**
   * https://www.kirilv.com/canvas-confetti/
   */
  confetti({
    origin: { y: 0.7 },
    particleCount: Math.floor(200 * particleRatio),
    ...options,
  });
}
