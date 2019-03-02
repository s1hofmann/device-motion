# device-motion
This repository contains a little library I created to react on device-motion events.

The following sample demonstrates how I use it with React.

## Sample

```js
import React from "react";

import { Seismograph } from "device-motion";

export default class SeismographDemo extends React.Component {
  constructor(props) {
    super(props);
    this.seismograph = null;
  }

  componentDidMount = () => {
    if (!this.seismograph) {
      this.seismograph = new Seismograph({
        minShakes: this.props.minShakes || 3,
        minAmplitude: this.props.minAmplitude || 3,
        onShake: this.onShake,
        delay: this.props.delay || 1500
      });
    }
    this.seismograph.startRecording();
  };

  componentWillUnmount() {
    if (this.seismograph) {
      this.seismograph.stopRecording();
    }
  };

  onShake = () => {
      ...
  };

  render = () => {
      ...
  };
}
```
