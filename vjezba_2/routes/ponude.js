import express from 'express';
import { nekretnine } from './nekretnine.js';
const router = express.Router();

const ponude = [];

router.post('/', (req, res) => {
  const nova_ponuda = req.body;
  const kljucevi = Object.keys(nova_ponuda);

  if (
    !(
      kljucevi.includes('id_nekretnine') &&
      kljucevi.includes('ime_kupca') &&
      kljucevi.includes('prezime_kupca') &&
      kljucevi.includes('ponudena_cijena') &&
      kljucevi.includes('broj_telefona')
    )
  ) {
    return res.status(400).json({ message: 'Niste poslali sve potrebne podatke.' });
  }

  if (isNaN(nova_ponuda.id_nekretnine)) {
    return res.status(400).json({ message: 'ID nekretnine mora biti broj.' });
  }

  if (nova_ponuda.ponudena_cijena <= 0) {
    return res.status(400).json({ message: 'Ponuđena cijena mora biti veća od 0.' });
  }

  const nekretnina = nekretnine.find((nekretnina) => nekretnina.id == nova_ponuda.id_nekretnine);

  if (!nekretnina) {
    return res.status(404).json({ message: 'Nekretnina s tim ID-em ne postoji.' });
  }

  nova_ponuda.id = ponude.length + 1;
  ponude.push(nova_ponuda);
  res.status(201).json(nova_ponuda);
});

export default router;
