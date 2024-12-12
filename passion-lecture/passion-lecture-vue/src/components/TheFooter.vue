<template>
  <footer>
    <div class="footer-content">
      <span>Application des livres - ApipassionBooks - 2024</span>
      <div class="footer-details">
        <p>Contact: pu78ifh@eduvaud.ch</p>
        <p>Développeurs: Dario Chasi - Nima Zarrabi - William Trelles - Thibaud Racine</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background: rgb(0, 143, 0);
  background: linear-gradient(90deg, rgb(86, 201, 255) 0%, rgb(27, 255, 122) 100%);
  color: rgb(0, 86, 126);
  padding: 10px 20px;
  border-top: 2px solid hsla(160, 100%, 37%, 1);
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column; /* Change to column to stack elements vertically */
}

.footer-content {
  display: flex;
  flex-direction: column; /* Change to column to stack elements vertically */
  justify-content: center;
  align-items: center;
  width: 100%;
}

footer span {
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
}

.footer-details p {
  margin: 5px 0; /* Add some margin for spacing between paragraphs */
  font-family: 'Arial', sans-serif;
  font-size: 14px;
  text-align: center;
}
</style>
