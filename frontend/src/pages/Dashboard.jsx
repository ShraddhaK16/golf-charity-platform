import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState('');
  const [subscription, setSubscription] = useState(null);
  const [scores, setScores] = useState([]);
  const [charities, setCharities] = useState([]);
  const navigate = useNavigate();

  // Score Form
  const [courseName, setCourseName] = useState('');
  const [date, setDate] = useState('');
  const [scoreVal, setScoreVal] = useState('');

  // Sub Form
  const [plan, setPlan] = useState('monthly');
  const [charityId, setCharityId] = useState('');

  useEffect(() => {
    const t = localStorage.getItem('token');
    const u = JSON.parse(localStorage.getItem('user'));
    if (!t || !u) {
      navigate('/login');
      return;
    }
    setToken(t);
    setUser(u);
    fetchData(t);
  }, [navigate]);

  const fetchData = async (t) => {
    try {
      const subRes = await axios.get('http://localhost:5000/api/subscriptions/me', { headers: { Authorization: `Bearer ${t}` } });
      setSubscription(subRes.data);
    } catch (e) { console.log('No subscription yet'); }

    try {
      const scoreRes = await axios.get('http://localhost:5000/api/scores', { headers: { Authorization: `Bearer ${t}` } });
      setScores(scoreRes.data);
    } catch (e) { console.error('Failed to load scores'); }

    try {
      const charityRes = await axios.get('http://localhost:5000/api/charity');
      setCharities(charityRes.data);
    } catch (e) { console.error('Failed to load charities'); }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/subscriptions/subscribe', { plan, charityId }, { headers: { Authorization: `Bearer ${token}` } });
      fetchData(token);
    } catch (error) {
      alert(error.response?.data?.error || 'Subscription failed');
    }
  };

  const handleSubmitScore = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/scores', { courseName, date, score: Number(scoreVal) }, { headers: { Authorization: `Bearer ${token}` } });
      setCourseName(''); setDate(''); setScoreVal('');
      fetchData(token);
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit score');
    }
  };

  if (!user) return null;

  return (
    <div className="animate-fade-in" style={{ padding: '2rem 0' }}>
      <h2 className="mb-8">Welcome, <span className="text-gradient">{user.name}</span></h2>

      {/* Subscription Section */}
      <div className="glass-card mb-8">
        <h3>Subscription Status</h3>
        {subscription ? (
          <div className="mt-4">
            <p className="mb-2"><strong>Plan:</strong> <span style={{ textTransform: 'capitalize' }}>{subscription.plan}</span></p>
            <p className="mb-2"><strong>Status:</strong> <span style={{ color: subscription.status === 'active' ? 'var(--accent-primary)' : 'var(--warning)', fontWeight: 'bold' }}>{subscription.status.toUpperCase()}</span></p>
            <p className="mb-2"><strong>Expiry:</strong> {new Date(subscription.expiryDate).toLocaleDateString()}</p>
            {subscription.charityId && <p><strong>Supported Charity:</strong> {subscription.charityId.name}</p>}
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="mt-4" style={{ maxWidth: '400px' }}>
            <p className="mb-4" style={{ color: 'var(--warning)' }}>You do not have an active subscription. Subscribe to enter monthly draws!</p>
            <div className="input-group">
              <label className="input-label">Select Plan</label>
              <select className="input-field" value={plan} onChange={(e) => setPlan(e.target.value)}>
                <option value="monthly">Monthly ($20)</option>
                <option value="yearly">Yearly ($200)</option>
              </select>
            </div>
            <div className="input-group">
              <label className="input-label">Select Charity to Support (Optional)</label>
              <select className="input-field" value={charityId} onChange={(e) => setCharityId(e.target.value)}>
                <option value="">None</option>
                {charities.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            <button type="submit" className="btn btn-primary">Subscribe Now</button>
          </form>
        )}
      </div>

      <div className="flex gap-4" style={{ flexWrap: 'wrap' }}>
        {/* Score Submission */}
        <div className="glass-card animate-fade-in delay-100" style={{ flex: '1', minWidth: '300px' }}>
          <h3>Log a Score</h3>
          <form onSubmit={handleSubmitScore} className="mt-4">
            <div className="input-group">
              <label className="input-label">Course Name</label>
              <input type="text" className="input-field" value={courseName} onChange={e => setCourseName(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="input-label">Date</label>
              <input type="date" className="input-field" value={date} onChange={e => setDate(e.target.value)} required />
            </div>
            <div className="input-group">
              <label className="input-label">Stableford Score</label>
              <input type="number" className="input-field" min="0" max="54" value={scoreVal} onChange={e => setScoreVal(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary w-full">Submit Score</button>
          </form>
        </div>

        {/* Score History */}
        <div className="glass-card animate-fade-in delay-200" style={{ flex: '1', minWidth: '300px' }}>
          <h3>Your Recent Rounds</h3>
          <div className="mt-4" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {scores.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)' }}>No scores logged yet.</p>
            ) : (
              <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '0.5rem 0' }}>Date</th>
                    <th>Course</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {scores.map(s => (
                    <tr key={s._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '0.5rem 0' }}>{new Date(s.date).toLocaleDateString()}</td>
                      <td>{s.courseName}</td>
                      <td><strong style={{ color: 'var(--accent-primary)' }}>{s.score}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
