import { Seismograph } from "../src/index";

describe("Seismograph", () => {
    it("should provide default constructor values", () => {
        // GIVEN
        const SUT = new Seismograph();
        const defaultShakes = 3;
        const defaultDelay = 1500;
        const defaultOnShake = "EAAAARTHQUAAAAKEEE!";

        // WHEN

        // THEN
        expect(SUT.onShake()).toEqual(defaultOnShake);
        expect(SUT.minShakes).toBe(defaultShakes);
        expect(SUT.delay).toBe(defaultDelay);
    });

    it("should update minShakes for valid numbers", () => {
        // GIVEN
        const expectedShakes = 10;
        const SUT = new Seismograph({minShakes: expectedShakes});

        // WHEN

        // THEN
        expect(SUT.minShakes).toBe(expectedShakes);
    });

    it("should not update minShakes for numbers < 1", () => {
        // GIVEN
        const expectedShakes = 3;
        const SUT = new Seismograph({minShakes: 0});

        // WHEN

        // THEN
        expect(SUT.minShakes).toBe(expectedShakes);
    });

    it("should update minAmplitude for valid numbers", () => {
        // GIVEN
        const expectedAmplitude = 10;
        const SUT = new Seismograph({minAmplitude: expectedAmplitude});

        // WHEN

        // THEN
        expect(SUT.minAmplitude).toBe(expectedAmplitude);
    });

    it("should not update minAmplitude for numbers < 1", () => {
        // GIVEN
        const expectedAmplitude = 3;
        const SUT = new Seismograph({minAmplitude: 0});

        // WHEN

        // THEN
        expect(SUT.minAmplitude).toBe(expectedAmplitude);
    });

    it("should update onShakes with passed functions", () => {
        // GIVEN
        const expectedOnShake = "Shake it!";
        const SUT = new Seismograph({onShake: () => expectedOnShake});

        // WHEN

        // THEN
        expect(SUT.onShake()).toEqual(expectedOnShake);
    });

    it("should not update onShakes for non function parameters", () => {
        // GIVEN
        const expectedOnShake = "EAAAARTHQUAAAAKEEE!";
        const SUT = new Seismograph({onShake: 5});

        // WHEN

        // THEN
        expect(SUT.onShake()).toEqual(expectedOnShake);
    });

    it("should update delay for values > 0", () => {
        // GIVEN
        const expectedDelay = 5;
        const SUT = new Seismograph({delay: expectedDelay});

        // WHEN

        // THEN
        expect(SUT.delay).toBe(expectedDelay);
    });

    it("should not update delay for values < 1", () => {
        // GIVEN
        const expectedDelay = 1500;
        const SUT = new Seismograph({delay: -10});

        // WHEN

        // THEN
        expect(SUT.delay).toBe(expectedDelay);
    });
});

describe("_onMotion", () => {
    it("should favor acceleration over accelerationIncludingGravity", () => {
        // GIVEN
        const SUT = new Seismograph();
        SUT._initValues = jest.fn();
        SUT._detectShake = jest.fn();
        const accelerationX = 10;
        const accelerationIncludingGravityX = 20;
        const event = {
            acceleration: {
                x: accelerationX
            },
            accelerationIncludingGravity: {
                x: accelerationIncludingGravityX
            }
        };

        // WHEN
        SUT._onMotionEvent(event);

        // THEN
        expect(SUT._initValues).toBeCalledWith(accelerationX);
    });

    it("should fallback to accelerationIncludingGravity", () => {
        // GIVEN
        const SUT = new Seismograph();
        SUT._initValues = jest.fn();
        SUT._detectShake = jest.fn();
        const accelerationIncludingGravityX = 20;
        const event = {
            accelerationIncludingGravity: {
                x: accelerationIncludingGravityX
            }
        };

        // WHEN
        SUT._onMotionEvent(event);

        // THEN
        expect(SUT._initValues).toBeCalledWith(accelerationIncludingGravityX);
    });
});

describe("_initValues", () => {
    it("should update previous value if not set", () => {
        // GIVEN
        const SUT = new Seismograph();
        const expectedValue = 10;

        // WHEN
        SUT._initValues(expectedValue);

        // THEN
        expect(SUT.previousX).toBe(expectedValue);
    });

    it("should not update previous value if set", () => {
        // GIVEN
        const SUT = new Seismograph();
        SUT.previousX = 20;
        const expectedValue = 20;

        // WHEN
        SUT._initValues(10);

        // THEN
        expect(SUT.previousX).toBe(expectedValue);
    });
});

describe("_shakeThresholdReached", () => {
    it("should return true if threshold is reached", () => {
        // GIVEN
        const SUT = new Seismograph();
        SUT.currentShakes = 10;

        // WHEN
        const result = SUT._shakeThresholdReached();

        // THEN
        expect(result).toBeTruthy();
    });

    it("should return true if threshold is reached", () => {
        // GIVEN
        const SUT = new Seismograph();
        SUT.currentShakes = 1;

        // WHEN
        const result = SUT._shakeThresholdReached();

        // THEN
        expect(result).toBeFalsy();
    });
});

describe("_checkAmplitude", () => {
    it("should return false for equal signs", () => {
        // GIVEN
        const SUT = new Seismograph();
        const previous = 5;
        const current = 5;

        // WHEN
        const result = SUT._checkAmplitude(current, previous);

        // THEN
        expect(result).toBeFalsy();
    });

    it("should return false if amplitude is not high enough", () => {
        // GIVEN
        const SUT = new Seismograph();
        const previous = 2;
        const current = -1;

        // WHEN
        const result = SUT._checkAmplitude(current, previous);

        // THEN
        expect(result).toBeFalsy();
    });

    it("should return true if amplitude is high enough and sign differs", () => {
        // GIVEN
        const SUT = new Seismograph();
        const previous = 1;
        const current = -5;

        // WHEN
        const result = SUT._checkAmplitude(current, previous);

        // THEN
        expect(result).toBeTruthy();
    });
});

describe("_belowTimeThreshold", () => {
    it("should return true for delta < delay", () => {
        // GIVEN
        const SUT = new Seismograph();
        const lastShake = 5;
        SUT.lastShake = lastShake;
        SUT._currentDate = jest.fn(() => lastShake + 10);

        // WHEN
        const result = SUT._belowTimeThreshold();

        // THEN
        expect(result).toBeTruthy();
    });

    it("should return false for delta >= delay", () => {
        // GIVEN
        const SUT = new Seismograph();
        const lastShake = 5;
        SUT.lastShake = lastShake;
        SUT._currentDate = jest.fn(() => lastShake + SUT.delay);

        // WHEN
        const result = SUT._belowTimeThreshold();

        // THEN
        expect(result).toBeFalsy();
    });
});

describe("_detectShake", () => {
    it("should return false when below delay", () => {
        // GIVEN
        const SUT = new Seismograph();
        const lastShake = 5;
        SUT.lastShake = lastShake;
        SUT._currentDate = jest.fn(() => lastShake + 10);
        const current = 5;
        const previous = -5;

        // WHEN
        const result = SUT._detectShake(current, previous);

        // THEN
        expect(result).toBeFalsy();
    });

    it("should return false when below min amplitude", () => {
        // GIVEN
        const SUT = new Seismograph();
        const lastShake = 5;
        SUT.lastShake = lastShake;
        SUT._currentDate = jest.fn(() => lastShake + SUT.delay);
        const current = 1;
        const previous = -5;

        // WHEN
        const result = SUT._detectShake(current, previous);

        // THEN
        expect(result).toBeFalsy();
    });

    it("should update shake value when above min amplitude", () => {
        // GIVEN
        const SUT = new Seismograph();
        const lastShake = 5;
        SUT.lastShake = lastShake;
        SUT._currentDate = jest.fn(() => lastShake + SUT.delay);
        const currentShake = SUT.currentShakes;
        const current = 5;
        const previous = -5;

        // WHEN
        SUT._detectShake(current, previous)

        // THEN
        expect(SUT.currentShakes - currentShake).toBe(1);
    });

    it("should return false when minShake value is not met", () => {
        // GIVEN
        const SUT = new Seismograph();
        const lastShake = 5;
        SUT.lastShake = lastShake;
        SUT._currentDate = jest.fn(() => lastShake + SUT.delay);
        SUT._shakeThresholdReached = jest.fn(() => false);
        const current = 5;
        const previous = -5;

        // WHEN
        const result = SUT._detectShake(current, previous)

        // THEN
        expect(result).toBeFalsy();
    });

    it("should call onShake and return true when minShake value is met", () => {
        // GIVEN
        const SUT = new Seismograph();
        const lastShake = 5;
        SUT.lastShake = lastShake;
        SUT._currentDate = jest.fn(() => lastShake + SUT.delay);
        SUT._shakeThresholdReached = jest.fn(() => true);
        SUT.onShake = jest.fn();
        const current = 5;
        const previous = -5;

        // WHEN
        const result = SUT._detectShake(current, previous)

        // THEN
        expect(result).toBeTruthy();
        expect(SUT.onShake).toBeCalledTimes(1);
    });
});
