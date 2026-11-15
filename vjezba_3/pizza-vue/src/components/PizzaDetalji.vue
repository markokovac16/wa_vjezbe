<template>
  <div
    class="mx-auto bg-linear-to-br min-h-screen p-8 bg-[url('/background.png')] bg-cover bg-center bg-no-repeat"
  >
    <div class="max-w-xl mx-auto bg-white/90 rounded-xl overflow-hidden shadow-lg">
      <div v-if="pizza">
        <div class="w-full h-64 overflow-hidden">
          <img :src="pizza.slika_url" :alt="pizza.naziv" class="w-full h-full object-cover" />
        </div>

        <div class="p-6">
          <h2 class="text-2xl font-bold text-orange-500 tracking-wide mb-4">{{ pizza.naziv }}</h2>

          <h3 class="font-semibold text-gray-700 mb-2">Sastojci</h3>
          <div class="flex flex-wrap gap-2 mb-6">
            <div
              v-for="sastojak in pizza.sastojci"
              :key="sastojak"
              class="flex items-center gap-2 bg-orange-500 text-slate-50 rounded-full px-3 py-1 text-sm"
            >
              <v-icon :name="ikoneSastojaka[sastojak]" />
              {{ sastojak }}
            </div>
          </div>

          <h3 class="font-semibold text-gray-700 mb-2">Cijene</h3>
          <div class="space-y-2">
            <div
              v-for="(cijena, velicina) in pizza.cijene"
              :key="velicina"
              class="flex justify-between text-gray-700"
            >
              <span class="font-medium capitalize">{{ velicina }}</span>
              <span>€{{ cijena }}</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="greska" class="p-6 text-center text-red-600 font-semibold">{{ greska }}</div>

      <div class="p-6 pt-0">
        <button
          @click="router.push('/')"
          class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full"
        >
          Natrag na popis
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const pizza = ref(null);
const greska = ref('');

const ikoneSastojaka = {
  rajčica: 'gi-tomato',
  sir: 'gi-cheese-wedge',
  gljive: 'gi-sliced-mushroom',
  bosiljak: 'io-leaf-sharp',
  paprika: 'gi-bell-pepper',
  šunka: 'gi-ham-shank',
  'feferoni ljuti': 'la-pepper-hot-solid',
  tunjevina: 'gi-canned-fish',
  'crveni luk': 'gi-garlic',
  panceta: 'fa-bacon',
  kulen: 'co-hotjar',
  vrhnje: 'gi-milk-carton',
};

async function fetchPizza() {
  try {
    const response = await axios.get('http://localhost:3000/pizze/' + route.params.naziv);
    pizza.value = response.data;
  } catch (error) {
    console.error('Greška pri dohvaćanju pizze:', error);
    greska.value = error.response?.data?.message || 'Došlo je do greške pri dohvaćanju pizze.';
  }
}

onMounted(() => {
  fetchPizza();
});
</script>
