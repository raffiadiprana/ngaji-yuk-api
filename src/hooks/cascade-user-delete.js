// Hook: cascade delete data terkait saat user dihapus
// Mencegah orphan data di tabel profiles, videologs, answers.
export const cascadeUserDelete = () => {
  return async (context) => {
    const { app, result } = context
    if (!result) return context

    const userId = result.id
    if (userId == null) return context

    const profiles = app.service('profiles')
    const videologs = app.service('videologs')
    const answers = app.service('answers')

    // Hapus semua record terkait user ini (Feathers remove dgn query + paginate:false)
    try {
      if (profiles) {
        await profiles.remove(null, { query: { user_id: userId }, paginate: false })
      }
    } catch (e) {
      console.error('cascade delete profiles failed', e.message)
    }
    try {
      if (videologs) {
        await videologs.remove(null, { query: { user_id: userId }, paginate: false })
      }
    } catch (e) {
      console.error('cascade delete videologs failed', e.message)
    }
    try {
      if (answers) {
        await answers.remove(null, { query: { user_id: userId }, paginate: false })
      }
    } catch (e) {
      console.error('cascade delete answers failed', e.message)
    }

    return context
  }
}
