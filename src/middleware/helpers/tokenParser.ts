const tryParseToken = (token: string): {login: string, password: string, projectId: string} | null => {
    if (token.indexOf('login') !== -1 && token.indexOf('password') !== -1 && token.indexOf('projectId') !== -1) {
        const splittedToken = token.split('|')
        return {login: splittedToken[1], password: splittedToken[3], projectId: splittedToken[5]}
    }
    return null
}

export default tryParseToken