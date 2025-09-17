<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Norsk Pokerforbund</title>
  <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=Inter:wght@300;500;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-dark: #0d0d0d;
      --accent: #c5a254; /* gold */
      --text-light: #f5f5f5;
      --text-muted: rgba(245,245,245,0.7);
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg-dark);
      color: var(--text-light);
      line-height: 1.6;
    }

    header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      padding: 20px 60px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 100;
    }

    header .logo {
      font-family: 'Playfair Display', serif;
      font-size: 1.4rem;
      font-weight: 700;
      color: var(--accent);
    }

    nav ul {
      list-style: none;
      display: flex;
      gap: 25px;
    }

    nav ul li a {
      text-decoration: none;
      color: var(--text-light);
      font-weight: 500;
      transition: 0.3s;
    }

    nav ul li a:hover {
      color: var(--accent);
    }

    /* Hero */
    .hero {
      height: 100vh;
      background: url("https://images.unsplash.com/photo-1529400971008-f566de0e6dfc?q=80&w=1600&auto=format&fit=crop") center/cover no-repeat;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      padding-left: 60px;
    }

    .hero::after {
      content: "";
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.55);
    }

    .hero-content {
      position: relative;
      max-width: 600px;
      z-index: 1;
    }

    .hero h1 {
      font-family: 'Playfair Display', serif;
      font-size: 3rem;
      margin-bottom: 20px;
    }

    .hero p {
      font-size: 1.1rem;
      color: var(--text-muted);
      margin-bottom: 25px;
    }

    .btn {
      display: inline-block;
      padding: 12px 28px;
      border: 1px solid var(--accent);
      color: var(--accent);
      text-decoration: none;
      font-weight: 600;
      border-radius: 4px;
      transition: 0.3s;
    }

    .btn:hover {
      background: var(--accent);
      color: #000;
    }

    section {
      max-width: 1100px;
      margin: 0 auto;
      padding: 80px 20px;
    }

    h2 {
      font-family: 'Playfair Display', serif;
      font-size: 2rem;
      margin-bottom: 20px;
      color: var(--accent);
    }

    p {
      color: var(--text-muted);
      max-width: 800px;
    }

    footer {
      text-align: center;
      padding: 40px 20px;
      font-size: 0.9rem;
      color: var(--text-muted);
      border-top: 1px solid rgba(255,255,255,0.1);
    }
  </style>
</head>
<body>
  <!-- Header -->
  <header>
    <div class="logo">Norsk Pokerforbund</div>
    <nav>
      <ul>
        <li><a href="#">Hjem</a></li>
        <li><a href="#">Arrangementer</a></li>
        <li><a href="#">Hall of Fame</a></li>
        <li><a href="#">Om Oss</a></li>
        <li><a href="#">Kontakt</a></li>
      </ul>
    </nav>
  </header>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-content">
      <h1>Hall of Fame</h1>
      <p>Personer som har levert prestasjoner på høyt nivå og / eller bidratt sterkt til pokerens vekst og posisjon i Norge.</p>
      <a href="#" class="btn">Sjekk ut Hall of Fame</a>
    </div>
  </section>

  <!-- About -->
  <section>
    <h2>Om Forbundet</h2>
    <p>Norsk Pokerforbund ble stiftet for å samle norske pokerspillere, fremme miljøet og skape et seriøst og inkluderende fellesskap. Vi arrangerer turneringer, sosiale sammenkomster og jobber for å fremme pokerens posisjon i Norge.</p>
  </section>

  <!-- Events -->
  <section>
    <h2>Kommende Arrangementer</h2>
    <p>Hold øye med våre ukentlige turneringer, workshops og spesielle arrangementer. Vi tilbyr noe for både nybegynnere og erfarne spillere.</p>
  </section>

  <!-- Contact -->
  <section>
    <h2>Kontakt Oss</h2>
    <p>Har du spørsmål eller ønsker å bli medlem? Kontakt oss gjerne via e-post på <a href="mailto:info@norskpokerforbund.no" style="color:var(--accent);text-decoration:none;">info@norskpokerforbund.no</a>.</p>
  </section>

  <!-- Footer -->
  <footer>
    © Norsk Pokerforbund – Alle rettigheter reservert
  </footer>
</body>
</html>
