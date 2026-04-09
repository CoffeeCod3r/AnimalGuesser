import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AnimalService, Animal } from '../../services/animal.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './game.html',
  styleUrls: ['./game.css'],
})
export class GameComponent implements OnInit {
  animal: Animal | null = null;
  selectedAnimal: string = '';
  attempts: number = 0;
  maxAttempts: number = 5;
  gameState: 'playing' | 'won' | 'lost' = 'playing';
  loading: boolean = false;
  score: number = 0;
  hintsRevealed: number = 1;
  animalOptions: string[] = [];
  filteredOptions: string[] = [];
  searchTerm: string = '';
  showDropdown: boolean = false;
  isCatMode: boolean = false;

  constructor(private animalService: AnimalService, private router: Router) {}

  ngOnInit(): void {
    this.animalOptions = this.animalService.getAnimalNames();
    this.filteredOptions = [...this.animalOptions];
    this.loadNewAnimal();
  }

  loadNewAnimal(): void {
    this.loading = true;
    this.gameState = 'playing';
    this.selectedAnimal = '';
    this.searchTerm = '';
    this.attempts = 0;
    this.hintsRevealed = 1;
    this.showDropdown = false;

    const attemptFetch = (retriesLeft: number = 10): void => {
      if (retriesLeft <= 0) {
        this.loading = false;
        console.error('Failed to load animal after multiple attempts');
        return;
      }

      this.animalService.getRandomAnimal().subscribe({
        next: (data) => {
          if (data && data.length > 0 && data[0].characteristics) {
            this.animal = data[0];
            this.loading = false;
          } else {
            attemptFetch(retriesLeft - 1);
          }
        },
        error: (err) => {
          console.error('Error fetching animal:', err);
          attemptFetch(retriesLeft - 1);
        },
      });
    };

    attemptFetch();
  }

  filterAnimals(): void {
    const search = this.searchTerm.toLowerCase().trim();
    if (search) {
      this.filteredOptions = this.animalOptions.filter((animal) =>
        animal.toLowerCase().includes(search)
      );
      this.showDropdown = true;
    } else {
      this.filteredOptions = [...this.animalOptions];
      this.showDropdown = false;
    }
  }

  selectAnimal(animal: string): void {
    this.selectedAnimal = animal;
    this.searchTerm = animal;
    this.showDropdown = false;
  }

  getHints(): Array<{ label: string; value: string }> {
    if (!this.animal?.characteristics) return [];

    const allHints = [
      {
        label: 'Location',
        value: this.animal.locations?.[0] || this.animal.characteristics.location || 'Unknown',
      },
      {
        label: 'Habitat',
        value: this.animal.characteristics.habitat || 'Unknown',
      },
      {
        label: 'Diet',
        value: this.animal.characteristics.diet || 'Unknown',
      },
      {
        label: 'Lifestyle',
        value: this.animal.characteristics.lifestyle || 'Unknown',
      },
      {
        label: 'Skin Type',
        value: this.animal.characteristics.skin_type || 'Unknown',
      },
      {
        label: 'Top Speed',
        value: this.animal.characteristics.top_speed || 'Unknown',
      },
      {
        label: 'Color',
        value: this.animal.characteristics.color || 'Unknown',
      },
      {
        label: 'Weight',
        value: this.animal.characteristics.weight || 'Unknown',
      },
      {
        label: 'Prey',
        value: this.animal.characteristics.prey || 'Unknown',
      },
      {
        label: 'Lifespan',
        value: this.animal.characteristics.lifespan || 'Unknown',
      },
      {
        label: 'Length',
        value: this.animal.characteristics.length || 'Unknown',
      },
      {
        label: 'Group Behavior',
        value: this.animal.characteristics.group_behavior || 'Unknown',
      },
      {
        label: 'Most Distinctive Feature',
        value: this.animal.characteristics.most_distinctive_feature || 'Unknown',
      },
      {
        label: 'Biggest Threat',
        value: this.animal.characteristics.biggest_threat || 'Unknown',
      },
      {
        label: 'Name of Young',
        value: this.animal.characteristics.name_of_young || 'Unknown',
      },
    ].filter((hint) => hint.value !== 'Unknown');

    return allHints.slice(0, this.hintsRevealed);
  }

  revealHint(): void {
    const maxHints = this.getMaxAvailableHints();
    if (this.hintsRevealed < maxHints && this.animal?.characteristics) {
      this.hintsRevealed++;
    }
  }

  getMaxAvailableHints(): number {
    if (!this.animal?.characteristics) return 0;

    const allHints = [
      this.animal.locations?.[0] || this.animal.characteristics.location,
      this.animal.characteristics.habitat,
      this.animal.characteristics.diet,
      this.animal.characteristics.lifestyle,
      this.animal.characteristics.skin_type,
      this.animal.characteristics.top_speed,
      this.animal.characteristics.color,
      this.animal.characteristics.weight,
      this.animal.characteristics.prey,
      this.animal.characteristics.lifespan,
      this.animal.characteristics.length,
      this.animal.characteristics.group_behavior,
      this.animal.characteristics.most_distinctive_feature,
      this.animal.characteristics.biggest_threat,
      this.animal.characteristics.name_of_young,
    ];

    return allHints.filter((hint) => hint && hint !== 'Unknown').length;
  }

  checkGuess(): void {
    if (!this.animal) return;

    console.log('Animal:', this.animal.name);

    // Sprawdź czy użytkownik coś wpisał
    if (!this.searchTerm.trim()) {
      alert('Please enter your guess!');
      return;
    }

    this.attempts++;
    const userGuess = this.searchTerm.toLowerCase().trim();
    const normalizedAnswer = this.animal.name.toLowerCase().trim();
    const commonName = this.animal.characteristics?.common_name?.toLowerCase().trim();

    // Sprawdź czy odpowiedź jest poprawna
    const isCorrect =
      userGuess === normalizedAnswer ||
      userGuess === commonName ||
      this.isAlternativeName(userGuess, normalizedAnswer);

    if (isCorrect) {
      this.gameState = 'won';
      const baseScore = 100;
      const hintPenalty = (this.hintsRevealed - 1) * 10;
      const attemptPenalty = (this.attempts - 1) * 5;
      this.score += Math.max(10, baseScore - hintPenalty - attemptPenalty);
    } else if (this.attempts >= this.maxAttempts) {
      this.gameState = 'lost';
    } else {
      this.searchTerm = '';
      this.showDropdown = false;
      this.revealHint();
    }
  }

  switchMode() {
    this.router.navigate(['/cats']);
  }

  // Dodaj metodę do sprawdzania alternatywnych nazw
  isAlternativeName(userGuess: string, correctName: string): boolean {
    // Słownik alternatywnych nazw zwierząt
    const alternativeNames: { [key: string]: string[] } = {
      lion: ['panthera leo', 'african lion'],
      tiger: ['panthera tigris'],
      elephant: ['african elephant', 'asian elephant', 'loxodonta africana', 'elephas maximus'],
      giraffe: ['giraffa camelopardalis'],
      zebra: ['equus quagga'],
      penguin: ['emperor penguin', 'adelie penguin'],
      kangaroo: ['red kangaroo', 'macropus rufus'],
      panda: ['giant panda', 'ailuropoda melanoleuca'],
      cheetah: ['acinonyx jubatus'],
      wolf: ['gray wolf', 'canis lupus'],
      fox: ['red fox', 'vulpes vulpes'],
      bear: ['brown bear', 'ursus arctos', 'polar bear', 'ursus maritimus'],
      rhinoceros: ['white rhino', 'black rhino'],
      hippopotamus: ['hippo', 'hippopotamus amphibius'],
      crocodile: ['nile crocodile', 'crocodylus niloticus'],
      eagle: ['bald eagle', 'golden eagle'],
      shark: ['great white shark', 'white shark', 'carcharodon carcharias'],
    };

    // Sprawdź czy użytkownik wpisał alternatywną nazwę
    if (alternativeNames[correctName]) {
      return alternativeNames[correctName].includes(userGuess);
    }

    // Dodatkowe sprawdzenie - czy odpowiedź zawiera kluczowe słowa
    const partialMatches = [
      { correct: 'lion', alternatives: ['lion', 'panthera leo'] },
      { correct: 'tiger', alternatives: ['tiger', 'panthera tigris'] },
      { correct: 'elephant', alternatives: ['elephant', 'african elephant', 'asian elephant'] },
      { correct: 'bear', alternatives: ['bear', 'brown bear', 'polar bear'] },
      { correct: 'wolf', alternatives: ['wolf', 'gray wolf'] },
      { correct: 'fox', alternatives: ['fox', 'red fox'] },
      { correct: 'eagle', alternatives: ['eagle', 'bald eagle'] },
      { correct: 'shark', alternatives: ['shark', 'white shark'] },
    ];

    const match = partialMatches.find((m) => m.correct === correctName);
    if (match && match.alternatives.some((alt) => userGuess.includes(alt))) {
      return true;
    }

    return false;
  }

  playAgain(): void {
    this.score = 0;
    this.loadNewAnimal();
  }
}
