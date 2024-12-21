# Market Analysis Dashboard

An interactive dashboard for analyzing market segments and comparing business metrics. Built with React, TypeScript, and Tailwind CSS.

## Features

- 📊 Interactive market segment cards with color-coded metrics
- 🔍 Filter segments by entry barriers and sort by key metrics
- 📈 Side-by-side comparison of market segments
- 📉 Visual charts for metric comparison and growth trajectories
- 📱 Fully responsive design

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Chart.js / React-Chartjs-2
- Framer Motion

## Getting Started

1. Clone the repository
```bash
git clone [repository-url]
cd [repository-name]
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Project Structure

```
src/
  ├── fork/
  │   └── modules/
  │       └── management-dashboard/
  │           ├── charts/
  │           │   ├── ComparisonChart.tsx
  │           │   └── GrowthTrendChart.tsx
  │           ├── MarketAnalysisBoard.tsx
  │           ├── data.ts
  │           ├── styles.css
  │           └── types.ts
  └── App.tsx
```

## Deployment

This project is configured for easy deployment on Vercel. Simply connect your GitHub repository to Vercel and it will automatically deploy your changes.

## License

MIT
