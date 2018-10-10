import { title } from 'assets/jss/material-kit-react.jsx';

const productStyle = {
  section: {
  },
  title: {
    ...title,
    marginBottom: '1rem',
    marginTop: '30px',
    minHeight: '32px',
    textDecoration: 'none',
  },
  description: {
    color: '#000',
    fontSize: 16,
    fontWeight: 400,
    textAlign: 'center',
  },
  titleTrade: {
    marginTop: 164,
    textAlign: 'center',
  },
  iconBlock: {
    backgroundColor: '#fff',
    margin: '-40px 20px 0 20px',
    maxWidth: 'calc(25% - 40px)',
    boxShadow: '4px 9px 26px 0 rgba(16,124,71,0.10)',
    borderRadius: '5.28px',
    borderTop: '1px solid rgba(176, 216, 196, 0.25)',
  },
  traderButton: {
    marginBottom: 130,
  },
};

export default productStyle;
