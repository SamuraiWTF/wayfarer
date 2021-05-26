const useApiOrigin = () => {
    return process.env.REACT_APP_API_ORIGIN || 'http://localhost:3001' // If not specified, default to local dev.
}

export default useApiOrigin;