import React, { Component } from 'react';
import base from '../base'
import AddFishForm from './AddFishForm';

class Inventory extends Component {
  constructor() {
    super();
    this.renderInventory = this.renderInventory.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.renderLogin = this.renderLogin.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.authHandler = this.authHandler.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      uid: null,
      ownder: null
    }
  }

  componentDidMount() {
    base.onAuth(user => {
      if(user) {
        this.authHandler(null, { user })
      }
    });
  }

  authenticate(provider) {
    base.authWithOAuthPopup(provider, this.authHandler)
  }

  authHandler(err, authData) {
    if(err) {
      console.error(err);
      return;
    }

    // Grab store info
    const storeRef = base.database().ref(this.props.storeId);
    // Query Firebase once for store data
    storeRef.once('value', snapshot => {
      const data = snapshot.val() || {};
      // Claim if no owner already
      if(!data.owner) {
        storeRef.set({
          owner: authData.user.uid
        })
      }

      this.setState({
        uid: authData.user.uid,
        owner: data.owner || authData.user.uid
      })
    })
  }

  logout() {
    base.unauth();
    this.setState({
      uid: null
    })
  }

  handleChange(e, key) {
    const fish = this.props.fishes[key];
    const updatedFish = {...fish,
      [e.target.name]: e.target.value
    };
    this.props.updateFish(key, updatedFish);
  }

  renderInventory(key) {
    const fish = this.props.fishes[key];
    return (
      <div className="fish-edit" key={key}>
        <input type="text" name="name" value={fish.name}placeholder="Fish Name" onChange={e => this.handleChange(e,key)} />
        <input type="text" name="price" value={fish.price} placeholder="Fish Price" onChange={e => this.handleChange(e,key)} />
        <select type="text" name="status" value={fish.status} placeholder="Fish Status" onChange={e => this.handleChange(e,key)}>
          <option value="available">Fresh!</option>
          <option value="unavailable">Sold Out!</option>
        </select>
        <textarea type="text" name="desc" value={fish.desc} placeholder="Fish Description" onChange={e => this.handleChange(e,key)}></textarea>
        <input type="text" name="image" value={fish.image} placeholder="Fish Image" onChange={e => this.handleChange(e,key)} />
        <button onClick={() => this.props.removeFish(key)}>- Remove Item</button>
      </div>
    );
  }

  renderLogin() {
    return (
      <nav className="login">
        <h2>Inventory</h2>
        <p>Sign in to manage your store's inventory.</p>
        <button className="github" onClick={() => this.authenticate('github')}>
          Log in with Github
        </button>
        <button className="facebook" onClick={() => this.authenticate('facebook')}>
          Log in with Facebook
        </button>
        <button className="twitter" onClick={() => this.authenticate('twitter')}>
          Log in with Twitter
        </button>
      </nav>
    );
  }

  render() {
    const logout = <button onClick={this.logout}>Log Out</button>
    //Check if they are not logged in
    if(!this.state.uid) {
      return <div>{this.renderLogin()}</div>;
    }

    //Check if they are the owner of the current store
    if(this.state.uid !== this.state.owner) {
      return (
        <div>
          <p>Sorry you aren't the owner of this store.</p>
          {logout}
        </div>);
    }

    return (
      <div>
        <h2>Inventory</h2>
        {logout}
        {Object.keys(this.props.fishes).map(this.renderInventory)}
        <AddFishForm addFish={this.props.addFish} />
        <button onClick={this.props.loadSamples}>Load Sample Fishes</button>
      </div>
    );
  }
}

Inventory.propTypes = {
  fishes: React.PropTypes.object.isRequired,
  addFish: React.PropTypes.func.isRequired,
  updateFish: React.PropTypes.func.isRequired,
  removeFish: React.PropTypes.func.isRequired,
  storeId: React.PropTypes.string.isRequired,
  loadSamples: React.PropTypes.func
}

export default Inventory;
