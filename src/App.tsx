import { lazy, Suspense, useEffect, useState } from 'react'
import Frontend from './Layer/Frontend'

// El panel admin (editores + Firebase Auth) va en un chunk aparte
const Backend = lazy(() => import('./Layer/Backend'))

function App() {
  const [view, setView] = useState<'landing' | 'backend'>('landing')

  useEffect(() => {
    // Scroll to top on view change
    window.scrollTo(0, 0);
  }, [view]);

  if (view === 'backend') {
    return (
      <Suspense fallback={<div className="min-h-screen bg-background" />}>
        <Backend onBack={() => setView('landing')} />
      </Suspense>
    )
  }

  return <Frontend onEnterBackend={() => setView('backend')} />
}

export default App
