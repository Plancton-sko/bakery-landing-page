<section id="hero">
  <picture>
    <source srcset="#" type="image/png">
    <img src="#" alt="Quality breads and flavors">
  </picture>
  <div class="overlay"></div>
  <h1>Quality breads and flavors</h1>
</section>

<style>
  #hero {
    position: relative;
    height: 500px;
    background-size: cover;
    background-position: center;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
  }

  #hero h1 {
    position: relative;
    z-index: 2;
    font-size: 3rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.3);
    padding: 20px;
    border-radius: 10px;
    text-align: center;
  }

  @media (max-width: 768px) {
    #hero h1 {
      font-size: 2rem;
    }
  }
</style>