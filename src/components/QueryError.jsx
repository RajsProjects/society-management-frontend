import { getErrorMessage } from '../utils/format'

export default function QueryError({ error, onRetry }) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
      <p className="font-semibold">Failed to load data</p>
      <p className="mt-1">{getErrorMessage(error)}</p>
      {onRetry && (
        <button type="button" className="btn-secondary mt-3" onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  )
}
