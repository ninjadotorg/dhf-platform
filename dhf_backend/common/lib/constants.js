'use strict';
const  PROJECT_STATE = {
  NEW: 'NEW',
  INITFUND: 'INITFUND',
  APPROVED: 'APPROVED',
  READY: 'READY',
  RELEASE: 'RELEASE',
  STOP: 'STOP',
  WITHDRAW: 'WITHDRAW',
};
const PROJECT_STAGE_STATE = {
  NEW: 'NEW',
  CURRENT: 'CURRENT',
  DONE: 'DONE',
  CANCEL: 'CANCEL',
  SUSPEND: 'SUSPEND',
};

const TRANSACTION_STATE = {
  PENDING: 'PENDING',
  MATCHED: 'MATCHED',
  DONE: 'DONE',
  CANCEL: 'CANCEL',
};
const USER_TYPE = {
  ADMIN: 'admin',
  USER: 'user',
  BACKEND: 'backend',
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
];

module.exports = {
  PROJECT_STATE: PROJECT_STATE,
  PROJECT_STAGE_STATE: PROJECT_STAGE_STATE,
  TRANSACTION_STATE: TRANSACTION_STATE,
  USER_TYPE: USER_TYPE,
  CURRENCIES: currencies,
  EXCHANGE: exchange,
};
