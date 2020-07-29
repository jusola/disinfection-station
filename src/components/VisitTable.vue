<template>
  <b-table
    class="is-size-5"
    :data="store.visits"
    :columns="columns"
  />
</template>
<script>
import store from '@/modules/store'
import app from '@/modules/app'

export default {
  data () {
    return {
      columns: [
        {
          field: 'time',
          label: this.$t('visits.label.time')
        },
        {
          field: 'location',
          label: this.$t('visits.label.location')
        }
      ],
      store: store,
      interval: null
    }
  },
  mounted () {
    app.getVisits()
    this.interval = setInterval(app.getVisits, 1000 * 30)
  },
  beforeDestroy () {
    clearInterval(this.interval)
  }
}
</script>

<style>

</style>
