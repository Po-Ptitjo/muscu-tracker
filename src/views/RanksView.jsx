import React from 'react'
import { computeAllElos } from '../utils/ranks'

export default function RanksView({ cycles, settings }) {
  const baseWeights = settings?.baseWeights || {}
  const { perExercise, globalElo } = computeAllElos(cycles, baseWeights)

  const rows = Object.entries(perExercise).sort((a,b)=> (b[1].points||0) - (a[1].points||0))

  return (
    <div className="px-4 py-6 pb-8">
      <div className="mb-5">
        <p className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: '#3D4F63' }}>Rangs</p>
        <h1 className="font-display text-4xl text-text-primary" style={{ letterSpacing: '-0.02em' }}>Système de rangs</h1>
      </div>

      <div className="rounded-2xl p-4 mb-5" style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="font-body text-sm">Points globaux</p>
        <h2 className="font-display text-3xl" style={{ color: '#A78BFA' }}>{globalElo ? globalElo : '— (provisoire)'}</h2>
        <p className="font-body text-xs" style={{ color: '#7A8BA3' }}>Somme des points de chaque exercice (exercices avec performances réelles)</p>
      </div>

      <div className="space-y-3">
        {rows.map(([id, info]) => (
          <div key={id} className="rounded-2xl overflow-hidden" style={{ background: '#0D1117', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="px-4 py-3 flex items-center justify-between">
              <div>
                <p className="font-body text-sm font-semibold text-text-primary">{info.name}</p>
                <p className="font-body text-xs" style={{ color: '#7A8BA3' }}>{info.group}</p>
              </div>
              <div className="text-right">
                {info.provisional ? (
                  <p className="font-body text-xs" style={{ color: '#3D4F63' }}>Provisoire — aucune série enregistrée</p>
                ) : (
                  <>
                    <p className="font-display text-xl" style={{ color: '#A78BFA' }}>{info.points}</p>
                    <p className="font-body text-xs" style={{ color: '#7A8BA3' }}>{info.rank?.name} — {info.percent}% · ELO {info.elo}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {rows.length === 0 && (
          <div className="text-center py-10">
            <p className="font-body text-sm" style={{ color: '#3D4F63' }}>Aucune performance enregistrée encore.</p>
          </div>
        )}
      </div>
    </div>
  )
}
