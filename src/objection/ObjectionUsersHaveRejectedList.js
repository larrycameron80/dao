import React, { Component } from 'react';

class ObjectionRejectedList extends Component {
  renderItem(item, index) {
    return (
      <li key={ index }>
        { item }
      </li>
    );
  }
  renderList(list) {
    if (list.length > 0) {
      return (
        <ul>
          {
            list.map(
              (item, index) => (
                this.renderItem(item, index)
              )
            )
          }
        </ul>
      );
    }
  }
  render() {
    if (this.props.usersHaveRejected !== null && this.props.usersHaveRejected.length > 0) {
      var list = this.props.usersHaveRejected.map(i => i.returnValues['user']);
      return (
        <div className="Objection-rejected-list yellow box">
          <h3>They rejected this objection</h3>
          { this.renderList(list) }
        </div>
      );
    }
    else if (this.props.objectionEndingDate > 0) {
      return (
        <div className="Objection-rejected-list yellow">
          <p>No one rejected this objection, so far.</p>
        </div>
      );
    }
    else return null;
  }
}

export default ObjectionRejectedList;
