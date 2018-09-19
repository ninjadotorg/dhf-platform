import axios from 'axios';
import history from '@/utils/history';
import _ from 'lodash';
/**
 * Create an Axios Client with defaults
 */
const client = axios.create({
  baseURL: 'http://35.240.197.175:9000/api/',
});
axios.defaults.headers.common.Authorization = localStorage.getItem('token');
/**
 * Request Wrapper with default success/error actions
 */
const request = options => {
  const onSuccess = response => {
    console.log('Request Successful!', response);
    return response.data;
  };

  const onError = error => {
    console.error('Request Failed:', error.config);

    if (error.response) {
      if (error.response.status === 401) history.push('/login');
      // Request was made but server responded with something other than 2xx
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else {
      // Something else happened while setting up the request triggered the error
      console.error('Error Message:', error.message);
    }

    return Promise.reject(error.response || error.message);
  };

  return client(options)
    .then(onSuccess)
    .catch(onError);
};

export default request;
