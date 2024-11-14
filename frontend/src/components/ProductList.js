// ProductList.js
import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { FiSearch, FiPlus, FiLogOut } from 'react-icons/fi';
import { BiCar } from 'react-icons/bi';
import axios from '../Api';
import '../styles/ProductList.css';

const ProductList = () => {
  const [cars, setCars] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(
          search ? `/api/cars/search?query=${encodeURIComponent(search)}` : '/api/cars'
        );
        setCars(response.data);
      } catch (err) {
        setError('Failed to fetch cars');
        setCars([]);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchCars, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);

  const EmptyState = () => (
    <div className="empty-state">
      <BiCar size={48} />
      <h3>No Cars Found</h3>
      <p>Start by adding your first car or try a different search</p>
      <Link to="/create" className="add-car-button">
        Add Your First Car
      </Link>
    </div>
  );

  return (
    <div className="product-list-container">
      <div className="list-header">
        <h1>Car Collection</h1>
        <div className="header-actions">
          <div className="search-bar">
            <FiSearch className="search-icon" />
            <input
              type="text"
              placeholder="Search cars..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
          </div>
          <button onClick={logout} className="logout-button">
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span>{error}</span>
          <button onClick={() => setError(null)}>Dismiss</button>
        </div>
      )}

      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner" />
          <p>Loading cars...</p>
        </div>
      ) : cars.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="product-grid">
          {cars.map((car) => (
            <Link to={`/products/${car._id}`} key={car._id} className="product-card">
              <div className="card-image-container">
                {car.images && car.images[0] ? (
                  <img
                    src={car.images[0]}
                    alt={car.title}
                    className="card-image"
                  />
                ) : (
                  <div className="placeholder-image">
                    <BiCar size={40} />
                  </div>
                )}
              </div>
              <div className="card-content">
                <h3 className="card-title">{car.title}</h3>
                <p className="card-description">
                  {car.description.length > 100
                    ? `${car.description.substring(0, 100)}...`
                    : car.description}
                </p>
                {car.tags && Object.values(car.tags).some(tag => tag) && (
                  <div className="card-tags">
                    {Object.entries(car.tags).map(([key, value]) => 
                      value && (
                        <span key={key} className="card-tag">
                          {value}
                        </span>
                      )
                    )}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <Link to="/create" className="add-button" title="Add new car">
        <FiPlus />
      </Link>
    </div>
  );
};

export default ProductList;