<template>
  <div>
    <section class="hero is-primary section">
      <div class="hero-body container">
        <h1 class="title">
          {{ $t('login.title') }}
        </h1>
        <h2 class="subtitle">
          {{ $t('login.subtitle') }}
        </h2>
      </div>
    </section>
    <section class="section">
      <div class="columns">
        <div class="column">
          <div class="stats box notification is-success">
            <div class="is-size-2 has-text-weight-semibold">
              {{ store.visitsToday }} {{ $t('main.stats.today') }}
            </div>
            <div class="is-size-4">
              {{ store.visitsThisWeek }} {{ $t('main.stats.thisweek') }}
            </div>
            <div class="is-size-4">
              {{ store.visits.length }} {{ $t('main.stats.total') }}
            </div>
          </div>
          <div class="actions box notification is-info">
            <div
              class="buttons"
            >
              <b-button
                tag="router-link"
                to="/scoreboard"
                type="is-large"
                class="is-primary"
              >
                {{ $t('main.link.scoreboard') }}
              </b-button>
            </div>
            <div class="buttons">
              <b-button
                tag="router-link"
                to="/configure"
                type="is-warning"
              >
                {{ $t('main.link.configure') }}
              </b-button>
              <b-button
                type="is-danger"
                @click="logout"
              >
                {{ $t('main.button.logout') }}
              </b-button>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="box">
            <VisitTable />
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import app from '@/modules/app'
import store from '@/modules/store'
import VisitTable from '@/components/VisitTable'

export default {
  name: 'MainPage',
  components: { VisitTable },
  data () {
    return {
      store: store
    }
  },
  methods: {
    logout () {
      app.logout()
    }
  }
}
</script>

<style>

</style>
