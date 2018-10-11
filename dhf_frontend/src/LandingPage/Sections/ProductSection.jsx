import React from 'react';
// @material-ui/core components
import withStyles from '@material-ui/core/styles/withStyles';

// @material-ui/icons
import Chat from '@material-ui/icons/Chat';
import VerifiedUser from '@material-ui/icons/VerifiedUser';
import Fingerprint from '@material-ui/icons/Fingerprint';
import Button from '@material-ui/core/Button';
// core components
import GridContainer from 'components/Grid/GridContainer.jsx';
import GridItem from 'components/Grid/GridItem.jsx';
import InfoArea from 'components/InfoArea/InfoArea.jsx';
import { Redirect, Link } from 'react-router-dom';


import productStyle from 'assets/jss/material-kit-react/views/landingPageSections/productStyle.jsx';
import highvolumesvg from './highvolumesvg.svg';
import nofeessvg from './nofeessvg.svg';
import nokycsvg from './nokycsvg.svg';
import unlimitedsvg from './unlimitedsvg.svg';


class ProductSection extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.section}>
        <div>
          <GridContainer>
            <GridItem xs={12} sm={12} md={3} className={classes.iconBlock}>
              <InfoArea
                title={(
                  <span>
                    No
                    {' '}
                    <br />
                  KYC required

                  </span>
                )}
                description="Just sign up, set your fund request and launch."
                icon={nokycsvg}
                iconColor="info"
                vertical
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={3} className={classes.iconBlock}>
              <InfoArea
                title="Access to high-volume crypto exchanges"
                description="Traders get access to Binance and more to come."
                icon={highvolumesvg}
                iconColor="success"
                vertical
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={3} className={classes.iconBlock}>
              <InfoArea
                title={(
                  <span>
                    No fees & hidden
                    {' '}
                    <br />
                    costs
                  </span>
                )}
                description="Ninja fund is free of charge for
                all traders."
                icon={nofeessvg}
                iconColor="danger"
                vertical
              />
            </GridItem>
            <GridItem xs={12} sm={12} md={3} className={classes.iconBlock}>
              <InfoArea
                title={(
                  <span>
                    Unlimited
                    {' '}
                    <br />
                    Commission
                  </span>
                )}
                description="Traders are given the rights to set whatever commission rates."
                icon={unlimitedsvg}
                iconColor="danger"
                vertical
              />
            </GridItem>
          </GridContainer>

          <GridContainer justify="center">
            <GridItem xs={12} sm={12} md={8} style={{ textAlign: 'center' }}>
              <h2 className={classes.titleTrade}>Ready to trade?</h2>
              <div className={classes.description}>
              Click here to sign up a
                {' '}
                <strong>Ninja trader</strong>
                {' '}
                account within
                {' '}
                <strong>less than a minute.</strong>
              </div>
              <br />
              <Button type="submit" variant="raised" color="primary" component={Link} to={localStorage.getItem('token') ? '/dashboard' : '/register'} style={{ marginBottom: 100 }}>
                  Become a Ninja Trader
              </Button>
            </GridItem>
          </GridContainer>
        </div>
      </div>
    );
  }
}

export default withStyles(productStyle)(ProductSection);
