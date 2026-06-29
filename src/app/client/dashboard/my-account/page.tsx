import { getMyAccountRoutePath } from '@/routes/routes'
import { redirect } from 'next/navigation'

export default function ClientMyAccountIndexPage() {
    redirect(getMyAccountRoutePath('profile'))
}
