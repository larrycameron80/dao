import React, { Component } from 'react';
import { Grid, Row, Col } from 'react-flexbox-grid';
import ButtonLink from '../ui/button/ButtonLink';
import './CommunitiesList.css';

class CommunitiesList extends Component {
  renderItem(community, index) {
    return (
      <Col key = { index } xs = { 6 } md = { 3 }>
        <ButtonLink
          href = { '/communities/' + community.address }
          anchor = { community.name } />
      </Col>
    )
  }
  render() {
    if (this.props.communities.length > 0) {
      return (
        <div className = "Communities-list blue">
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
