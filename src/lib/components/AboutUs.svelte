  <!--/src/lib/componnets/AboutUs-->
  <body>
    <section id="about-us">
      <h2>Sobre Nós</h2>
      <p>
        Texto fictício usado frequentemente como espaço reservado.
      </p>
      <div class="about-content">
        <div class="image-container">
          <img src="/images/nadya-spetnitskaya.webp" alt="Imagem de pão" />
        </div>
        <div class="text-container">
          <h3>Qual é o seu pão favorito para sanduíches?</h3>
          <p>
            Texto fictício usado frequentemente nas indústrias gráficas, editoriais e de design para pré-visualização de layouts e modelos visuais.
          </p>
          <button>Ler Mais</button>
        </div>
      </div>
    </section>
    </body>
  <style>
  /* Geral */
  body {
    font-family: var(--font-primary);
    background-color: var(--background-color);
    color: var(--primary-color);
    margin: 0;
    padding: 0;
  }

  section#about-us {
    text-align: center;
    padding: 60px 20px;
    background-color: #f3e0c5;
    margin: 20px auto;
    max-width: 900px;
    border-radius: 12px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }

  section#about-us h2 {
    font-family: var(--font-primary);
    font-size: 36px;
    font-weight: bold;
    margin-bottom: 20px;
    color: var(--primary-color);
  }

  section#about-us > p {
    font-size: 18px;
    color:var(--primary-color);
    margin-bottom: 30px;
  }

  /* Conteúdo principal */
  .about-content {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    background-color: #fff;
    box-shadow: var(--box-shadow);
    border-radius: var(--border-radius);
    padding: 20px;
    gap: 20px;
  }

  .image-container {
    flex: 1;
    max-width: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .image-container img {
    width: 100%;
    height: auto;
    border-radius: var(--border-radius);
    object-fit: cover;
    box-shadow: var(--box-shadow-small);
  }

  .text-container {
    flex: 2;
    text-align: left;
  }

  .text-container h3 {
    font-family: var(--font-primary);
    font-size: 28px;
    font-weight: bold;
    margin-bottom: 15px;
    color: var(--primary-color);
  }

  .text-container p {
    font-size: 16px;
    color: var(--primary-color);
    line-height: 1.8;
    margin-bottom: 20px;
  }

  .text-container button {
    background-color: var(--third-color);
    color: var(--white-text);
    border: none;
    padding: var(--button-padding);
    font-size: 14px;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.2s ease;
  }

  .text-container button:hover {
    background-color: var(--highlight-color);
    transform: scale(1.05);
  }
  </style>
