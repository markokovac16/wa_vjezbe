<template>
  <footer
    class="fixed bottom-0 left-0 right-0 bg-slate-700 backdrop-blur-sm border-t border-slate-600 shadow-xl p-4 sm:p-6 text-white"
  >
    <button
      class="absolute top-2 right-2 text-slate-300 hover:text-white text-xl font-bold cursor-pointer"
      @click="emit('close')"
    >
      ×
    </button>

    <div
      class="max-w-7xl mx-auto flex flex-col sm:flex-row items-center sm:items-center justify-between gap-4 sm:gap-6"
    >
      <!-- Slika pizze i naziv -->
      <div
        class="flex flex-col items-center text-center sm:flex-row sm:items-center sm:text-left gap-2 w-full sm:w-auto"
      >
        <img
          :src="odabranaPizza.slika_url"
          :alt="odabranaPizza.naziv"
          class="w-12 h-12 sm:w-16 sm:h-16 rounded-lg object-cover shadow-md shadow-black/40"
        />

        <div>
          <h3 class="font-bold tracking-wide text-base sm:text-lg text-orange-400">
            {{ odabranaPizza.naziv }}
          </h3>
        </div>
      </div>

      <!-- Odabir veličina + cijene -->
      <div
        class="flex items-center justify-center sm:justify-start flex-wrap gap-2 w-full sm:w-auto"
      >
        <button
          v-for="(cijena, velicina) in odabranaPizza.cijene"
          :key="velicina"
          @click="odabranaVelicina = velicina"
          :class="[
            'px-3 py-1 rounded-lg border border-slate-500 text-sm sm:text-base hover:bg-orange-500 hover:text-white transition-all cursor-pointer',
            odabranaVelicina === velicina
              ? 'bg-orange-500 text-white'
              : 'bg-slate-600/40 text-white',
          ]"
        >
          {{ velicina }} – {{ cijena }}€
        </button>
      </div>

      <!-- Odabir količine -->
      <div class="flex items-center justify-center space-x-2 w-full sm:w-auto">
        <button
          @click="kolicina > 1 ? kolicina-- : (kolicina = 1)"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
        >
          -
        </button>

        <div
          class="px-3 py-1 bg-slate-600/40 backdrop-blur-sm rounded-md border border-slate-500 text-sm sm:text-base"
        >
          {{ kolicina }}
        </div>

        <button
          @click="kolicina ? kolicina++ : (kolicina = 1)"
          class="w-8 h-8 flex items-center justify-center rounded-full bg-orange-500 text-white font-bold hover:bg-orange-600 transition-all cursor-pointer"
        >
          +
        </button>
      </div>

      <div class="w-full sm:w-auto text-center font-semibold text-lg text-orange-400 tracking-wide">
        Ukupno: {{ ukupna_cijena_stavke || '0.00' }}€
      </div>

      <button
        @click="dodajUNarudzbu"
        class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center"
      >
        Dodaj u košaricu
      </button>

      <button
        @click="posaljiNarudzbu"
        class="bg-orange-500 text-white font-semibold px-4 py-2 rounded-xl shadow-md shadow-black/40 hover:bg-orange-600 transition-all tracking-wide cursor-pointer w-full sm:w-auto text-center"
      >
        Naruči
      </button>
    </div>

    <div
      v-if="narucene_pizze.length"
      class="mt-4 max-w-2xl mx-auto max-h-40 overflow-y-auto bg-slate-800/50 backdrop-blur-sm rounded-lg p-3 border border-slate-600"
    >
      <h4 class="font-semibold text-lg text-white mb-2">Stavke u košarici:</h4>
      <ul class="space-y-2">
        <li
          v-for="(stavka, index) in narucene_pizze"
          :key="index"
          class="flex items-center justify-between bg-slate-700/50 rounded-md p-2"
        >
          <div class="text-white">
            {{ stavka.naziv }} ({{ stavka.velicina }}) x{{ stavka.kolicina }}
          </div>
          <div class="flex items-center gap-3">
            <div class="text-orange-400 font-semibold">{{ stavka.cijena }}€</div>
            <button
              @click="obrisiStavku(index)"
              class="text-slate-300 hover:text-red-400 font-bold cursor-pointer"
            >
              ×
            </button>
          </div>
        </li>
      </ul>
    </div>

    <!-- Podaci za dostavu -->
    <div
      v-if="narucene_pizze.length"
      class="mt-4 max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-2"
    >
      <input
        v-model="prezime"
        type="text"
        placeholder="Prezime"
        class="px-3 py-2 rounded-lg bg-slate-600/40 border border-slate-500 text-white placeholder-slate-300"
      />
      <input
        v-model="adresa"
        type="text"
        placeholder="Adresa"
        class="px-3 py-2 rounded-lg bg-slate-600/40 border border-slate-500 text-white placeholder-slate-300"
      />
      <input
        v-model="telefon"
        type="text"
        placeholder="Telefon"
        class="px-3 py-2 rounded-lg bg-slate-600/40 border border-slate-500 text-white placeholder-slate-300"
      />
    </div>

    <!-- Status narudžbe -->
    <div
      v-if="poruka"
      :class="[
        'mt-4 max-w-2xl mx-auto text-center font-semibold rounded-lg p-2',
        uspjeh ? 'bg-green-600/70' : 'bg-red-600/70',
      ]"
    >
      {{ poruka }}
    </div>
  </footer>
</template>

<script setup>
import { ref, computed } from 'vue';
import axios from 'axios';

const props = defineProps({
  odabranaPizza: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(['close']);

const narucene_pizze = ref([]);
const odabranaVelicina = ref('mala');
const kolicina = ref(1);

const prezime = ref('');
const adresa = ref('');
const telefon = ref('');

const poruka = ref('');
const uspjeh = ref(false);

const ukupna_cijena_stavke = computed(() => {
  const cijenaPoKomadu = props.odabranaPizza.cijene[odabranaVelicina.value];
  return (cijenaPoKomadu * kolicina.value).toFixed(2);
});

function dodajUNarudzbu() {
  const novaStavka = {
    naziv: props.odabranaPizza.naziv,
    velicina: odabranaVelicina.value,
    kolicina: kolicina.value,
    cijena: ukupna_cijena_stavke.value,
  };
  narucene_pizze.value.push(novaStavka);
  poruka.value = '';
  console.log('Naručene pizze:', narucene_pizze.value);
}

function obrisiStavku(index) {
  narucene_pizze.value.splice(index, 1);
}

async function posaljiNarudzbu() {
  if (narucene_pizze.value.length === 0) {
    uspjeh.value = false;
    poruka.value = 'Košarica je prazna! Molimo dodajte pizze prije narudžbe.';
    return;
  }

  if (prezime.value.trim() === '' || adresa.value.trim() === '' || telefon.value.trim() === '') {
    uspjeh.value = false;
    poruka.value = 'Molimo unesite prezime, adresu i broj telefona.';
    return;
  }

  try {
    const odgovor = await axios.post('http://localhost:3000/narudzbe', {
      narucene_pizze: narucene_pizze.value,
      podaci_dostava: {
        prezime: prezime.value,
        adresa: adresa.value,
        telefon: telefon.value,
      },
    });

    console.log('Narudžba uspješno poslana:', odgovor.data);
    uspjeh.value = true;
    poruka.value = odgovor.data.message;

    narucene_pizze.value = [];
    prezime.value = '';
    adresa.value = '';
    telefon.value = '';
  } catch (error) {
    console.error('Greška pri slanju narudžbe:', error);
    uspjeh.value = false;
    poruka.value = error.response?.data?.message || 'Došlo je do greške pri slanju narudžbe.';
  }
}
</script>
