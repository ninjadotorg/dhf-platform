import axios from 'axios';
const initialState = []
export default {
    state: initialState,
    reducers: {
      // handle state changes with pure functions
      addWallet(state, payload) {
        return [ ...state, payload ]
      }
    },
    effects: (dispatch) => ({
      // handle state changes with impure functions.
      // use async/await for async actions
      async linkToWallet(verifyCode, rootState) {
        const result = await axios.post('http://35.198.235.226:9000/api/link-to-wallet/verify', {
            verifyCode
        });
        console.log('result==================', result);
        // dispatch.count.increment(payload)
      }
    })
  }