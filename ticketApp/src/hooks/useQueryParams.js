import { useLocation } from 'react-router-dom';

//had to write a parser because React's URLSearchParams constructor is broken.

const useQueryParams = () => {
    return new URLSearchParams(useLocation().search);
}

export default useQueryParams;