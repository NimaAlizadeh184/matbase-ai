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
- Keep replies focused and reasonably concise; use tables/formatting only when it aids comparison
"""

    tools = [
        {
            "name": "provide_recommendation",
            "description": "Provide the reply to show the user and any relevant material ids.",
            "input_schema": {
                "type": "object",
                "properties": {
                    "reply": {"type": "string", "description": "The text response, markdown supported"},
                    "suggested_material_ids": {
                        "type": "array",
                        "items": {"type": "integer"},
                        "description": "IDs of materials from the database that are relevant (empty if none)",
                    },
                },
                "required": ["reply", "suggested_material_ids"],
            },
        }
    ]

    messages = [
        {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"Database of available materials:\n{json.dumps(material_summary, indent=2)}",
                    "cache_control": {"type": "ephemeral"},
                },
                {
                    "type": "text",
                    "text": f"User question: {message}",
                },
            ],
        }
    ]

    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=1024,
        system=system_prompt,
        messages=messages,
        tools=tools,
        tool_choice={"type": "tool", "name": "provide_recommendation"},
    )

    tool_use = next(block for block in response.content if block.type == "tool_use")
    return {
        "reply": tool_use.input["reply"],
        "suggested_material_ids": tool_use.input["suggested_material_ids"],
    }
