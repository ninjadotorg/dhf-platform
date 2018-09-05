'use strict';
const  PROJECT_STATE = {
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
module.exports = {
  PROJECT_STATE: PROJECT_STATE,
  TRANSACTION_STATE: TRANSACTION_STATE,
  USER_TYPE: USER_TYPE,
};