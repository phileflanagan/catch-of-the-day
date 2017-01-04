import React, { Component } from 'react';

import sampleFishes from '../sample-fishes';
import Header from './Header';
import Order from './Order';
import Inventory from './Inventory';

class App extends Component {
  constructor() {
    super();
    this.loadSamples = this.loadSamples.bind(this);
    this.addFish = this.addFish.bind(this);

    this.state = {
      fishes: {},
      order: {}
    };
  }

  loadSamples() {
    this.setState({
      fishes: sampleFishes
    });
  }

  addFish(fish) {
      const fishes = {...this.state.fishes}
      const timestamp = Date.now();
      fishes[`fish-${timestamp}`] = fish;
      this.setState({ fishes });
  }

  render() {
    return (
      <div className="catch-of-the-day">
        <div className="menu">
          <Header tagline="Fresh Seafood Market"/>
        </div>
        <Order />
        <Inventory addFish={this.addFish} loadSamples={this.loadSamples}/>
      </div>
    );
  }
}

export default App;
