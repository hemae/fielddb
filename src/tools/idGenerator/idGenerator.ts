const generateId = (): string => {
    return `${Date.now().toString(36)}-${Math.floor(
        Math.random() * 1e16
    ).toString(36)}`
}

export default generateId