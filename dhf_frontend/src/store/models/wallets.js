import { clientApi } from '@/utils/api';
const LINK_WALLET_URL = '/link-to-wallet/my-wallet';

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
      async getWallets() {
        try {
            const { status , data } = await clientApi.get(LINK_WALLET_URL);
            if (status !== 200) return;
            dispatch.wallets.load(data)
        } catch (err) {
            console.log('getWallets=>', err);
        }
      }
    })
  }