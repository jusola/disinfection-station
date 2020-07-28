class Store {
  constructor () {
    this.loadingCount = 0
    this.scores = []
  }

  addLoading = (loadingChange) => {
    this.loadingCount += loadingChange
  }

  getLoading = () => {
    return this.loadingCount
  }

  setScores = (newScores) => {
    this.scores = newScores
  }

  getScores = () => {
    return this.scores
  }
}

export default new Store()
