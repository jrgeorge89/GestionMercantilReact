
const initialState = { 
  token: localStorage.getItem('token') || null, 
  error: null 
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return { ...state, token: action.payload, error: null };
    case 'LOGIN_FAILURE':
      localStorage.removeItem('token');
      return { ...state, token: null, error: action.payload };
    case 'LOGOUT':
      localStorage.removeItem('token');
      return { ...state, token: null, error: null };
    default:
      return state;
  }
};

export default authReducer;
