<script>
import net from '@/modules/net'
import store from '@/modules/store'
import app from '@/modules/app'

export default {
  data () {
    return {
      username: '',
      password: '',
      recoverCode: '',
      mode: 'login'
    }
  },
  computed: {
    loading () {
      return store.getLoading()
    }
  },
  methods: {
    login () {
      app.login(this.username, this.password)
      this.clearForms()
    },
    recover () {
      app.recover(this.recoverCode)
      this.clearForms()
    },
    switchTo (newMode) {
      this.mode = newMode
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
          {{ $t('recover.instructions.title') }}
        </p>
        <ol
          type="1"
          class="is-size-7"
        >
          <li>
            {{ $t('recover.instructions.1') }}
          </li>
          <li>
            {{ $t('recover.instructions.2') }}
          </li>
          <li>
            {{ $t('recover.instructions.3') }}
          </li>
          <li>
            {{ $t('recover.instructions.4') }}
          </li>
        </ol>
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
          @keyup.enter="recover"
        >
          <b-field :label="$t('recover.label.code')">
            <b-input
              v-model="recoverCode"
              type="text"
              pattern="^[0-9]{6,}$"
              :placeholder="$t('recover.placeholder.code')"
              required
            />
          </b-field>
          <b-button
            expanded
            type="is-primary"
            @click="recover"
          >
            {{ $t('recover.label.recover') }}
          </b-button>
        </div>
      </div>
    </section>
  </div>
</template>

<style></style>
