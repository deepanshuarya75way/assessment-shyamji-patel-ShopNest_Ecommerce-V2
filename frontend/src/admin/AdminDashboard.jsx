import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';

const statusOptions = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
const statusColors = {
  pending: '#f97316',
  processing: '#3b82f6',
  shipped: '#8b5cf6',
  delivered: '#22c55e',
  cancelled: '#ef4444',
};

const emptyForm = { name: '', description: '', price: '', category: '', stock: '' };

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [tab, setTab] = useState('overview');

  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const authHeader = { Authorization: `Bearer ${user?.token}` };

  const fetchAll = async () => {
    setLoading(true);
    setError('');
    try {
      const [statsRes, ordersRes, productsRes] = await Promise.all([
        fetch('/api/analytics', { headers: authHeader }),
        fetch('/api/orders', { headers: authHeader }),
        fetch('/api/products'),
      ]);

      if (!statsRes.ok || !ordersRes.ok || !productsRes.ok) {
        throw new Error('Failed to load admin data');
      }

      setStats(await statsRes.json());
      setOrders(await ordersRes.json());
      setProducts(await productsRes.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Failed to update status');
      setOrders((prev) => prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)));
    } catch (err) {
      alert(err.message);
    }
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setImageFile(null);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (product) => {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      stock: product.stock,
    });
    setImageFile(null);
    setEditingId(product._id);
    setShowForm(true);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmitProduct = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => formData.append(key, value));
      if (imageFile) formData.append('image', imageFile);

      const url = editingId ? `/api/products/${editingId}` : '/api/products';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: authHeader,
        body: formData,
      });

      if (!res.ok) throw new Error('Failed to save product');

      const saved = await res.json();

      if (editingId) {
        setProducts((prev) => prev.map((p) => (p._id === editingId ? saved : p)));
      } else {
        setProducts((prev) => [...prev, saved]);
      }

      setShowForm(false);
      setForm(emptyForm);
      setImageFile(null);
      setEditingId(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
        headers: authHeader,
      });
      if (!res.ok) throw new Error('Failed to delete product');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ textAlign: 'center', margin: '100px 20px', color: '#a1a1aa' }}>
        <h2 style={{ color: '#fff' }}>Access Denied</h2>
        <p>You must be an admin to view this page.</p>
      </div>
    );
  }

  if (loading) {
    return <div style={{ textAlign: 'center', margin: '100px', color: '#f97316' }}>Loading Dashboard...</div>;
  }

  if (error) {
    return <div style={{ textAlign: 'center', margin: '100px', color: '#ef4444' }}>{error}</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ color: '#fff', marginBottom: '30px' }}>Admin Dashboard</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        {['overview', 'orders', 'products'].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              borderBottom: tab === t ? '2px solid #f97316' : '2px solid transparent',
              color: tab === t ? '#f97316' : '#a1a1aa',
              fontSize: '15px',
              fontWeight: 600,
              textTransform: 'capitalize',
              cursor: 'pointer',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {tab === 'overview' && stats && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '20px',
          }}
        >
          <StatCard label="Total Users" value={stats.totalUsers} />
          <StatCard label="Total Orders" value={stats.totalOrders} />
          <StatCard label="Total Products" value={stats.totalProducts} />
          <StatCard label="Total Revenue" value={`₹${stats.totalRevenue}`} highlight />
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.length === 0 ? (
            <p style={{ color: '#a1a1aa' }}>No orders yet.</p>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                style={{
                  background: '#18181b',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                  <div>
                    <p style={{ color: '#71717a', fontSize: '13px', margin: 0 }}>Customer</p>
                    <p style={{ color: '#fafafa', fontSize: '14px', margin: '4px 0 0' }}>
                      {order.user?.name || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#71717a', fontSize: '13px', margin: 0 }}>Order ID</p>
                    <p style={{ color: '#fafafa', fontSize: '13px', margin: '4px 0 0' }}>{order._id}</p>
                  </div>
                  <div>
                    <p style={{ color: '#71717a', fontSize: '13px', margin: 0 }}>Total</p>
                    <p style={{ color: '#f97316', fontSize: '15px', fontWeight: 700, margin: '4px 0 0' }}>
                      ₹{order.totalAmount}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: '#71717a', fontSize: '13px', margin: '0 0 4px' }}>Status</p>
                    <select
                      value={order.status || 'pending'}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '8px',
                        border: 'none',
                        background: statusColors[order.status] || '#71717a',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '13px',
                        textTransform: 'capitalize',
                        cursor: 'pointer',
                      }}
                    >
                      {statusOptions.map((s) => (
                        <option key={s} value={s} style={{ background: '#18181b', color: '#fff' }}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                  {order.items.map((item, idx) => (
                    <p key={idx} style={{ color: '#a1a1aa', fontSize: '13px', margin: '4px 0' }}>
                      {item.productId?.name || 'Product'} × {item.qty}
                    </p>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          <button
            onClick={openAddForm}
            style={{
              padding: '12px 22px',
              background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 600,
              cursor: 'pointer',
              marginBottom: '24px',
            }}
          >
            + Add New Product
          </button>

          {showForm && (
            <form
              onSubmit={handleSubmitProduct}
              style={{
                background: '#18181b',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px',
                padding: '24px',
                marginBottom: '24px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '16px',
              }}
            >
              <input name="name" placeholder="Product Name" value={form.name} onChange={handleFormChange} required style={inputStyle} />
              <input name="category" placeholder="Category" value={form.category} onChange={handleFormChange} required style={inputStyle} />
              <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleFormChange} required style={inputStyle} />
              <input name="stock" type="number" placeholder="Stock" value={form.stock} onChange={handleFormChange} required style={inputStyle} />
              <textarea
                name="description"
                placeholder="Description"
                value={form.description}
                onChange={handleFormChange}
                required
                style={{ ...inputStyle, gridColumn: '1 / -1', minHeight: '80px', resize: 'vertical' }}
              />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                style={{ ...inputStyle, padding: '10px' }}
                required={!editingId}
              />

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '12px' }}>
                <button
                  type="submit"
                  disabled={saving}
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: saving ? 'not-allowed' : 'pointer',
                    opacity: saving ? 0.6 : 1,
                  }}
                >
                  {saving ? 'Saving...' : editingId ? 'Update Product' : 'Create Product'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    color: '#a1a1aa',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {products.map((product) => (
              <div
                key={product._id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  background: '#18181b',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: '10px',
                  padding: '14px 18px',
                }}
              >
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fafafa', margin: 0, fontWeight: 600 }}>{product.name}</p>
                  <p style={{ color: '#71717a', margin: '2px 0 0', fontSize: '13px' }}>
                    {product.category} · ₹{product.price} · Stock: {product.stock}
                  </p>
                </div>
                <button onClick={() => openEditForm(product)} style={actionBtnStyle('#3b82f6')}>Edit</button>
                <button onClick={() => handleDeleteProduct(product._id)} style={actionBtnStyle('#ef4444')}>Delete</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, highlight }) => (
  <div
    style={{
      background: '#18181b',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '24px',
    }}
  >
    <p style={{ color: '#71717a', fontSize: '13px', margin: '0 0 10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </p>
    <p style={{ color: highlight ? '#f97316' : '#fff', fontSize: '2rem', fontWeight: 700, margin: 0 }}>
      {value}
    </p>
  </div>
);

const inputStyle = {
  padding: '12px 16px',
  borderRadius: '8px',
  border: '1px solid rgba(255,255,255,0.08)',
  background: 'rgba(255,255,255,0.03)',
  color: '#fafafa',
  fontSize: '14px',
  outline: 'none',
  fontFamily: 'inherit',
};

const actionBtnStyle = (color) => ({
  padding: '8px 14px',
  background: 'transparent',
  border: `1px solid ${color}`,
  color: color,
  borderRadius: '6px',
  fontSize: '13px',
  fontWeight: 600,
  cursor: 'pointer',
});

export default AdminDashboard;
