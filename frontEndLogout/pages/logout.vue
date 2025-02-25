<script setup>
import { useAuth } from "../composables/useAuth"
// await axios.post("/logout");
// useRouter().replace("/login");

const { logout } = useAuth()
logout();

</script>
<template>
  <div>Logging Out...</div>
</template>
