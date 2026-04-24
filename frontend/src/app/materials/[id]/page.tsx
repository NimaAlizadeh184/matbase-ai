'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { fetchMaterial, MaterialDetail } from '@/lib/api'
import Link from 'next/link'

function PropertyRow({ label, value, unit }: { label: string; value: string | number | null; unit?: string }) {
  if (value === null || value === undefined) return null
  return (
    <tr className="border-t border-gray-100">
      <td className="py-2 pr-4 text-sm text-gray-500 w-48">{label}</td>
      <td className="py-2 text-sm font-medium text-gray-900">
        {value}{unit ? ` ${unit}` : ''}
      </td>
    </tr>
  )
}

export default function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [material, setMaterial] = useState<MaterialDetail | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMaterial(Number(id)).then(setMaterial).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="animate-pulse h-96 bg-gray-200 rounded-xl" />
  if (!material) return <p className="text-center text-gray-500 mt-20">Material not found.</p>

  return (
    <div className="max-w-4xl mx-auto">
      <Link href="/" className="text-sm text-brand-600 hover:underline mb-4 inline-block">← Back to search</Link>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{material.name}</h1>
            {material.abbreviation && (
              <span className="text-base font-mono text-gray-500">{material.abbreviation}</span>
            )}
          </div>
          {material.category && (
            <span className="text-sm px-3 py-1 rounded-full bg-brand-100 text-brand-700 font-medium capitalize">
              {material.category}
            </span>
          )}
        </div>

        {material.cas_number && (
          <p className="text-xs text-gray-400 mb-4">CAS: {material.cas_number}</p>
        )}

        {material.description && (
          <p className="text-sm text-gray-600 mb-6">{material.description}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Thermal Properties</h2>
            <table className="w-full">
              <tbody>
                <PropertyRow label="Glass Transition Temp (Tg)" value={material.glass_transition_temp} unit="°C" />
                <PropertyRow label="Melting Temp (Tm)" value={material.melting_temp} unit="°C" />
                <PropertyRow label="Max Service Temp" value={material.max_service_temp} unit="°C" />
                <PropertyRow label="Min Service Temp" value={material.min_service_temp} unit="°C" />
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Mechanical Properties</h2>
            <table className="w-full">
              <tbody>
                <PropertyRow label="Tensile Strength" value={material.tensile_strength} unit="MPa" />
                <PropertyRow label="Elongation at Break" value={material.elongation_at_break} unit="%" />
                <PropertyRow label="Young's Modulus" value={material.youngs_modulus} unit="GPa" />
                <PropertyRow label="Flexural Modulus" value={material.flexural_modulus} unit="GPa" />
                <PropertyRow label="Izod Impact Strength" value={material.izod_impact_strength} unit="J/m" />
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Physical Properties</h2>
            <table className="w-full">
              <tbody>
                <PropertyRow label="Density" value={material.density} unit="g/cm³" />
                <PropertyRow label="Water Absorption (24h)" value={material.water_absorption} unit="%" />
                <PropertyRow label="Refractive Index" value={material.refractive_index} />
                <PropertyRow label="Transparency" value={material.transparency} />
              </tbody>
            </table>
          </section>

          <section>
            <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Performance</h2>
            <table className="w-full">
              <tbody>
                <PropertyRow label="Chemical Resistance" value={material.chemical_resistance} />
                <PropertyRow label="UV Resistance" value={material.uv_resistance} />
                <PropertyRow label="Flame Retardancy" value={material.flame_retardancy} />
              </tbody>
            </table>
          </section>
        </div>

        {(material.trade_names || material.manufacturers) && (
          <section className="mt-8 border-t border-gray-100 pt-6">
            <h2 className="font-semibold text-gray-700 mb-3 text-sm uppercase tracking-wide">Commercial</h2>
            {material.trade_names && (
              <p className="text-sm text-gray-700 mb-1">
                <span className="text-gray-500">Trade names: </span>{material.trade_names}
              </p>
            )}
            {material.manufacturers && (
              <p className="text-sm text-gray-700">
                <span className="text-gray-500">Manufacturers: </span>{material.manufacturers}
              </p>
            )}
          </section>
        )}

        {material.typical_applications && (
          <section className="mt-6 border-t border-gray-100 pt-6">
            <h2 className="font-semibold text-gray-700 mb-2 text-sm uppercase tracking-wide">Typical Applications</h2>
            <p className="text-sm text-gray-700">{material.typical_applications}</p>
          </section>
        )}
      </div>
    </div>
  )
}
