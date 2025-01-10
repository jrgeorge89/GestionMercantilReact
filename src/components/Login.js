import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../redux/actions/authActions';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (acceptTerms) {
      dispatch(login(email, password));
    } else {
      alert("Debe aceptar los términos y condiciones");
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
          <h2>Debes iniciar sesión para acceder a la plataforma</h2>
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
