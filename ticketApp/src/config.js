// config.js
export let config = {
    REACT_APP_API_ORIGIN: 'http://localhost:3001', // Default value
};

// Fetch the config.json file and update the config object
export const loadConfig= fetch('/config.json')
    .then((response) => {
        return response.json();})
    .then((jsonConfig) => {
        config.REACT_APP_API_ORIGIN = jsonConfig.REACT_APP_API_ORIGIN || process.env.REACT_APP_API_ORIGIN || config.REACT_APP_API_ORIGIN;
        console.log("Config loaded:", config)
    })
    .catch((error) => {
        config.REACT_APP_API_ORIGIN = process.env.REACT_APP_API_ORIGIN || config.REACT_APP_API_ORIGIN;
        console.log("Error loading /config.json. Fallback config loaded:", config)
    });
