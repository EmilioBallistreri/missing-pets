// Datos iniciales de demostración en la Provincia de Córdoba con fotos de alta resolución

export const INITIAL_PETS = [
  {
    id: 'pet-milo-01',
    status: 'perdido', // 'perdido' | 'encontrado' | 'adopcion' | 'reunido' | 'adoptado'
    name: 'Milo',
    species: 'perro',
    otherSpecies: null,
    breed: 'Golden Retriever mestizo',
    gender: 'Macho',
    size: 'grande',
    age: '3 años',
    color: 'Dorado claro con pecho blanco',
    distinctiveFeatures: 'Llevaba collar azul desgastado con chapita en forma de hueso. Tiene una pequeña mancha oscura en la lengua.',
    description: 'Se asustó con los truenos de la tormenta de anoche y salió corriendo por la zona de Nueva Córdoba / Parque Sarmiento. Es muy sociable pero temeroso de ruidos fuertes.',
    reward: '$50.000',
    dateReported: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    lastSeenDate: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    location: {
      address: 'Av. Hipólito Yrigoyen y San Lorenzo',
      neighborhood: 'Nueva Córdoba',
      city: 'Córdoba',
      lat: -31.4285,
      lng: -64.1865
    },
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1000&q=80'
    ],
    contact: {
      name: 'Camila Rodríguez',
      phone: '+5493515842918',
      email: 'camila.cba@ejemplo.com',
      showPhone: true
    },
    sightings: [
      {
        id: 's-1',
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        locationText: 'Cerca de la pista de patinaje del Parque Sarmiento',
        certainty: 'alta',
        notes: 'Lo vimos tomando agua cerca de la rotonda. Quise acercarme pero cruzó hacia la zona de los choripanes.',
        reportedBy: 'Martín V.',
        photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 's-2',
        date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        locationText: 'Bajando por calle Estrada hacia Plaza España',
        certainty: 'media',
        notes: 'Un perro dorado con collar azul corría en dirección a Plaza España.',
        reportedBy: 'Sofía (Vecina Nva Cba)'
      }
    ]
  },
  {
    id: 'pet-luna-02',
    status: 'encontrado',
    name: 'Gatita en resguardo',
    species: 'gato',
    otherSpecies: null,
    breed: 'Siamés mestiza',
    gender: 'Hembra',
    size: 'pequeño',
    age: 'Aprox. 1 año',
    color: 'Crema con orejas y cola café oscuro',
    distinctiveFeatures: 'Ojos celestes brillantes, muy mimosa y ronroneadora. No tiene collar.',
    description: 'Encontrada refugiada en la vereda de un bar sobre La Cañada en barrio Güemes. Se encuentra en tránsito en mi departamento, limpia y comiendo bien. Buscamos a sus tutores.',
    reward: null,
    dateReported: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    lastSeenDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    location: {
      address: 'Belgrano y Fructuoso Rivera',
      neighborhood: 'Barrio Güemes',
      city: 'Córdoba',
      lat: -31.4235,
      lng: -64.1925
    },
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=80'
    ],
    contact: {
      name: 'Gonzalo Morales',
      phone: '+5493514392019',
      email: 'gonza.guemes@ejemplo.com',
      showPhone: true
    },
    sightings: []
  },
  {
    id: 'pet-toby-03',
    status: 'adopcion',
    name: 'Toby',
    species: 'perro',
    otherSpecies: null,
    breed: 'Mestizo de Border Collie',
    gender: 'Macho',
    size: 'mediano',
    age: '8 meses',
    color: 'Negro con pecho, patas y punta de cola blancas',
    distinctiveFeatures: 'Castrado, vacunado y desparasitado. Súper enérgico, aprende rápido.',
    description: 'Fue rescatado en inmediaciones del río Suquía junto a sus hermanos. Hoy es un cachorro alegre, recuperado y dulce, listo para integrarse a una familia responsable con patio o tiempo para paseos.',
    reward: null,
    rescueBeforeImage: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80',
    dateReported: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    location: {
      address: 'Plaza Colón y Av. Colón',
      neighborhood: 'Barrio Alberdi',
      city: 'Córdoba',
      lat: -31.4080,
      lng: -64.2050
    },
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=80'
    ],
    contact: {
      name: 'Refugio Patitas Cordobesas',
      phone: '+5493516744883',
      email: 'adopciones@patitascordoba.org',
      showPhone: true
    },
    sightings: []
  },
  {
    id: 'pet-copito-04',
    status: 'perdido',
    name: 'Copito',
    species: 'otro',
    otherSpecies: 'Conejo Mini Lop',
    breed: 'Mini Lop orejas caídas',
    gender: 'Macho',
    size: 'pequeño',
    age: '1 año',
    color: 'Blanco puro con ojos oscuros',
    distinctiveFeatures: 'Orejas caídas muy suaves, tamaño de unos 25 cm. Muy dócil, responde al ruido de su bolsita de heno.',
    description: 'Se escapó del jardín de casa en barrio General Paz aprovechando un portón abierto. Al ser un conejo doméstico no sabe sobrevivir en la calle y los perros de la zona pueden asustarlo. ¡Por favor retenerlo o avisarnos!',
    reward: '$25.000',
    dateReported: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    lastSeenDate: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    location: {
      address: '24 de Septiembre y Pringles',
      neighborhood: 'Barrio General Paz',
      city: 'Córdoba',
      lat: -31.4125,
      lng: -64.1680
    },
    images: [
      'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1535241749838-299277b6305f?auto=format&fit=crop&w=1000&q=80'
    ],
    contact: {
      name: 'Familia Mansilla',
      phone: '+5493513448190',
      email: 'familia.mansilla@ejemplo.com',
      showPhone: true
    },
    sightings: [
      {
        id: 's-conejo-1',
        date: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
        locationText: 'Plaza Alberdi, entre los canteros de flores',
        certainty: 'alta',
        notes: 'Lo vimos comiendo pastito cerca de la fuente. Cuando nos acercamos se metió debajo de un arbusto espeso.',
        reportedBy: 'Lucas (Kiosco de la plaza)'
      }
    ]
  },
  {
    id: 'pet-simba-05',
    status: 'perdido',
    name: 'Simba',
    species: 'gato',
    otherSpecies: null,
    breed: 'Común atigrado naranja',
    gender: 'Macho',
    size: 'mediano',
    age: '4 años',
    color: 'Naranja atigrado con blanco en la panza',
    distinctiveFeatures: 'Collar rojo con cascabel y chapita telefónica. Muesca suave en oreja izquierda.',
    description: 'Salió por los techos en Alta Córdoba cerca de la plaza Rivadavia. No está acostumbrado a la calle, puede estar muy asustado y escondido en cocheras, árboles o patios de vecinos.',
    reward: '$30.000',
    dateReported: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    lastSeenDate: new Date(Date.now() - 1000 * 60 * 60 * 76).toISOString(),
    location: {
      address: 'Mariano Fragueiro y Jerónimo Luis de Cabrera',
      neighborhood: 'Alta Córdoba',
      city: 'Córdoba',
      lat: -31.3980,
      lng: -64.1820
    },
    images: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=1000&q=80'
    ],
    contact: {
      name: 'Florencia & Lucas',
      phone: '+5493513219084',
      email: 'flor.cba@ejemplo.com',
      showPhone: true
    },
    sightings: [
      {
        id: 's-3',
        date: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        locationText: 'Techo de una cochera sobre calle Urquiza',
        certainty: 'alta',
        notes: 'Escuché maullidos y vi un gato naranja idéntico anoche.',
        reportedBy: 'Esteban C.'
      }
    ]
  },
  {
    id: 'pet-olivia-06',
    status: 'adopcion',
    name: 'Olivia',
    species: 'perro',
    otherSpecies: null,
    breed: 'Galga mestiza rescatada',
    gender: 'Hembra',
    size: 'grande',
    age: '2 años',
    color: 'Canela / arena con antifaz negro',
    distinctiveFeatures: 'Esterilizada, extremadamente cariñosa, tranquila adentro de casa y le fascina dormir en almohadones.',
    description: 'Rescatada en la zona norte de Córdoba. Hoy ya recuperó peso, vitalidad y salud plena. Busca una familia cariñosa para compartir su vida.',
    reward: null,
    rescueBeforeImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
    dateReported: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    location: {
      address: 'Av. Rafael Núñez y Hugo Wast',
      neighborhood: 'Cerro de las Rosas',
      city: 'Córdoba',
      lat: -31.3780,
      lng: -64.2380
    },
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1000&q=80'
    ],
    contact: {
      name: 'Valeria S. (Rescatista)',
      phone: '+5493512948102',
      email: 'valeria.cerro@ejemplo.com',
      showPhone: true
    },
    sightings: []
  },
  {
    id: 'pet-rocky-07',
    status: 'encontrado',
    name: 'Perrito encontrado',
    species: 'perro',
    otherSpecies: null,
    breed: 'Mestizo mediano',
    gender: 'Macho',
    size: 'mediano',
    age: 'Adulto',
    color: 'Dorado y blanco',
    distinctiveFeatures: 'Tiene collar azul desgastado. Muy sociable, se acerca a las personas buscando caricias.',
    description: 'Estaba deambulando desorientado cerca del Parque Las Heras Elisa. Está limpio y cuidado, claramente tiene familia. Buscamos a sus tutores.',
    reward: null,
    dateReported: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    lastSeenDate: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    location: {
      address: 'Costanera y Puente Centenario',
      neighborhood: 'Centro / Costanera',
      city: 'Córdoba',
      lat: -31.4105,
      lng: -64.1840
    },
    images: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=80'
    ],
    contact: {
      name: 'Mariano P.',
      phone: '+5493516829471',
      email: 'mariano.cba@ejemplo.com',
      showPhone: true
    },
    sightings: []
  }
];
