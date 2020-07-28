<template>
  <section class="section">
    <b-table
      class="is-size-3"
      :data="store.scores"
      :columns="columns"
    />
    <b-button
      type="is-info is-small"
      @click="back"
    >
      {{ $t('scoreboard.link.back') }}
    </b-button>
  </section>
</template>
<script>
import store from '@/modules/store'
import app from '@/modules/app'

export default {
  data () {
    return {
      columns: [
        {
          field: 'username',
          label: this.$t('scoreboard.label.username')
        },
        {
          field: 'score',
          label: this.$t('scoreboard.label.score')
        }
      ],
      store: store,
      interval: null
    }
  },
  mounted () {
    app.getScores()
    this.interval = setInterval(app.getScores, 1000 * 30)
  },
  beforeDestroy () {
    clearInterval(this.interval)
  },
  methods: {
    back () {
      history.go(-1)
    }
  }
}
</script>

<style>

</style>
