
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/authActions';
import { useNavigate } from 'react-router-dom'; 
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); 

  const handleSubmit = (event) => {
    event.preventDefault();
    if (acceptTerms) {
      dispatch(login(email, password))
        .then(() => {
          navigate('/home'); 
        })
        .catch((error) => {
          setErrorMessage('Error durante el inicio de sesión, por favor verifica tus datos.');
          console.error('Error during login:', error.message);
        });
    } else {
      setErrorMessage('Debe aceptar los términos y condiciones');
    }
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <img src="/path/to/logo.png" alt="Logo" className="logo" />
        <div className="right-header">
          <span>Beneficios por renovar</span>
          <i className="user-icon"></i>
        </div>
      </div>
      <div className="login-body">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Debes iniciar sesión para acceder al sistema</h2>
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          <div className="form-field">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>
              <input
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                required
              />
              Acepto términos y condiciones
            </label>
          </div>
          <button type="submit">Iniciar sesión</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
