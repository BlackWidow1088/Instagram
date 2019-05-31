export const add = () => {
    return { type: 'INCREMENT' }
}

export const subtract = () => {
    return { type: 'DECREMENT' }
}

export const updateEmail = (email) => {
    return { type: 'UPDATE_EMAIL', payload: email }
}

export const updatePassword = (pass) => {
    return { type: 'UPDATE_PASSWORD', payload: pass }
}