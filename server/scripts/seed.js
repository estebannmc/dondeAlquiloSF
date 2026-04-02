const path = require('path');
process.chdir(path.join(__dirname, '..'));

const fs = require('fs');
const admin = require('firebase-admin');

const serviceAccountPath = path.join(__dirname, '..', 'config', 'serviceAccountKey.json');

let serviceAccount;

if (fs.existsSync(serviceAccountPath)) {
  serviceAccount = require(serviceAccountPath);
} else {
  console.error('❌ No se encontró config/serviceAccountKey.json');
  console.log('\n📋 Instrucciones:');
  console.log('1. Ve a Firebase Console → Configuración del proyecto → Cuentas de servicio');
  console.log('2. Genera una nueva clave privada');
  console.log('3. Guarda el archivo como config/serviceAccountKey.json');
  console.log('4. Vuelve a ejecutar: node scripts/seed.js\n');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const ejemplos = [
  {
    property_address: "Bv. Pellegrini 1500, Santa Fe",
    property_coords: { latitud: -31.6172, longitud: -60.7055 },
    review: {
      estrellas: 5,
      presion_agua: 5,
      humedad: 'no',
      ruido_exterior: 'no',
      olores_cañerias: 'no',
      plagas: 'no',
      revision_electricidad: 'si',
      revision_gas: 'si',
      revision_plomeria: 'si',
      revision_cloacas: 'si',
      muebles_estado: 'excelente',
      comentario: "Excelente departamento, muy luminoso y tranquilo. La presión de agua es perfecta incluso en horarios pico. El propietario demostró toda la documentación al día y con buena onda. Los vecinos son muy respetuosos, no hay ruidos molestos. Totalmente recomendable para estudiantes o familias."
    }
  },
  {
    property_address: "San Martín 2500, Santa Fe",
    property_coords: { latitud: -31.6234, longitud: -60.6988 },
    review: {
      estrellas: 2,
      presion_agua: 2,
      humedad: 'si',
      ruido_exterior: 'si',
      olores_cañerias: 'si',
      plagas: 'no',
      revision_electricidad: 'no',
      revision_gas: 'si',
      revision_plomeria: 'no',
      revision_cloacas: 'no',
      muebles_estado: 'deteriorado',
      comentario: "Pésima experiencia. El departamento tiene filtraciones de humedad en las paredes que nunca fueron solucionadas. La presión de agua es muy mala, especialmente en el segundo piso. Hay mucho ruido de la calle porque está cerca de un bar. Los olores de las cañerías son constantes. NO me mostraron ningún tipo de revisión de electricidad ni plomería. Los muebles están muy deteriorados y el propietario no quiso repararlos."
    }
  },
  {
    property_address: "Av. Freyre 1800, Santa Fe",
    property_coords: { latitud: -31.6156, longitud: -60.6892 },
    review: {
      estrellas: 3,
      presion_agua: 3,
      humedad: 'nsnc',
      ruido_exterior: 'no',
      olores_cañerias: 'no',
      plagas: 'nsnc',
      revision_electricidad: 'si',
      revision_gas: 'no',
      revision_plomeria: 'si',
      revision_cloacas: 'nsnc',
      muebles_estado: 'bueno',
      comentario: "El departamento cumple con lo básico. La ubicación es buena, cerca de todo. No noté problemas graves de humedad ni ruidos. El propietario me mostró las revisions de electricidad y plomería, pero no la de gas. Los muebles están en buen estado general, solo algunas marcas de uso normal. Precio un poco alto para lo que ofrece, pero acceptable."
    }
  }
];

async function seed() {
  console.log('🌱 Poblando Firestore...\n');

  for (let i = 0; i < ejemplos.length; i++) {
    const ejemplo = ejemplos[i];
    
    const propertyRef = await db.collection('properties').add({
      direccion: ejemplo.property_address,
      latitud: ejemplo.property_coords.latitud,
      longitud: ejemplo.property_coords.longitud,
      fecha_creacion: new Date()
    });

    const userId = `user_ejemplo_${i + 1}`;
    await db.collection('users').doc(userId).set({
      id: userId,
      nombre: `Usuario Ejemplo ${i + 1}`,
      email: `ejemplo${i + 1}@test.com`,
      proveedor_login: 'test'
    });

    await db.collection('reviews').add({
      usuario_id: userId,
      propiedad_id: propertyRef.id,
      ...ejemplo.review,
      fecha: new Date()
    });

    console.log(`✅ ${i + 1}. ${ejemplo.property_address}`);
  }

  console.log('\n🎉 ¡Completado! 3 propiedades y 3 reseñas creadas.');
  process.exit(0);
}

seed().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
