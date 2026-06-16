const variants = {
  primary:   'bg-brand text-white hover:bg-brand-dark',
  secondary: 'bg-brand-light text-brand hover:bg-blue-100',
  danger:    'bg-red-600 text-white hover:bg-red-700',
  ghost:     'bg-transparent text-brand hover:bg-brand-light border border-brand',
}

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  return (
    <button
      className={`px-4 py-2 rounded-lg font-semibold text-sm transition disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
