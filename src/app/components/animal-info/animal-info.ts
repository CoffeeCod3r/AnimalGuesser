import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Animal, AnimalImage } from '../../services/animal.service';
import { NgIf, NgFor } from '@angular/common';

@Component({
  selector: 'app-animal-info',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './animal-info.html',
  styleUrls: ['./animal-info.css'],
})
export class AnimalInfoComponent {
  @Input() animal: Animal | undefined = undefined;
  @Input() animalImages: AnimalImage[] = [];
  showDetails: boolean = false;
  imageLoadError: boolean = false;
  selectedImageIndex: number = 0;

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }

  selectImage(index: number): void {
    this.selectedImageIndex = index;
  }

  nextImage(): void {
    if (this.animalImages.length > 0) {
      this.selectedImageIndex = (this.selectedImageIndex + 1) % this.animalImages.length;
    }
  }

  previousImage(): void {
    if (this.animalImages.length > 0) {
      this.selectedImageIndex =
        (this.selectedImageIndex - 1 + this.animalImages.length) % this.animalImages.length;
    }
  }

  get animalCharacteristics(): { label: string; value: string }[] {
    if (!this.animal) return [];

    const char = this.animal.characteristics;
    if (!char) return [];

    return [
      { label: 'Habitat', value: char.habitat || '' },
      { label: 'Diet', value: char.diet || '' },
      { label: 'Color', value: char.color || '' },
      { label: 'Lifestyle', value: char.lifestyle || '' },
      { label: 'Skin Type', value: char.skin_type || '' },
      { label: 'Top Speed', value: char.top_speed || '' },
      { label: 'Lifespan', value: char.lifespan || '' },
      { label: 'Weight', value: char.weight || '' },
      { label: 'Length', value: char.length || '' },
      { label: 'Name of Young', value: char.name_of_young || '' },
      { label: 'Group Behavior', value: char.group_behavior || '' },
      { label: 'Prey', value: char.prey || '' },
      { label: 'Most Distinctive Feature', value: char.most_distinctive_feature || '' },
      { label: 'Biggest Threat', value: char.biggest_threat || '' },
      { label: 'Estimated Population', value: char.estimated_population_size || '' },
      { label: 'Gestation Period', value: char.gestation_period || '' },
      { label: 'Average Litter Size', value: char.average_litter_size || '' },
      { label: 'Number of Species', value: char.number_of_species || '' },
    ].filter((item) => item.value && item.value !== 'Unknown' && item.value.trim() !== '');
  }

  get hasImages(): boolean {
    return this.animalImages && this.animalImages.length > 0;
  }

  get selectedImage(): AnimalImage | null {
    return this.hasImages ? this.animalImages[this.selectedImageIndex] : null;
  }
}
