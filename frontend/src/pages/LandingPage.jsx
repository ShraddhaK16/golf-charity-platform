import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Heart, CalendarDays } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="animate-fade-in text-center flex-col items-center justify-center pt-10">
      <h1 style={{ fontSize: '4rem', marginBottom: '1rem' }}>
        Play Golf. <span className="text-gradient">Make an Impact.</span>
      </h1>
      <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', marginBottom: '3rem' }}>
        A modern platform where your passion for golf meets the power of giving.
        Track scores, win monthly draws, and support charities—all with one subscription.
      </p>

      <div className="flex justify-center gap-4 mb-16">
        <Link to="/register" className="btn btn-primary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
          Start Your Journey <ArrowRight size={20} style={{ marginLeft: '10px' }} />
        </Link>
        <Link to="/login" className="btn btn-secondary" style={{ fontSize: '1.1rem', padding: '1rem 2rem' }}>
          Member Login
        </Link>
      </div>

      <div className="flex justify-center gap-6" style={{ flexWrap: 'wrap' }}>
        <div className="glass-card" style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Trophy size={48} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
          <h3>Track Performance</h3>
          <p className="mt-2 text-center" style={{ color: 'var(--text-secondary)' }}>Log your Stableford scores and watch your game improve.</p>
        </div>

        <div className="glass-card animate-fade-in delay-100" style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Heart size={48} color="var(--danger)" style={{ marginBottom: '1rem' }} />
          <h3>Support Charity</h3>
          <p className="mt-2 text-center" style={{ color: 'var(--text-secondary)' }}>A portion of your subscription goes directly to your selected cause.</p>
        </div>

        <div className="glass-card animate-fade-in delay-200" style={{ flex: '1', minWidth: '250px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <CalendarDays size={48} color="var(--warning)" style={{ marginBottom: '1rem' }} />
          <h3>Monthly Draws</h3>
          <p className="mt-2 text-center" style={{ color: 'var(--text-secondary)' }}>Active subscribers are automatically entered to win premium prizes.</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
