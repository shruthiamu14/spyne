// ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiEdit2, FiTrash2, FiArrowLeft, FiTag } from 'react-icons/fi';
import axios from '../Api';
import '../styles/ProductDetail.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/cars/${id}`);
        setCar(response.data);
      } catch (err) {
        setError('Failed to load car details');
      } finally {
        setLoading(false);
      }
    };
    fetchCar();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/cars/${id}`);
      navigate('/products');
    } catch (err) {
      setError('Failed to delete car');
    }
  };

  if (loading) return <div className="loading-spinner" />;
  if (error) return <div className="error-message">{error}</div>;
  if (!car) return <div className="not-found">Car not found</div>;

  return (
    <div className="product-detail-container">
      <div className="detail-header">
        <Link to="/products" className="back-link">
          <FiArrowLeft /> Back to Cars
        </Link>
        <div className="action-buttons">
          <button 
            onClick={() => navigate(`/products/${id}/edit`)} 
            className="edit-button"
          >
            <FiEdit2 /> Edit
          </button>
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className="delete-button"
          >
            <FiTrash2 /> Delete
          </button>
        </div>
      </div>

      <div className="car-info">
        <h1>{car.title}</h1>
        <p className="description">{car.description}</p>

        {car.tags && Object.values(car.tags).some(tag => tag) && (
          <div className="tags-section">
            <h3><FiTag /> Tags</h3>
            <div className="tags-container">
              {Object.entries(car.tags).map(([key, value]) => 
                value && (
                  <span key={key} className="tag">
                    {`${key}: ${value}`}
                  </span>
                )
              )}
            </div>
          </div>
        )}

        {car.images && car.images.length > 0 && (
          <div className="image-gallery">
            {car.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${car.title} view ${index + 1}`}
                className="gallery-image"
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to delete this car?</p>
            <div className="modal-actions">
              <button 
                onClick={() => setShowDeleteModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                className="confirm-delete-button"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedImage && (
        <div 
          className="image-modal"
          onClick={() => setSelectedImage(null)}
        >
          <img 
            src={selectedImage} 
            alt="Full size view" 
            className="modal-image"
          />
        </div>
      )}
    </div>
  );
};

export default ProductDetail;