import {
  primaryColor,
  warningColor,
  dangerColor,
  successColor,
  infoColor,
  roseColor,
  grayColor,
  title,
} from 'assets/jss/material-kit-react.jsx';

const infoStyle = {
  infoArea: {
    maxWidth: '360px',
    margin: '0 auto',
    padding: '0px',
    paddingBottom: '7px',
    textAlign: 'left',
  },
  iconWrapper: {
    float: 'left',
    marginTop: '10px',
    marginRight: '10px',
    position: 'relative',
    right: 9,
  },
  primary: {
    color: primaryColor,
  },
  warning: {
    color: warningColor,
  },
  danger: {
    color: dangerColor,
  },
  success: {
    color: successColor,
  },
  info: {
    color: infoColor,
  },
  rose: {
    color: roseColor,
  },
  gray: {
    color: grayColor,
  },
  icon: {
    width: '36px',
    height: '36px',
  },
  descriptionWrapper: {
    color: '#000',
    marginTop: -40,
    overflow: 'hidden',
    marginLeft: 14,
  },
  title,
  description: {
    color: '#000',
    overflow: 'hidden',
    marginTop: '0px',
    fontSize: '14px',
  },
  iconWrapperVertical: {
    float: 'none',
  },
  iconVertical: {
    width: '61px',
    height: '61px',
  },
};

export default infoStyle;
