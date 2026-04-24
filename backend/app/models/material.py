from sqlalchemy import Column, Float, Integer, String, Text
from sqlalchemy.dialects.postgresql import ARRAY

from app.database import Base


class Material(Base):
    __tablename__ = "materials"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False, index=True)
    abbreviation = Column(String, index=True)
    category = Column(String, index=True)           # e.g. thermoplastic, thermoset, elastomer
    cas_number = Column(String)
    description = Column(Text)

    # Thermal properties
    glass_transition_temp = Column(Float)           # Tg °C
    melting_temp = Column(Float)                    # Tm °C
    max_service_temp = Column(Float)                # °C
    min_service_temp = Column(Float)                # °C

    # Mechanical properties
    tensile_strength = Column(Float)                # MPa
    elongation_at_break = Column(Float)             # %
    youngs_modulus = Column(Float)                  # GPa
    flexural_modulus = Column(Float)                # GPa
    izod_impact_strength = Column(Float)            # J/m

    # Physical properties
    density = Column(Float)                         # g/cm³
    water_absorption = Column(Float)                # % (24h)
    refractive_index = Column(Float)

    # Other
    chemical_resistance = Column(String)            # poor / fair / good / excellent
    uv_resistance = Column(String)                  # poor / fair / good / excellent
    flame_retardancy = Column(String)               # HB / V-2 / V-1 / V-0
    transparency = Column(String)                   # opaque / translucent / transparent

    # Commercial info
    trade_names = Column(Text)                      # comma-separated e.g. "Zytel, Ultramid"
    manufacturers = Column(Text)                    # comma-separated
    typical_applications = Column(Text)
