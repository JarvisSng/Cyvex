import PropTypes from 'prop-types';

const EmptyState = ({ 
  icon = null,
  title = "No data available",
  description = "",
  action = null,
  isLoading = false
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12 px-4 text-center">
      {isLoading ? (
        <>
          <svg 
            className="animate-spin mx-auto h-12 w-12 text-blue-500" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-4 text-gray-500">Loading...</p>
        </>
      ) : (
        <>
          {icon || (
            <svg 
              className="mx-auto h-12 w-12 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
          <h3 className="mt-2 text-lg font-medium text-gray-900">{title}</h3>
          {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
          {action && <div className="mt-6">{action}</div>}
        </>
      )}
    </div>
  );
};

EmptyState.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
  action: PropTypes.node,
  isLoading: PropTypes.bool
};

export default EmptyState;