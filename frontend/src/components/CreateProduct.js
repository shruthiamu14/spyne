// CreateProduct.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiUpload } from 'react-icons/fi';
import axios from '../Api';
import '../styles/CreateProduct.css';

const CreateProduct = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState({
    car_type: '',
    company: '',
    dealer: ''
  });
  const [images, setImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const navigate = useNavigate();

  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files || []);
    const totalImages = images.length + newFiles.length;
    
    if (totalImages > 10) {
      setImageError('Maximum 10 images allowed');
      e.target.value = '';
      return;
    }

    // Create preview URLs for new files and combine with existing
    const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviewUrls]);
    setImages(prev => [...prev, ...newFiles]);
    setImageError('');
  };

  // Cleanup previews on unmount
  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  const handleTagChange = (key, value) => {
    setTags(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleRemoveImage = (indexToRemove) => {
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('tags', JSON.stringify(tags));
      Array.from(images).forEach(image => formData.append('images', image));

      await axios.post('/api/cars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/products');
    } catch (error) {
      setImageError(error.response?.data?.error || 'Error creating car');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-product-container">
      <div className="header-section">
        <Link to="/products" className="back-button">
          <FiArrowLeft /> Back to Cars
        </Link>
        <h2>Add New Car</h2>
      </div>

      <form onSubmit={handleSubmit} className="create-product-form">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="product-input"
            placeholder="Enter car title"
            required
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="product-textarea"
            placeholder="Enter car description"
            required
          />
        </div>

        <div className="tags-section">
          <label>Tags</label>
          <div className="tags-grid">
            <div className="tag-input-group">
              <span className="tag-icon">🚗</span>
              <input
                type="text"
                placeholder="Car Type"
                value={tags.car_type}
                onChange={(e) => handleTagChange('car_type', e.target.value)}
                className="tag-input"
              />
            </div>
            <div className="tag-input-group">
              <span className="tag-icon">🏢</span>
              <input
                type="text"
                placeholder="Company"
                value={tags.company}
                onChange={(e) => handleTagChange('company', e.target.value)}
                className="tag-input"
              />
            </div>
            <div className="tag-input-group">
              <span className="tag-icon">👤</span>
              <input
                type="text"
                placeholder="Dealer"
                value={tags.dealer}
                onChange={(e) => handleTagChange('dealer', e.target.value)}
                className="tag-input"
              />
            </div>
          </div>
        </div>

        <div className="image-upload-section">
          <label>
            Images <span className="image-limit">({images.length}/10)</span>
          </label>
          
          {imagePreviews.length > 0 && (
            <div className="image-preview-grid">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="preview-container">
                  <img 
                    src={preview} 
                    alt={`Preview ${index + 1}`} 
                    className="preview-image"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="delete-preview-btn"
                    aria-label="Remove image"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div 
            className="upload-area"
            onClick={() => document.querySelector('#file-input').click()}
          >
            <input
              id="file-input"
              type="file"
              multiple
              onChange={handleImageUpload}
              className="product-file-input"
              accept="image/*"
              style={{ display: 'none' }}
            />
            <div className="upload-placeholder">
              <FiUpload className="upload-icon" />
              <p className="upload-text">Click to upload or drag images here</p>
              <p className="upload-hint">Supports: JPG, PNG (Max 10 images)</p>
            </div>
          </div>
          
          {imageError && (
            <div className="error-message">
              {imageError}
            </div>
          )}
        </div>

        <button 
          type="submit" 
          className="product-submit-button"
          disabled={loading || imageError}
        >
          {loading ? (
            <>
              <span className="loading-spinner" />
              Creating...
            </>
          ) : (
            'Create Car'
          )}
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;