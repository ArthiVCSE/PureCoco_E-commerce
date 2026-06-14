import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/common/Toast';
import { validateLoginForm } from '../utils/validators';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

const Login = () => {
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get('redirect') || null;
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateLoginForm(form);
    if (!validation.isValid) { setErrors(validation.errors); return; }
    setLoading(true);
    const result = await login(form);
    setLoading(false);
    if (result.success) {
      addToast('Welcome back!', 'success');
      if (redirect) {
        navigate(redirect);
      } else {
        navigate(result.user?.role === 'admin' ? '/admin' : '/dashboard');
      }
    } else {
      addToast(result.error, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 animate-fade-in font-sans bg-gradient-to-br from-cream via-cream-dark to-cream dark:from-coconut-dark dark:via-coconut dark:to-coconut-dark">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-natural flex items-center justify-center text-white font-display font-bold text-xl">
            P
          </div>
          <h1 className="font-display text-3xl font-bold text-body mb-2">Welcome Back</h1>
          <p className="text-muted font-sans">Sign in to your PureCoco account</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 card shadow-card space-y-4">
          <Input label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} icon={Mail} required />
          <div className="relative">
            <Input label="Password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} icon={Lock} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-coconut/50 hover:text-coconut dark:text-cream/50 dark:hover:text-cream" aria-label={showPassword ? 'Hide password' : 'Show password'}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Button type="submit" variant="secondary" className="w-full" size="lg" loading={loading}>Sign In</Button>
        </form>

        <p className="text-center text-sm mt-6 text-muted font-sans">
          Don't have an account? <Link to="/register" className="text-gold hover:underline font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
