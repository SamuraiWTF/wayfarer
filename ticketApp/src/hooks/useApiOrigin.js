import { config } from '../config';

const useApiOrigin = () => {
    return config.REACT_APP_API_ORIGIN;
}

export default useApiOrigin;