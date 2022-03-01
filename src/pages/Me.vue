<template>
  <q-page padding>
    <div class="row q-col-gutter-md">
      <div class="col-md-4 col-xs-12 col-sm-6">
        <card-dashboard
          table="category"
          label="Categories"
          icon="mdi-shape-outline"
        />
      </div>
      <div class="col-md-4 col-xs-12 col-sm-6">
        <card-dashboard
          table="product"
          label="Products"
          icon="mdi-archive"
        />
      </div>
    </div>
    <!-- <div v-if="user">
      <div>Hello {{ user.user_metadata.name }}</div>
    </div> -->
  </q-page>
</template>

<script>
import { defineComponent, defineAsyncComponent } from 'vue'
import useAuthUser from 'src/composables/UseAuthUser'

export default defineComponent({
  name: 'PageMe',
  components: {
    CardDashboard: defineAsyncComponent(() => import('components/CardDashbaord.vue'))
  },
  setup () {
    const { user } = useAuthUser()

    return {
      user
    }
  }
})
</script>
