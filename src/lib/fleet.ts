export type CarCategory = 'Economy' | 'SUV' | '4x4' | 'Van' | 'Luxury';
export type Car = {
  id: string;
  slug: string;
  make: string;
  model: string;
  category: CarCategory;
  seats: number;
  transmission: 'Automatic' | 'Manual';
  fuel: 'Petrol' | 'Diesel' | 'Hybrid';
  price: number;
  image: string;
  description: string;
  features: string[];
  luggage: number;
};

export const cars: Car[] = [
  { id: 'bd-101', slug: 'city-compact', make: 'Kifaru', model: 'City Compact', category: 'Economy', seats: 5, transmission: 'Automatic', fuel: 'Petrol', price: 4500, image: '/images/coastal-drive.jpg', description: 'A nimble, comfortable choice for errands, commutes, and easy days around Nairobi.', features: ['Air conditioning', 'Bluetooth audio', 'Reverse camera', 'Unlimited city kilometres'], luggage: 2 },
  { id: 'bd-102', slug: 'family-crossover', make: 'Tembo', model: 'Family Crossover', category: 'SUV', seats: 5, transmission: 'Automatic', fuel: 'Petrol', price: 7800, image: '/images/city-suv.jpg', description: 'A spacious crossover for family plans, airport transfers, and long weekends away.', features: ['Air conditioning', 'Apple CarPlay', 'Rear camera', 'Cruise control'], luggage: 3 },
  { id: 'bd-103', slug: 'safari-4x4', make: 'Savanna', model: 'Safari 4x4', category: '4x4', seats: 7, transmission: 'Automatic', fuel: 'Diesel', price: 14500, image: '/images/safari-4x4.jpg', description: 'A capable 4x4 with room for the people and kit you need for a proper road trip.', features: ['Four wheel drive', 'High clearance', 'Roof rack', 'Roadside support'], luggage: 4 },
  { id: 'bd-104', slug: 'adventure-wagon', make: 'Acacia', model: 'Adventure Wagon', category: '4x4', seats: 7, transmission: 'Manual', fuel: 'Diesel', price: 16800, image: '/images/green-4x4.jpg', description: 'A well prepared all terrain rental for the scenic routes and the road less travelled.', features: ['Four wheel drive', 'All terrain tyres', 'Extra luggage space', 'Two spare tyres'], luggage: 5 },
  { id: 'bd-105', slug: 'people-mover', make: 'Jirani', model: 'People Mover', category: 'Van', seats: 8, transmission: 'Automatic', fuel: 'Diesel', price: 12000, image: '/images/road-trip.jpg', description: 'Bring the whole group together in a practical van with plenty of room to settle in.', features: ['Eight seats', 'Dual climate control', 'Sliding doors', 'USB charging'], luggage: 5 },
  { id: 'bd-106', slug: 'executive-sedan', make: 'Imara', model: 'Executive Sedan', category: 'Luxury', seats: 5, transmission: 'Automatic', fuel: 'Hybrid', price: 18000, image: '/images/roadside-suv.jpg', description: 'A refined, quiet ride for business travel, celebrations, and special occasions.', features: ['Leather interior', 'Hybrid efficiency', 'Premium sound', 'Driver assistance'], luggage: 3 },
  { id: 'bd-107', slug: 'urban-hatchback', make: 'Kifaru', model: 'Urban Hatchback', category: 'Economy', seats: 5, transmission: 'Manual', fuel: 'Petrol', price: 3900, image: '/images/city-traffic.jpg', description: 'An affordable everyday car that makes parking and getting around simple.', features: ['Air conditioning', 'Fuel efficient', 'USB audio', 'Compact parking'], luggage: 2 },
];

export const categories: { name: CarCategory; price: number; image: string; intro: string }[] = [
  { name: 'Economy', price: 3900, image: '/images/coastal-drive.jpg', intro: 'Easy city drives' },
  { name: 'SUV', price: 7800, image: '/images/city-suv.jpg', intro: 'Space for every plan' },
  { name: '4x4', price: 14500, image: '/images/safari-4x4.jpg', intro: 'Ready for the open road' },
  { name: 'Van', price: 12000, image: '/images/road-trip.jpg', intro: 'Bring everyone along' },
  { name: 'Luxury', price: 18000, image: '/images/roadside-suv.jpg', intro: 'A little extra comfort' },
];

export const formatKes = (value: number) => `KES ${value.toLocaleString('en-KE')}`;
export const getCar = (slug: string) => cars.find((car) => car.slug === slug);
