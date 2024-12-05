<!--/src/lib/componnets/AboutUs-->
<body>
  <section id="about-us">
    <h2>Sobre Nós</h2>
    <p>
      Texto fictício usado frequentemente como espaço reservado.
    </p>
    <div class="about-content">
      <div class="image-container">
        <img src="/images/nadya-spetnitskaya.jpg" alt="Imagem de pão" />
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
  font-family: 'Roboto', sans-serif;
  background-color: #FDF4E3;
  color: #6B4226;
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
  font-family: 'Playfair Display', serif;
  font-size: 36px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #6B4226;
}

section#about-us > p {
  font-size: 18px;
  color: #6B4226;
  margin-bottom: 30px;
}

/* Conteúdo principal */
.about-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
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
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.text-container {
  flex: 2;
  text-align: left;
}

.text-container h3 {
  font-family: 'Playfair Display', serif;
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #6B4226;
}

.text-container p {
  font-size: 16px;
  color: #6B4226;
  line-height: 1.8;
  margin-bottom: 20px;
}

.text-container button {
  background-color: #F4A261;
  color: #fff;
  border: none;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.2s ease;
}

.text-container button:hover {
  background-color: #E76F51;
  transform: scale(1.05);
}
</style>
