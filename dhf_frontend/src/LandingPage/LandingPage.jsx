import React from 'react';
// nodejs library that concatenates classes
import classNames from 'classnames';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';

// @material-ui/icons

// core components
import Header from 'components/Header/Header.jsx';
import Footer from 'components/Footer/Footer.jsx';
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import Button from '@material-ui/core/Button';
import { Redirect, Link } from 'react-router-dom';
import HeaderLinks from 'components/Header/HeaderLinks.jsx';
import Parallax from 'components/Parallax/Parallax.jsx';
import landingPageStyle from 'assets/jss/material-kit-react/views/landingPage.jsx';

// Sections for this page
import ProductSection from './Sections/ProductSection.jsx';
import MainImage from './Sections/mainImage.png';
// import TeamSection from './Sections/TeamSection.jsx';
// import WorkSection from './Sections/WorkSection.jsx';


class LandingPage extends React.Component {
  handleEmailSubmit(event) {
    event.preventDefault();
  }

  render() {
    const { classes, ...rest } = this.props;
    return (
      <div style={{ backgroundColor: '#f6f6f6' }}>
        <React.Fragment>
          <CssBaseline />
          <Header
            color="#fff"
            className={classes.navbar}
            rightLinks={<HeaderLinks />}
          />
          <div className={classes.mainBackground}>
            <div className={classes.container}>
              <GridContainer className={classes.mainBlock}>
                <GridItem xs={12} sm={12} md={6}>
                  <h1 className={classes.title}>More than a trading platform</h1>
                  <div style={{ marginBottom: 10 }}>
                  Get more funds with less work. Stop investing time on looking for investors hopelessly. Register just in minutes, and connect with your investors effortlessly.
                  </div>
                  <br />
                  <Button type="submit" variant="raised" color="primary" component={Link} to={localStorage.getItem('token') ? '/dashboard' : '/register'}>
                  Become a Ninja Trader
                  </Button>
                </GridItem>
                <GridItem xs={12} sm={12} md={6}>
                  <img src={MainImage} alt="header" width="500" classNames={classes.mainImage} />
                </GridItem>
              </GridContainer>
            </div>
          </div>
          <div className={classNames(classes.main, classes.mainRaised)} style={{ backgroundColor: 'transparent' }}>
            <div className={classes.container}>
              <ProductSection />
              {/* <TeamSection /> */}
              {/* <WorkSection /> */}
            </div>
          </div>
          <Footer handleEmailSubmit={this.handleEmailSubmit} />
        </React.Fragment>
      </div>
    );
  }
}

export default withStyles(landingPageStyle)(LandingPage);
