import axios from 'axios';

export const login = (email, password) => async (dispatch) => {
  try {
    const response = await axios.post('http://localhost:8080/auth/login', {
      username: email,
      password: password
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const { token } = response.data;

    dispatch({ type: 'LOGIN_SUCCESS', payload: token });

    // Almacena el token en localStorage para usarlo en futuras solicitudes
    localStorage.setItem('token', token);
  } catch (error) {
    dispatch({ type: 'LOGIN_FAILURE', payload: error.message });
  }
};
