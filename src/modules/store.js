class Store {
  constructor () {
    this.loadingCount = 0
    this.scores = []
    this.visits = []
    this.visitsToday = 0
    this.visitsThisWeek = 0
  }

  addLoading = (loadingChange) => {
    this.loadingCount += loadingChange
  }

  setScores = (newScores) => {
    this.scores = newScores
  }

  setVisits = (newVisits) => {
    this.visits = newVisits
  }

  setVisitsToday = (newVisitsToday) => {
    this.visitsToday = newVisitsToday
  }

  setVisitsThisWeek = (newVisitsThisWeek) => {
    this.visitsThisWeek = newVisitsThisWeek
  }
}

export default new Store()
