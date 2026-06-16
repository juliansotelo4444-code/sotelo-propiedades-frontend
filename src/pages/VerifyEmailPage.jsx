import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { authAPI } from '../services/apiServices'
import SoteloLogo from '../components/common/SoteloLogo'

export default function VerifyEmailPage() {
  const [params] = useSearchParams()
  const [status, setStatus] = useState('loading') // loading | success | error
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = params.get('token')
    if (!token) {
      setStatus('error')
      setMessage('No se encontró el token de verificación')
      return
    }

    authAPI.verifyEmail(token)
      .then(({ data }) => {
        setStatus('success')
        setMessage(data.message)
      })
      .catch((err) => {
        setStatus('error')
        setMessage(err.response?.data?.error || 'Error al verificar la cuenta')
      })
  }, [])

  return (
    <div className="verify-page">
      <div className="verify-card">
        <div className="verify-logo">
          <SoteloLogo size="md" />
        </div>

        <div className="verify-icon">
          {status === 'loading' && <span className="spinner" />}
          {status === 'success' && <span className="icon-success">✓</span>}
          {status === 'error' && <span className="icon-error">✕</span>}
        </div>

        <h2 className="verify-title">
          {status === 'loading' && 'Verificando tu cuenta...'}
          {status === 'success' && '¡Cuenta verificada!'}
          {status === 'error' && 'No pudimos verificar tu cuenta'}
        </h2>

        <p className="verify-message">{message}</p>

        {status !== 'loading' && (
          <Link to="/login" className="btn-primary">
            Ir a iniciar sesión
          </Link>
        )}
      </div>

      <style>{`
        .verify-page {
          min-height: 100vh; display: flex; align-items: center; justify-content: center;
          background: linear-gradient(135deg, #1a0000 0%, #1f2937 100%); padding: 16px;
        }
        .verify-card {
          background: #fff; border-radius: 16px; padding: clamp(32px, 6vw, 48px);
          width: 100%; max-width: 420px; text-align: center;
          box-shadow: 0 20px 60px rgba(0,0,0,.4);
        }
        .verify-logo { display: flex; justify-content: center; margin-bottom: 24px; }
        .verify-icon { margin-bottom: 16px; }
        .icon-success {
          display: inline-flex; align-items: center; justify-content: center;
          width: 56px; height: 56px; border-radius: 50%;
          background: #dcfce7; color: #16a34a; font-size: 1.75rem; font-weight: 700;
        }
        .icon-error {
          display: inline-flex; align-items: center; justify-content: center;
          width: 56px; height: 56px; border-radius: 50%;
          background: #fee2e2; color: #dc2626; font-size: 1.75rem; font-weight: 700;
        }
        .verify-title { font-size: 1.25rem; font-weight: 700; margin-bottom: 8px; }
        .verify-message { color: var(--gray-500); margin-bottom: 24px; font-size: .9375rem; }
      `}</style>
    </div>
  )
}
