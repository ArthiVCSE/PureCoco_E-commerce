import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/common/Toast';
import { validateRegisterForm } from '../utils/validators';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { APP_NAME } from '../utils/constants';

const Register = () => {
  const { register } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validation = validateRegisterForm(form);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setLoading(true);
    const result = await register(form);
    setLoading(false);
    if (result.success) {
      addToast('Account created successfully!', 'success');
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 pt-20 pb-12 animate-fade-in font-sans bg-gradient-to-br from-cream via-cream-dark to-cream dark:from-coconut-dark dark:via-coconut dark:to-coconut-dark">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gradient-to-br from-gold to-natural flex items-center justify-center text-white font-display font-bold text-xl">
            P
          </div>
          <h1 className="font-display text-3xl font-bold text-body mb-2">Join {APP_NAME}</h1>
          <p className="text-muted font-sans">Create your account and start your pure journey</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 card shadow-card space-y-4">
          <Input label="Full Name" name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} icon={User} required />
          <Input label="Email" name="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} icon={Mail} required autoComplete="email" />
          <div className="relative">
            <Input label="Password" name="password" type={showPassword ? 'text' : 'password'} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} error={errors.password} icon={Lock} required autoComplete="new-password" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-[38px] text-coconut/50 hover:text-coconut dark:text-cream/50 dark:hover:text-cream">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <Input label="Confirm Password" name="confirmPassword" type={showPassword ? 'text' : 'password'} value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} error={errors.confirmPassword} icon={Lock} required autoComplete="new-password" />
          <Button type="submit" variant="secondary" className="w-full" size="lg" loading={loading}>Create Account</Button>
        </form>

        <p className="text-center text-sm mt-6 text-muted font-sans">
          Already have an account? <Link to="/login" className="text-gold hover:underline font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
