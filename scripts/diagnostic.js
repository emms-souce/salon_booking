// const { PrismaClient } = require('@prisma/client')

// const prisma = new PrismaClient()

// async function diagnostic() {
//   try {
//     console.log('🔍 Diagnostic de la base de données...\n')

//     // Vérifier les salons
//     const salons = await prisma.salon.findMany({
//       select: {
//         id: true,
//         name: true,
//         isActive: true,
//         _count: {
//           select: {
//             services: true
//           }
//         }
//       }
//     })

//     console.log('📍 SALONS TROUVÉS:')
//     if (salons.length === 0) {
//       console.log('  ❌ Aucun salon trouvé dans la base de données')
//     } else {
//       salons.forEach(salon => {
//         console.log(`  ✅ ${salon.name} (ID: ${salon.id}, Actif: ${salon.isActive}, Services: ${salon._count.services})`)
//       })
//     }
//     console.log('')

//     // Vérifier les services
//     const services = await prisma.service.findMany({
//       select: {
//         id: true,
//         name: true,
//         salonId: true,
//         isActive: true,
//         duration: true,
//         salon: {
//           select: {
//             name: true
//           }
//         }
//       }
//     })

//     console.log('🛍️ SERVICES TROUVÉS:')
//     if (services.length === 0) {
//       console.log('  ❌ Aucun service trouvé dans la base de données')
//     } else {
//       services.forEach(service => {
//         console.log(`  ✅ ${service.name} (ID: ${service.id}, Salon: ${service.salon.name}, Actif: ${service.isActive}, Durée: ${service.duration}min)`)
//       })
//     }
//     console.log('')

//     // Vérifier les utilisateurs
//     const users = await prisma.user.count()
//     console.log(`👥 UTILISATEURS: ${users} utilisateurs trouvés\n`)

//     // Vérifier les réservations
//     const bookings = await prisma.booking.count()
//     console.log(`📅 RÉSERVATIONS: ${bookings} réservations trouvées\n`)

//     // Suggestions
//     console.log('💡 SUGGESTIONS:')
//     if (salons.length === 0) {
//       console.log('  - Créez au moins un salon via l\'interface ou avec un script de seed')
//     }
//     if (services.length === 0) {
//       console.log('  - Ajoutez des services à vos salons')
//     }
//     if (salons.some(s => !s.isActive)) {
//       console.log('  - Certains salons sont inactifs, vérifiez le statut')
//     }
//     if (services.some(s => !s.isActive)) {
//       console.log('  - Certains services sont inactifs, vérifiez le statut')
//     }

//   } catch (error) {
//     console.error('❌ Erreur lors du diagnostic:', error)
//   } finally {
//     await prisma.$disconnect()
//   }
// }

// diagnostic()