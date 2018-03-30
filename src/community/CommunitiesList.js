import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import { Link } from 'react-router-dom';
import './CommunitiesList.css';

class CommunitiesList extends Component {
  renderItem(community, index) {
    if (!community.isPrivate && community.isActive) {
      return (
        <Col key = { index } xs = { 6 } md = { 3 }>
          <Link to = { '/community/' + community.address }>
            { community.name }
          </Link>
        </Col>
      )
    }
    else {
      return (null);
    }
  }
  render() {
    if (this.props.communities.length > 0) {
      return (
        <div className = "Communities-list blue box">
          <Grid fluid>
            <Row>
              {
                this.props.communities.map(
                  (community, index) => (
                    this.renderItem(community, index)
                  )
                )
              }
            </Row>
          </Grid>
        </div>
      );
    }
    else {
      return (null);
    }
  }
}

export default CommunitiesList;
