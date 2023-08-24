// useConfig.js
// This hook is used to what for config.json to load and make it available to the rest of the app.
import { useState, useEffect } from 'react';
import { loadConfig, config } from './config';

const useConfig = () => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        loadConfig.then(() => {
            setIsLoaded(true);
        });
    }, []);

    return { isLoaded, config };
};

export default useConfig;
