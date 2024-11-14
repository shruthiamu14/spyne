import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiTrash2, FiUpload, FiImage } from 'react-icons/fi';
import axios from '../Api';
import '../styles/EditProduct.css';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState({
    car_type: '',
    company: '',
    dealer: ''
  });
  const [images, setImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [imageError, setImageError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newImagePreviews, setNewImagePreviews] = useState([]);

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await axios.get(`/api/cars/${id}`);
        const car = response.data;
        setTitle(car.title || '');
        setDescription(car.description || '');
        setTags(car.tags || {
          car_type: '',
          company: '',
          dealer: ''
        });
        setExistingImages(car.images || []);
      } catch (error) {
        console.error('Error fetching car details:', error);
        navigate('/products');
      }
    };
    fetchCarDetails();
  }, [id, navigate]);

  const handleImageDelete = (indexToDelete) => {
    setExistingImages(prevImages => 
      prevImages.filter((_, index) => index !== indexToDelete)
    );
  };

  const handleImageUpload = (e) => {
    const files = e.target.files;
    const totalImages = files.length + existingImages.length;
    
    if (totalImages > 10) {
      setImageError('Maximum 10 images allowed');
      e.target.value = '';
      return;
    }
    
    // Create preview URLs
    const previewUrls = Array.from(files).map(file => URL.createObjectURL(file));
    setNewImagePreviews(previewUrls);
    setImageError('');
    setImages(files);
  };
  useEffect(() => {
    return () => {
      newImagePreviews.forEach(url => URL.revokeObjectURL(url));
    };
  }, [newImagePreviews]);

  const handleTagChange = (key, value) => {
    setTags(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const formData = new FormData();
      
      formData.append('title', title.trim());
      formData.append('description', description.trim());
      formData.append('tags', JSON.stringify(tags));
      formData.append('existingImages', JSON.stringify(existingImages));
      
      if (images.length > 0) {
        Array.from(images).forEach(image => formData.append('images', image));
      }

      await axios.put(`/api/cars/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/products');
    } catch (error) {
      setImageError(error.response?.data?.error || 'Error updating car');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="edit-product-container">
      <div className="header-section">
        <Link to="/products" className="back-button">
          <FiArrowLeft /> Back to Cars
        </Link>
        <h2>Edit Car Details</h2>
      </div>

      <form onSubmit={handleSubmit} className="edit-product-form">
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

        <div className="image-section">
      <div className="image-header">
        <label>Current Images</label>
        <span className="image-count">
          {(existingImages.length + images.length)}/10 images
        </span>
      </div>

      <div className="images-grid">
        {/* Existing Images */}
        {existingImages.map((image, index) => (
          <div key={`existing-${index}`} className="image-container">
            <img src={image} alt={`Car ${index + 1}`} className="existing-image" />
            <button
              type="button"
              onClick={() => handleImageDelete(index)}
              className="delete-image-btn"
              aria-label="Delete image"
            >
              <FiTrash2 />
            </button>
          </div>
        ))}
        
        {/* New Image Previews */}
        {newImagePreviews.map((preview, index) => (
          <div key={`preview-${index}`} className="image-container">
            <img src={preview} alt={`New ${index + 1}`} className="preview-image" />
          </div>
        ))}
      </div>

          <div className="upload-section">
            <label>Add New Images</label>
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
              />
              <div className="upload-placeholder">
                <FiUpload className="upload-icon" />
                <p>Click to upload or drag images here</p>
                <p className="upload-hint">Supports: JPG, PNG</p>
              </div>
            </div>
            {imageError && (
              <div className="error-message">
                <FiImage />
                {imageError}
              </div>
            )}
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            onClick={() => navigate('/products')}
            className="cancel-button"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="save-button"
            disabled={loading || imageError}
          >
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Saving...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;