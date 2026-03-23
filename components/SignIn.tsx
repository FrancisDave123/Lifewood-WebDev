import React, { useEffect, useRef, useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import type { PageRoute } from '../routes/routeTypes';
import { ADMIN_PROFILE_STORAGE_KEY, DEFAULT_ADMIN_PROFILE } from './adminProfile';
import { authService } from '../services/authService';

interface SignInProps {
  navigateTo?: (page: PageRoute) => void;
  initialAuthMode?: 'signin' | 'forgot';
  onAuthSuccess?: (payload: { email: string; roleId: number | null; roleName: string | null }) => void;
}

export const SignIn: React.FC<SignInProps> = ({ navigateTo, initialAuthMode = 'signin', onAuthSuccess }) => {
  const AUTH_LOGO_URL = 'https://framerusercontent.com/images/BZSiFYgRc4wDUAuEybhJbZsIBQY.png?width=1519&height=429';

  const videoRef = useRef<HTMLVideoElement>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'forgot'>(initialAuthMode);
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const syncAdminRole = (roleName?: string | null) => {
    if (!roleName) return;
    try {
      const raw = localStorage.getItem(ADMIN_PROFILE_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
      const nextProfile = {
        ...DEFAULT_ADMIN_PROFILE,
        ...parsed,
        role: roleName
      };
      localStorage.setItem(ADMIN_PROFILE_STORAGE_KEY, JSON.stringify(nextProfile));
    } catch {}
  };

  const resolveDestination = (roleId: number | null, roleName: string | null): PageRoute => {
    if (roleId === 1) return 'admin-dashboard';
    const label = (roleName || '').toLowerCase();
    if (label.includes('intern')) return 'intern-dashboard';
    if (label.includes('employee')) return 'employee-dashboard';
    if (label.includes('applicant')) return 'applicant-dashboard';
    return 'home';
  };

  useEffect(() => {
    setAuthMode(initialAuthMode);
  }, [initialAuthMode]);

  const isForgot = authMode === 'forgot';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (authMode !== 'signin') {
      setAuthError('Password reset is not available yet.');
      return;
    }

    const normalizedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!normalizedEmail || !trimmedPassword) {
      setAuthError('Email and password are required.');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setAuthError('Enter a valid email address.');
      return;
    }

    setAuthError('');
    setIsSubmitting(true);

    try {
    const user = await authService.login(normalizedEmail, trimmedPassword);
    syncAdminRole(user.role_name);
    onAuthSuccess?.({ email: user.email, roleId: user.role_id, roleName: user.role_name });
    // ✅ navigation is now handled by the parent via onAuthSuccess
  } catch (error) {
      if (error instanceof Error) {
        setAuthError(error.message);
      } else {
        setAuthError('Unable to sign in right now. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSeamlessLoop = () => {
    const video = videoRef.current;
    if (!video || !video.duration) return;

    // Restart a few milliseconds before the true end to avoid visible end-frame stalls.
    if (video.currentTime >= video.duration - 0.06) {
      video.currentTime = 0.01;
      void video.play();
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-lifewood-seaSalt">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        disablePictureInPicture
        onTimeUpdate={handleSeamlessLoop}
        onEnded={() => {
          const video = videoRef.current;
          if (!video) return;
          video.currentTime = 0.01;
          void video.play();
        }}
        className="absolute inset-0 h-full w-full object-cover opacity-70"
      >
        <source src="https://www.pexels.com/download/video/34645742/" type="video/mp4" />
      </video>

      {/* Subtle Overlay for readability */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

      {/* Content Container */}
      <div className="relative z-10 flex min-h-screen items-center justify-center p-4 animate-pop-out opacity-0">
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-10">
          {/* Left Side - Form */}
          <div className="flex flex-col justify-center animate-pop-out opacity-0" style={{ animationDelay: '80ms' }}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${authMode}-view`}
                initial={{ opacity: 0, rotateY: -9, scale: 0.985, y: 8 }}
                animate={{ opacity: 1, rotateY: 0, scale: 1, y: 0 }}
                exit={{ opacity: 0, rotateY: 9, scale: 0.985, y: -8 }}
                transition={{ duration: 0.42, ease: [0.22, 0.61, 0.36, 1] }}
                style={{ transformPerspective: 1000 }}
              >
                <div className="mb-8">
                  <button
                    onClick={() => navigateTo?.('home')}
                    className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-lifewood-serpent/70 transition hover:text-lifewood-serpent"
                    aria-label="Go back to home page"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                  </button>

                  <button
                    onClick={() => navigateTo?.('home')}
                    className="mb-6 flex items-center gap-2 transition hover:opacity-80"
                  >
                    <img
                      src={AUTH_LOGO_URL}
                      alt="Lifewood"
                      className="h-7 w-auto object-contain"
                    />
                  </button>

                  <h1 className="mb-2 font-heading text-4xl font-black text-lifewood-serpent">
                    {isForgot ? 'Forgot Password' : 'Sign In'}
                  </h1>
                  <p className="text-base text-lifewood-serpent/60">
                    {isForgot
                      ? 'Enter your email and we will send a password reset link.'
                      : 'Access your AI data solutions.'}
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email Input */}
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-lifewood-serpent">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lifewood-serpent/40" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (authError) setAuthError('');
                        }}
                        placeholder="you@company.com"
                        className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/60 py-2 pl-10 pr-4 text-sm text-lifewood-serpent placeholder-lifewood-serpent/40 transition focus:border-lifewood-green/60 focus:outline-none focus:ring-2 focus:ring-lifewood-green/20"
                        required
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  {!isForgot && (
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-lifewood-serpent">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-lifewood-serpent/40" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (authError) setAuthError('');
                          }}
                          placeholder="********"
                          className="w-full rounded-lg border border-lifewood-serpent/20 bg-white/60 py-2 pl-10 pr-10 text-sm text-lifewood-serpent placeholder-lifewood-serpent/40 transition focus:border-lifewood-green/60 focus:outline-none focus:ring-2 focus:ring-lifewood-green/20"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-lifewood-serpent/40 transition hover:text-lifewood-serpent/60"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Remember & Forgot Password */}
                  {authMode === 'signin' && (
                    <div className="flex items-center justify-between text-xs">
                      <label className="flex cursor-pointer items-center gap-2">
                        <input type="checkbox" className="h-3 w-3 rounded border border-lifewood-serpent/20 bg-white/40 accent-lifewood-green" />
                        <span className="text-lifewood-serpent/60">Remember me</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          if (authError) setAuthError('');
                          if (navigateTo) {
                            navigateTo('forgot-password');
                          } else {
                            setAuthMode('forgot');
                          }
                        }}
                        className="text-lifewood-green transition hover:text-lifewood-green/80"
                      >
                        Forgot?
                      </button>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`mt-5 w-full rounded-lg py-2 text-sm font-bold text-white transition-all active:scale-95 ${isSubmitting ? 'cursor-not-allowed bg-lifewood-green/60' : 'bg-lifewood-green hover:bg-lifewood-green/90'}`}
                  >
                    {isForgot ? 'Send Reset Link' : isSubmitting ? 'Signing In...' : 'Sign In'}
                  </button>

                  {authMode === 'signin' && authError && (
                    <p className="rounded-lg border border-red-400/30 bg-red-500/10 px-3 py-2 text-xs font-medium text-red-700">
                      {authError}
                    </p>
                  )}
                </form>

                {/* Toggle Sign In / Sign Up */}
                <div className="mt-5 text-center">
                  {isForgot ? (
                    <p className="text-xs text-lifewood-serpent/60">
                      Remember your password?{' '}
                      <button
                        type="button"
                        onClick={() => {
                          if (authError) setAuthError('');
                          if (navigateTo) {
                            navigateTo('signin');
                          } else {
                            setAuthMode('signin');
                          }
                        }}
                        className="font-semibold text-lifewood-green transition hover:text-lifewood-green/80"
                      >
                        Sign In
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs text-lifewood-serpent/60">
                      {"Don't have an account?"}{' '}
                      <button
                        type="button"
                        onClick={() => {
                          if (authError) setAuthError('');
                          navigateTo?.('join-us');
                        }}
                        className="font-semibold text-lifewood-green transition hover:text-lifewood-green/80"
                      >
                        Join Us
                      </button>
                    </p>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right Side - Lifewood Details */}
          <div className="hidden flex-col justify-between animate-pop-out opacity-0 lg:flex" style={{ animationDelay: '160ms' }}>
            <div className="space-y-3">
              {/* Feature 1 */}
              <div className="rounded-xl border border-white/30 bg-white/40 p-4 backdrop-blur-md transition hover:bg-white/50">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-lifewood-green to-lifewood-green/50">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="mb-1 font-heading text-lg font-bold text-lifewood-serpent">Global AI Data</h3>
                <p className="text-xs text-lifewood-serpent/60">Access comprehensive AI-ready datasets with precision and scale.</p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-xl border border-white/30 bg-white/40 p-4 backdrop-blur-md transition hover:bg-white/50">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-lifewood-yellow to-lifewood-yellow/50">
                  <svg className="h-5 w-5 text-lifewood-serpent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                </div>
                <h3 className="mb-1 font-heading text-lg font-bold text-lifewood-serpent">Secure & Compliant</h3>
                <p className="text-xs text-lifewood-serpent/60">Enterprise-grade security across 40+ delivery centers.</p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-xl border border-white/30 bg-white/40 p-4 backdrop-blur-md transition hover:bg-white/50">
                <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-lifewood-saffron to-lifewood-saffron/50">
                  <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="mb-1 font-heading text-lg font-bold text-lifewood-serpent">40+ Countries</h3>
                <p className="text-xs text-lifewood-serpent/60">Global specialists across 30+ countries for unmatched quality.</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/30 bg-white/40 p-4 text-center backdrop-blur-md">
                <div className="mb-1 text-2xl font-black text-lifewood-green">56K+</div>
                <p className="text-xs text-lifewood-serpent/60">Contributors</p>
              </div>
              <div className="rounded-lg border border-white/30 bg-white/40 p-4 text-center backdrop-blur-md">
                <div className="mb-1 text-2xl font-black text-lifewood-yellow">50+</div>
                <p className="text-xs text-lifewood-serpent/60">Languages</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
