import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BASE_URL from "../api";
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

  // Subscription Form
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
      // ✅ FIXED: correct route
      const subRes = await axios.get(`${BASE_URL}/api/subscriptions/me`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      setSubscription(subRes.data);
    } catch (e) {
      console.log('No subscription yet');
    }

    try {
      const scoreRes = await axios.get(`${BASE_URL}/api/scores`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      setScores(scoreRes.data);
    } catch (e) {
      console.error('Failed to load scores');
    }

    try {
      const charityRes = await axios.get(`${BASE_URL}/api/charity`);
      setCharities(charityRes.data);
    } catch (e) {
      console.error('Failed to load charities');
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    try {
      // ✅ FIXED: correct route
      await axios.post(
        `${BASE_URL}/api/subscriptions/subscribe`,
        { plan, charityId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      fetchData(token);

    } catch (error) {
      console.log(error.response);
      alert(error.response?.data?.error || 'Subscription failed');
    }
  };

  const handleSubmitScore = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${BASE_URL}/api/scores`,
        { courseName, date, score: Number(scoreVal) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setCourseName('');
      setDate('');
      setScoreVal('');

      fetchData(token);

    } catch (error) {
      alert(error.response?.data?.error || 'Failed to submit score');
    }
  };

  if (!user) return null;

  return (
    <div style={{ padding: '2rem 0' }}>
      <h2>Welcome, {user.name}</h2>

      {/* Subscription */}
      <div>
        <h3>Subscription</h3>

        {subscription ? (
          <div>
            <p><strong>Plan:</strong> {subscription.plan}</p>
            <p><strong>Status:</strong> {subscription.status}</p>
            <p><strong>Expiry:</strong> {new Date(subscription.expiryDate).toLocaleDateString()}</p>
            {subscription.charityId && (
              <p><strong>Charity:</strong> {subscription.charityId.name}</p>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubscribe}>
            <select value={plan} onChange={(e) => setPlan(e.target.value)}>
              <option value="monthly">Monthly ($20)</option>
              <option value="yearly">Yearly ($200)</option>
            </select>

            <select value={charityId} onChange={(e) => setCharityId(e.target.value)}>
              <option value="">None</option>
              {charities.map(c => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>

            <button type="submit">Subscribe</button>
          </form>
        )}
      </div>

      {/* Add Score */}
      <div>
        <h3>Add Score</h3>

        <form onSubmit={handleSubmitScore}>
          <input
            type="text"
            placeholder="Course Name"
            value={courseName}
            onChange={e => setCourseName(e.target.value)}
            required
          />

          <input
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            required
          />

          <input
            type="number"
            placeholder="Score"
            value={scoreVal}
            onChange={e => setScoreVal(e.target.value)}
            required
          />

          <button type="submit">Submit</button>
        </form>
      </div>

      {/* Scores */}
      <div>
        <h3>Your Scores</h3>

        {scores.length === 0 ? (
          <p>No scores yet</p>
        ) : (
          scores.map(s => (
            <div key={s._id}>
              {s.courseName} - {s.score} ({new Date(s.date).toLocaleDateString()})
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;