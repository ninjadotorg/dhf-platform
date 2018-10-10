import { container, title } from 'assets/jss/material-kit-react.jsx';

const landingPageStyle = {
  container: {
    zIndex: '12',
    ...container,
  },
  navbar: {
    boxShadow: '0',
  },
  title: {
    ...title,
    display: 'inline-block',
    position: 'relative',
    marginTop: '30px',
    minHeight: '32px',
    padding: '8px 0',
    textDecoration: 'none',
    color: '#000',
  },
  mainBackground: {
    minHeight: 650,
    backgroundColor: '#fff',
  },
  mainImage: {

  },
  mainBlock: {
    padding: '90px 0',
  },
  subtitle: {
    fontSize: '1.313rem',
    maxWidth: '500px',
    margin: '10px auto 0',
  },
  main: {
    background: '#FFFFFF',
    position: 'relative',
    zIndex: '3',
    textAlign: 'left',
  },
  mainRaised: {
    margin: '-60px 30px 0px',
    borderRadius: '6px',
  },
};

export default landingPageStyle;
