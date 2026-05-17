import { useState } from 'react'
import { Settings, RotateCcw, Download, Upload, ChevronDown, ChevronUp, Zap, Weight } from 'lucide-react'
import { BASE_PROGRAM, MUSCLE_GROUPS, getDefaultWeights } from '../data/muscuData'

// ─── Progression algorithm explainer ─────────────────────────────────────
function AlgoExplainer() {
  return (
    <div className="rounded-2xl overflow-hidden mb-4"
      style={{ background: '#0D1117', border: '1px solid rgba(167,139,250,0.2)' }}>
      <div className="px-4 py-3 flex items-center gap-2 border-b" style={{ borderColor: 'rgba(167,139,250,0.15)' }}>
        <Zap size={14} style={{ color: '#A78BFA' }} />
        <p className="font-body text-xs uppercase tracking-widest" style={{ color: '#A78BFA' }}>
          Algorithme Surcharge Progressive
        </p>
      </div>
      <div className="px-4 py-3 space-y-2">
        {[
          { icon: '🔥', cond: 'Toutes les séries ≥ reps max', res: '+incrément (machine: +5kg, haltères: +1-2kg)', color: '#00D68F' },
          { icon: '✅', cond: 'Dans la cible [rMin, rMax)', res: 'Maintenir le poids', color: '#A78BFA' },
          { icon: '⚠️', cond: 'Au moins 1 série < reps min', res: '−incrément (retour en arrière)', color: '#FF6635' },
        ].map(({ icon, cond, res, color }) => (
          <div key={cond} className="flex gap-3">
            <span className="text-sm flex-shrink-0">{icon}</span>
            <div className="flex-1">
              <p className="font-body text-xs text-text-primary">{cond}</p>
              <p className="font-body text-xs mt-0.5" style={{ color }}>{res}</p>
            </div>
          </div>
        ))}
        <div className="pt-2 border-t" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <p className="font-body text-xs" style={{ color: '#3D4F63' }}>
            La progression est calculée automatiquement après chaque séance et appliquée à la même séance de la semaine suivante.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── Day weight config ────────────────────────────────────────────────────
function DayWeightsPanel({ day, baseWeights, onWeightChange }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="rounded-2xl overflow-hidden mb-3"
      style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.07)' }}>
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center gap-3 px-4 py-3 active:bg-white/5 transition-colors">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${day.color}22` }}>
          <Weight size={14} style={{ color: day.color }} />
        </div>
        <div className="flex-1 text-left">
          <p className="font-body text-sm font-semibold text-text-primary">{day.name}</p>
          <p className="font-body text-xs" style={{ color: '#7A8BA3' }}>{day.sub}</p>
        </div>
        <div style={{ color: '#3D4F63' }}>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {open && (
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {day.exercises.map(ex => {
            const color = MUSCLE_GROUPS[ex.group] || '#888'
            const currentW = baseWeights[ex.id] ?? ex.weight
            const step = ex.inc || (ex.equipType === 'machine' ? 5 : 1)

            return (
              <div key={ex.id} className="px-4 py-2.5 flex items-center gap-3 border-b last:border-0"
                style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: color }} />
                <div className="flex-1 min-w-0">
                  <p className="font-body text-xs font-medium text-text-primary truncate">{ex.name}</p>
                  <p className="font-body text-[10px]" style={{ color }}>
                    {ex.group} · {ex.rMin}–{ex.rMax} reps · incrément +{ex.inc}kg
                  </p>
                </div>
                {/* Weight control */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => onWeightChange(ex.id, Math.max(0, currentW - step))}
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm active:scale-85 transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', color: '#EDF2F7' }}>
                    −
                  </button>
                  <input
                    type="number"
                    value={currentW}
                    min="0"
                    step={step}
                    onChange={e => onWeightChange(ex.id, parseFloat(e.target.value) || 0)}
                    className="w-14 text-center font-body font-bold rounded-lg py-1 outline-none"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#EDF2F7', fontSize: '14px' }}
                  />
                  <button
                    onClick={() => onWeightChange(ex.id, currentW + step)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm active:scale-85 transition-all"
                    style={{ background: 'rgba(255,255,255,0.07)', color: '#EDF2F7' }}>
                    +
                  </button>
                  <span className="font-body text-xs ml-1" style={{ color: '#3D4F63' }}>kg</span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Main SettingsView ────────────────────────────────────────────────────
export default function SettingsView({ settings, cycles, onUpdate, onUpdateBaseWeight, onReset, onExport, onImport }) {
  const [showReset, setShowReset] = useState(false)
  const baseWeights = settings?.baseWeights || getDefaultWeights()

  const handleImport = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = e => onImport(e.target.files[0])
    input.click()
  }

  const totalSessions = cycles.flatMap(c => c.weeks.flatMap(w => w.sessions)).filter(s => s.status === 'done').length

  return (
    <div className="px-4 py-6 pb-8">
      <div className="mb-5">
        <p className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: '#3D4F63' }}>Configuration</p>
        <h1 className="font-display text-4xl text-text-primary" style={{ letterSpacing: '-0.02em' }}>Réglages</h1>
      </div>

      {/* App info */}
      <div className="rounded-2xl p-4 flex items-center gap-4 mb-5"
        style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6d28d9, #a78bfa)' }}>
          <span className="text-2xl">💪</span>
        </div>
        <div>
          <p className="font-display text-xl text-text-primary">Muscu Tracker</p>
          <p className="font-body text-xs" style={{ color: '#7A8BA3' }}>
            {totalSessions} séances · {cycles.length} cycles · Surcharge progressive
          </p>
        </div>
      </div>

      {/* Session preferences */}
      <div className="rounded-2xl overflow-hidden mb-4"
        style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <p className="font-body text-xs uppercase tracking-widest" style={{ color: '#3D4F63' }}>Préférences de séance</p>
        </div>
        <div className="px-4 py-3 flex items-center justify-between">
          <div>
            <p className="font-body text-sm font-semibold text-text-primary">Repos par défaut</p>
            <p className="font-body text-xs mt-0.5" style={{ color: '#7A8BA3' }}>Entre les séries</p>
          </div>
          <select
            value={settings?.restDefault || 90}
            onChange={e => onUpdate({ restDefault: parseInt(e.target.value) })}
            className="rounded-xl px-3 py-2 font-body text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)', color: '#EDF2F7', fontSize: '14px' }}>
            <option value={45}>45s</option>
            <option value={60}>1 min</option>
            <option value={90}>90s</option>
            <option value={120}>2 min</option>
            <option value={180}>3 min</option>
          </select>
        </div>
      </div>

      {/* Algo explainer */}
      <AlgoExplainer />

      {/* Base weights per exercise */}
      <div className="mb-2">
        <p className="font-body text-xs uppercase tracking-widest mb-3" style={{ color: '#3D4F63' }}>
          Poids de base par exercice
        </p>
        <p className="font-body text-xs mb-4" style={{ color: '#7A8BA3' }}>
          Ces poids servent de départ pour les nouveaux cycles. Ils évoluent automatiquement en fonction de tes performances.
        </p>
        {BASE_PROGRAM.map(day => (
          <DayWeightsPanel
            key={day.id}
            day={day}
            baseWeights={baseWeights}
            onWeightChange={(exId, w) => onUpdateBaseWeight(exId, w)}
          />
        ))}
      </div>

      {/* Export / Import / Reset */}
      <div className="rounded-2xl overflow-hidden mt-5"
        style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="px-4 py-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.05)' }}>
          <p className="font-body text-xs uppercase tracking-widest" style={{ color: '#3D4F63' }}>Données</p>
        </div>
        <div className="p-3 space-y-2">
          <button onClick={onExport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all active:scale-95"
            style={{ background: 'rgba(0,214,143,0.08)', color: '#00D68F', border: '1px solid rgba(0,214,143,0.2)' }}>
            <Download size={16} /> Exporter mes données
          </button>
          <button onClick={handleImport}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all active:scale-95"
            style={{ background: 'rgba(255,255,255,0.05)', color: '#7A8BA3', border: '1px solid rgba(255,255,255,0.08)' }}>
            <Upload size={16} /> Importer des données
          </button>
          <button
            onClick={() => { if (showReset) { onReset(); setShowReset(false) } else setShowReset(true) }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all active:scale-95"
            style={{ background: 'rgba(239,68,68,0.08)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }}>
            <RotateCcw size={16} />
            {showReset ? '⚠️ Confirmer la réinitialisation ?' : 'Réinitialiser tout'}
          </button>
          {showReset && (
            <button onClick={() => setShowReset(false)}
              className="w-full text-center font-body text-xs py-2"
              style={{ color: '#3D4F63' }}>
              Annuler
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
