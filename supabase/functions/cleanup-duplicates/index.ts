import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.56.1'

Deno.serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get all services and identify duplicates
    const { data: services, error: fetchError } = await supabaseClient
      .from('services')
      .select('*')
      .order('created_at', { ascending: true })

    if (fetchError) {
      throw fetchError
    }

    // Group by title, user_id, city, uf
    const groups = new Map()
    
    for (const service of services) {
      const key = `${service.title}-${service.user_id}-${service.city}-${service.uf}`
      if (!groups.has(key)) {
        groups.set(key, [])
      }
      groups.get(key).push(service)
    }

    // Find duplicates and remove all but the first one
    const duplicatesToRemove = []
    let totalRemoved = 0

    for (const [key, serviceGroup] of groups) {
      if (serviceGroup.length > 1) {
        // Keep the first (oldest), remove the rest
        const toRemove = serviceGroup.slice(1)
        duplicatesToRemove.push(...toRemove.map(s => s.id))
        totalRemoved += toRemove.length
        
        console.log(`Found ${serviceGroup.length} duplicates for \"${serviceGroup[0].title}\" by user ${serviceGroup[0].user_id}`)
      }
    }

    // Remove duplicates in batches
    if (duplicatesToRemove.length > 0) {
      const { error: deleteError } = await supabaseClient
        .from('services')
        .delete()
        .in('id', duplicatesToRemove)

      if (deleteError) {
        throw deleteError
      }

      // Log the cleanup action
      await supabaseClient.from('admin_audit_log').insert({
        admin_user_id: '00000000-0000-0000-0000-000000000000',
        action_type: 'duplicate_cleanup',
        target_type: 'services',
        details: {
          total_removed: totalRemoved,
          removed_ids: duplicatesToRemove,
          cleanup_date: new Date().toISOString()
        }
      })
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Removed ${totalRemoved} duplicate services`,
        details: {
          total_removed: totalRemoved,
          duplicate_ids_removed: duplicatesToRemove
        }
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error cleaning duplicates:', error)
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
