import { useState, useMemo } from 'react'
import { MUSCLE_GROUPS } from '../data/muscuData'

export default function HistoryView({ cycles }) {
  const [tab, setTab] = useState('push')
  const TYPES = [
    { id: 'push', label: 'Push' },
    { id: 'pull', label: 'Pull' },
    { id: 'legs', label: 'Legs' },
    { id: 'pdb', label: 'PDB' },
  ]

  const doneSessions = useMemo(() => {
    return cycles
      .flatMap(c => c.weeks.flatMap(w => w.sessions.map(s => ({ ...s, cycleId: c.id, weekNum: w.number }))))
      .filter(s => s.status === 'done')
      .sort((a, b) => new Date(b.completedAt || 0) - new Date(a.completedAt || 0))
  }, [cycles])

  const sessionType = (s) => {
    const id = s.dayId || ''
    if (id.startsWith('j1')) return 'push'
    if (id.startsWith('j2')) return 'pull'
    if (id.startsWith('j3')) return 'legs'
    if (id.startsWith('j4')) return 'pdb'
    // Fallbacks
    if (s.title && /push/i.test(s.title)) return 'push'
    if (s.title && /pull/i.test(s.title)) return 'pull'
    if (s.title && /leg/i.test(s.title)) return 'legs'
    return 'pdb'
  }

  const grouped = useMemo(() => {
    const g = { push: [], pull: [], legs: [], pdb: [] }
    doneSessions.forEach(s => {
      const t = sessionType(s)
      g[t] = g[t] || []
      g[t].push(s)
    })
    return g
  }, [doneSessions])

  return (
    <div className="px-4 py-6 pb-8">
      <div className="mb-5">
        <p className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: '#3D4F63' }}>Historique</p>
        <h1 className="font-display text-4xl text-text-primary" style={{ letterSpacing: '-0.02em' }}>Anciennes séances</h1>
      </div>

      <div className="flex gap-1 p-1 rounded-2xl mb-5" style={{ background: 'rgba(255,255,255,0.02)' }}>
        {TYPES.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 py-2 rounded-xl font-body text-xs font-semibold transition-all"
            style={{ background: tab === t.id ? 'rgba(167,139,250,0.16)' : 'transparent', color: tab === t.id ? '#A78BFA' : '#7A8BA3' }}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {(!grouped[tab] || grouped[tab].length === 0) && (
          <div className="text-center py-12">
            <p className="font-body text-sm" style={{ color: '#3D4F63' }}>Aucune séance enregistrée pour ce type.</p>
          </div>
        )}

        {grouped[tab] && grouped[tab].map(sess => (
          <div key={sess.id} className="rounded-2xl overflow-hidden" style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="px-4 py-4 flex items-start justify-between">
              <div>
                <p className="font-body text-xs font-semibold" style={{ color: sess.color || '#A78BFA' }}>{sess.day}</p>
                <h3 className="font-display text-xl text-text-primary" style={{ marginTop: 4 }}>{sess.title}</h3>
                <p className="font-body text-xs" style={{ color: '#7A8BA3' }}>
                  {sess.completedAt ? new Date(sess.completedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }) : 'Date inconnue'}
                </p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
              {sess.exercises.map(ex => {
                const sets = ex.completedSets || []
                const best = sets.reduce((acc, s) => (s.weight > (acc.weight || 0) ? s : acc), {})
                return (
                  <div key={ex.exerciseId} className="px-4 py-3 border-b last:border-0" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-2 min-w-0">
                        <span className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: MUSCLE_GROUPS[ex.group] || '#888' }} />
                        <div className="min-w-0">
                          <p className="font-body text-sm font-semibold text-text-primary leading-tight">{ex.name}</p>
                          <p className="font-body text-xs mt-0.5" style={{ color: '#7A8BA3' }}>{ex.group}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-lg" style={{ color: '#A78BFA' }}>{best.weight ? `${best.weight}kg` : '—'}</p>
                        <p className="font-body text-xs" style={{ color: '#3D4F63' }}>{sets.length ? sets.map(s => `${s.weight}kg × ${s.reps}r`).join(', ') : 'Aucune donnée'}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
