from typing import Optional

from pydantic import BaseModel


class MaterialListItem(BaseModel):
    id: int
    name: str
    abbreviation: Optional[str]
    category: Optional[str]
    density: Optional[float]
    glass_transition_temp: Optional[float]
    melting_temp: Optional[float]
    tensile_strength: Optional[float]
    max_service_temp: Optional[float]
    transparency: Optional[str]
    trade_names: Optional[str]

    model_config = {"from_attributes": True}


class MaterialDetail(BaseModel):
    id: int
    name: str
    abbreviation: Optional[str]
    category: Optional[str]
    cas_number: Optional[str]
    description: Optional[str]

    glass_transition_temp: Optional[float]
    melting_temp: Optional[float]
    max_service_temp: Optional[float]
    min_service_temp: Optional[float]

    tensile_strength: Optional[float]
    elongation_at_break: Optional[float]
    youngs_modulus: Optional[float]
    flexural_modulus: Optional[float]
    izod_impact_strength: Optional[float]

    density: Optional[float]
    water_absorption: Optional[float]
    refractive_index: Optional[float]

    chemical_resistance: Optional[str]
    uv_resistance: Optional[str]
    flame_retardancy: Optional[str]
    transparency: Optional[str]

    trade_names: Optional[str]
    manufacturers: Optional[str]
    typical_applications: Optional[str]

    model_config = {"from_attributes": True}
