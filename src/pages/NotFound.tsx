import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center">
        <p className="text-8xl font-extrabold text-gradient-gold font-display">404</p>
        <h1 className="mt-4 text-2xl font-bold text-ink-800 font-display">Page not found</h1>
        <p className="mt-2 text-ink-500">The page you're looking for doesn't exist or has moved.</p>
        <Link to="/" className="btn-gold mt-6 inline-flex">Back to Home</Link>
      </div>
    </div>
  )
}
