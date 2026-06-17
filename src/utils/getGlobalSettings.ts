import { API_BASE_URL } from '@/utils/config'
import { IGlobalSettingsAPIResponse } from '@/types/global'

/**
 * Fetches the global platform settings from the backend.
 * Results are cached and revalidated every hour (ISR).
 * Next.js automatically deduplicates identical fetch calls
 * within the same request, so calling this in multiple
 * layouts/pages does not cause extra network requests.
 */
export async function getGlobalSettings(): Promise<IGlobalSettingsAPIResponse | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/user/get-global`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}
