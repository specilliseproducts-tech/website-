import { PrismaClient } from '@prisma/client';
import {
  products,
  processSteps,
  collaborators,
  strengths,
} from '../lib/constants';
import * as readline from 'readline';

const prisma = new PrismaClient();

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to ask for user confirmation
function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('🌱 Starting comprehensive seed process...');

  try {
    // Check existing data and ask for confirmation
    const existingProducts = await prisma.product.count();
    const existingProcessSteps = await prisma.processStep.count();
    const existingCollaborators = await prisma.collaborator.count();
    const existingStrengths = await prisma.strength.count();

    console.log('\n📊 Current database status:');
    console.log(`   Products: ${existingProducts}`);
    console.log(`   Process Steps: ${existingProcessSteps}`);
    console.log(`   Collaborators: ${existingCollaborators}`);
    console.log(`   Strengths: ${existingStrengths}\n`);

    let shouldClearData = false;
    if (
      existingProducts > 0 ||
      existingProcessSteps > 0 ||
      existingCollaborators > 0 ||
      existingStrengths > 0
    ) {
      const answer = await askQuestion(
        '⚠️  Database contains existing data. Do you want to delete and reseed all data? (y/N): ',
      );
      shouldClearData =
        answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
    }

    if (shouldClearData) {
      console.log('🗑️  Clearing existing data...');
      await prisma.strength.deleteMany();
      await prisma.collaborator.deleteMany();
      await prisma.processStep.deleteMany();
      await prisma.product.deleteMany();
      console.log('✅ Existing data cleared');
    }

    // Seed Products
    if (shouldClearData || existingProducts === 0) {
      console.log('📦 Seeding products...');
      for (const product of products) {
        const productData = {
          slug: product.slug,
          name: product.name,
          shortDescription: product.shortDescription,
          description: product.description.trim(),
          features: product.features,
          applications: product.applications,
          modelPath: product.modelPath,
          imagePath: product.imagePath,
          color: product.color,
          category: product.category,
          brochureUrl: product.brochureUrl,
        };

        const createdProduct = await prisma.product.create({
          data: productData,
        });

        console.log(`   ✅ Created product: ${createdProduct.name}`);
      }
      console.log(`📊 Created ${products.length} products\n`);
    } else {
      console.log('⏭️  Skipping products (already exist)\n');
    }

    // Seed Process Steps
    if (shouldClearData || existingProcessSteps === 0) {
      console.log('🔄 Seeding process steps...');
      for (const step of processSteps) {
        const createdStep = await prisma.processStep.create({
          data: {
            number: step.number,
            title: step.title,
            description: step.description,
          },
        });

        console.log(
          `   ✅ Created step: ${createdStep.number} - ${createdStep.title}`,
        );
      }
      console.log(`📊 Created ${processSteps.length} process steps\n`);
    } else {
      console.log('⏭️  Skipping process steps (already exist)\n');
    }

    // Seed Collaborators
    if (shouldClearData || existingCollaborators === 0) {
      console.log('🤝 Seeding collaborators...');
      for (const collaborator of collaborators) {
        const createdCollaborator = await prisma.collaborator.create({
          data: {
            name: collaborator.name,
            description: collaborator.description,
            longDescription: collaborator.longDescription,
            logo: collaborator.logo,
            website: collaborator.website,
          },
        });

        console.log(`   ✅ Created collaborator: ${createdCollaborator.name}`);
      }
      console.log(`📊 Created ${collaborators.length} collaborators\n`);
    } else {
      console.log('⏭️  Skipping collaborators (already exist)\n');
    }

    // Seed Strengths
    if (shouldClearData || existingStrengths === 0) {
      console.log('💪 Seeding company strengths...');
      for (const strength of strengths) {
        const createdStrength = await prisma.strength.create({
          data: {
            icon: strength.icon,
            title: strength.title,
            description: strength.description,
          },
        });

        console.log(`   ✅ Created strength: ${createdStrength.title}`);
      }
      console.log(`📊 Created ${strengths.length} strengths\n`);
    } else {
      console.log('⏭️  Skipping strengths (already exist)\n');
    }

    console.log('🎉 Seed process completed successfully!');

    // Show final summary
    const finalProducts = await prisma.product.count();
    const finalProcessSteps = await prisma.processStep.count();
    const finalCollaborators = await prisma.collaborator.count();
    const finalStrengths = await prisma.strength.count();

    console.log('\n📈 Final database summary:');
    console.log(`   Products: ${finalProducts}`);
    console.log(`   Process Steps: ${finalProcessSteps}`);
    console.log(`   Collaborators: ${finalCollaborators}`);
    console.log(`   Strengths: ${finalStrengths}`);
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    rl.close();
  }
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
