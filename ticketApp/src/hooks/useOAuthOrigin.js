const useOAuthOrigin = () => {
    return process.env.REACT_APP_OAUTH_ORIGIN || 'http://localhost:3002' // If not specified, default to local dev.
}

export default useOAuthOrigin;