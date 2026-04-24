const BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface MaterialListItem {
  id: number
  name: string
  abbreviation: string | null
  category: string | null
  density: number | null
  glass_transition_temp: number | null
  melting_temp: number | null
  tensile_strength: number | null
  max_service_temp: number | null
  transparency: string | null
  trade_names: string | null
}

export interface MaterialDetail extends MaterialListItem {
  cas_number: string | null
  description: string | null
  min_service_temp: number | null
  elongation_at_break: number | null
  youngs_modulus: number | null
  flexural_modulus: number | null
  izod_impact_strength: number | null
  water_absorption: number | null
  refractive_index: number | null
  chemical_resistance: string | null
  uv_resistance: string | null
  flame_retardancy: string | null
  manufacturers: string | null
  typical_applications: string | null
}

export interface FilterParams {
  search?: string
  category?: string
  tg_min?: number
  tg_max?: number
  density_min?: number
  density_max?: number
  tensile_min?: number
  tensile_max?: number
  max_service_temp_min?: number
  transparency?: string
  chemical_resistance?: string
}

export async function fetchMaterials(params: FilterParams = {}): Promise<MaterialListItem[]> {
  const query = new URLSearchParams()
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== '') query.set(k, String(v))
  })
  const res = await fetch(`${BASE}/materials/?${query}`)
  if (!res.ok) throw new Error('Failed to fetch materials')
  return res.json()
}

export async function fetchMaterial(id: number): Promise<MaterialDetail> {
  const res = await fetch(`${BASE}/materials/${id}`)
  if (!res.ok) throw new Error('Failed to fetch material')
  return res.json()
}

export async function compareMaterials(ids: number[]): Promise<MaterialDetail[]> {
  const res = await fetch(`${BASE}/materials/compare/?ids=${ids.join(',')}`)
  if (!res.ok) throw new Error('Failed to compare materials')
  return res.json()
}

export async function chatWithAI(message: string): Promise<{ reply: string; suggested_material_ids: number[] }> {
  const res = await fetch(`${BASE}/ai/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message }),
  })
  if (!res.ok) throw new Error('Failed to get AI response')
  return res.json()
}
