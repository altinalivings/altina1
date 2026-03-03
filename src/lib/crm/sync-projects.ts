import projects from '@/data/projects'
import { createAdminClient } from '@/lib/supabase/admin'

export async function syncProjectsToSupabase() {
  const supabase = createAdminClient()
  const results = { created: 0, updated: 0, errors: 0, total: projects.length }

  for (const p of projects) {
    const propertyData = {
      project_ref: p.id,
      name: p.name,
      developer: p.developer || null,
      brand: (p as Record<string, unknown>).brand as string || null,
      city: p.city || null,
      state: p.state || null,
      sector: p.sector || null,
      micro_market: p.micro_market || null,
      location: p.location || null,
      rera: p.rera || null,
      status: p.status || null,
      possession: p.possession || null,
      launch_date: p.launch || null,
      property_type: p.propertyType || null,
      configuration: p.configuration || null,
      typologies: p.typologies || null,
      sizes: p.sizes || null,
      land_area: p.land_area || null,
      towers: p.towers || null,
      floors: p.floors || null,
      total_units: String(p.total_units || ''),
      price_display: p.price || null,
      amenities: p.amenities || null,
      highlights: p.highlights || null,
      overview: p.overview || p.description || null,
      hero_image: p.hero || null,
      gallery: p.gallery || null,
      brochure_url: p.brochure_pdf || null,
      video_url: p.video_url || null,
      map_embed: p.map?.embed || null,
      map_lat: p.map?.lat || null,
      map_lng: p.map?.lng || null,
      is_featured: p.featured || false,
      synced_from_ts: true,
      updated_at: new Date().toISOString(),
    }

    const { error } = await supabase
      .from('properties')
      .upsert(propertyData, { onConflict: 'project_ref' })

    if (error) {
      console.error(`Sync error for ${p.id}:`, error)
      results.errors++
    } else {
      results.updated++
    }
  }

  return results
}
