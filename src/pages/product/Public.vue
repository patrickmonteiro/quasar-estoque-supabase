<template>
  <q-page padding>
    <div class="row" v-if="brand.name">
      <div class="col-12 text-center text-h4">
        {{ brand.name }}
      </div>
    </div>
    <div class="row">
      <q-select
        outlined
        v-model="categoryId"
        :options="optionsCategories"
        label="Category"
        option-label="name"
        option-value="id"
        map-options
        emit-value
        clearable
        class="col-12"
        dense
        @update:model-value="handleListProducts(route.params.id)"
      />

      <q-table
        :rows="products"
        :columns="columnsProduct"
        v-model:pagination="initialPagination"
        row-key="id"
        class="col-12"
        :loading="loading"
        :filter="filter"
        grid
        hide-pagination
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
          <transition-group
            appear
            enter-active-class="animated fadeInLeft"
            leave-active-class="animated fadeOutRight"
          >
            <div class="q-pa-xs col-xs-12 col-sm-6 col-md-3" key="card">
              <q-card class="cursor-pointer" v-ripple:primary @click="handleShowDetails(props.row)">
                <q-img :src="props.row.img_url" :ratio="4/3" />
                <q-card-section class="text-center">
                  <div class="text-h6">{{ props.row.name }}</div>
                  <div class="text-subtitle2">{{ formatCurrency(props.row.price) }}</div>
                </q-card-section>
              </q-card>
            </div>
            <div class="col-12" v-if="props.rowIndex === 3 && brand.paralax_url" key="paralax">
              <q-parallax :height="200" :speed="0.5">
                <template v-slot:media>
                  <img :src="brand.paralax_url">
                </template>

                <h3 class="text-white">{{ brand.name }}</h3>
              </q-parallax>
            </div>
          </transition-group>
        </template>
      </q-table>
    </div>
    <div class="row justify-center">
      <q-pagination
        v-model="initialPagination.page"
        :max="pagesNumber"
        direction-links
        @update:model-value="handleScrollToTop"
      />
    </div>
    <dialog-product-details
      :show="showDialogDetails"
      :product="productDetails"
      @hide-dialog="showDialogDetails = false"
    />
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted, computed } from 'vue'
import useApi from 'src/composables/UseApi'
import useNotify from 'src/composables/UseNotify'
import { useRoute } from 'vue-router'
import { columnsProduct, initialPagination } from './table'
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
    const optionsCategories = ref([])
    const categoryId = ref('')

    const { listPublic, brand } = useApi()
    const { notifyError } = useNotify()
    const route = useRoute()

    const handleListProducts = async (userId) => {
      try {
        loading.value = true
        products.value = categoryId.value ? await listPublic(table, userId, 'category_id', categoryId.value) : await listPublic(table, userId)
        loading.value = false
      } catch (error) {
        notifyError(error.message)
      }
    }

    const handleShowDetails = (product) => {
      productDetails.value = product
      showDialogDetails.value = true
    }

    const hadleListCategories = async (userId) => {
      optionsCategories.value = await listPublic('category', userId)
    }

    const handleScrollToTop = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    onMounted(() => {
      if (route.params.id) {
        hadleListCategories(route.params.id)
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
      handleListProducts,
      brand,
      optionsCategories,
      categoryId,
      route,
      initialPagination,
      handleScrollToTop,
      pagesNumber: computed(() => Math.ceil(products.value.length / initialPagination.value.rowsPerPage))
    }
  }
})
</script>
