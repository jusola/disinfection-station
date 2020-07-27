class Store {
  constructor () {
    this.loadingCount = 0
  }

  addLoading = (loadingChange) => {
    this.loadingCount += loadingChange
  }

  getLoading = () => {
    return this.loadingCount
  }
}

export default new Store()
