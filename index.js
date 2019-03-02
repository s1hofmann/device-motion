export class Seismograph {
  constructor(
    { minShakes, minAmplitude, onShake, delay } = {
      minShakes: 3,
      minAmplitude: 3,
      onShake: () => "EAAAARTHQUAAAAKEEE!",
      delay: 1500
    }
  ) {
    if (typeof minShakes === "number" && minShakes > 0) {
      this.minShakes = minShakes;
    } else {
      this.minShakes = 3;
    }
    if (typeof minAmplitude === "number" && minAmplitude > 0) {
      this.minAmplitude = minAmplitude;
    } else {
      this.minAmplitude = 3;
    }
    if (typeof onShake === "function") {
      this.onShake = onShake;
    } else {
      this.onShake = () => "EAAAARTHQUAAAAKEEE!";
    }
    this.delay = delay > 0 ? delay : 1500;
    this.currentShakes = 0;
    this.lastShake = Date.now();
    this.previousX = null;
  }

  startRecording = () => {
    window.addEventListener("devicemotion", this._onMotionEvent);
  };

  stopRecording = () => {
    window.removeEventListener("devicemotion", this._onMotionEvent);
  };

  _onMotionEvent = event => {
    let x = null;

    if ("acceleration" in event) {
      x = event.acceleration.x;
    } else {
      x = event.accelerationIncludingGravity.x;
    }

    this._initValues(x);

    this._detectShake(x, this.previousX);
  };

  _initValues = x => {
    if (!this.previousX) {
      this.previousX = x;
    }
  };

  _detectShake = (current, previous) => {
    if (this._belowTimeThreshold()) {
      return false;
    }

    if (!this._checkAmplitude(current, previous)) {
      return false;
    } else {
      ++this.currentShakes;
    }

    previous = current;

    if (this._shakeThresholdReached()) {
      this.currentShakes = 0;
      this.lastShake = this._currentDate();
      this.onShake();
      return true;
    }
    return false;
  };

  _checkAmplitude = (current, previous) => {
    if (Math.sign(current) === Math.sign(previous) || Math.abs(current) < this.minAmplitude) {
      return false;
    }
    return true;
  }

  _shakeThresholdReached = () => {
    return this.currentShakes > this.minShakes;
  };

  _belowTimeThreshold = () => {
    return this._currentDate() - this.lastShake < this.delay;
  };

  _currentDate = () => Date.now();
}
