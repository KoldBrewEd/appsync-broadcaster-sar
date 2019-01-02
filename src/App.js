import React, { Component } from 'react';
import './App.css';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css';

import Amplify, {API,graphqlOperation} from 'aws-amplify';
Amplify.configure({
  'aws_appsync_graphqlEndpoint': 'https://xxxxxx.appsync-api.us-east-1.amazonaws.com/graphql',
  'aws_appsync_region': 'us-east-1',
  'aws_appsync_authenticationType': 'API_KEY',
  'aws_appsync_apiKey': 'da2-xxxxxxxxxxxxxxxxxxxxxxxxxx',
});

const sendMessage = `mutation sendMessage($message: String!) {
  sendMessage(message: $message) {
    __typename
    message
  }
}`;

const subscribeToMessage = `subscription subscribeToMessage {
  subscribeToMessage {
    __typename
    message
  }
}`;

class App extends Component {

  constructor(props){
     super(props);
     this.state={
        message:"",
        value:"",
        display:false
     };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentDidMount(){
    this.subscription = API.graphql(graphqlOperation(subscribeToMessage)).subscribe({
      next: (event) => {
          console.log("Subscription: "+event.value.data);
          this.setState({display: true});
          this.setState({message: event.value.data.subscribeToMessage.message});
        }
    });
  }

  handleChange(event) {
    this.setState({value:event.target.value});
  }

  async handleSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
    const message = {
      "message":this.state.value
    }
    await API.graphql(graphqlOperation(sendMessage, message));
  }

  render() {
    return (
      <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <div className="jumbotron jumbotron-fluid p-0">
          <h3 className="display-4">Broadcaster</h3>
        </div>
        <br/>
        <div className="container">
          <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input className="form-control form-control-lg"type="text" value={this.state.value} onChange={this.handleChange} />
          </div>
          <input type="submit" value="Submit" className="btn btn-primary"/>
          </form>
        </div>
        <br/>
        {this.state.display ?  
          <div className="container">
            <div className="card bg-success">
              <h3 className="card-text text-white p-2">{this.state.message}</h3>
            </div>
          </div>
        : null }
      </div>
    );
  }
}

export default App;