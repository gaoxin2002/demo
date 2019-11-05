<template>
  <div>
    <mainComponent></mainComponent>
  </div>
</template>

<script>
import mainComponent from './components/Main.vue'
export default {
  data () {
    return {
      fullscreen : 123
    }
  },
  components: {
    mainComponent
  }
}
</script>

<style>
</style>
