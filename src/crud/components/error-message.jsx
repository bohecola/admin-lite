import { defineComponent } from "vue";

export default defineComponent({
  name: "cl-error-message",

  props: {
    title: String
  },

  setup(props) {
    return () => {
      return <el-alert title={prop.title} type="error"></el-alert>
    };
  }
});