<template>
  <q-page padding>
    <div class="row" v-if="brand.name">
      <div class="col-12 text-center text-h4">
        {{ brand.name }}
      </div>
    </div>
    <div class="row">
      <q-table
        :rows="products"
        :columns="columnsProduct"
        row-key="id"
        class="col-12"
        :loading="loading"
        :filter="filter"
        grid
      >
        <template v-slot:top>
          <span class="text-h6">
            Products
          </span>
          <q-space />
          <q-input outlined dense debounce="300" v-model="filter" placeholder="Search" class="q-mr-sm">
            <template v-slot:append>
              <q-icon name="mdi-magnify" />
            </template>
          </q-input>
        </template>

        <template v-slot:item="props">
          <div class="q-pa-xs col-xs-12 col-sm-6 col-md-4">
            <q-card class="cursor-pointer" v-ripple:primary @click="handleShowDetails(props.row)">
              <q-img :src="props.row.img_url" :ratio="4/3" />
              <q-card-section class="text-center">
                <div class="text-h6">{{ props.row.name }}</div>
                <div class="text-subtitle2">{{ formatCurrency(props.row.price) }}</div>
              </q-card-section>
            </q-card>
          </div>
        </template>
      </q-table>
    </div>
    <dialog-product-details
      :show="showDialogDetails"
      :product="productDetails"
      @hide-dialog="showDialogDetails = false"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import { useRoute } from 'vue-router'
import { columnsProduct } from './table'
import { formatCurrency } from 'src/utils/format'
import DialogProductDetails from 'components/DialogProductDetails'

export default defineComponent({
  name: 'PageProductPublic',
  components: {
    DialogProductDetails
  },
  setup () {
    const products = ref([])
    const loading = ref(true)
    const filter = ref('')
    const table = 'product'
    const showDialogDetails = ref(false)
    const productDetails = ref({})

    const { listPublic, brand } = useApi()
    const { notifyError } = useNotify()
    const route = useRoute()

    const handleListProducts = async (userId) => {
      try {
        loading.value = true
        products.value = await listPublic(table, userId)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleShowDetails = (product) => {
      productDetails.value = product
      showDialogDetails.value = true
    }

    onMounted(() => {
      if (route.params.id) {
        handleListProducts(route.params.id)
      }
    })

    return {
      columnsProduct,
      products,
      loading,
      filter,
      formatCurrency,
      showDialogDetails,
      productDetails,
      handleShowDetails,
      brand
    }
  }
})
</script>
