import type { TaskInput } from '../types/task';

// --- פונקציה ליצירת תאריך אקראי ---
const getRandomDate = (): string => {
  const today = new Date();
  const future = new Date();
  future.setDate(today.getDate() + 30); // עד חודש קדימה

  const randomTime = today.getTime() + Math.random() * (future.getTime() - today.getTime());
  return new Date(randomTime).toISOString().split('T')[0];
};

export const aiSuggestions: TaskInput[] = [
  // --- Workout ---
  {
    title: 'Do 20 push-ups',
    category: 'Workout',
    description: 'Quick morning bodyweight exercise',
    date: getRandomDate(),
  },
  {
    title: 'Practice kickboxing combo',
    category: 'Workout',
    description: '3 rounds of jab-cross-kick combinations',
    date: getRandomDate(),
  },
  {
    title: 'Run 3 km',
    category: 'Workout',
    description: 'Light jog to improve endurance',
    date: getRandomDate(),
  },
  {
    title: 'Plank challenge',
    category: 'Workout',
    description: 'Hold plank for 2 minutes',
    date: getRandomDate(),
  },
  {
    title: 'Leg day routine',
    category: 'Workout',
    description: 'Squats, lunges, calf raises',
    date: getRandomDate(),
  },

  // --- Nutrition ---
  {
    title: 'Prepare smoothie',
    category: 'Nutrition',
    description: 'Banana + protein powder + almond milk',
    date: getRandomDate(),
  },
  {
    title: 'Cook grilled chicken salad',
    category: 'Nutrition',
    description: 'Healthy lunch with veggies',
    date: getRandomDate(),
  },
  {
    title: 'Meal prep for the week',
    category: 'Nutrition',
    description: 'Plan and prepare meals in advance',
    date: getRandomDate(),
  },
  {
    title: 'Try a new healthy recipe',
    category: 'Nutrition',
    description: 'Experiment with quinoa or lentils',
    date: getRandomDate(),
  },
  {
    title: 'Drink 2 liters of water',
    category: 'Nutrition',
    description: 'Stay hydrated throughout the day',
    date: getRandomDate(),
  },

  // --- Guitar ---
  {
    title: 'Practice major scales',
    category: 'Guitar',
    description: 'Focus on 3 positions across the neck',
    date: getRandomDate(),
  },
  {
    title: 'Learn a new Paramore song',
    category: 'Guitar',
    description: 'Work on chords and timing',
    date: getRandomDate(),
  },
  {
    title: 'Finger exercises',
    category: 'Guitar',
    description: 'Improve speed and accuracy',
    date: getRandomDate(),
  },
  {
    title: 'Practice improvisation',
    category: 'Guitar',
    description: 'Jam over backing track in E minor',
    date: getRandomDate(),
  },
  {
    title: 'Buy new guitar accessory',
    category: 'Guitar',
    description: 'Consider a pedal or strap',
    date: getRandomDate(),
  },

  // --- Events ---
  {
    title: 'Go to a jam session',
    category: 'Events',
    description: 'Play with other musicians',
    date: getRandomDate(),
  },
  {
    title: 'Meet a friend for coffee',
    category: 'Events',
    description: 'Catch up and chat',
    date: getRandomDate(),
  },
  {
    title: 'Attend a local meetup',
    category: 'Events',
    description: 'Network and meet new people',
    date: getRandomDate(),
  },
  {
    title: 'Visit a museum or gallery',
    category: 'Events',
    description: 'Explore art and exhibitions',
    date: getRandomDate(),
  },
  {
    title: 'Plan a weekend outing',
    category: 'Events',
    description: 'Hike, picnic, or small trip',
    date: getRandomDate(),
  },
];