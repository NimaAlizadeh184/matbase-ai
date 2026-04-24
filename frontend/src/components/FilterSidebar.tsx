import { FilterParams } from '@/lib/api'

interface Props {
  filters: FilterParams
  onChange: (f: FilterParams) => void
}

const CATEGORIES = ['thermoplastic', 'thermoset', 'elastomer', 'thermoplastic elastomer', 'biopolymer']
const TRANSPARENCIES = ['transparent', 'translucent', 'opaque']
const CHEM_RESISTANCE = ['poor', 'fair', 'good', 'excellent']

function RangeField({
  label, minKey, maxKey, unit, filters, onChange
}: {
  label: string
  minKey: keyof FilterParams
  maxKey: keyof FilterParams
  unit: string
  filters: FilterParams
  onChange: (f: FilterParams) => void
}) {
  return (
    <div className="mb-5">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
        {label} <span className="normal-case font-normal">({unit})</span>
      </p>
      <div className="flex gap-2">
        <input
          type="number"
          placeholder="Min"
          value={(filters[minKey] as number) ?? ''}
          onChange={e => onChange({ ...filters, [minKey]: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
        <input
          type="number"
          placeholder="Max"
          value={(filters[maxKey] as number) ?? ''}
          onChange={e => onChange({ ...filters, [maxKey]: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>
    </div>
  )
}

export default function FilterSidebar({ filters, onChange }: Props) {
  const reset = () => onChange({})

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-semibold text-gray-800">Filters</h2>
        <button onClick={reset} className="text-xs text-brand-600 hover:underline">Reset all</button>
      </div>

      {/* Category */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Category</p>
        <div className="flex flex-col gap-1.5">
          {CATEGORIES.map(cat => (
            <label key={cat} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
              <input
                type="radio"
                name="category"
                checked={filters.category === cat}
                onChange={() => onChange({ ...filters, category: cat })}
                className="accent-brand-600"
              />
              <span className="capitalize">{cat}</span>
            </label>
          ))}
          {filters.category && (
            <button
              onClick={() => onChange({ ...filters, category: undefined })}
              className="text-xs text-left text-gray-400 hover:text-gray-600 mt-1"
            >
              Clear category
            </button>
          )}
        </div>
      </div>

      <RangeField label="Glass Transition Temp" minKey="tg_min" maxKey="tg_max" unit="°C" filters={filters} onChange={onChange} />
      <RangeField label="Density" minKey="density_min" maxKey="density_max" unit="g/cm³" filters={filters} onChange={onChange} />
      <RangeField label="Tensile Strength" minKey="tensile_min" maxKey="tensile_max" unit="MPa" filters={filters} onChange={onChange} />

      {/* Max service temp */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Min service temp (°C)</p>
        <input
          type="number"
          placeholder="e.g. 150"
          value={filters.max_service_temp_min ?? ''}
          onChange={e => onChange({ ...filters, max_service_temp_min: e.target.value ? Number(e.target.value) : undefined })}
          className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
        />
      </div>

      {/* Transparency */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Transparency</p>
        <select
          value={filters.transparency || ''}
          onChange={e => onChange({ ...filters, transparency: e.target.value || undefined })}
          className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">Any</option>
          {TRANSPARENCIES.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
        </select>
      </div>

      {/* Chemical resistance */}
      <div className="mb-1">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Chemical resistance</p>
        <select
          value={filters.chemical_resistance || ''}
          onChange={e => onChange({ ...filters, chemical_resistance: e.target.value || undefined })}
          className="w-full text-sm border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-brand-500"
        >
          <option value="">Any</option>
          {CHEM_RESISTANCE.map(t => <option key={t} value={t} className="capitalize">{t}</option>)}
        </select>
      </div>
    </div>
  )
}
