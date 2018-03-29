import React, { Component } from 'react';
import './Communities.css';

class CommunitiesList extends Component {
  renderItem(community, index) {
    return (
      <p key = { index }>
        { community.name + ' ' + community.address }
      </p>
    )
  }
  render() {
    if (this.props.communities.length > 0) {
      return (
        this.props.communities.map(
          (community, index) => (
            this.renderItem(community, index)
          )
        )
      );
    }
    else {
      return (null);
    }
  }
}

export default CommunitiesList;
