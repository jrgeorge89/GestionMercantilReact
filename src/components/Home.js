import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Home.css';

const Home = () => {
  const [role, setRole] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [merchants, setMerchants] = useState([]);
  const [municipalities, setMunicipalities] = useState([]);
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    name: '',
    municipalitieId: '',
    registrationDate: '',
    status: '',
    size: 5,
    page: 0,
  });
  const [pagination, setPagination] = useState({
    totalPages: 0,
    totalElements: 0,
    currentPage: 0,
  });

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setRole(decodedToken.role);
      setFirstName(decodedToken.firstName);
      setLastName(decodedToken.lastName);
    }
  }, [token]);

  const fetchMunicipalities = () => {
    if (token) {
      axios.get('http://localhost:8080/api/departments', {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(response => {
        const allMunicipalities = response.data.data.reduce((acc, department) => acc.concat(department.municipalities), []);
        setMunicipalities(allMunicipalities);
      }).catch(error => {
        console.error('Error fetching municipalities:', error.message);
      });
    }
  };

  const fetchMerchants = () => {
    if (token) {
      const params = {
        name: filters.name || undefined,
        municipalitieId: filters.municipalitieId || undefined,
        registrationDate: filters.registrationDate || undefined,
        status: filters.status || undefined,
        size: filters.size,
        page: filters.page,
      };

      axios.get('http://localhost:8080/api/businessman', {
        headers: { 'Authorization': `Bearer ${token}` },
        params,
      }).then(response => {
        setMerchants(response.data.data.content);
        setPagination({
          totalPages: response.data.data.totalPages,
          totalElements: response.data.data.totalElements,
          currentPage: response.data.data.number,
        });
      }).catch(error => {
        console.error('Error fetching merchants:', error.message);
      });
    }
  };

  useEffect(() => {
    fetchMunicipalities();
    fetchMerchants();
  }, [token, filters]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleAddBusinessman = () => {
    navigate('/businessman/create');
  };

  const handleEditBusinessman = (id) => {
    navigate(`/businessman/update/${id}`);
  };

  const handleDeleteBusinessman = (id) => {
    if (window.confirm("¿Estás seguro de que deseas eliminar este comerciante?")) {
      axios.delete(`http://localhost:8080/api/businessman/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      }).then(response => {
        fetchMerchants();
      }).catch(error => {
        console.error('Error deleting merchant:', error.message);
      });
    }
  };

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'Activo' ? 'Inactivo' : 'Activo';
    axios.patch(`http://localhost:8080/api/businessman/${id}/status?status=${newStatus}`, null, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      fetchMerchants();
    })
    .catch(error => {
      console.error('Error toggling status:', error.message);
    });
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      page: newPage,
    }));
  };

  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  const handleLogoutMenu = () => {
    setShowLogoutMenu((prevState) => !prevState);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="home-container">
      <div className="home-header">
        <h1>Plataforma de Gestión de Comerciante</h1>
        <div className="user-info">
          <img src="../assets/user-icon.jpg" alt="" className="user-icon" onClick={handleLogoutMenu} />
          <div className="user-text">
            <strong>Bienvenido!</strong>
            <span>{firstName} {lastName}</span>
            <span>{role}</span>
          </div>
          {showLogoutMenu && (
            <div className="logout-menu">
              <button onClick={handleLogout}>Cerrar Sesión</button>
            </div>
          )}
        </div>
      </div>

      <div className="filters">
        <h3>Filtros</h3>
        <div className="filter-group">
          <input
            type="text"
            placeholder="Nombre"
            name="name"
            value={filters.name}
            onChange={handleFilterChange}
          />
          <select
            name="municipalitieId"
            value={filters.municipalitieId}
            onChange={handleFilterChange}
          >
            <option value="">Seleccionar Municipio</option>
            {municipalities.map((municipality) => (
              <option key={municipality.id} value={municipality.id}>
                {municipality.name}
              </option>
            ))}
          </select>
          <input
            type="date"
            placeholder="Fecha de Registro"
            name="registrationDate"
            value={filters.registrationDate}
            onChange={handleFilterChange}
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
          >
            <option value="">Seleccionar Estado</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
          <button onClick={() => setFilters({ ...filters, page: 0 })}>Aplicar Filtros</button>
        </div>
      </div>

      <div className="actions">
        <button onClick={handleAddBusinessman}>Agregar Comerciante</button>
      </div>

      <div className="traders-table">
        <table>
          <thead>
            <tr>
              <th>Razón Social</th>
              <th>Departamento</th>
              <th>Ciudad</th>
              <th>Teléfono</th>
              <th>Correo Electrónico</th>
              <th>Fecha Registro</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {merchants.map((merchant) => (
              <tr key={merchant.businessman_id}>
                <td>{merchant.nombreRazonSocial}</td>
                <td>{merchant.department.nombre}</td>
                <td>{merchant.municipality.nombre}</td>
                <td>{merchant.telefono}</td>
                <td>{merchant.correoElectronico}</td>
                <td>{merchant.fechaRegistro}</td>
                <td>
                  <button
                    className={merchant.estado === 'Activo' ? 'active' : 'inactive'}
                    onClick={() => handleToggleStatus(merchant.businessman_id, merchant.estado)}
                  >
                    {merchant.estado}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEditBusinessman(merchant.businessman_id)}>Editar</button>
                  {role === 'Administrador' && (
                    <button onClick={() => handleDeleteBusinessman(merchant.businessman_id)}>Eliminar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button disabled={pagination.currentPage === 0} onClick={() => handlePageChange(pagination.currentPage - 1)}>
          Anterior
        </button>
        <span>Página {pagination.currentPage + 1} de {pagination.totalPages}</span>
        <button disabled={pagination.currentPage === pagination.totalPages - 1} onClick={() => handlePageChange(pagination.currentPage + 1)}>
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Home;
