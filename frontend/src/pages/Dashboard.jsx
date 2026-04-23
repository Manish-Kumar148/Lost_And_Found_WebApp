import { useState, useEffect } from 'react';
import api from '../utils/api';

const Dashboard = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    itemName: '',
    description: '',
    type: 'Lost',
    location: '',
    date: '',
    contactInfo: ''
  });
  const [error, setError] = useState('');
  
  // Safe parsing in case localStorage data is corrupted
  let user = null;
  try {
    user = JSON.parse(localStorage.getItem('user'));
  } catch (e) {
    // ignore
  }

  const fetchItems = async (query = '') => {
    try {
      const url = query ? `/items/search?name=${query}` : '/items';
      const res = await api.get(url);
      setItems(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchItems(searchQuery);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/items', formData);
      setFormData({ itemName: '', description: '', type: 'Lost', location: '', date: '', contactInfo: '' });
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add item');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/items/${id}`);
        fetchItems();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete');
      }
    }
  };

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      
      <div className="row">
        {/* Add Item Form */}
        <div className="col-md-4 mb-4">
          <div className="card">
            <div className="card-body">
              <h4>Report an Item</h4>
              {error && <div className="alert alert-danger">{error}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-2">
                  <label>Item Name</label>
                  <input type="text" name="itemName" className="form-control" value={formData.itemName} onChange={handleChange} required />
                </div>
                <div className="mb-2">
                  <label>Description</label>
                  <textarea name="description" className="form-control" value={formData.description} onChange={handleChange} required></textarea>
                </div>
                <div className="mb-2">
                  <label>Type</label>
                  <select name="type" className="form-control" value={formData.type} onChange={handleChange}>
                    <option value="Lost">Lost</option>
                    <option value="Found">Found</option>
                  </select>
                </div>
                <div className="mb-2">
                  <label>Location</label>
                  <input type="text" name="location" className="form-control" value={formData.location} onChange={handleChange} required />
                </div>
                <div className="mb-2">
                  <label>Date</label>
                  <input type="date" name="date" className="form-control" value={formData.date} onChange={handleChange} required />
                </div>
                <div className="mb-2">
                  <label>Contact Info</label>
                  <input type="text" name="contactInfo" className="form-control" value={formData.contactInfo} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-success w-100 mt-2">Submit</button>
              </form>
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="col-md-8">
          <form onSubmit={handleSearch} className="d-flex mb-4">
            <input 
              type="text" 
              className="form-control me-2" 
              placeholder="Search items by name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="btn btn-outline-primary" type="submit">Search</button>
            <button className="btn btn-outline-secondary ms-2" type="button" onClick={() => { setSearchQuery(''); fetchItems(''); }}>Clear</button>
          </form>

          <div className="row">
            {items.map(item => (
              <div className="col-md-6 mb-3" key={item._id}>
                <div className={`card h-100 border-${item.type === 'Lost' ? 'danger' : 'success'}`}>
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <span className={`badge bg-${item.type === 'Lost' ? 'danger' : 'success'}`}>{item.type}</span>
                    <small className="text-muted">{new Date(item.date).toLocaleDateString()}</small>
                  </div>
                  <div className="card-body">
                    <h5 className="card-title">{item.itemName}</h5>
                    <p className="card-text">{item.description}</p>
                    <p className="mb-1"><strong>Location:</strong> {item.location}</p>
                    <p className="mb-1"><strong>Contact:</strong> {item.contactInfo}</p>
                    <p className="mb-0"><small>Reported by: {item.user?.name || 'Unknown'}</small></p>
                  </div>
                  {user && item.user?._id === user._id && (
                    <div className="card-footer bg-transparent">
                      <button className="btn btn-sm btn-danger w-100" onClick={() => handleDelete(item._id)}>Delete Entry</button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {items.length === 0 && <p className="text-center mt-5">No items found.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
