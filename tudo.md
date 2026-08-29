[
    { "img": "ht "Card 1: Nosso primeiro encontro" },
    { "img": "https://via.placeholder.com/300x160?text=Card+2", "text":tps://via.placeholder.com/300x160?text=Card+1", "text": "Card 2: Primeira viagem" },
    { "img": "https://via.placeholder.com/300x160?text=Card+3", "text": "Card 3: Jantar especial" },
    { "img": "https://via.placeholder.com/300x160?text=Card+4", "text": "Card 4: Caminhada no parque" },
    { "img": "https://via.placeholder.com/300x160?text=Card+5", "text": "Card 5: Filme em casa" },
    { "special": true, "text": "➡ Veja mais fotos", "link": "galeria.html" }

  ]


  [ ] playlist, 
  [v] reproduzir vídeo, 
  [v] pdf abrir, 
  [ ] link pro pinterest, 
  [v] link pro spotity, 
  [ ] LINK pros cartões,
  [ ] galeria,(separada por dia/momentos)
  [ ] PACOTE DE FIGURINHA
  [ ] PRINTS IMPORTANTES
  [v]LOGIN
  [v] menu hamburguer
  [v] musicas em formato de disco

[v] header
[V] footer
[V] seção Músicas que lembram meu momoi
[V] linha do tempo

          <!-- Abrir PDF -->
          <div class="carousel-card tall" onclick="openModal('pdf-viewer', 'docs/Para o meu amor.pdf')">
            <img src="images/1608858884-IMG-20230707-WA0002.jpg" alt="Cartão PDF">
            <p>Carta em PDF</p>
          </div>
    
          <!-- PDF + Botão de download -->
          <div class="carousel-card tall" onclick="openModal('pdf-download', 'images/20230623_223424814.jpg', 'stickers.zip')">
            <img src="images/20230623_223424814.jpg" alt="PDF e download">
            <p>Carta + Figurinhas</p>
          </div>



  <style>
  .pdf-popup {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: none;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .pdf-content {
    background: white;
    width: 80%;
    height: 90%;
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 0 10px #00000050;
  }

  .pdf-content iframe {
    width: 100%;
    height: 100%;
  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 15px;
    font-size: 2rem;
    cursor: pointer;
    color: #333;
    z-index: 10;
  }
</style>

<script>
  function openPDFPopup() {
    document.getElementById("pdfPopup").style.display = "flex";
  }

  function closePDFPopup() {
    document.getElementById("pdfPopup").style.display = "none";
  }
</script>


<!-- Link para abrir o PDF -->
<button onclick="openPDFPopup()">Ver Documento</button>


<!-- Popup -->
<div class="pdf-popup" id="pdfPopup">
  <div class="pdf-content">
    <span class="close-btn" onclick="closePDFPopup()">&times;</span>
    <iframe src="docs/27 de abril de 2023.pdf" frameborder="0"></iframe>
  </div>
</div>