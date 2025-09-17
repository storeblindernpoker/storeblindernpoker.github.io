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
