---
description: Load persona context for targeted content creation
allowed-tools: Read, Glob
arguments:
  - name: name
    description: "Persona identifier: boutique-bride-bella, corporate-claire, social-savvy-sarah, or art-collector-alex"
    required: true
---

# /content:persona Command

Load comprehensive persona details to inform content creation for Pike & West.

## When Invoked with `$ARGUMENTS.name`

1. **Load Persona Profile**
   - Read from `docs/marketing-strategy/01-personas/[name].md` if available
   - Load associated keywords, topics, and content preferences

2. **Present Quick Profile**

   | Attribute | Detail                     |
   |-----------|----------------------------|
   | Age Range | [range]                    |
   | Income    | [level]                    |
   | Location  | [areas]                    |
   | Status    | [context]                  |
   | Priority  | Primary/Secondary/Tertiary |

3. **Show Persona Story**
   - Who they are and what they value
   - Their journey to Pike & West
   - What differentiates them

4. **List Needs and Pain Points**
   - Must-haves
   - Nice-to-haves
   - Deal-breakers
   - Pain points to address

5. **Map Decision Journey**
   - Research phase behaviors
   - Discovery phase actions
   - Consideration phase needs
   - Decision phase triggers

6. **Provide Content Guidance**
   - Content they need at each stage
   - Language that resonates
   - Words to avoid
   - Tone preferences

7. **Identify Content Gaps**
   - Scan existing content for persona coverage
   - Note what's missing for this persona

## Available Personas

| Slug                   | Name                 | Priority  | Focus                           |
|------------------------|----------------------|-----------|---------------------------------|
| `boutique-bride-bella` | Boutique Bride Bella | Primary   | Weddings, intimate celebrations |
| `corporate-claire`     | Corporate Claire     | Primary   | Corporate events, retreats      |
| `social-savvy-sarah`   | Social Savvy Sarah   | Secondary | Parties, celebrations           |
| `art-collector-alex`   | Art Collector Alex   | Tertiary  | Art events, gallery openings    |

## Persona Quick Reference

### Boutique Bride Bella

- **Seeking:** Unique, Instagram-worthy venue with art backdrop
- **Values:** Authenticity, flexibility, intimate settings
- **Pain Points:** Venue fatigue, decoration overwhelm, vendor restrictions
- **Keywords:** unique wedding venue, art gallery wedding, intimate wedding

### Corporate Claire

- **Seeking:** Professional yet distinctive space for corporate events
- **Values:** Flexibility, service quality, impressive setting
- **Pain Points:** Generic conference rooms, inflexible venues
- **Keywords:** corporate event venue Memphis, retreat planning, team events

### Social Savvy Sarah

- **Seeking:** Memorable setting for milestone celebrations
- **Values:** Photo-worthy moments, unique experiences
- **Pain Points:** Cookie-cutter party venues
- **Keywords:** birthday party venue, celebration space, private event

### Art Collector Alex

- **Seeking:** Gallery events, artist openings, cultural experiences
- **Values:** Art appreciation, community, cultural enrichment
- **Pain Points:** Limited art event spaces in Memphis
- **Keywords:** gallery opening, art event, Memphis art scene

## Session Behavior

When a persona is loaded:

- All subsequent content commands use this persona context
- Brand voice adjusts for persona preferences
- Keyword suggestions align with persona searches
- CTAs reflect persona's decision stage

Persona remains active until:

- Another persona is loaded
- Session ends
- User runs `/content:persona --clear`

## Suggested Actions After Loading

```bash
# Create content for this persona
/content:outline "[topic relevant to persona]"

# Check existing coverage
/check:editorial --persona [name]

# View content queue filtered by persona
/content:queue --persona [name]
```
