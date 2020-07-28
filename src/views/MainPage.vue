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
      <div class="container">
        <b-button
          tag="router-link"
          to="/scoreboard"
          type="is-large"
          class="is-primary"
        >
          {{ $t('main.link.scoreboard') }}
        </b-button>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <p>{{ $t('main.label.actions') }}</p>
        <div>
          <b-button
            tag="router-link"
            to="/configure"
            type="is-info"
          >
            {{ $t('main.link.configure') }}
          </b-button>
        </div>
        <div>
          <b-button
            type="is-danger"
            @click="logout"
          >
            {{ $t('main.button.logout') }}
          </b-button>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import app from '@/modules/app'

export default {
  methods: {
    logout () {
      app.logout()
    }
  }
}
</script>

<style>

</style>
