import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import MessagesList from './MessagesList';

import { connect } from 'react-redux'
import { fetchMessages } from '../store'
import { withRouter } from 'react-router-dom'

export class Main extends Component {

  componentDidMount() {
    this.props.loadMessages();
  }

  render() {
    return (
      <div>
        <Sidebar />
        <Navbar />
        <main>
          <Switch>
            <Route path="/channels/:channelId" component={MessagesList} />
            <Redirect to="/channels/1" />
          </Switch>
        </main>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  loadMessages: () => dispatch(fetchMessages()),
})

export default withRouter(connect(null, mapDispatchToProps)(Main));
