'use strict';
const  PROJECT_STATE = {
  NEW: 'NEW',
  INITFUND: 'INITFUND',
  APPROVED: 'APPROVED',
  READY: 'READY',
  RELEASED: 'RELEASED',
  TOP: 'TOP',
  WITHDRAW: 'WITHDRAW',
};
const TRANSACTION_STATE = {
  PENDING: 'PENDING',
  MATCHED: 'MATCHED',
  DONE: 'DONE',
  CANCEL: 'CANCEL',
};
const USER_TYPE = {
  ADMIN: 'admin',
  TRADER: 'trader',
  USER: 'user',
};
const exchange = ['binance'];

const currencies = [
  {
    code: 'USD', Name: 'USD', isUsed: false,
  },
  {
    code: 'BTC', Name: 'Bitcoin', isUsed: false,
  },
  {
    code: 'ETH', Name: 'Ethereum', isUsed: true,
  },
  {
    code: 'EOS', Name: 'EOS', isUsed: false,
  },
  {
    code: 'NEO', Name: 'NEO', isUsed: false,
  },
  {
    code: 'ONT', Name: 'Ontology', isUsed: false,
  },
  {
    code: 'BCC', Name: 'Bitcoin Cash', isUsed: false,
  },
  {
    code: 'VET', Name: 'VeChainThor', isUsed: false,
  },
  {
    code: 'TRX', Name: 'TRON', isUsed: false,
  },
  {
    code: 'ADA', Name: 'Cardano', isUsed: false,
  },
  {
    code: 'XRP', Name: 'Ripple', isUsed: false,
  },
  {
    code: 'LTC', Name: 'Litecoin', isUsed: false,
  },
  {
    code: 'ETC', Name: 'Ethereum Classic', isUsed: false,
  },
  {
    code: 'ICX', Name: 'ICON', isUsed: false,
  },
  {
    code: 'XLM', Name: 'Stellar Lumens', isUsed: false,
  },
  {
    code: 'BNB', Name: 'Binance Coin', isUsed: false,
  },
  {
    code: 'TUSD', Name: 'TrueSUD', isUsed: false,
  },
  {
    code: 'IOTA', Name: 'MIOTA', isUsed: false,
  },
  {
    code: 'QTUM', Name: 'Qtum', isUsed: false,
  },
  {
    code: 'NULS', Name: 'Nuls', isUsed: false,
  },
];

module.exports = {
  PROJECT_STATE: PROJECT_STATE,
  TRANSACTION_STATE: TRANSACTION_STATE,
  USER_TYPE: USER_TYPE,
  CURRENCIES: currencies,
  EXCHANGE: exchange,
};
