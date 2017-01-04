import React, { Component } from 'react';

class AddFishForm extends Component {
  constructor() {
    super();
    this.createFish = this.createFish.bind(this);
  }

  createFish(event) {
    event.preventDefault();

    const fish = {
      name: this.name.value,
      price: this.price.value,
      status: this.status.value,
      desc: this.desc.value,
      image: this.image.value
    }

    this.props.addFish(fish);
  }

  render() {
    return (
      <form className="fish-edit" onSubmit={this.createFish}>
        <input type="text" placeholder="Fish Name" ref={input => this.name = input}/>
        <input type="text" placeholder="Fish Price" ref={input => this.price = input}/>
        <select ref={input => this.status = input}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" placeholder="Fish Desc" ref={input => this.desc = input}></textarea>
        <input type="text" placeholder="Fish Image" ref={input => this.image = input}/>
        <button type="submit">+ Add Item</button>
      </form>
    );
  }
}

export default AddFishForm;
