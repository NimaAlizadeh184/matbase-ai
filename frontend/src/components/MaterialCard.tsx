import { MaterialListItem } from '@/lib/api'
import Link from 'next/link'

interface Props {
  material: MaterialListItem
  selected: boolean
  onToggleCompare: (id: number) => void
}

const CATEGORY_COLORS: Record<string, string> = {
  thermoplastic: 'bg-blue-100 text-blue-700',
  thermoset: 'bg-orange-100 text-orange-700',
  elastomer: 'bg-green-100 text-green-700',
  'thermoplastic elastomer': 'bg-purple-100 text-purple-700',
  biopolymer: 'bg-emerald-100 text-emerald-700',
}

function Stat({ label, value, unit }: { label: string; value: number | null; unit: string }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-400">{label}</p>
      <p className="text-sm font-semibold text-gray-800">
        {value !== null ? `${value} ${unit}` : '—'}
      </p>
    </div>
  )
}

export default function MaterialCard({ material, selected, onToggleCompare }: Props) {
  const categoryColor = CATEGORY_COLORS[material.category ?? ''] || 'bg-gray-100 text-gray-600'

  return (
    <div className={`bg-white rounded-xl border shadow-sm p-5 flex flex-col gap-3 transition-all ${selected ? 'border-brand-500 ring-2 ring-brand-200' : 'border-gray-200 hover:border-brand-300'}`}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link href={`/materials/${material.id}`} className="font-semibold text-gray-900 hover:text-brand-600 transition-colors leading-tight">
            {material.name}
          </Link>
          {material.abbreviation && (
            <span className="ml-2 text-xs font-mono text-gray-500">{material.abbreviation}</span>
          )}
        </div>
        {material.category && (
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 capitalize ${categoryColor}`}>
            {material.category}
          </span>
        )}
      </div>

      {material.trade_names && (
        <p className="text-xs text-gray-500 truncate">
          Trade names: {material.trade_names}
        </p>
      )}

      <div className="grid grid-cols-3 gap-2 border-t border-gray-100 pt-3">
        <Stat label="Tg" value={material.glass_transition_temp} unit="°C" />
        <Stat label="Density" value={material.density} unit="g/cm³" />
        <Stat label="Tensile" value={material.tensile_strength} unit="MPa" />
      </div>

      <div className="flex items-center justify-between mt-1">
        <Link
          href={`/materials/${material.id}`}
          className="text-xs text-brand-600 hover:underline"
        >
          View details →
        </Link>
        <button
          onClick={() => onToggleCompare(material.id)}
          className={`text-xs px-3 py-1 rounded-md border transition-colors ${
            selected
              ? 'bg-brand-600 text-white border-brand-600'
              : 'border-gray-300 text-gray-600 hover:border-brand-400 hover:text-brand-600'
          }`}
        >
          {selected ? 'Selected' : '+ Compare'}
        </button>
      </div>
    </div>
  )
}
