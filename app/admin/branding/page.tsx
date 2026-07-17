import { BrandingManager } from '@/components/admin/BrandingManager'

export default function BrandingPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Branding
        </h1>
      </div>

      <BrandingManager />
    </div>
  )
}
