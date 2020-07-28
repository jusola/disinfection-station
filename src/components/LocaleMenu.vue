<template>
  <div class="locale-changer">
    <p>{{ $t('footer.locale') }}</p>
    <span class="select">
      <select
        v-model="$i18n.locale"
      >
        <option
          v-for="(lang, i) in langs"
          :key="`Lang${i}`"
          :value="lang"
        >
          {{ lang }}
        </option>
      </select>
    </span>
  </div>
</template>

<script>
export default {
  name: 'LocaleChanger',
  data () {
    return { langs: ['fi-fi', 'en'] }
  }
}
</script>
