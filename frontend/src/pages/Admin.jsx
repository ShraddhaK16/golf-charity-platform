import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const [token, setToken] = useState('');
  const [draws, setDraws] = useState([]);
  const [charities, setCharities] = useState([]);
  const [prizeName, setPrizeName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = JSON.parse(localStorage.getItem('user'));
    if (!t || !u || u.role !== 'admin') {
      navigate('/');
      return;
    }
    setToken(t);
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const drawsRes = await axios.get('http://localhost:5000/api/draws');
      setDraws(drawsRes.data);
    } catch (e) { console.error('Failed to load draws'); }

    try {
      const charRes = await axios.get('http://localhost:5000/api/charity');
      setCharities(charRes.data);
    } catch (e) { console.error('Failed to load charities'); }
  };

  const handleRunDraw = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/draws/run', { prize: prizeName }, { headers: { Authorization: `Bearer ${token}` } });
      alert(`Draw successful! Winner: ${res.data.draw.winner.name}`);
      setPrizeName('');
      fetchData();
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to run draw');
    }
  };

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <h2 className="mb-8">Admin <span className="text-gradient">Control Panel</span></h2>

      <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
        {/* Run Draw */}
        <div className="glass-card" style={{ flex: '1', minWidth: '300px' }}>
          <h3 className="mb-4">Monthly Prize Draw</h3>
          <form onSubmit={handleRunDraw}>
            <div className="input-group">
              <label className="input-label">Prize Name</label>
              <input type="text" className="input-field" value={prizeName} onChange={e => setPrizeName(e.target.value)} required placeholder="e.g. Callaway Epic Driver" />
            </div>
            <button type="submit" className="btn btn-primary w-full">Execute Random Draw</button>
          </form>

          <h4 className="mt-8 mb-4">Past Winners</h4>
          {draws.length === 0 ? <p style={{ color: 'var(--text-secondary)' }}>No draws run yet.</p> : (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {draws.map(d => (
                <li key={d._id} style={{ padding: '0.75rem', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem', borderRadius: '8px' }}>
                  <strong>Prize:</strong> <span style={{ color: 'var(--accent-primary)' }}>{d.prize}</span> <br />
                  <strong>Winner:</strong> {d.winnerId?.name} ({d.winnerId?.email}) <br />
                  <strong>Date:</strong> {new Date(d.date).toLocaleDateString()}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Charity Overview */}
        <div className="glass-card delay-100" style={{ flex: '1', minWidth: '300px' }}>
          <h3 className="mb-4">Charity Contributions</h3>
          {charities.length === 0 ? (
            <button onClick={async () => {
              await axios.post('http://localhost:5000/api/charity/seed');
              fetchData();
            }} className="btn btn-secondary mt-2">Seed Initial Charities</button>
          ) : (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {charities.map(c => (
                <div key={c._id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', marginBottom: '1rem', borderRadius: '8px', borderLeft: '4px solid var(--accent-primary)' }}>
                  <h4 style={{ color: 'var(--text-primary)' }}>{c.name}</h4>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{c.description}</p>
                  <div style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    Total Generated: <span className="text-gradient">${c.totalDonations.toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
