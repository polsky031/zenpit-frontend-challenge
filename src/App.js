import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import _ from 'lodash';

const API_getlatest = 'https://fonoapi.freshpixl.com/v1/getlatest?';
const API_getdevice = 'https://fonoapi.freshpixl.com/v1/getdevice?';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      token: 'a925d73cfbe6e6652905037053fff874a00b4c92ccc0bea5',
      topBrand: ['Samsung','Apple','Nokia','Sony','LG','HTC','HUAWEI'],
      limit: [5,10,15,20,25],
      deviceResult : [],
      resultCtr: 0,
      brand: '',
      deviceName: '',
      noOfRows: 0,
      errorMessage: ''
    };
  }

  componentDidMount(){
    this.getLatestDeviceInfo();
  }

  getLatestDeviceInfo() {

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    let getRandomBrand = _.sample(this.state.topBrand);
    let getRandomLimit = _.sample(this.state.limit);
    const token = this.state.token;

    let params = 'token='+token+'&brand='+getRandomBrand+'&limit='+getRandomLimit;
     // fetch get latest mobile device data
    fetch(API_getlatest + params, requestOptions)
    .then(response => {
        if (!response.ok) { 
            return Promise.reject(response.statusText);
        }
        return response.json();
    })
    .then(data => {
      this.setState({ deviceResult: data });   
      this.setState({ resultCtr: data.length }); 
    });

  }

  getDeviceInfo(brand, device, limit) {

    const requestOptions = {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };
    const token = this.state.token;

    let params = 'token='+token+'&brand='+brand+'&device='+device;
     // fetch get latest mobile device data
    fetch(API_getdevice + params, requestOptions)
    .then(response => {
        if (!response.ok) { 
            return Promise.reject(response.statusText);
        }
        return response.json();
    })
    .then(data => {
      this.setState({ deviceResult: data });   
      this.setState({ resultCtr: data.length }); 
    });

  }

  brandHandleChange(ev){
    const input = ev.target.value;

    if(input){
      this.setState({brand: input});
    }
  }

  deviceNameHandleChange(ev){
    const input = ev.target.value;

    if(input){
      this.setState({deviceName: input});
    }
  }

  limitHandleChange(ev){
    const input = ev.target.value;

    if(input){
      this.setState({noOfRows: input});
    }
  }

  handleSearchDevice() {
    let brand = this.state.brand;
    let deviceName = this.state.deviceName;
    let limit = this.state.noOfRows;

    if(!brand){
      this.setState({errorMessage:'Brand is required'});
      return;
    }

    if(!deviceName){
      this.setState({errorMessage:'Device name is required'});
      return;
    }

    this.getDeviceInfo(brand, deviceName, limit);

  }

  handleCheckLatest() {
    // call this method to get the latest device info
    this.setState({brand:''});
    this.setState({deviceName:''});
    this.getLatestDeviceInfo();
  }

  renderLimitDropdown() {
    let limitDropdown = this.state.limit;
    let ctr = 0;
    let limitItems = limitDropdown.map((limit) => {
      ctr += 1;
      return <option key={ctr}>{limit}</option>
    });

    return limitItems;
  }

  renderDeviceInformation() {
    let deviceResult = this.state.deviceResult;
    let ctr = 0;

    if(deviceResult.status === "error"){
      this.setState({ deviceResult: [] });   
      this.setState({ resultCtr: 0 }); 
      this.setState({errorMessage:deviceResult.message});
      return;
    } else {
      let deviceDataDetails = deviceResult.map((dev) => {
        ctr += 1;
        return <div key={ctr} className="result-detail"> 
          <label>{dev.DeviceName}</label>
          <label>{dev.Brand}</label>
          <label>{dev.technology}</label>
          <label>{dev.sim}</label>
          <label>{dev.size}</label>
          <label>{dev.resolution}</label>
          <label>{dev.battery_c}</label>
        </div> 
      });
  
      return deviceDataDetails;
    }



  }


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">* MOBILE DEVICE INFORMATION CENTER *</h1>
        </header>
        <div className="App-intro">
          <input 
            className="App-searchfield" 
            placeholder="Enter brand (example : samsung, htc)" 
            onChange={this.brandHandleChange.bind(this)}
            value={this.state.brand}
          />
          <input 
            className="App-searchfield" 
            placeholder="Enter device name (example : i9305, A8)" 
            onChange={this.deviceNameHandleChange.bind(this)}
            value={this.state.deviceName}
          />
          <select 
            className="App-searchfield"
            onChange={this.limitHandleChange.bind(this)}>
            <option key={null}>{"No. of Rows  "}</option>
            {this.renderLimitDropdown()}
          </select>
        </div>

        <p className="App-button-holder">
            <button className="btn-search" onClick={() => { this.handleSearchDevice() }}>Search</button>
            <button className="btn-check" onClick={() => { this.handleCheckLatest() }}>
              Refresh List
            </button>
        </p>
        {
            this.state.errorMessage &&
            <div className="App-errContainer">{this.state.errorMessage}</div>
        }
        <div className="row App-searchresult"> 
              <h3 className="result-count">Showing {this.state.resultCtr} Device(s)</h3>
              <div className="col-md-12">
                {this.renderDeviceInformation()}
              </div>
        </div>
      </div>
    );
  }
}

export default App;
