import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../services/apiServices'
import SoteloLogo from '../components/common/SoteloLogo'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { data } = await authAPI.login(form)
      login(data.token, data.user)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Error al ingresar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <SoteloLogo size="md" />
        </div>
        <h2 className="auth-title">Ingresar a tu cuenta</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert-error">{error}</div>}

          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange}
              placeholder="tu@email.com" required />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" name="password" value={form.password} onChange={handleChange}
              placeholder="••••••" required />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>

          <p className="auth-footer">
            ¿No tenés cuenta?{' '}
            <Link to="/registro">Registrate gratis</Link>
          </p>
        </form>
      </div>
      <AuthStyles />
    </div>
  )
}

function AuthStyles() {
  return <style>{`
    .auth-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(135deg, #1a0000 0%, #1f2937 100%); padding: 16px;
    }
    .auth-card {
      background: #fff; border-radius: 16px; padding: clamp(28px, 5vw, 44px);
      width: 100%; max-width: 420px;
      box-shadow: 0 20px 60px rgba(0,0,0,.4);
    }
    .auth-logo { display: flex; justify-content: center; margin-bottom: 28px; }
    .auth-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 24px; text-align: center; }
    .auth-form { display: flex; flex-direction: column; gap: 16px; }
    .btn-full { width: 100%; }
    .auth-footer { text-align: center; font-size: .9rem; color: var(--gray-600); }
    .auth-footer a { color: var(--red); font-weight: 600; }
    .auth-footer a:hover { text-decoration: underline; }
  `}</style>
}
