import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import BASE_URL from "../api";
import axios from 'axios';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("Registering...");

      const res = await axios.post(`${BASE_URL}/api/auth/register`, {
        name,
        email,
        password
      });

      console.log("Register success:", res.data);

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      navigate('/dashboard');

    } catch (err) {
      console.log("Register error:", err.response);
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-8">Create Account</h2>

        {error && (
          <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              className="input-field"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email</label>
            <input
              className="input-field"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              className="input-field"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full mt-4">
            Sign Up
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;



// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import BASE_URL from "../api";
// import axios from 'axios';

// const Register = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post(`${BASE_URL}/api/auth/register`, { name, email, password });
//       localStorage.setItem('token', res.data.token);
//       localStorage.setItem('user', JSON.stringify(res.data.user));
//       navigate('/dashboard');
//     } catch (err) {
//       setError(err.response?.data?.error || 'Registration failed');
//     }
//   };

//   return (
//     <div className="flex justify-center items-center" style={{ minHeight: '60vh' }}>
//       <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '400px' }}>
//         <h2 className="text-center mb-8">Create Account</h2>
//         {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

//         <form onSubmit={handleSubmit}>
//           <div className="input-group">
//             <label className="input-label" htmlFor="name">Full Name</label>
//             <input
//               className="input-field"
//               type="text"
//               id="name"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>

//           <div className="input-group">
//             <label className="input-label" htmlFor="email">Email address</label>
//             <input
//               className="input-field"
//               type="email"
//               id="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="input-group">
//             <label className="input-label" htmlFor="password">Password</label>
//             <input
//               className="input-field"
//               type="password"
//               id="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//               minLength="6"
//             />
//           </div>

//           <button type="submit" className="btn btn-primary w-full mt-4">Sign Up</button>
//         </form>
//         <p className="text-center mt-4">
//           <span style={{ color: 'var(--text-secondary)' }}>Already have an account? </span>
//           <Link to="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none' }}>Login</Link>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Register;
