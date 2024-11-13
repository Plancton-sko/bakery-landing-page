<!--/src/lib/componnets/AboutUs-->
<body>
<section id="about-us">
  <h2>About Us</h2>
  <p>
    Lorem ipsum is placeholder text commonly
  </p>
  <div class="about-content">
    <div class="image-container">
      <img src="/images/nadya-spetnitskaya.jpg" alt="Bread Image" />
    </div>
    <div class="text-container">
      <h3>What is your favorite bread for your sandwich</h3>
      <p>
        Lorem ipsum is placeholder text commonly used in the graphic, print, and
        publishing industries for previewing layouts and visual mockups.
      </p>
      <button>Read More</button>
    </div>
  </div>
</section>
</body>
<style>
/* Estilo geral */
body {
  font-family: 'Roboto', sans-serif;
  background-color: #f8f8f8;
  color: #333;
  margin: 0;
  padding: 0;
}

section#about-us {
  text-align: center;
  padding: 40px 20px;
  background-color: #ffffff;
  margin: 20px auto;
  max-width: 800px;
  border-radius: 8px;
}

section#about-us h2 {
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 10px;
  text-transform: lowercase;
  letter-spacing: 2px;
}

section#about-us > p {
  font-size: 20px;
  color: #667;
  margin-bottom: 20px;
}

/* Caixa de conteúdo da seção */
.about-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 20px;
  background-color: #ffffff;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
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
  border-radius: 8px;
  object-fit: cover;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.text-container {
  flex: 2;
  text-align: left;
}

.text-container h3 {
  font-size: 25px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #333;
}

.text-container p {
  font-size: 18px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 20px;
}

.text-container button {
  background-color: transparent;
  color: #333;
  border: 1px solid #333;
  padding: 10px 20px;
  font-size: 14px;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s, color 0.3s;
  align-self: center; 
}

.text-container button:hover {
  background-color: #333;
  color: #fff;
}

</style>
