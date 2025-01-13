
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Businessman.css';

const Businessman = () => {
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [city, setCity] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [registrationDate, setRegistrationDate] = useState('');
  const [hasEstablishments, setHasEstablishments] = useState(false);
  const [availableDepartments, setAvailableDepartments] = useState([]);
  const [availableCities, setAvailableCities] = useState([]);
  const { id } = useParams(); // Obtén el ID desde la URL
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    // llamada a API para obtener los departamentos
    setAvailableDepartments(['Departamento 1', 'Departamento 2']);
  }, []);

  useEffect(() => {
    // llamada a API para obtener los municipios según el departamento
    if (department === 'Departamento 1') {
      setAvailableCities(['Ciudad 1', 'Ciudad 2']);
    } else if (department === 'Departamento 2') {
      setAvailableCities(['Ciudad 3', 'Ciudad 4']);
    } else {
      setAvailableCities([]);
    }
  }, [department]);

  useEffect(() => {
    if (id) {
      axios.get(`http://localhost:8080/api/businessman/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      })
      .then(response => {
        const merchant = response.data;
        setName(merchant.nombreRazonSocial);
        setDepartment(merchant.department.id - 1);
        setCity(merchant.municipality.id - 1);
        setPhone(merchant.telefono);
        setEmail(merchant.correoElectronico);
        setRegistrationDate(merchant.fechaRegistro);
        setHasEstablishments(merchant.tieneEstablecimientos);
      })
      .catch(error => {
        console.error('Error fetching merchant:', error.message);
      });
    }
  }, [id, token]);

  const handleSubmit = (event) => {
    event.preventDefault();
    
    const businessmanData = {
      nombreRazonSocial: name,
      department: { id: availableDepartments.indexOf(department) + 1 },
      municipality: { id: availableCities.indexOf(city) + 1 },
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

    axios({ method, url, data: businessmanData, headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }})
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
            value={availableDepartments[department]}
            onChange={(e) => setDepartment(e.target.value)}
            required
          >
            <option value="">Seleccionar...</option>
            {availableDepartments.map((dep) => (
              <option key={dep} value={dep}>{dep}</option>
            ))}
          </select>
        </div>
        <div className="form-field">
          <label>Municipio o Ciudad *</label>
          <select
            value={availableCities[city]}
            onChange={(e) => setCity(e.target.value)}
            required
            disabled={!department}
          >
            <option value="">Seleccionar...</option>
            {availableCities.map((mun) => (
              <option key={mun} value={mun}>{mun}</option>
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
        <button type="submit">Guardar</button>
      </form>
    </div>
  );
};

export default Businessman;
