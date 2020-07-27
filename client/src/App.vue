<script>
export default { name: 'Ticked' }
</script>

<template>
  <div
    id="app"
    class="is-viewport-height is-flex has-direction-column"
  >
    <router-view />
    <footer class="footer">
      <div class="content has-text-centered">
        <p>
          {{ $t('contact.problems') }} <a href="mailto:sanitizer@jusola.xyz">sanitizer@jusola.xyz</a>
        </p>
      </div>
    </footer>
  </div>
</template>

<style></style>
