// Unix timestamp (in seconds) to count down to
const eventStart = Math.round(new Date(2025, 0, 14, 16) / 1000); // 13th December 2023 at 4 pm in seconds

// Set up FlipDown
const flipdown = new FlipDown(eventStart, {
  headings: ["Dani", "Sati", "Minute", "Sekunde"],
});

// Start the countdown
flipdown.start();

// Do something when the countdown ends
flipdown.ifEnded(() => {
  console.log("Event ended!");
});
