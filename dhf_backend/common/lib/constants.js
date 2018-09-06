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
const currencies = [
  {
    code: 'USD', Name: 'USD',
  },
  {
    code: 'BTC', Name: 'Bitcoin',
  },
  {
    code: 'ETH', Name: 'Ethereum',
  },
  {
    code: 'BTC', Name: 'Bitcoin',
  },
  {
    code: 'EOS', Name: 'EOS',
  },
  {
    code: 'NEO', Name: 'NEO',
  },
  {
    code: 'ONT', Name: 'Ontology',
  },
];
module.exports = {
  PROJECT_STATE: PROJECT_STATE,
  TRANSACTION_STATE: TRANSACTION_STATE,
  USER_TYPE: USER_TYPE,
  CURRENCIES: currencies,
};
