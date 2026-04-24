'use client'

import { useState, useEffect, useCallback } from 'react'
import { fetchMaterials, MaterialListItem, FilterParams } from '@/lib/api'
import FilterSidebar from '@/components/FilterSidebar'
import MaterialCard from '@/components/MaterialCard'
import SearchBar from '@/components/SearchBar'

export default function HomePage() {
  const [materials, setMaterials] = useState<MaterialListItem[]>([])
  const [filters, setFilters] = useState<FilterParams>({})
  const [loading, setLoading] = useState(true)
  const [compareIds, setCompareIds] = useState<number[]>([])

  const load = useCallback(async (params: FilterParams) => {
    setLoading(true)
    try {
      const data = await fetchMaterials(params)
      setMaterials(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load(filters) }, [filters, load])

  const toggleCompare = (id: number) => {
    setCompareIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : prev.length < 3 ? [...prev, id] : prev
    )
  }

  return (
    <div className="flex gap-8">
      <aside className="w-64 shrink-0">
        <FilterSidebar filters={filters} onChange={setFilters} />
      </aside>

      <div className="flex-1 min-w-0">
        <div className="mb-6">
          <SearchBar
            value={filters.search || ''}
            onChange={search => setFilters(f => ({ ...f, search }))}
          />
        </div>

        {compareIds.length > 0 && (
          <div className="mb-4 flex items-center gap-3 bg-brand-50 border border-brand-200 rounded-lg px-4 py-3">
            <span className="text-sm font-medium text-brand-700">
              {compareIds.length} material{compareIds.length > 1 ? 's' : ''} selected for comparison
            </span>
            <a
              href={`/compare?ids=${compareIds.join(',')}`}
              className="ml-auto bg-brand-600 text-white text-sm px-4 py-1.5 rounded-md hover:bg-brand-700 transition-colors"
            >
              Compare
            </a>
            <button
              onClick={() => setCompareIds([])}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Clear
            </button>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-200 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : materials.length === 0 ? (
          <p className="text-center text-gray-500 mt-20">No materials found. Try adjusting your filters.</p>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">{materials.length} materials found</p>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {materials.map(m => (
                <MaterialCard
                  key={m.id}
                  material={m}
                  selected={compareIds.includes(m.id)}
                  onToggleCompare={toggleCompare}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
