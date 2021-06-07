import { useState } from 'react';

export function useLocalPersistedState(storageKey, defaultValue) {
    const initialStoredVal = localStorage.getItem(storageKey);
    if(!initialStoredVal) {
        localStorage.setItem(storageKey, defaultValue)
    }
    const presentVal = localStorage.getItem(storageKey);
    const [value, setValue] = useState(presentVal);
    const setter = (newVal) => {
        localStorage.setItem(storageKey, newVal);
        return setValue(newVal);
    }
    return [value, setter];
}