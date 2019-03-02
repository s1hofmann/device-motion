# device-motion

[![Build Status](https://travis-ci.com/s1hofmann/device-motion.svg?branch=master)](https://travis-ci.com/s1hofmann/device-motion)[![Greenkeeper badge](https://badges.greenkeeper.io/s1hofmann/device-motion.svg)](https://greenkeeper.io/)[SonarCloud badge](https://sonarcloud.io/api/project_badges/measure?project=s1hofmann_device-motion&metric=alert_status)](https://sonarcloud.io/dashboard?id=s1hofmann_device-motion) [![SonarCloud Coverage](https://sonarcloud.io/api/project_badges/measure?project=s1hofmann_device-motion&metric=coverage)](https://sonarcloud.io/component_measures?id=s1hofmann_device-motion&metric=coverage)

This repository contains a little library I created to react on device-motion events.

## Installation

```
npm install device-motion # OR yarn add device-motion
```

## Sample

The following sample demonstrates how I use it with React.

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
