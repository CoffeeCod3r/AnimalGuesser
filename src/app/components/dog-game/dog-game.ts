// src/app/components/dog-game/dog-game.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Dog, DogService } from '../../services/dog.service';

type GameState = 'playing' | 'won' | 'lost';

interface Hint {
  label: string;
  value: string;
  icon?: string;
}

@Component({
  selector: 'app-dog-game',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dog-game.html',
  styleUrls: ['./dog-game.css'],
})
export class DogGameComponent implements OnInit {
  dog: Dog | null = null;
  loading = false;
  gameState: GameState = 'playing';
  imageLoading = false;

  score = 0;
  attempts = 0;
  maxAttempts = 3;

  hintsRevealed = 0;
  availableHints: Hint[] = [];

  searchTerm = '';
  selectedGuess = '';
  showDropdown = false;
  filteredOptions: string[] = [];
  allDogBreeds: string[] = [];

  constructor(private dogService: DogService) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.select-wrapper')) {
      this.showDropdown = false;
    }
  }

  ngOnInit(): void {
    this.loadDogBreeds();
    this.loadNewDog();
  }

  loadDogBreeds(): void {
    this.allDogBreeds = this.dogService.getDogBreeds();
  }

  loadNewDog(): void {
    this.loading = true;
    this.imageLoading = true;
    this.gameState = 'playing';
    this.hintsRevealed = 0;
    this.searchTerm = '';
    this.selectedGuess = '';
    this.showDropdown = false;
    this.attempts = 0;

    this.dogService.getRandomDog().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.dog = data[0];
          this.prepareHints();
          this.loading = false;

          // Automatically reveal first hint
          setTimeout(() => {
            if (this.hintsRevealed === 0) {
              this.revealHint();
            }
          }, 100);
        } else {
          console.error('No dog data received');
          this.loading = false;
          setTimeout(() => this.loadNewDog(), 1000);
        }
      },
      error: (err) => {
        console.error('Error loading dog:', err);
        this.loading = false;
        setTimeout(() => this.loadNewDog(), 1000);
      },
    });
  }

  onImageLoad(): void {
    this.imageLoading = false;
  }

  onImageError(): void {
    this.imageLoading = false;
    console.error('Failed to load dog image');
  }

  prepareHints(): void {
    if (!this.dog) return;

    this.availableHints = [];

    // Height hint (average of male and female)
    if (this.dog.min_height_male && this.dog.max_height_male) {
      const avgHeight = (this.dog.min_height_male + this.dog.max_height_male) / 2;
      this.availableHints.push({
        label: 'Average Height',
        value: `${avgHeight.toFixed(1)} inches`,
        icon: '📏',
      });
    }

    // Weight hint (average of male)
    if (this.dog.min_weight_male && this.dog.max_weight_male) {
      const avgWeight = (this.dog.min_weight_male + this.dog.max_weight_male) / 2;
      this.availableHints.push({
        label: 'Average Weight',
        value: `${avgWeight.toFixed(0)} lbs`,
        icon: '⚖️',
      });
    }

    if (this.dog.min_life_expectancy && this.dog.max_life_expectancy) {
      this.availableHints.push({
        label: 'Life Expectancy',
        value: `${this.dog.min_life_expectancy} - ${this.dog.max_life_expectancy} years`,
        icon: '⏳',
      });
    }

    if (this.dog.playfulness !== undefined) {
      this.availableHints.push({
        label: 'Playfulness',
        value: this.getRatingText(this.dog.playfulness),
        icon: '🎾',
      });
    }

    if (this.dog.trainability !== undefined) {
      this.availableHints.push({
        label: 'Trainability',
        value: this.getRatingText(this.dog.trainability),
        icon: '🎓',
      });
    }

    if (this.dog.good_with_children !== undefined) {
      this.availableHints.push({
        label: 'Good with Children',
        value: this.getRatingText(this.dog.good_with_children),
        icon: '👨‍👩‍👧‍👦',
      });
    }

    if (this.dog.good_with_other_dogs !== undefined) {
      this.availableHints.push({
        label: 'Good with Other Dogs',
        value: this.getRatingText(this.dog.good_with_other_dogs),
        icon: '🐕',
      });
    }

    if (this.dog.good_with_strangers !== undefined) {
      this.availableHints.push({
        label: 'Good with Strangers',
        value: this.getRatingText(this.dog.good_with_strangers),
        icon: '👋',
      });
    }

    if (this.dog.shedding !== undefined) {
      this.availableHints.push({
        label: 'Shedding',
        value: this.getRatingText(this.dog.shedding),
        icon: '🧹',
      });
    }

    if (this.dog.grooming !== undefined) {
      this.availableHints.push({
        label: 'Grooming Needs',
        value: this.getGroomingText(this.dog.grooming),
        icon: '✂️',
      });
    }

    if (this.dog.energy !== undefined) {
      this.availableHints.push({
        label: 'Energy Level',
        value: this.getRatingText(this.dog.energy),
        icon: '⚡',
      });
    }

    if (this.dog.barking !== undefined) {
      this.availableHints.push({
        label: 'Barking Level',
        value: this.getBarkingText(this.dog.barking),
        icon: '🔊',
      });
    }

    if (this.dog.protectiveness !== undefined) {
      this.availableHints.push({
        label: 'Protectiveness',
        value: this.getRatingText(this.dog.protectiveness),
        icon: '🛡️',
      });
    }

    if (this.dog.drooling !== undefined) {
      this.availableHints.push({
        label: 'Drooling',
        value: this.getRatingText(this.dog.drooling),
        icon: '💧',
      });
    }

    if (this.availableHints.length < 3) {
      this.addFallbackHints();
    }
  }

  addFallbackHints(): void {
    if (!this.dog) return;

    if (this.availableHints.length === 0) {
      this.availableHints.push({
        label: 'Type',
        value: 'Dog Breed',
        icon: '🐶',
      });
    }

    if (this.availableHints.length < 2) {
      this.availableHints.push({
        label: 'Coat',
        value: 'Various types and lengths',
        icon: '🦮',
      });
    }

    if (this.availableHints.length < 3) {
      this.availableHints.push({
        label: 'Temperament',
        value: 'Varies by breed',
        icon: '😊',
      });
    }
  }

  getHints(): Hint[] {
    return this.availableHints.slice(0, this.hintsRevealed);
  }

  getMaxAvailableHints(): number {
    return this.availableHints.length;
  }

  revealHint(): void {
    if (this.hintsRevealed < this.availableHints.length) {
      this.hintsRevealed++;
    }
  }

  filterDogs(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (term.length === 0) {
      this.filteredOptions = [];
      this.showDropdown = false;
      return;
    }

    this.filteredOptions = this.allDogBreeds.filter((breed) => breed.toLowerCase().includes(term));
    this.showDropdown = this.filteredOptions.length > 0;
  }

  selectDog(dogBreed: string): void {
    this.selectedGuess = dogBreed;
    this.searchTerm = dogBreed;
    this.showDropdown = false;
  }

  checkGuess(): void {
    if (!this.searchTerm.trim() || !this.dog) return;

    console.log('Selected Guess:', this.dog.name);
    const guessToCheck = this.selectedGuess || this.searchTerm;
    this.attempts++;

    const normalizedGuess = guessToCheck.toLowerCase().trim();
    const normalizedAnswer = this.dog.name.toLowerCase().trim();

    if (normalizedGuess === normalizedAnswer) {
      this.gameState = 'won';
      this.score++;
    } else if (this.attempts >= this.maxAttempts) {
      this.gameState = 'lost';
    } else {
      this.revealHint();
      this.searchTerm = '';
      this.selectedGuess = '';
    }
  }

  playAgain(): void {
    this.score = 0;
    this.attempts = 0;
    this.loadNewDog();
  }

  nextDog(): void {
    this.attempts = 0;
    this.loadNewDog();
  }

  getRatingText(rating: number): string {
    if (rating >= 4) return 'High';
    if (rating >= 3) return 'Medium';
    return 'Low';
  }

  getGroomingText(grooming: number): string {
    if (grooming >= 4) return 'High maintenance';
    if (grooming >= 3) return 'Moderate';
    return 'Low maintenance';
  }

  getBarkingText(barking: number): string {
    if (barking >= 4) return 'Very vocal';
    if (barking >= 3) return 'Moderate';
    return 'Quiet';
  }

  getHintProgress(): number {
    return (this.hintsRevealed / this.getMaxAvailableHints()) * 100;
  }

  onSearchKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.checkGuess();
    } else if (event.key === 'Escape') {
      this.showDropdown = false;
    }
  }
}
