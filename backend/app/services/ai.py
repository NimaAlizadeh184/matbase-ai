import json

import anthropic
from sqlalchemy.orm import Session

from app.config import settings
from app.models.material import Material


async def get_ai_recommendation(message: str, db: Session) -> dict:
    materials = db.query(Material).all()
    material_summary = [
        {
            "id": m.id,
            "name": m.name,
            "abbreviation": m.abbreviation,
            "category": m.category,
            "glass_transition_temp": m.glass_transition_temp,
            "melting_temp": m.melting_temp,
            "max_service_temp": m.max_service_temp,
            "tensile_strength": m.tensile_strength,
            "density": m.density,
            "transparency": m.transparency,
            "chemical_resistance": m.chemical_resistance,
            "uv_resistance": m.uv_resistance,
            "typical_applications": m.typical_applications,
        }
        for m in materials
    ]

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    system_prompt = """You are a polymer materials expert assistant for MatBase AI.
You have access to a database of polymer materials and help engineers and researchers
find the right material for their application.

When answering:
- Be specific about material properties
- Suggest concrete materials from the database when relevant
- Explain trade-offs between materials
- Return your answer as JSON with two fields:
  - "reply": your text response (markdown supported)
  - "suggested_material_ids": list of material IDs from the database that are relevant (empty list if none)
"""

    user_prompt = f"""Database of available materials:
{json.dumps(material_summary, indent=2)}

User question: {message}

Respond with valid JSON only."""

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}],
    )

    try:
        result = json.loads(response.content[0].text)
        return result
    except (json.JSONDecodeError, IndexError, KeyError):
        return {"reply": response.content[0].text, "suggested_material_ids": []}
