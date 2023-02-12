import { apiUrl, apiPath } from './apiEnv.js';
import productModal from "./components/modal.js";

const app = Vue.createApp({
  components: {
    productModal,
  },
  data() {
    return {
      products: [],
      product: {},
      carts: [],
      isLoading: false,
      isChanged: false,
      user: {},
      message: "",
    };
  },
  methods: {
    getProducts() {
      const url = `${apiUrl}api/${apiPath}/products/all`;
      axios
        .get(url)
        .then((res) => {
          this.products = res.data.products;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    getProduct(id) {
      const url = `${apiUrl}api/${apiPath}/product/${id}`;
      axios
        .get(url)
        .then((res) => {
          this.product = res.data.product;
          this.$refs.detailModal.openModal();
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    addToCart(id, qty = 1) {
      this.isLoading = true;
      const obj = {
        product_id: id,
        qty,
      };
      const url = `${apiUrl}api/${apiPath}/cart`;
      axios
        .post(url, { data: obj })
        .then((res) => {
          this.isLoading = false;
          this.getCart();
          this.$refs.detailModal.hideModal();
        })
        .catch((err) => {
          this.isLoading = false;
          alert(err.response.data.message);
        });
    },
    getCart() {
      const url = `${apiUrl}api/${apiPath}/cart`;
      axios
        .get(url)
        .then((res) => {
          this.carts = res.data.data;
        })
        .catch((err) => {
          alert(err.response.data.message);
        });
    },
    deleteItem(id) {
      this.isLoading = true;
      const url = `${apiUrl}api/${apiPath}/cart/${id}`;
      axios
        .delete(url)
        .then((res) => {
          this.isLoading = false;
          this.getCart();
        })
        .catch((err) => {
          this.isLoading = false;
          alert(err.response.data.message);
        });
    },
    changeItem(cart) {
      this.isChanged = true;
      const url = `${apiUrl}api/${apiPath}/cart/${cart.id}`;
      axios
        .put(url, {
          data: {
            product_id: cart.product_id,
            qty: cart.qty,
          },
        })
        .then((res) => {
          this.isChanged = false;
          this.getCart();
        })
        .catch((err) => {
          this.isLoading = false;
          this.isChanged = false;
          alert(err.response.data.message);
        });
    },
    isPhone (value) {
      const phoneNumber = /^(09)[0-9]{8}$/;
      return phoneNumber.test(value) ? true : "請輸入 09 開頭的 10 位電話號碼";
    },
    onSubmit(values, { resetForm }) {
      this.isLoading = true;
      const url = `${apiUrl}api/${apiPath}/order`;
      axios
        .post(url, {
          data: {
            user: { ...this.user },
            message: this.message,
          },
        })
        .then((res) => {
          alert("訂單送出成功");
          this.getCart();
          resetForm();
          this.message = '';
          this.isLoading = false;
        })
        .catch((err) => {
          this.isLoading = false;
          alert(err.response.data.message);
        });
    },
  },
  mounted() {
    this.getProducts();
    this.getCart();
  },
});

app.component("loading", VueLoading.Component);
app.component("VForm", VeeValidate.Form);
app.component("VField", VeeValidate.Field);
app.component("ErrorMessage", VeeValidate.ErrorMessage);

Object.keys(VeeValidateRules).forEach((rule) => {
  if (rule !== "default") {
    VeeValidate.defineRule(rule, VeeValidateRules[rule]);
  }
});
// 讀取外部的資源
VeeValidateI18n.loadLocaleFromURL('./zh_TW.json');

// Activate the locale
VeeValidate.configure({
  generateMessage: VeeValidateI18n.localize('zh_TW'),
  validateOnInput: true, // 調整為：輸入文字時，就立即進行驗證
});

app.mount('#app');