<div class="hero">
  <h1 class="sr-only">Homelab</h1>

  <img src="frog.svg" width="400" alt="Frog avatar representing the Homelab" />

  <h1>Welcome to the pond</h1>

  <p>This is my own piece of internet land.</p>

  <p class="auto">
    I cover many topics of interest in this website, in no particular order.
    Such as: open source software, music, computer science wizardry, actual
    wizardry, self-hosting experiments, and whatever else I feel like tinkering
    with at the time.
  </p>
</div>

<style>
  .hero {
    text-align: center;
    padding: 4rem 1rem 3rem;
  }
  .hero p {
    font-size: 1.1rem;
    max-width: 600px;
    margin: 0.5rem auto 0;
    line-height: 1.6;
    opacity: 0.85;
  }

  .hero-illustration {
    display: flex;
    justify-content: center;
    margin: 2.5rem auto 1.5rem;
    padding: 1.5rem;
    border-radius: 24px;
    background: radial-gradient(
      circle at top,
      rgba(79, 209, 197, 0.15),
      transparent 65%
    );
    max-width: 520px;
  }

  .hero-illustration img {
    width: 100%;
    height: auto;
  }

  /* Accessible-only h1 */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }

  /* Light theme overrides live in the root layout */
</style>
