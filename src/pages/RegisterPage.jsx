import { useState } from 'react'
import { Link } from 'react-router-dom'
import { authAPI } from '../services/apiServices'
import SoteloLogo from '../components/common/SoteloLogo'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(''); setSuccess('')

    // Validación simple antes de mandar al backend
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      const { data } = await authAPI.register(form)
      setSuccess(data.message)
      setForm({ name: '', email: '', password: '' })
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.msg ||
        'Error al registrarse'
      )
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
        <h2 className="auth-title">Crear cuenta</h2>
        <p className="auth-subtitle">Registrate para publicar tus propiedades</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {error && <div className="alert-error">{error}</div>}
          {success && <div className="alert-success">✓ {success}</div>}

          <div className="field">
            <label>Nombre completo</label>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Tu nombre" required />
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="tu@email.com" required />
          </div>
          <div className="field">
            <label>Contraseña</label>
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="Mínimo 6 caracteres" required />
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Registrando...' : 'Crear cuenta'}
          </button>

          <p className="auth-footer">
            ¿Ya tenés cuenta?{' '}
            <Link to="/login">Iniciá sesión</Link>
          </p>
        </form>
      </div>

      <style>{`
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
        .auth-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 4px; text-align: center; }
        .auth-subtitle { text-align: center; color: var(--gray-500); font-size: .9rem; margin-bottom: 24px; }
        .auth-form { display: flex; flex-direction: column; gap: 16px; }
        .btn-full { width: 100%; }
        .auth-footer { text-align: center; font-size: .9rem; color: var(--gray-600); }
        .auth-footer a { color: var(--red); font-weight: 600; }
        .auth-footer a:hover { text-decoration: underline; }
      `}</style>
    </div>
  )
}
