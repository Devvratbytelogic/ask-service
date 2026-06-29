import { getVendorAccountRoutePath } from '@/routes/routes'
import { redirect } from 'next/navigation'

export default function VendorAccountIndexPage() {
    redirect(getVendorAccountRoutePath('profile'))
}
