import { useEffect, useState } from 'react'
import {
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from 'firebase/auth'
import { auth, firebaseAuthReady } from '../firebase'

const googleProvider = new GoogleAuthProvider()
const githubProvider = new GithubAuthProvider()

function OAuthTwoFactorCard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(firebaseAuthReady)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState(null)
  const [twoFactorCode, setTwoFactorCode] = useState('')

  useEffect(() => {
    if (!auth) {
      setLoading(false)
      return undefined
    }
    return onAuthStateChanged(auth, (nextUser) => {
      setUser(nextUser)
      setLoading(false)
    })
  }, [])

  const handleGoogle = async () => {
    if (!auth) return
    setBusy(true)
    setError(null)
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Google sign-in failed.')
    } finally {
      setBusy(false)
    }
  }

  const handleGitHub = async () => {
    if (!auth) return
    setBusy(true)
    setError(null)
    try {
      await signInWithPopup(auth, githubProvider)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GitHub sign-in failed.')
    } finally {
      setBusy(false)
    }
  }

  const handleSignOut = async () => {
    if (!auth) return
    setBusy(true)
    setError(null)
    try {
      await signOut(auth)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign out failed.')
    } finally {
      setBusy(false)
    }
  }

  if (!firebaseAuthReady) {
    return (
      <div className="oauth-card">
        <h3 className="oauth-card__title">Secure Login</h3>
        <p className="oauth-card__hint">
          Firebase is not configured yet. In this folder, copy{' '}
          <code>.env.example</code> to <code>.env</code> and add your web app
          keys from the Firebase console. Then restart <code>npm run dev</code>{' '}
          or rebuild before deploy.
        </p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="oauth-card">
        <h3 className="oauth-card__title">Secure Login</h3>
        <p className="oauth-card__hint">Checking sign-in status…</p>
      </div>
    )
  }

  return (
    <div className="oauth-card">
      <h3 className="oauth-card__title">Secure Login</h3>

      {user ? (
        <div className="oauth-card__signed-in">
          <p className="oauth-card__hint">
            Signed in as <strong>{user.email || user.displayName || user.uid}</strong>
          </p>
          <button
            type="button"
            className="oauth-button"
            onClick={handleSignOut}
            disabled={busy}
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="oauth-card__buttons">
          <button
            type="button"
            className="oauth-button"
            onClick={handleGoogle}
            disabled={busy}
          >
            Login with Google
          </button>
          <button
            type="button"
            className="oauth-button"
            onClick={handleGitHub}
            disabled={busy}
          >
            Login with GitHub
          </button>
        </div>
      )}

      {error ? <p className="oauth-card__error">{error}</p> : null}

      <label className="oauth-card__label" htmlFor="two-factor-code">
        Enter 2FA Code
      </label>
      <input
        id="two-factor-code"
        type="text"
        className="oauth-card__input"
        placeholder="Enter your 2FA code"
        value={twoFactorCode}
        onChange={(e) => setTwoFactorCode(e.target.value)}
        autoComplete="one-time-code"
        inputMode="numeric"
        disabled={!user}
      />
      <p className="oauth-card__hint oauth-card__hint--small">
        {user
          ? 'Demo UI: full TOTP/SMS MFA can be added with Firebase multi-factor auth in production. Google/GitHub may already prompt for their own 2-step verification on your account.'
          : 'Sign in first. This field matches the Project 3 wireframe; wire it to Firebase MFA when required.'}
      </p>
    </div>
  )
}

export default OAuthTwoFactorCard
