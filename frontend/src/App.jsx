import { useEffect, useMemo, useState } from 'react';
import UploadForm from './components/UploadForm';
import ScoreCard from './components/ScoreCard';
import KeywordsList from './components/KeywordsList';
import BulletsList from './components/BulletsList';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

function AuthScreen() {
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const submitAuth = async (event) => {
    event.preventDefault();
    if (!supabase) {
      setMessage('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: displayName,
            },
          },
        });
        if (error) throw error;
        setMessage('Check your email to confirm your account, if confirmation is enabled.');
      }
    } catch (error) {
      setMessage(error.message || 'Authentication failed.');
    } finally {
      setLoading(false);
    }
  };

  const sendReset = async () => {
    if (!supabase) {
      setMessage('Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
      return;
    }

    if (!email) {
      setMessage('Enter your email first to receive a reset link.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/`,
      });
      if (error) throw error;
      setMessage('Password reset link sent. Check your email.');
    } catch (error) {
      setMessage(error.message || 'Unable to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),_transparent_36%),linear-gradient(135deg,_#4b5563,_#111827_58%,_#0f172a)] flex items-center justify-center p-4 text-gray-100">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-gray-900/75 p-8 shadow-[0_25px_80px_rgba(0,0,0,0.45)] backdrop-blur-xl">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-gray-400">ResuMate AI</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h1>
          <p className="mt-2 text-sm text-gray-400">
            {mode === 'signin' ? 'Sign in to analyze resumes and job descriptions.' : 'Sign up to save your session and keep using the analyzer.'}
          </p>
        </div>

        <form onSubmit={submitAuth} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="mb-2 block text-sm text-gray-300">Name</label>
              <input
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-gray-800/80 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-gray-400"
                placeholder="Your name"
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm text-gray-300">Email</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              type="email"
              className="w-full rounded-xl border border-white/10 bg-gray-800/80 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-gray-400"
              placeholder="name@example.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-gray-300">Password</label>
            <input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
              className="w-full rounded-xl border border-white/10 bg-gray-800/80 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-gray-400"
              placeholder="••••••••"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-gray-600 to-gray-500 px-4 py-3 font-semibold text-white transition hover:from-gray-500 hover:to-gray-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Working...' : mode === 'signin' ? 'Sign in' : 'Sign up'}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            className="text-gray-300 transition hover:text-white"
          >
            {mode === 'signin' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
          </button>

          <button type="button" onClick={sendReset} className="text-gray-300 transition hover:text-white">
            Forgot password?
          </button>
        </div>

        {message && <p className="mt-4 text-sm text-gray-300">{message}</p>}
      </div>
    </div>
  );
}

function AppShell({ session, profileName, setProfileName, onSignOut, onSaveName, loading, result, error, handleAnalyze }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const email = session?.user?.email || '';
  const initial = useMemo(() => (profileName || email || 'U').slice(0, 1).toUpperCase(), [profileName, email]);

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.08),_transparent_32%),linear-gradient(135deg,_#6b7280,_#111827_60%,_#0f172a)] p-4 text-gray-100">
      <div className="fixed left-4 top-4 z-20">
        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((value) => !value)}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-gray-900/75 px-3 py-2 text-left shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:bg-gray-900/90"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-sm font-bold text-gray-900">
              {initial}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">{profileName || 'Set your name'}</p>
              <p className="text-xs text-gray-400">{email}</p>
            </div>
          </button>

          {profileOpen && (
            <div className="absolute left-0 mt-3 w-64 rounded-2xl border border-white/10 bg-gray-900 p-3 shadow-2xl">
              <label className="mb-2 block text-xs uppercase tracking-[0.2em] text-gray-400">Display name</label>
              <input
                value={profileName}
                onChange={(event) => setProfileName(event.target.value)}
                className="w-full rounded-xl border border-white/10 bg-gray-800/90 px-3 py-2 text-sm text-white outline-none focus:border-gray-400"
                placeholder="Your name"
              />
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onSaveName}
                  className="rounded-xl bg-gray-700 px-3 py-2 text-sm font-medium text-white transition hover:bg-gray-600"
                >
                  Save name
                </button>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="rounded-xl border border-white/10 px-3 py-2 text-sm font-medium text-gray-200 transition hover:bg-white/10"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex min-h-[calc(100vh-2rem)] items-center justify-center">
        <div className="mx-auto w-full max-w-5xl rounded-[2rem] border border-white/10 bg-gray-900/70 p-6 shadow-[0_30px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl md:p-8">
          <div className="mb-8 text-center">
            <p className="text-xs uppercase tracking-[0.3em] text-gray-400">ResuMate AI</p>
            <h1 className="mt-2 text-3xl font-semibold text-white md:text-4xl">Resume analysis, simplified</h1>
            <p className="mt-2 text-sm text-gray-400">Upload a resume and job description to get an ATS-style breakdown.</p>
          </div>

          <UploadForm onAnalyze={handleAnalyze} loading={loading} />

          {error && (
            <div className="mt-6 rounded-xl border border-red-400/40 bg-red-950/40 p-4 text-red-100">
              {error}
            </div>
          )}

          {result && (
            <div className="mt-8 space-y-6">
              <ScoreCard scoreText={result.ats_score} />
              <KeywordsList keywordsText={result.missing_keywords} />
              <BulletsList bulletsText={result.improved_bullets} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [profileName, setProfileName] = useState('');
  const [authReady, setAuthReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!supabase) {
      setAuthReady(true);
      return undefined;
    }

    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) {
        return;
      }

      setSession(data.session || null);
      setProfileName(data.session?.user?.user_metadata?.full_name || '');
      setAuthReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setProfileName(nextSession?.user?.user_metadata?.full_name || '');
      setResult(null);
      setError('');
      setAuthReady(true);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  const handleAnalyze = async (resumeFile, jdFile) => {
    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('resume', resumeFile);
    formData.append('job_description', jdFile);
    try {
      const { data } = await axios.post('/analyze', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
  };

  const handleSaveName = async () => {
    if (!supabase || !session?.user) {
      return;
    }

    const { error: updateError } = await supabase.auth.updateUser({
      data: { full_name: profileName },
    });

    if (updateError) {
      setError(updateError.message || 'Unable to update name.');
      return;
    }

    setError('');
  };

  if (!authReady) {
    return <div className="min-h-screen bg-gray-950" />;
  }

  if (!supabase || !session) {
    return <AuthScreen />;
  }

  return (
    <AppShell
      session={session}
      profileName={profileName}
      setProfileName={setProfileName}
      onSignOut={handleSignOut}
      onSaveName={handleSaveName}
      loading={loading}
      result={result}
      error={error}
      handleAnalyze={handleAnalyze}
    />
  );
}

export default App;