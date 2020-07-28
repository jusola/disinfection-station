class DisinfError extends Error {
  constructor (message, translationKey) {
    super(message)
    this.type = 'DisinfError'
    this.translationKey = translationKey
  }
}

class NetworkError extends DisinfError {
  constructor (message, translationKey) {
    super(message, translationKey)
    this.type = 'NetworkError'
  }
}

class ServerError extends DisinfError {
  constructor (message, translationKey) {
    super(message, translationKey)
    this.type = 'ServerError'
  }
}

class CredentialError extends DisinfError {
  constructor (message, translationKey) {
    super(message, translationKey)
    this.type = 'CredentialError'
  }
}

class QueryError extends DisinfError {
  constructor (message, translationKey) {
    super(message, translationKey)
    this.type = 'QueryError'
  }
}

function makeError (type, message, translationKey) {
  switch (type) {
    case 'NetworkError':
      return new NetworkError(message, translationKey)
    case 'ServerError':
      return new ServerError(message, translationKey)
    case 'CredentialError':
      return new CredentialError(message, translationKey)
    case 'QueryError':
      return new QueryError(message, translationKey)
    default:
      return new DisinfError(message, translationKey)
  }
}

export default { NetworkError, ServerError, CredentialError, QueryError, makeError }
