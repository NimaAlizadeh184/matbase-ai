'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { compareMaterials, MaterialDetail } from '@/lib/api'
import Link from 'next/link'

const ROWS: { label: string; key: keyof MaterialDetail; unit?: string }[] = [
  { label: 'Category', key: 'category' },
  { label: 'Tg (°C)', key: 'glass_transition_temp', unit: '°C' },
  { label: 'Tm (°C)', key: 'melting_temp', unit: '°C' },
  { label: 'Max Service Temp', key: 'max_service_temp', unit: '°C' },
  { label: 'Min Service Temp', key: 'min_service_temp', unit: '°C' },
  { label: 'Tensile Strength', key: 'tensile_strength', unit: 'MPa' },
  { label: 'Elongation at Break', key: 'elongation_at_break', unit: '%' },
  { label: "Young's Modulus", key: 'youngs_modulus', unit: 'GPa' },
  { label: 'Density', key: 'density', unit: 'g/cm³' },
  { label: 'Water Absorption', key: 'water_absorption', unit: '%' },
  { label: 'Chemical Resistance', key: 'chemical_resistance' },
  { label: 'UV Resistance', key: 'uv_resistance' },
  { label: 'Flame Retardancy', key: 'flame_retardancy' },
  { label: 'Transparency', key: 'transparency' },
  { label: 'Trade Names', key: 'trade_names' },
  { label: 'Manufacturers', key: 'manufacturers' },
]

function CompareContent() {
  const params = useSearchParams()
  const ids = (params.get('ids') || '').split(',').map(Number).filter(Boolean)
  const [materials, setMaterials] = useState<MaterialDetail[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (ids.length) {
      compareMaterials(ids).then(setMaterials).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  if (loading) return <div className="animate-pulse h-96 bg-gray-200 rounded-xl" />
  if (!ids.length) return (
    <div className="text-center mt-20">
      <p className="text-gray-500 mb-4">No materials selected for comparison.</p>
      <Link href="/" className="text-brand-600 hover:underline">Go to search</Link>
    </div>
  )

  return (
    <div>
      <Link href="/" className="text-sm text-brand-600 hover:underline mb-4 inline-block">← Back to search</Link>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Compare Materials</h1>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left py-3 px-4 text-gray-500 font-medium w-48">Property</th>
              {materials.map(m => (
                <th key={m.id} className="text-left py-3 px-4 text-gray-900 font-semibold">
                  <Link href={`/materials/${m.id}`} className="hover:text-brand-600">
                    {m.name}
                  </Link>
                  {m.abbreviation && (
                    <span className="ml-2 text-xs font-mono text-gray-400">{m.abbreviation}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(row => (
              <tr key={row.key} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="py-2.5 px-4 text-gray-500">{row.label}</td>
                {materials.map(m => {
                  const val = m[row.key]
                  return (
                    <td key={m.id} className="py-2.5 px-4 text-gray-900 capitalize">
                      {val !== null && val !== undefined ? `${val}${row.unit && typeof val === 'number' ? ` ${row.unit}` : ''}` : '—'}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="animate-pulse h-96 bg-gray-200 rounded-xl" />}>
      <CompareContent />
    </Suspense>
  )
}
