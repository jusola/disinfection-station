<script>
import net from '@/modules/net'
import store from '@/modules/store'
import app from '@/modules/app'

export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  computed: {
    loading () {
      return store.getLoading()
    }
  },
  methods: {
    configure () {
      app.configure(this.username, this.password)
      this.clearForms()
    },
    clearForms () {
      this.username = ''
      this.password = ''
      this.recoverCode = ''
    }
  }
}
</script>

<template>
  <div class="flexed is-centered is-vcentered">
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
    <section class="section container">
      <div class="content">
        <p class="is-size-5">
          {{ $t('configure.instructions.title') }}
        </p>
        <ul
          class="is-size-7"
        >
          <li>
            {{ $t('configure.instructions.1') }}
          </li>
        </ul>
      </div>
    </section>
    <section
      class="section container"
    >
      <b-loading
        :active="loading !== 0"
        :is-full-page="true"
        :can-cancel="false"
      />
      <div class="column columns is-full">
        <div
          class="column is-full"
          @keyup.enter="configure"
        >
          <b-field :label="$t('configure.label.username')">
            <b-input
              v-model="username"
              type="text"
              :placeholder="$t('configure.placeholder.user')"
              required
            />
          </b-field>
          <b-field :label="$t('configure.label.password')">
            <b-input
              v-model="password"
              type="password"
              :placeholder="$t('configure.placeholder.password')"
              password-reveal
              required
            />
          </b-field>
          <b-button
            expanded
            type="is-primary"
            @click="configure"
          >
            {{ $t('configure.label.button') }}
          </b-button>
        </div>
      </div>
    </section>
  </div>
</template>

<style></style>
