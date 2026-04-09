# 🐱 Cat Breed Guesser

<div align="center">

**Test your knowledge of cat breeds in this interactive guessing game!**

[![Angular](https://img.shields.io/badge/Angular-20.3-DD0031?style=for-the-badge&logo=angular)](https://angular.io/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

[🎮 Play Now](#-how-to-play) • [📖 Documentation](#-documentation) • [🛠️ Installation](#-installation) • [🤝 Support](#-support-the-project)

</div>

---

## 📖 About

**Cat Breed Guesser** is an engaging educational game where your task is to guess the cat breed based on a photo and gradually revealed hints. The fewer hints you use, the more points you earn!

### ✨ Game Features

- 🖼️ **Real cat photos** – fetched from API-Ninjas
- 🧩 **Hint system** – discover breed traits step by step
- 🎯 **Quick suggestions** – unlock a list of 6 breeds (with -20 point penalty)
- 🔥 **Streak system** – build streaks and multiply your points
- 📊 **Detailed statistics** – learn about each breed's characteristics
- 💎 **Elegant design** – modern, responsive interface
- 🌍 **Breed data** – origin, weight, lifespan, personality traits

---

## 🎮 How to Play

1. **View the photo** – a cat image will appear on screen
2. **Guess the breed** – type the name or choose from suggestions
3. **Use hints wisely** – each hint reduces your potential points
4. **Build streaks** – consecutive correct answers multiply your score
5. **Learn** – after each round, discover details about the breed

### Scoring System

| Action | Points |
|--------|--------|
| Correct answer (no hints) | +100 |
| Correct answer (with hints) | +50 |
| Using quick suggestions | -20 (penalty) |
| Streak bonus (streak) | x1.5, x2, x3... |

---

## 🛠️ Installation

### Requirements

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) or [Angular CLI](https://angular.io/cli)

### Installation Steps

```bash
# 1. Clone the repository
git clone https://github.com/CoffeeCod3r/AnimalGuesser.git
cd AnimalGuesser

# 2. Install dependencies
npm install

# 3. Start the development server
ng serve
```

The application will be available at: **http://localhost:4200/**

### Production Build

```bash
ng build --configuration=production
```

Built files will be in the `dist/` directory.

---

## 📁 Project Structure

```
AnimalGuesser/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   └── cat-game/          # Main game component
│   │   ├── services/
│   │   │   ├── cat.service.ts     # Cat API service
│   │   │   ├── dog.service.ts     # Dog API service (coming soon)
│   │   │   └── animal.service.ts  # Shared animal service
│   │   ├── app.ts                 # Main application component
│   │   └── app.routes.ts          # Routing configuration
│   ├── styles.css                 # Global styles
│   └── index.html                 # Main HTML file
├── angular.json                   # Angular CLI configuration
├── package.json                   # Project dependencies
└── tsconfig.json                  # TypeScript configuration
```

---

## 🛠️ Technologies

| Technology | Version | Description |
|------------|---------|-------------|
| **Angular** | 20.3 | Frontend framework |
| **TypeScript** | 5.9 | Programming language |
| **RxJS** | 7.8 | Reactive programming |
| **Angular CLI** | 20.3 | Command-line tool |
| **Prettier** | - | Code formatting |

### API

- **API-Ninjas Cats API** – database of cat breeds with traits and images

---

## 🤝 Support the Project

If you enjoy this game and want to support its development, consider:

- ☕ **Buy me a coffee** – [suppi.pl/coffeecod3r](https://suppi.pl/coffeecod3r)
- ⭐ **Star the repository** on GitHub
- 🐛 **Report a bug** or suggest a feature in [Issues](https://github.com/CoffeeCod3r/AnimalGuesser/issues)

---

## 📄 License

This project is available under the [MIT](LICENSE) license.

---

## 👨‍💻 Author

**CoffeeCod3r** – created with a passion for cats and coding 🐾

---

<div align="center">

**Have fun and thanks for playing!** 🐱💕

</div>