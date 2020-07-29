<script>
import net from '@/modules/net'
import store from '@/modules/store'
import app from '@/modules/app'

export default {
  data () {
    return {
      username: '',
      password: '',
      registerCode: '',
      registerLocation: '',
      mode: 'login',
      store: store
    }
  },
  methods: {
    login () {
      app.login(this.username, this.password)
      this.clearForms()
    },
    register () {
      app.register(this.registerCode, this.registerLocation)
      this.clearForms()
    },
    switchTo (newMode) {
      this.mode = newMode
      this.clearForms()
    },
    clearForms () {
      this.username = ''
      this.password = ''
      this.registerCode = ''
      this.registerLocation = ''
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
          {{ $t('register.instructions.title') }}
        </p>
        <ol
          type="1"
          class="is-size-7"
        >
          <li>
            {{ $t('register.instructions.1') }}
          </li>
          <li>
            {{ $t('register.instructions.2') }}
          </li>
          <li>
            {{ $t('register.instructions.3') }}
          </li>
          <li>
            {{ $t('register.instructions.4') }}
          </li>
        </ol>
      </div>
    </section>
    <section
      class="section container"
    >
      <b-loading
        :active="store.loadingCount !== 0"
        :is-full-page="true"
        :can-cancel="false"
      />
      <div class="column columns is-full">
        <div
          class="column is-half"
          @keyup.enter="login"
        >
          <b-field :label="$t('login.label.user')">
            <b-input
              v-model="username"
              type="text"
              :placeholder="$t('login.placeholder.user')"
              required
            />
          </b-field>
          <b-field :label="$t('login.label.password')">
            <b-input
              v-model="password"
              type="password"
              :placeholder="$t('login.placeholder.password')"
              password-reveal
              required
            />
          </b-field>
          <b-button
            expanded
            type="is-primary"
            @click="login"
          >
            {{ $t('login.label.login') }}
          </b-button>
        </div>
        <div
          class="column is-half"
          @keyup.enter="register"
        >
          <b-field :label="$t('register.label.location')">
            <b-input
              v-model="registerLocation"
              type="text"
              :placeholder="$t('register.placeholder.location')"
              required
            />
          </b-field>
          <b-field :label="$t('register.label.code')">
            <b-input
              v-model="registerCode"
              type="text"
              pattern="^[0-9]{6,}$"
              :placeholder="$t('register.placeholder.code')"
              required
            />
          </b-field>
          <b-button
            expanded
            type="is-primary"
            @click="register"
          >
            {{ $t('register.label.register') }}
          </b-button>
        </div>
      </div>
    </section>
  </div>
</template>

<style></style>
