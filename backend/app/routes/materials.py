from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.material import Material
from app.schemas.material import MaterialDetail, MaterialListItem

router = APIRouter(prefix="/materials", tags=["materials"])


@router.get("/", response_model=list[MaterialListItem])
def list_materials(
    search: Optional[str] = Query(None),
    category: Optional[str] = Query(None),
    tg_min: Optional[float] = Query(None),
    tg_max: Optional[float] = Query(None),
    density_min: Optional[float] = Query(None),
    density_max: Optional[float] = Query(None),
    tensile_min: Optional[float] = Query(None),
    tensile_max: Optional[float] = Query(None),
    max_service_temp_min: Optional[float] = Query(None),
    transparency: Optional[str] = Query(None),
    chemical_resistance: Optional[str] = Query(None),
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db),
):
    query = db.query(Material)

    if search:
        term = f"%{search}%"
        query = query.filter(
            or_(
                Material.name.ilike(term),
                Material.abbreviation.ilike(term),
                Material.trade_names.ilike(term),
                Material.description.ilike(term),
                Material.typical_applications.ilike(term),
            )
        )

    filters = []
    if category:
        filters.append(Material.category == category)
    if tg_min is not None:
        filters.append(Material.glass_transition_temp >= tg_min)
    if tg_max is not None:
        filters.append(Material.glass_transition_temp <= tg_max)
    if density_min is not None:
        filters.append(Material.density >= density_min)
    if density_max is not None:
        filters.append(Material.density <= density_max)
    if tensile_min is not None:
        filters.append(Material.tensile_strength >= tensile_min)
    if tensile_max is not None:
        filters.append(Material.tensile_strength <= tensile_max)
    if max_service_temp_min is not None:
        filters.append(Material.max_service_temp >= max_service_temp_min)
    if transparency:
        filters.append(Material.transparency == transparency)
    if chemical_resistance:
        filters.append(Material.chemical_resistance == chemical_resistance)

    if filters:
        query = query.filter(and_(*filters))

    return query.offset(skip).limit(limit).all()


@router.get("/{material_id}", response_model=MaterialDetail)
def get_material(material_id: int, db: Session = Depends(get_db)):
    return db.query(Material).filter(Material.id == material_id).first()


@router.get("/compare/", response_model=list[MaterialDetail])
def compare_materials(
    ids: str = Query(..., description="Comma-separated material IDs"),
    db: Session = Depends(get_db),
):
    id_list = [int(i) for i in ids.split(",")]
    return db.query(Material).filter(Material.id.in_(id_list)).all()
