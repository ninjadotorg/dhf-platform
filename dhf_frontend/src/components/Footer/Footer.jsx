/*eslint-disable*/
import React from 'react';
// nodejs library to set properties for components
import PropTypes from 'prop-types';
// nodejs library that concatenates classes
import classNames from 'classnames';
import {List, ListItem, withStyles} from '@material-ui/core';

// @material-ui/icons
import Favorite from '@material-ui/icons/Favorite';
import LogoImage from '../Header/logo.svg';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import footerStyle from 'assets/jss/material-kit-react/components/footerStyle.jsx';
import twitter from './twitter.svg';
import facebook from './facebook.svg';
import linkedin from './linkedin.svg';
import telegram from './telegram.svg';
import youtube from './youtube.svg';
import github from './github-logo.svg';

function Footer({
  ...props
}) {
  const {classes, whiteFont} = props;
  const footerClasses = classNames({
    [classes.footer]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  const aClasses = classNames({
    [classes.a]: true,
    [classes.footerWhiteFont]: whiteFont
  });
  return (
    <footer className={footerClasses}>
    <div className={classes.container}>
      <div className="ninjafooterblock"  style={{clear:'both',borderTop:'1px solid rgba(51, 51, 51, 0.2)',paddingTop:20}}>
        <div className="clearfix">
          <img src={LogoImage} alt="" style={{
            float: 'left',
            position:'relative',
            top:3
          }}/>
          <div style={{
            float: 'left',
            marginLeft:30,
            fontSize:14,
            lineHeight:1.5
          }}>
            <span>Building blockchain powered apps, tools and solutions for the new wild
              west world web.<br/>
              <div style={{float:'left',fontSize:14}}>
                Contact us:
                <a href="mailto:fund@ninja.org" target="_top">fund@ninja.org</a>
              </div>
            </span>
        </div>
        <div class="pl-1 pt-1" style={{
            float: 'right',
            textAlign:'right',
            fontSize:14,
            lineHeight:1.5
          }}>
          <div><span>Join the dojo on <a href="https://t.me/ninjacash" class="landing-link">Telegram</a></span></div>
          <div><span>Read more about <a href="https://medium.com/@ninja_org" class="landing-link">Fund</a></span></div>
        </div>
      </div>
    </div>
    <div>
    <div style={{margin:'20px auto 100px auto'}}>
        <a target="_blank" href="https://twitter.com/ninjadotorg" style={{marginRight:20}}><img src={twitter} alt="" /></a>
        <a target="_blank" style={{marginRight:20}} href="https://www.facebook.com/ninjadotorg/"><img src={facebook} alt=""/></a>
        <a target="_blank" style={{marginRight:20}} href="https://www.linkedin.com/company/ninjadotorg/"><img src={linkedin} alt=""/></a>
        <a target="_blank" style={{marginRight:20}} href="https://t.me/ninjacash"><img src={telegram} alt=""/></a>
        <a target="_blank" style={{marginRight:20}} href="https://www.youtube.com/channel/UCnVIB9HmXpHI6hipu6-M5Ag"><img src={youtube}
            alt=""/></a>
        <a target="_blank" href="https://github.com/ninjadotorg/dhf-platform"><img width="40" src={github}
          alt="" /></a>
      </div>
    </div>
  </div>
  <div style={{backgroundColor:'#35C37D', width:'100%',position:'absolute',left:0,right:0,bottom:0,height:80,padding:'22px 0',zIndex:10000}}>
  <form action="" onSubmit={props.handleEmailSubmit}>
  <input type="email" name="email" placeholder="Enter your email address..." style={{height:40,width:300,padding:'0 20px',border:0}} required/>
                    <Button type="submit" style={{backgroundColor:'#333',textTransform:'none'}}>Signup for our Newsletter</Button>
                    </form>
  </div>
  </footer>
  );
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired,
  whiteFont: PropTypes.bool,
};

export default withStyles(footerStyle)(Footer);
