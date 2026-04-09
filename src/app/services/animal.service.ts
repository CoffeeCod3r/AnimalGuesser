import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Animal {
  name: string;
  taxonomy?: {
    kingdom?: string;
    phylum?: string;
    class?: string;
    order?: string;
    family?: string;
    genus?: string;
    scientific_name?: string;
  };
  locations?: string[];
  characteristics?: {
    prey?: string;
    name_of_young?: string;
    group_behavior?: string;
    estimated_population_size?: string;
    biggest_threat?: string;
    most_distinctive_feature?: string;
    gestation_period?: string;
    habitat?: string;
    diet?: string;
    average_litter_size?: string;
    lifestyle?: string;
    common_name?: string;
    number_of_species?: string;
    location?: string;
    color?: string;
    skin_type?: string;
    top_speed?: string;
    lifespan?: string;
    weight?: string;
    length?: string;
  };
}

export interface AnimalImage {
  thumbnail: string;
  source: string;
  title: string;
  original: string;
}

export interface GoogleImagesResponse {
  images_results: AnimalImage[];
  search_metadata: {
    status: string;
  };
}

@Injectable({
  providedIn: 'root',
})
export class AnimalService {
  private animalsApiUrl = 'https://api.api-ninjas.com/v1/animals';
  private animalsApiKey = 'MDWum+fxz+txMjFmpqkbEw==d1fEpGfxlf8ghytW';

  private serpApiUrl = 'https://serpapi.com/search.json';
  private serpApiKey = 'e122b528e6185fc13b6852123700ebb1334262e1ef55a358a438a207d6db1a2d';

  private animalNames = [
    // Ssaki lądowe - duże
    'lion',
    'tiger',
    'elephant',
    'giraffe',
    'zebra',
    'cheetah',
    'leopard',
    'jaguar',
    'panther',
    'puma',
    'cougar',
    'lynx',
    'bobcat',
    'bear',
    'grizzly bear',
    'polar bear',
    'black bear',
    'panda',
    'wolf',
    'fox',
    'coyote',
    'jackal',
    'hyena',
    'deer',
    'moose',
    'elk',
    'reindeer',
    'caribou',
    'antelope',
    'gazelle',
    'impala',
    'buffalo',
    'bison',
    'yak',
    'ox',
    'hippo',
    'hippopotamus',
    'rhino',
    'rhinoceros',

    // Ssaki - małpy i naczelne
    'gorilla',
    'chimpanzee',
    'orangutan',
    'baboon',
    'monkey',
    'lemur',
    'gibbon',

    // Ssaki - torbacze i australijskie
    'kangaroo',
    'wallaby',
    'koala',
    'wombat',
    'tasmanian devil',
    'opossum',

    // Ssaki - gryzonie i małe
    'rabbit',
    'hare',
    'squirrel',
    'chipmunk',
    'beaver',
    'porcupine',
    'hedgehog',
    'mouse',
    'rat',
    'hamster',
    'guinea pig',
    'chinchilla',
    'mole',
    'shrew',
    'vole',

    // Ssaki domowe
    'cat',
    'dog',
    'horse',
    'donkey',
    'cow',
    'pig',
    'sheep',
    'goat',
    'llama',
    'alpaca',

    // Ptaki - drapieżne
    'eagle',
    'hawk',
    'falcon',
    'owl',
    'vulture',
    'kite',
    'osprey',

    // Ptaki - wodne i nadwodne
    'penguin',
    'pelican',
    'swan',
    'duck',
    'goose',
    'heron',
    'crane',
    'stork',
    'flamingo',
    'albatross',
    'seagull',
    'puffin',
    'cormorant',

    // Ptaki - inne
    'parrot',
    'macaw',
    'cockatoo',
    'parakeet',
    'toucan',
    'peacock',
    'turkey',
    'chicken',
    'rooster',
    'pheasant',
    'quail',
    'ostrich',
    'emu',
    'cassowary',
    'kiwi',
    'crow',
    'raven',
    'magpie',
    'jay',
    'sparrow',
    'robin',
    'cardinal',
    'woodpecker',
    'hummingbird',
    'kingfisher',
    'swallow',

    // Gady
    'crocodile',
    'alligator',
    'caiman',
    'snake',
    'python',
    'boa',
    'cobra',
    'viper',
    'rattlesnake',
    'anaconda',
    'lizard',
    'iguana',
    'gecko',
    'chameleon',
    'monitor lizard',
    'komodo dragon',
    'turtle',
    'tortoise',
    'sea turtle',

    // Płazy
    'frog',
    'toad',
    'tree frog',
    'bullfrog',
    'salamander',
    'newt',
    'axolotl',

    // Ryby
    'shark',
    'great white shark',
    'hammerhead shark',
    'whale shark',
    'tiger shark',
    'ray',
    'stingray',
    'manta ray',
    'electric ray',
    'tuna',
    'salmon',
    'trout',
    'bass',
    'pike',
    'carp',
    'catfish',
    'goldfish',
    'betta',
    'angelfish',
    'clownfish',
    'swordfish',
    'marlin',
    'barracuda',
    'eel',
    'moray eel',
    'seahorse',
    'pufferfish',
    'piranha',

    // Ssaki morskie
    'whale',
    'blue whale',
    'humpback whale',
    'orca',
    'killer whale',
    'dolphin',
    'porpoise',
    'seal',
    'sea lion',
    'walrus',
    'otter',
    'sea otter',
    'manatee',
    'dugong',

    // Bezkręgowce - owady
    'ant',
    'bee',
    'wasp',
    'hornet',
    'butterfly',
    'moth',
    'beetle',
    'ladybug',
    'dragonfly',
    'damselfly',
    'grasshopper',
    'cricket',
    'mosquito',
    'fly',
    'flea',
    'louse',
    'termite',
    'mantis',
    'praying mantis',
    'stick insect',
    'caterpillar',

    // Bezkręgowce - pajęczaki
    'spider',
    'tarantula',
    'scorpion',
    'tick',
    'mite',

    // Bezkręgowce - inne
    'crab',
    'lobster',
    'shrimp',
    'crayfish',
    'barnacle',
    'octopus',
    'squid',
    'cuttlefish',
    'nautilus',
    'jellyfish',
    'sea anemone',
    'coral',
    'starfish',
    'sea urchin',
    'snail',
    'slug',
    'clam',
    'oyster',
    'mussel',
    'scallop',
    'worm',
    'earthworm',
    'leech',
    'centipede',
    'millipede',

    // Ssaki egzotyczne/rzadkie
    'sloth',
    'anteater',
    'armadillo',
    'aardvark',
    'platypus',
    'echidna',
    'meerkat',
    'mongoose',
    'badger',
    'weasel',
    'ferret',
    'mink',
    'skunk',
    'raccoon',
    'bat',
    'fruit bat',
    'vampire bat',
    'camel',
    'dromedary',
  ];

  constructor(private http: HttpClient) {}

  getAnimalNames(): string[] {
    return [...this.animalNames].sort();
  }

  getRandomAnimal(): Observable<Animal[]> {
    const randomName = this.animalNames[Math.floor(Math.random() * this.animalNames.length)];
    const headers = new HttpHeaders({
      'X-Api-Key': this.animalsApiKey,
    });
    return this.http.get<Animal[]>(`${this.animalsApiUrl}?name=${randomName}`, { headers });
  }

  getAnimalImages(animalName: string): Observable<GoogleImagesResponse> {
    const params = {
      engine: 'google_images',
      q: `${animalName} animal`,
      api_key: this.serpApiKey,
      tbm: 'isch',
      ijn: '0',
    };

    return this.http.get<GoogleImagesResponse>(this.serpApiUrl, { params });
  }

  getRandomAnimalWithImages(): Observable<{ animal: Animal[]; images: AnimalImage[] }> {
    return new Observable((observer) => {
      this.getRandomAnimal().subscribe({
        next: (animalData) => {
          if (animalData && animalData.length > 0) {
            const animalName = animalData[0].name;
            this.getAnimalImages(animalName).subscribe({
              next: (imageData) => {
                observer.next({
                  animal: animalData,
                  images: imageData.images_results || [],
                });
                observer.complete();
              },
              error: (imageError) => {
                console.error('Error fetching animal images:', imageError);
                observer.next({
                  animal: animalData,
                  images: [],
                });
                observer.complete();
              },
            });
          } else {
            observer.next({
              animal: [],
              images: [],
            });
            observer.complete();
          }
        },
        error: (animalError) => {
          console.error('Error fetching animal data:', animalError);
          observer.error(animalError);
        },
      });
    });
  }

  getAnimalByNameWithImages(
    animalName: string
  ): Observable<{ animal: Animal[]; images: AnimalImage[] }> {
    return new Observable((observer) => {
      const headers = new HttpHeaders({
        'X-Api-Key': this.animalsApiKey,
      });

      this.http.get<Animal[]>(`${this.animalsApiUrl}?name=${animalName}`, { headers }).subscribe({
        next: (animalData) => {
          this.getAnimalImages(animalName).subscribe({
            next: (imageData) => {
              observer.next({
                animal: animalData,
                images: imageData.images_results || [],
              });
              observer.complete();
            },
            error: (imageError) => {
              console.error('Error fetching animal images:', imageError);
              observer.next({
                animal: animalData,
                images: [],
              });
              observer.complete();
            },
          });
        },
        error: (animalError) => {
          console.error('Error fetching animal data:', animalError);
          observer.error(animalError);
        },
      });
    });
  }
}
