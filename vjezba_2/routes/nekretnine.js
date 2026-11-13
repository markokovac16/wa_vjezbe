import express from 'express';
const router = express.Router();

const nekretnine = [
  { id: 1, naziv: 'Stan u centru', opis: 'Dvosobni stan blizu Arene', cijena: 180000, lokacija: 'Pula', broj_soba: 2, povrsina: 55 },
  { id: 2, naziv: 'Kuća s vrtom', opis: 'Obiteljska kuća s velikim vrtom', cijena: 350000, lokacija: 'Medulin', broj_soba: 4, povrsina: 140 },
  { id: 3, naziv: 'Garsonijera', opis: 'Mala garsonijera za studente', cijena: 85000, lokacija: 'Rovinj', broj_soba: 1, povrsina: 28 },
];

router.get('/', (req, res) => {
  res.status(200).json(nekretnine);
});

router.get('/:id', (req, res) => {
  const id_nekretnine = req.params.id;

  if (isNaN(id_nekretnine)) {
    return res.status(400).json({ message: 'ID nekretnine mora biti broj.' });
  }

  const nekretnina = nekretnine.find((nekretnina) => nekretnina.id == id_nekretnine);

  if (nekretnina) {
    res.status(200).json(nekretnina);
  } else {
    res.status(404).json({ message: 'Nekretnina nije pronađena.' });
  }
});

router.post('/', (req, res) => {
  const nova_nekretnina = req.body;
  const kljucevi = Object.keys(nova_nekretnina);

  if (
    !(
      kljucevi.includes('naziv') &&
      kljucevi.includes('opis') &&
      kljucevi.includes('cijena') &&
      kljucevi.includes('lokacija') &&
      kljucevi.includes('broj_soba') &&
      kljucevi.includes('povrsina')
    )
  ) {
    return res.status(400).json({ message: 'Niste poslali sve potrebne podatke.' });
  }

  if (nova_nekretnina.cijena < 0 || nova_nekretnina.broj_soba < 0 || nova_nekretnina.povrsina <= 0) {
    return res.status(400).json({ message: 'Cijena, broj soba i površina ne mogu biti negativni.' });
  }

  let novi_id = 1;
  if (nekretnine.length > 0) {
    novi_id = nekretnine[nekretnine.length - 1].id + 1;
  }

  nova_nekretnina.id = novi_id;
  nekretnine.push(nova_nekretnina);
  res.status(201).json(nova_nekretnina);
});

router.put('/:id', (req, res) => {
  const id_nekretnine = req.params.id;
  const nova_nekretnina = req.body;
  const kljucevi = Object.keys(nova_nekretnina);

  if (isNaN(id_nekretnine)) {
    return res.status(400).json({ message: 'ID nekretnine mora biti broj.' });
  }

  if (
    !(
      kljucevi.includes('naziv') &&
      kljucevi.includes('opis') &&
      kljucevi.includes('cijena') &&
      kljucevi.includes('lokacija') &&
      kljucevi.includes('broj_soba') &&
      kljucevi.includes('povrsina')
    )
  ) {
    return res.status(400).json({ message: 'Niste poslali sve potrebne podatke.' });
  }

  if (nova_nekretnina.cijena < 0 || nova_nekretnina.broj_soba < 0 || nova_nekretnina.povrsina <= 0) {
    return res.status(400).json({ message: 'Cijena, broj soba i površina ne mogu biti negativni.' });
  }

  const index = nekretnine.findIndex((nekretnina) => nekretnina.id == id_nekretnine);

  if (index !== -1) {
    nova_nekretnina.id = Number(id_nekretnine);
    nekretnine[index] = nova_nekretnina;
    res.status(200).json(nekretnine[index]);
  } else {
    res.status(404).json({ message: 'Nekretnina nije pronađena.' });
  }
});

router.patch('/:id', (req, res) => {
  const id_nekretnine = req.params.id;
  const nova_nekretnina = req.body;

  if (isNaN(id_nekretnine)) {
    return res.status(400).json({ message: 'ID nekretnine mora biti broj.' });
  }

  if (nova_nekretnina.cijena < 0 || nova_nekretnina.broj_soba < 0 || nova_nekretnina.povrsina <= 0) {
    return res.status(400).json({ message: 'Cijena, broj soba i površina ne mogu biti negativni.' });
  }

  const index = nekretnine.findIndex((nekretnina) => nekretnina.id == id_nekretnine);

  if (index !== -1) {
    for (const key in nova_nekretnina) {
      nekretnine[index][key] = nova_nekretnina[key];
    }
    res.status(200).json(nekretnine[index]);
  } else {
    res.status(404).json({ message: 'Nekretnina nije pronađena.' });
  }
});

router.delete('/:id', (req, res) => {
  const id_nekretnine = req.params.id;

  if (isNaN(id_nekretnine)) {
    return res.status(400).json({ message: 'ID nekretnine mora biti broj.' });
  }

  const index = nekretnine.findIndex((nekretnina) => nekretnina.id == id_nekretnine);

  if (index !== -1) {
    nekretnine.splice(index, 1);
    res.status(200).json({ message: 'Nekretnina uspješno obrisana.' });
  } else {
    res.status(404).json({ message: 'Nekretnina nije pronađena.' });
  }
});

export { nekretnine };
export default router;
