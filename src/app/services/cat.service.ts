// src/app/services/cat.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Cat {
  name: string;
  origin?: string;
  length?: string;
  image_link?: string;
  family_friendly?: number;
  shedding?: number;
  general_health?: number;
  playfulness?: number;
  children_friendly?: number;
  grooming?: number;
  intelligence?: number;
  other_pets_friendly?: number;
  min_weight?: number;
  max_weight?: number;
  min_life_expectancy?: number;
  max_life_expectancy?: number;
}

@Injectable({
  providedIn: 'root',
})
export class CatService {
  private catsApiUrl = 'https://api.api-ninjas.com/v1/cats';
  private apiKey = 'MDWum+fxz+txMjFmpqkbEw==d1fEpGfxlf8ghytW';

  private catBreeds = [
    'Abyssinian',
    'Aegean',
    'American Bobtail',
    'American Curl',
    'American Shorthair',
    'American Wirehair',
    'Arabian Mau',
    'Asian',
    'Asian Semi-longhair',
    'Australian Mist',
    'Balinese',
    'Bambino',
    'Bengal',
    'Birman',
    'Bombay',
    'Brazilian Shorthair',
    'British Longhair',
    'British Shorthair',
    'Burmese',
    'Burmilla',
    'California Spangled',
    'Chantilly-Tiffany',
    'Chartreux',
    'Chausie',
    'Cheetoh',
    'Colorpoint Shorthair',
    'Cornish Rex',
    'Cymric',
    'Cyprus',
    'Devon Rex',
    'Donskoy',
    'Dragon Li',
    'Egyptian Mau',
    'European Shorthair',
    'Exotic Shorthair',
    'Havana Brown',
    'Himalayan',
    'Japanese Bobtail',
    'Javanese',
    'Khao Manee',
    'Korat',
    'Kurilian Bobtail',
    'LaPerm',
    'Maine Coon',
    'Malayan',
    'Manx',
    'Munchkin',
    'Nebelung',
    'Norwegian Forest Cat',
    'Ocicat',
    'Ojos Azules',
    'Oregon Rex',
    'Oriental Bicolor',
    'Oriental Longhair',
    'Oriental Shorthair',
    'Persian',
    'Peterbald',
    'Pixie-bob',
    'Ragamuffin',
    'Ragdoll',
    'Russian Blue',
    'Russian White',
    'Savannah',
    'Scottish Fold',
    'Selkirk Rex',
    'Serengeti',
    'Siamese',
    'Siberian',
    'Singapura',
    'Snowshoe',
    'Sokoke',
    'Somali',
    'Sphynx',
    'Suphalak',
    'Thai',
    'Tonkinese',
    'Toyger',
    'Turkish Angora',
    'Turkish Van',
    'York Chocolate',
  ];

  constructor(private http: HttpClient) {}

  getCatBreeds(): string[] {
    return [...this.catBreeds].sort();
  }

  getRandomCat(): Observable<Cat[]> {
    const randomBreed = this.catBreeds[Math.floor(Math.random() * this.catBreeds.length)];
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
    });
    return this.http.get<Cat[]>(`${this.catsApiUrl}?name=${randomBreed}`, { headers });
  }

  getCatByName(name: string): Observable<Cat[]> {
    const headers = new HttpHeaders({
      'X-Api-Key': this.apiKey,
    });
    return this.http.get<Cat[]>(`${this.catsApiUrl}?name=${name}`, { headers });
  }
}