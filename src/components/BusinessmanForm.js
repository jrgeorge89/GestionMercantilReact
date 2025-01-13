import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'; 
import './BusinessmanForm.css';

const BusinessmanForm = () => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [hasEstablishments, setHasEstablishments] = useState(false);
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    axios.get('http://localhost:8080/api/departments', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }).then(response => {
        setAvailableDepartments(response.data.data);
      }).catch(error => {
        console.error('Error fetching departments:', error.message);
      });
  }, [token]);

  useEffect(() => {
    if (department) {
      axios.get(`http://localhost:8080/api/departments/${department}/municipalities`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          setAvailableCities(response.data.data);
        }).catch(error => {
          console.error('Error fetching municipalities:', error.message);
        });
    }
  }, [department, token]);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/api/businessman/${id}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }).then(response => {
          const merchant = response.data;
          setName(merchant.nombreRazonSocial);
          setDepartment(merchant.department.id);
          setCity(merchant.municipality.id);
          setPhone(merchant.telefono);
          setEmail(merchant.correoElectronico);
          setRegistrationDate(merchant.fechaRegistro);
          setHasEstablishments(merchant.tieneEstablecimientos);
        }).catch(error => {
          console.error('Error fetching merchant:', error.message);
        });
    }
  }, [id, token]);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const businessmanData = {
      nombreRazonSocial: name,
      department: { id: department },
      municipality: { id: city },
      telefono: phone,
      correoElectronico: email,
      fechaRegistro: registrationDate,
      estado: 'Activo',
      usuario: 'ADMIN',
    };

    const url = id
      ? `http://localhost:8080/api/businessman/${id}`
      : 'http://localhost:8080/api/businessman';
    const method = id ? 'put' : 'post';

    axios({
      method,
      url,
      data: businessmanData,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Businessman saved successfully:', response.data);
      navigate('/home');
    })
    .catch(error => {
      console.error(`Error ${id ? 'updating' : 'creating'} businessman:`, error.message);
    });
  };

  return (
    <div className="businessman-container">
      <h2>{id ? 'Actualizar Comerciante' : 'Crear Comerciante'}</h2>
      <form onSubmit={handleSubmit} className="businessman-form">
        <div className="form-row">
          <div className="form-field">
            <label>Nombre o Razón Social *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="form-field">
            <label>Departamento *</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              required
            >
              <option value="">Seleccionar...</option>
              {availableDepartments.map((dep) => (
                <option key={dep.id} value={dep.id}>{dep.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Municipio o Ciudad *</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              disabled={!department}
            >
              <option value="">Seleccionar...</option>
              {availableCities.map((mun) => (
                <option key={mun.id} value={mun.id}>{mun.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Teléfono</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-field">
            <label>Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Fecha de Registro *</label>
            <input
              type="date"
              value={registrationDate}
              onChange={(e) => setRegistrationDate(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-field">
          <label>
            <input
              type="checkbox"
              checked={hasEstablishments}
              onChange={(e) => setHasEstablishments(e.target.checked)}
            />
            ¿Posee establecimientos?
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Guardar</button>
          <button type="button" onClick={() => navigate('/home')}>Cancelar</button>
        </div>
      </form>
    </div>
  );
};

export default BusinessmanForm;
