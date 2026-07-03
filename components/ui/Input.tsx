'use client'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
}

export function Input({ label, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        {...props}
      />
    </div>
  )
}
