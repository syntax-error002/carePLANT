import type { Disease } from './types';

export const DISEASES: Disease[] = [
  {
    id: '1',
    slug: 'late-blight-tomato',
    name: 'Late Blight',
    description:
      'Late blight, caused by the oomycete Phytophthora infestans, is a devastating disease of tomatoes and potatoes. It thrives in cool, moist conditions and can spread rapidly, wiping out entire crops.',
    symptoms: [
      'Large, dark, water-soaked spots on leaves, often with a pale green or yellow halo.',
      'White, fuzzy mold on the underside of leaves, especially in humid weather.',
      'Dark, greasy-looking lesions on stems.',
      'Firm, dark, rotting spots on fruits.',
    ],
    causes: [
      'Spores spreading from infected plants or potato tubers.',
      'High humidity and prolonged leaf wetness.',
      'Cool to moderate temperatures (60-70°F or 15-21°C).',
    ],
    prevention: [
      'Plant resistant varieties.',
      'Ensure good air circulation through proper spacing and pruning.',
      'Water at the base of the plant to keep foliage dry.',
      'Rotate crops and remove volunteer potato and tomato plants.',
      'Inspect plants regularly, especially during cool, wet weather.',
    ],
    treatment: {
      organic: [
        'Remove and destroy infected plant parts immediately.',
        'Apply copper-based fungicides as a preventative or at first sign of disease.',
        'Improve air circulation to dry out plants.',
      ],
      chemical: [
        'Apply fungicides containing chlorothalonil, mancozeb, or other targeted chemicals.',
        'Follow a regular spray schedule as recommended by local extension services.',
      ],
    },
    imageUrl: 'https://picsum.photos/seed/101/800/600',
    imageHint: 'diseased tomato',
  },
  {
    id: '2',
    slug: 'powdery-mildew-squash',
    name: 'Powdery Mildew',
    description:
      'Powdery mildew is a common fungal disease affecting a wide variety of plants, including squash and cucumbers. It appears as white, powdery spots on leaves and stems.',
    symptoms: [
      'White, powdery spots on leaves, stems, and sometimes fruit.',
      'Leaves may turn yellow and dry out.',
      'Stunted growth and reduced yield.',
    ],
    causes: [
      'Fungal spores spread by wind.',
      'High humidity at night and dry conditions during the day.',
      'Poor air circulation and shaded conditions.',
    ],
    prevention: [
      'Choose resistant varieties.',
      'Provide adequate spacing for good air flow.',
      'Plant in sunny locations.',
      'Avoid over-fertilizing with nitrogen.',
    ],
    treatment: {
      organic: [
        'Spray with a solution of baking soda (1 tbsp per gallon of water with a drop of soap).',
        'Apply horticultural oils or neem oil.',
        'Use milk spray (1 part milk to 9 parts water).',
      ],
      chemical: [
        'Apply fungicides containing sulfur, potassium bicarbonate, or myclobutanil.',
        'Rotate fungicides to prevent resistance.',
      ],
    },
    imageUrl: 'https://picsum.photos/seed/102/800/600',
    imageHint: 'diseased squash',
  },
  {
    id: '3',
    slug: 'leaf-rust-wheat',
    name: 'Leaf Rust',
    description:
      'Leaf rust is a fungal disease that affects cereal crops like wheat and barley. It produces small, orange-brown pustules on the upper surfaces of leaves, reducing the plant\'s photosynthetic ability.',
    symptoms: [
      'Small, circular to oval, orange-brown pustules on leaves.',
      'Pustules may be surrounded by a yellow halo.',
      'In severe cases, leaves may turn yellow and die prematurely.',
    ],
    causes: [
      'Fungus Puccinia triticina.',
      'Spores spread by wind over long distances.',
      'Mild temperatures (60-77°F or 15-25°C) and moist conditions.',
    ],
    prevention: [
      'Plant resistant wheat varieties.',
      'Early planting can help crops mature before rust becomes severe.',
      'Control volunteer wheat and wild grasses that can host the fungus.',
    ],
    treatment: {
      organic: ['There are limited effective organic treatments for large-scale agriculture. Focus on prevention.'],
      chemical: [
        'Apply foliar fungicides, especially triazole and strobilurin types.',
        'Timing of application is critical and should be based on scouting and disease forecasting.',
      ],
    },
    imageUrl: 'https://picsum.photos/seed/103/800/600',
    imageHint: 'diseased wheat',
  },
  {
    id: '4',
    slug: 'black-spot-rose',
    name: 'Black Spot',
    description:
      'Black spot is a common fungal disease of roses caused by Diplocarpon rosae. It manifests as black spots on leaves, which then turn yellow and drop off, weakening the plant.',
    symptoms: [
      'Circular black spots with fringed margins on the upper side of leaves.',
      'Yellowing of the area surrounding the spots.',
      'Premature leaf drop, leading to defoliation.',
      'Raised, purplish-red spots may appear on canes.',
    ],
    causes: [
      'Fungal spores spreading via water splash (rain or irrigation).',
      'At least seven hours of leaf wetness for spore germination.',
      'Warm, humid weather.',
    ],
    prevention: [
      'Select disease-resistant rose varieties.',
      'Ensure good air circulation and prune to open up the plant.',
      'Water the soil, not the leaves, and do so in the morning.',
      'Clean up and destroy fallen leaves and infected canes.',
      'Apply a dormant spray in late winter/early spring.',
    ],
    treatment: {
      organic: [
        'Remove infected leaves and canes promptly.',
        'Apply neem oil or sulfur-based fungicides weekly.',
        'Use a baking soda spray as a preventative.',
      ],
      chemical: [
        'Apply fungicides containing myclobutanil, tebuconazole, or chlorothalonil.',
        'Begin applications in spring and continue on a 7- to 14-day schedule.',
      ],
    },
    imageUrl: 'https://picsum.photos/seed/104/800/600',
    imageHint: 'diseased rose',
  },
];

export function getDiseaseBySlug(slug: string): Disease | undefined {
  return DISEASES.find((disease) => disease.slug === slug);
}

export function getDiseaseById(id: string): Disease | undefined {
  return DISEASES.find((disease) => disease.id === id);
}
