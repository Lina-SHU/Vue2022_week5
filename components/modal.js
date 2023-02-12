export default {
  props: ["product", "addCart"],
  data() {
    return {
      detailModal: "",
      qty: 1,
    };
  },
  template: `
  <div ref="productModal" class="modal" tabindex="-1">
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-body">
          <div class="text-end">
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="row">
            <div class="col-md-6">
              <img :src="product.imageUrl" :alt="product.title" class="img-fluid" />
            </div>
            <div class="col-md-6">
              <h1 class="fs-4">{{ product.title }}</h1>
              <p>{{ product.description }}</p>
              <p class="fs-5 text-end">$ {{ product.price }}<del class="text-danger fs-6 ms-2">$ {{ product.origin_price }}</del> </p>
              <div class="input-group mb-3">
                <select class="form-select" v-model="qty">
                  <option :value="i" v-for="i in 20" :key="i">
                    {{ i }}
                  </option>
                </select>
                <button type="button" class="btn btn-danger" @click.prevent="addCart(product.id, qty)">加入購物車</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  `,
  methods: {
    openModal() {
      this.detailModal.show();
    },
    hideModal() {
      this.detailModal.hide();
    },
  },
  mounted() {
    this.detailModal = new bootstrap.Modal(this.$refs.productModal);
  },
};