// Datos iniciales de demostración realistas con fotos de alta resolución

export const INITIAL_PETS = [
  {
    id: 'pet-milo-01',
    status: 'perdido', // 'perdido' | 'encontrado' | 'adopcion' | 'reunido' | 'adoptado'
    name: 'Milo',
    species: 'perro',
    breed: 'Golden Retriever mestizo',
    gender: 'Macho',
    size: 'grande',
    age: '3 años',
    color: 'Dorado claro con pecho blanco',
    distinctiveFeatures: 'Llevaba collar azul desgastado con chapita en forma de hueso. Tiene una pequeña mancha oscura en la lengua.',
    description: 'Se asustó con los truenos de la tormenta de anoche y salió corriendo por la zona de Parque Centenario. Es muy sociable pero suele ser temeroso de ruidos fuertes. Necesita medicación para la alergia.',
    reward: '$50.000',
    dateReported: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    lastSeenDate: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    location: {
      address: 'Av. Díaz Vélez y Campichuelo',
      neighborhood: 'Caballito / Almagro',
      city: 'Buenos Aires',
      lat: -34.6062,
      lng: -58.4354
    },
    images: [
      'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1000&q=80'
    ],
    contact: {
      name: 'Camila Rodriguez',
      phone: '+5491158429182',
      email: 'camila.r@ejemplo.com',
      showPhone: true
    },
    sightings: [
      {
        id: 's-1',
        date: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
        locationText: 'Cerca de la entrada principal de Parque Centenario',
        certainty: 'alta', // 'alta' | 'media' | 'baja'
        notes: 'Lo vimos tomando agua de un charco cerca del monumento. Quise acercarme pero cruzó rápido hacia Marechal.',
        reportedBy: 'Martín V.',
        photoUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80'
      },
      {
        id: 's-2',
        date: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
        locationText: 'Frente al hospital Durand sobre Av. Díaz Vélez',
        certainty: 'media',
        notes: 'Un perro dorado con collar azul corría en dirección hacia el parque.',
        reportedBy: 'Dra. Silvina (Guardia)'
      }
    ]
  },
  {
    id: 'pet-luna-02',
    status: 'encontrado',
    name: 'Gatita rescatada',
    species: 'gato',
    breed: 'Siamés mestiza',
    gender: 'Hembra',
    size: 'pequeño',
    age: 'Aprox. 1 año',
    color: 'Crema con orejas y cola gris oscuro',
    distinctiveFeatures: 'Ojos celestes brillantes, muy mimosa. No tiene collar.',
    description: 'Encontrada refugiada bajo el capó de un auto en una noche de frío. Se encuentra en tránsito en mi depto, comiendo bien y limpia. Si reconoces a sus dueños o la estás buscando comunícate por favor.',
    reward: null,
    dateReported: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    lastSeenDate: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    location: {
      address: 'Gorriti y Thames',
      neighborhood: 'Palermo Soho',
      city: 'Buenos Aires',
      lat: -34.5885,
      lng: -58.4312
    },
    images: [
      'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=1000&q=80'
    ],
    contact: {
      name: 'Gonzalo Morales',
      phone: '+5491143920194',
      email: 'gonza.m@ejemplo.com',
      showPhone: true
    },
    sightings: []
  },
  {
    id: 'pet-toby-03',
    status: 'adopcion',
    name: 'Toby',
    species: 'perro',
    breed: 'Mestizo de Border Collie',
    gender: 'Macho',
    size: 'mediano',
    age: '8 meses',
    color: 'Negro con pecho, patas y punta de cola blancas',
    distinctiveFeatures: 'Castrado, vacunado y desparasitado. Súper enérgico e inteligente.',
    description: 'Fue rescatado de un terreno baldío junto a sus hermanitos en condiciones precarias. Hoy es un cachorro recuperado, alegre y dulce, aprende trucos a gran velocidad y adora correr en el pasto.',
    reward: null,
    rescueBeforeImage: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=600&q=80', // Foto del día del rescate
    dateReported: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    location: {
      address: 'Av. Libertador y Juramento',
      neighborhood: 'Belgrano',
      city: 'Buenos Aires',
      lat: -34.5582,
      lng: -58.4496
    },
    images: [
      'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1000&q=80'
    ],
    contact: {
      name: 'Refugio Patas Seguras',
      phone: '+5491167448831',
      email: 'adopciones@patasseguras.org',
      showPhone: true
    },
    sightings: []
  },
  {
    id: 'pet-simba-04',
    status: 'perdido',
    name: 'Simba',
    species: 'gato',
    breed: 'Común europeo atigrado naranja',
    gender: 'Macho',
    size: 'mediano',
    age: '4 años',
    color: 'Naranja atigrado con blanco en la panza',
    distinctiveFeatures: 'Collar rojo con cascabel y chapita telefónica. Muesca suave en oreja izquierda.',
    description: 'Salió al balcón y saltó por los techos linderos. No está acostumbrado a la calle, puede estar muy asustado y escondido en cocheras, jardines o huecos de escaleras. ¡Nuestros hijos lo extrañan mucho!',
    reward: '$30.000',
    dateReported: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    lastSeenDate: new Date(Date.now() - 1000 * 60 * 60 * 76).toISOString(),
    location: {
      address: 'Av. Santa Fe y Pueyrredón',
      neighborhood: 'Recoleta',
      city: 'Buenos Aires',
      lat: -34.5928,
      lng: -58.4035
    },
    images: [
      'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1561948955-570b270e7c36?auto=format&fit=crop&w=1000&q=80'
    ],
    contact: {
      name: 'Florencia & Lucas',
      phone: '+5491132190844',
      email: 'flor.lucas@ejemplo.com',
      showPhone: true
    },
    sightings: [
      {
        id: 's-3',
        date: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
        locationText: 'Techo de cochera sobre calle Juncal',
        certainty: 'alta',
        notes: 'Escuché maullidos intensos y vi un gato naranja idéntico a las 11 de la noche.',
        reportedBy: 'Esteban C.'
      }
    ]
  },
  {
    id: 'pet-olivia-05',
    status: 'adopcion',
    name: 'Olivia',
    species: 'perro',
    breed: 'Galga mestiza',
    gender: 'Hembra',
    size: 'grande',
    age: '2 años',
    color: 'Canela / arena con antifaz negro',
    distinctiveFeatures: 'Esterilizada, extremadamente cariñosa, tranquila adentro de casa y le fascina dormir en almohadones.',
    description: 'Rescatada en la ruta en estado de desnutrición severa. Hoy ya recuperó su peso y alegría, y busca una familia para siempre.',
    reward: null,
    rescueBeforeImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=600&q=80',
    dateReported: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(),
    location: {
      address: 'Plaza Arenales',
      neighborhood: 'Villa Devoto',
      city: 'Buenos Aires',
      lat: -34.6001,
      lng: -58.5126
    },
    images: [
      'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1000&q=80',
      'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=1000&q=80'
    ],
    contact: {
      name: 'Valeria S.',
      phone: '+5491129481022',
      email: 'valeria.rescatista@ejemplo.com',
      showPhone: true
    },
    sightings: []
  },
  {
    id: 'pet-rocky-06',
    status: 'encontrado',
    name: 'Perrito encontrado',
    species: 'perro',
    breed: 'Mestizo mediano',
    gender: 'Macho',
    size: 'mediano',
    age: 'Adulto',
    color: 'Dorado y blanco',
    distinctiveFeatures: 'Tiene collar azul desgastado. Muy sociable, se acerca a las personas.',
    description: 'Estaba deambulando desorientado cerca del parque. Se nota que tiene familia porque está bien cuidado. Buscamos a sus tutores.',
    reward: null,
    dateReported: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    lastSeenDate: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
    location: {
      address: 'Av. Corrientes y Ángel Gallardo',
      neighborhood: 'Almagro / Caballito',
      city: 'Buenos Aires',
      lat: -34.6045,
      lng: -58.4310
    },
    images: [
      'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?auto=format&fit=crop&w=1000&q=80'
    ],
    contact: {
      name: 'Mariano P.',
      phone: '+5491168294711',
      email: 'mariano.crespo@ejemplo.com',
      showPhone: true
    },
    sightings: []
  }
];
