import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  Lock, 
  Mail, 
  AlertCircle,
  Loader2,
  Check
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (officerName: string, role: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('r.swaminathan@aicte-india.org');
  const [password, setPassword] = useState('Setu#Compliance2026');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  if (!isOpen && !isClosing) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email.trim()) {
      setErrorMessage('Please enter your Institutional ID or AICTE official email.');
      return;
    }
    if (!password || password.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      if (email.includes('sunita')) {
        onLoginSuccess('Er. Sunita Deshmukh', 'Scrutiny Officer (RO Chennai)');
      } else {
        onLoginSuccess('Dr. Ramanathan S.', 'Senior Scrutiny Officer (RO Mumbai)');
      }
    }, 600);
  };

  const handleQuickFill = (role: 'senior' | 'regional') => {
    if (role === 'senior') {
      setEmail('r.swaminathan@aicte-india.org');
      setPassword('Setu#Compliance2026');
    } else {
      setEmail('s.deshmukh@aicte-india.org');
      setPassword('ChennaiRO#2026');
    }
    setErrorMessage('');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="login-title"
    >
      {/* Semi-translucent dark blue backdrop allowing landing page to show through */}
      <div 
        onClick={handleClose}
        className="fixed inset-0 bg-[#0E1A2B]/60 backdrop-blur-xs transition-opacity duration-400"
      />

      {/* Login sheet sliding up smoothly from bottom */}
      <div 
        className={`relative w-full max-w-md bg-[#1C2E46]/92 backdrop-blur-md border border-[#F6F0D5]/25 rounded-3xl p-7 sm:p-9 shadow-[0_20px_50px_rgba(0,0,0,0.4)] z-10 text-[#F6F0D5] ${
          isClosing ? 'animate-slide-down' : 'animate-slide-up'
        }`}
      >
        {/* Top return link & Wordmark */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={handleClose}
            className="inline-flex items-center gap-1.5 text-xs text-[#D9CEAA]/80 hover:text-[#F6F0D5] transition-colors py-1 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to overview</span>
          </button>

          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#F6F0D5] text-[#16253B] flex items-center justify-center shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <span className="font-semibold text-xs tracking-wider uppercase text-[#F6F0D5]">Fraud Caught</span>
          </div>
        </div>

        {/* Headings */}
        <div className="mb-6">
          <h2 id="login-title" className="text-2xl sm:text-3xl font-serif-editorial text-[#F6F0D5] tracking-tight mb-2">
            Welcome back
          </h2>
          <p className="text-xs sm:text-sm text-[#D9CEAA]/80 leading-relaxed">
            Sign in with your AICTE official ID or registered nodal officer email.
          </p>
        </div>

        {/* Quick Demo Role Switcher */}
        <div className="mb-6 p-2.5 rounded-xl bg-[#16253B]/70 border border-[#F6F0D5]/15 flex items-center justify-between gap-2 text-xs">
          <span className="text-[11px] font-medium text-[#D9CEAA]/80 shrink-0">Demo roles:</span>
          <div className="flex gap-1.5">
            <button
              type="button"
              onClick={() => handleQuickFill('senior')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                email.includes('r.swaminathan')
                  ? 'bg-[#F6F0D5] text-[#16253B] font-semibold'
                  : 'bg-[#22364F] text-[#F6F0D5] hover:bg-[#2A415E]'
              }`}
            >
              Sr. Scrutiny Officer
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('regional')}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors cursor-pointer ${
                email.includes('s.deshmukh')
                  ? 'bg-[#F6F0D5] text-[#16253B] font-semibold'
                  : 'bg-[#22364F] text-[#F6F0D5] hover:bg-[#2A415E]'
              }`}
            >
              Regional Officer
            </button>
          </div>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-5 p-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-[#F6F0D5] text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-amber-300" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#F6F0D5] mb-1.5">
              Official Email / Institutional ID
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#D9CEAA]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="officer.id@aicte-india.org"
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm bg-[#16253B]/80 border border-[#F6F0D5]/20 rounded-xl text-[#F6F0D5] placeholder-[#D9CEAA]/40 focus:outline-none focus:border-[#F6F0D5] focus:ring-1 focus:ring-[#F6F0D5] transition-all"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#F6F0D5] mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#D9CEAA]/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-[#16253B]/80 border border-[#F6F0D5]/20 rounded-xl text-[#F6F0D5] placeholder-[#D9CEAA]/40 focus:outline-none focus:border-[#F6F0D5] focus:ring-1 focus:ring-[#F6F0D5] transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#D9CEAA]/70 hover:text-[#F6F0D5] transition-colors cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & forgot password */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-[#D9CEAA]/80 hover:text-[#F6F0D5]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#F6F0D5]/30 bg-[#16253B] text-[#F6F0D5] focus:ring-0 w-3.5 h-3.5 accent-[#F6F0D5]"
              />
              <span>Remember this session</span>
            </label>
            <a 
              href="#forgot-password" 
              onClick={(e) => { e.preventDefault(); alert('Demo credentials pre-filled via buttons above.'); }}
              className="text-[#D9CEAA]/70 hover:text-[#F6F0D5] hover:underline"
            >
              Forgot password?
            </a>
          </div>

          {/* Submit Button in Yellow */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#F6F0D5] hover:bg-white text-[#16253B] rounded-xl font-semibold text-sm transition-all shadow-[0_4px_16px_rgba(0,0,0,0.25)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#16253B]" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign in to Scrutiny Console</span>
                  <Check className="w-4 h-4 text-[#16253B]" />
                </>
              )}
            </button>
          </div>
        </form>

        {/* Security badge at bottom */}
        <div className="mt-7 pt-4 border-t border-[#F6F0D5]/15 text-center">
          <p className="text-[11px] text-[#D9CEAA]/70">
            Secured institutional gateway • NIC VPN authorized session
          </p>
        </div>
      </div>
    </div>
  );
};
