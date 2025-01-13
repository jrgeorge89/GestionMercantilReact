import axios from 'axios';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';

export const login = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      username: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { token } = response.data;

    dispatch({ type: 'LOGIN_SUCCESS', payload: token });

    localStorage.setItem('token', token); // Almacena el token en localStorage
  } catch (error) {
    dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
  }
};
