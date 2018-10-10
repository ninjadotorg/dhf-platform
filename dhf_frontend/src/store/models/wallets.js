import axios from 'axios';
const initialState = []
export default {
    state: initialState,
    reducers: {
      // handle state changes with pure functions
      load(__, payload) {
        return payload;
      }
    },
    effects: (dispatch) => ({
      // handle state changes with impure functions.
      // use async/await for async actions
      async getWallets(payload, rootState) {
        try {
            const { status , data } = await axios.get('http://35.198.235.226:9000/api/link-to-wallet/my-wallet');
            if (status !== 200) return;
            console.log('result==================', data);
            dispatch.wallets.load(data)
        } catch (err) {
            console.log('getWallets=>', err);
        }
      }
    })
  }