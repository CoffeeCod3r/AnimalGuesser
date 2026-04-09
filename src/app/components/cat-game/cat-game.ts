// src/app/components/cat-game/cat-game.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Cat, CatService } from '../../services/cat.service';

type GameState = 'playing' | 'won' | 'lost';

interface Hint {
  label: string;
  value: string;
  icon?: string;
}

@Component({
  selector: 'app-cat-game',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './cat-game.html',
  styleUrls: ['./cat-game.css'],
})
export class CatGameComponent implements OnInit {
  cat: Cat | null = null;
  loading = false;
  gameState: GameState = 'playing';
  imageLoading = false;

  // Enhanced scoring system
  score = 0;
  totalScore = 0;
  streak = 0;
  bestStreak = 0;
  attempts = 0;
  maxAttempts = 3;
  roundsPlayed = 0;

  hintsRevealed = 0;
  availableHints: Hint[] = [];

  searchTerm = '';
  selectedGuess = '';
  showDropdown = false;
  filteredOptions: string[] = [];
  allCatBreeds: string[] = [];
  
  // Quick suggestions
  quickSuggestions: string[] = [];
  quickSuggestionsUnlocked = false;
  wrongSuggestions: string[] = [];

  // Animation states
  showScoreAnimation = false;
  scoreAnimationValue = 0;

  constructor(private catService: CatService) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.select-wrapper')) {
      this.showDropdown = false;
    }
  }

  ngOnInit(): void {
    this.loadCatBreeds();
    this.loadNewCat();
    this.loadStats();
  }

  loadStats(): void {
    const savedBestStreak = localStorage.getItem('catGameBestStreak');
    if (savedBestStreak) {
      this.bestStreak = parseInt(savedBestStreak, 10);
    }
  }

  saveStats(): void {
    if (this.streak > this.bestStreak) {
      this.bestStreak = this.streak;
      localStorage.setItem('catGameBestStreak', this.bestStreak.toString());
    }
  }

  loadCatBreeds(): void {
    this.allCatBreeds = this.catService.getCatBreeds();
  }

  loadNewCat(): void {
    this.loading = true;
    this.imageLoading = true;
    this.gameState = 'playing';
    this.hintsRevealed = 0;
    this.searchTerm = '';
    this.selectedGuess = '';
    this.showDropdown = false;
    this.attempts = 0;
    this.quickSuggestions = [];
    this.quickSuggestionsUnlocked = false;
    this.wrongSuggestions = [];

    this.catService.getRandomCat().subscribe({
      next: (data) => {
        if (data && data.length > 0) {
          this.cat = data[0];
          this.prepareHints();
          this.generateQuickSuggestions();
          this.loading = false;

          setTimeout(() => {
            if (this.hintsRevealed === 0) {
              this.revealHint();
            }
          }, 100);
        } else {
          console.error('No cat data received');
          this.loading = false;
          setTimeout(() => this.loadNewCat(), 1000);
        }
      },
      error: (err) => {
        console.error('Error loading cat:', err);
        this.loading = false;
        setTimeout(() => this.loadNewCat(), 1000);
      },
    });
  }

  onImageLoad(): void {
    this.imageLoading = false;
  }

  onImageError(): void {
    this.imageLoading = false;
    console.error('Failed to load cat image');
  }

  prepareHints(): void {
    if (!this.cat) return;

    this.availableHints = [];

    if (this.cat.origin) {
      this.availableHints.push({
        label: 'Origin',
        value: this.cat.origin,
        icon: '🌍',
      });
    }

    if (this.cat.length) {
      this.availableHints.push({
        label: 'Length',
        value: this.cat.length,
        icon: '📏',
      });
    }

    if (this.cat.min_weight && this.cat.max_weight) {
      this.availableHints.push({
        label: 'Weight Range',
        value: `${this.cat.min_weight} - ${this.cat.max_weight} lbs`,
        icon: '⚖️',
      });
    }

    if (this.cat.min_life_expectancy && this.cat.max_life_expectancy) {
      this.availableHints.push({
        label: 'Life Expectancy',
        value: `${this.cat.min_life_expectancy} - ${this.cat.max_life_expectancy} years`,
        icon: '⏳',
      });
    }

    if (this.cat.playfulness !== undefined) {
      this.availableHints.push({
        label: 'Playfulness',
        value: this.getRatingText(this.cat.playfulness),
        icon: '🎾',
      });
    }

    if (this.cat.intelligence !== undefined) {
      this.availableHints.push({
        label: 'Intelligence',
        value: this.getRatingText(this.cat.intelligence),
        icon: '🧠',
      });
    }

    if (this.cat.family_friendly !== undefined) {
      this.availableHints.push({
        label: 'Family Friendly',
        value: this.getRatingText(this.cat.family_friendly),
        icon: '👨‍👩‍👧‍👦',
      });
    }

    if (this.cat.children_friendly !== undefined) {
      this.availableHints.push({
        label: 'Children Friendly',
        value: this.getRatingText(this.cat.children_friendly),
        icon: '👶',
      });
    }

    if (this.cat.shedding !== undefined) {
      this.availableHints.push({
        label: 'Shedding',
        value: this.getRatingText(this.cat.shedding),
        icon: '🧹',
      });
    }

    if (this.cat.grooming !== undefined) {
      this.availableHints.push({
        label: 'Grooming Needs',
        value: this.getGroomingText(this.cat.grooming),
        icon: '✂️',
      });
    }

    if (this.cat.other_pets_friendly !== undefined) {
      this.availableHints.push({
        label: 'Other Pets Friendly',
        value: this.getRatingText(this.cat.other_pets_friendly),
        icon: '🐕',
      });
    }

    if (this.cat.general_health !== undefined) {
      this.availableHints.push({
        label: 'General Health',
        value: this.getRatingText(this.cat.general_health),
        icon: '💚',
      });
    }

    if (this.availableHints.length < 3) {
      this.addFallbackHints();
    }
  }

  addFallbackHints(): void {
    if (!this.cat) return;

    if (this.availableHints.length === 0) {
      this.availableHints.push({
        label: 'Type',
        value: 'Domestic Cat Breed',
        icon: '🐱',
      });
    }

    if (this.availableHints.length < 2) {
      this.availableHints.push({
        label: 'Coat',
        value: 'Various types and lengths',
        icon: '🦁',
      });
    }

    if (this.availableHints.length < 3) {
      this.availableHints.push({
        label: 'Temperament',
        value: 'Varies by breed',
        icon: '😺',
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

  filterCats(): void {
    const term = this.searchTerm.toLowerCase().trim();

    if (term.length === 0) {
      this.filteredOptions = [];
      this.showDropdown = false;
      return;
    }

    this.filteredOptions = this.allCatBreeds.filter((breed) => breed.toLowerCase().includes(term));
    this.showDropdown = this.filteredOptions.length > 0;
  }

  selectCat(catBreed: string): void {
    this.selectedGuess = catBreed;
    this.searchTerm = catBreed;
    this.showDropdown = false;
  }

  generateQuickSuggestions(): void {
    if (!this.cat) return;

    // Start with the correct answer
    const suggestions = [this.cat.name];

    // Get random wrong answers (4 different breeds)
    const availableBreeds = this.allCatBreeds.filter(breed => breed !== this.cat!.name);
    
    while (suggestions.length < 6 && availableBreeds.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableBreeds.length);
      const randomBreed = availableBreeds[randomIndex];
      suggestions.push(randomBreed);
      availableBreeds.splice(randomIndex, 1);
    }

    // Shuffle the suggestions so correct answer isn't always first
    this.quickSuggestions = this.shuffleArray(suggestions);
  }

  shuffleArray(array: string[]): string[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  selectQuickSuggestion(breed: string): void {
    this.searchTerm = breed;
    this.selectedGuess = breed;
    this.showDropdown = false;
  }

  unlockQuickSuggestions(): void {
    this.quickSuggestionsUnlocked = true;
  }

  isWrongSuggestion(suggestion: string): boolean {
    return this.wrongSuggestions.includes(suggestion);
  }

  calculateScore(): number {
    const basePoints = 100;
    const hintsUsed = this.hintsRevealed;
    const attemptsUsed = this.attempts;
    
    // Więcej punktów za mniej podpowiedzi i prób
    const hintPenalty = (hintsUsed - 1) * 15; // -15 za każdą dodatkową podpowiedź
    const attemptPenalty = attemptsUsed * 10; // -10 za każdą próbę
    
    // Kara za użycie Quick Suggestions
    const quickSuggestionsPenalty = this.quickSuggestionsUnlocked ? 20 : 0;
    
    // Bonus za streak
    const streakBonus = this.streak * 25;
    
    const finalScore = Math.max(10, basePoints - hintPenalty - attemptPenalty - quickSuggestionsPenalty + streakBonus);
    return finalScore;
  }

  showScorePopup(points: number): void {
    this.scoreAnimationValue = points;
    this.showScoreAnimation = true;
    
    setTimeout(() => {
      this.showScoreAnimation = false;
    }, 2000);
  }

  checkGuess(): void {
    if (!this.searchTerm.trim() || !this.cat) return;

    const guessToCheck = this.selectedGuess || this.searchTerm;
    this.attempts++;

    const normalizedGuess = guessToCheck.toLowerCase().trim();
    const normalizedAnswer = this.cat.name.toLowerCase().trim();

    if (normalizedGuess === normalizedAnswer) {
      this.gameState = 'won';
      this.roundsPlayed++;
      this.streak++;
      
      const earnedPoints = this.calculateScore();
      this.score += earnedPoints;
      this.totalScore += earnedPoints;
      
      this.showScorePopup(earnedPoints);
      this.saveStats();
    } else if (this.attempts >= this.maxAttempts) {
      this.gameState = 'lost';
      this.roundsPlayed++;
      this.streak = 0;
      this.saveStats();
    } else {
      // Mark wrong suggestion if from quick suggestions
      if (this.quickSuggestionsUnlocked && this.selectedGuess && !this.wrongSuggestions.includes(this.selectedGuess)) {
        this.wrongSuggestions.push(this.selectedGuess);
      }
      
      this.revealHint();
      this.searchTerm = '';
      this.selectedGuess = '';
    }
  }

  playAgain(): void {
    this.score = 0;
    this.totalScore = 0;
    this.streak = 0;
    this.roundsPlayed = 0;
    this.attempts = 0;
    this.loadNewCat();
  }

  nextCat(): void {
    this.attempts = 0;
    this.loadNewCat();
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

  getStreakMessage(): string {
    if (this.streak === 0) return '';
    if (this.streak < 3) return 'Good start! 🎯';
    if (this.streak < 5) return 'On fire! 🔥';
    if (this.streak < 10) return 'Unstoppable! ⭐';
    return 'LEGENDARY! 👑';
  }
}