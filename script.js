document.addEventListener('DOMContentLoaded', () => {
    // Seleciona todos os elementos HTML necessários
    const audioPlayer = document.getElementById('audio-player');
    const playlistElement = document.getElementById('playlist');
    const currentSongTitleElement = document.getElementById('current-song-title');
    const currentAlbumArtElement = document.getElementById('current-album-art'); // Capa giratória menor
    const mainAlbumCoverElement = document.getElementById('main-album-cover'); // Capa principal grande
    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');
    const stopButton = document.getElementById('stop-button');
    const playPauseButton = document.getElementById('play-pause-button');
    const playlistCountElement = document.getElementById('playlist-count');
    // const volumeSlider = document.getElementById('volume-slider'); // Removido
    // const volumeValueElement = document.getElementById('volume-value'); // Removido
    const speedSlider = document.getElementById('speed-slider'); // Certifique-se de ter este slider no HTML se for usá-lo
    const speedValueElement = document.getElementById('speed-value'); // Certifique-se de ter este elemento no HTML
    const currentTimeElement = document.getElementById('current-time');
    const durationElement = document.getElementById('duration'); // Variável corrigida
    const emptyPlaylistMessage = document.querySelector('.empty-playlist-message');
    const progressBar = document.getElementById('progress-bar'); // Referência à barra de progresso
    const albumListElement = document.getElementById('album-list'); // Referência à div onde as capas dos álbuns serão mostradas
    const albumSelectionArea = document.querySelector('.album-selection-area'); // Referência à área de seleção de álbuns
    const playlistArea = document.querySelector('.playlist-area'); // Referência à área da playlist

    let currentTrackIndex = -1; // Índice da faixa atualmente tocando
    let isSeeking = false; // Flag para saber se o usuário está arrastando a barra
    let wasPlayingBeforeSeek = false; // Nova flag para lembrar o estado antes de arrastar
    let currentAlbum = null; // Variável para armazenar o álbum atualmente selecionado

    // --- Nova estrutura de dados: Álbuns com suas músicas e imagens ---
    const albums = [
        {
            name: "Meu Caminho",
            coverImg: "Assets/MeuCaminhoIA/capadiscoIA.png", // Capa para seleção
            bolachaImg: "Assets/MeuCaminhoIA/bolachaia.png", // Imagem para a vitrola giratória
            topoImg: "Assets/MeuCaminhoIA/TopoIA.png",     // Imagem para o topo
            tracks: [
                { title: "Meu tipo de Garota 15 Anos", src: "Assets/MeuCaminhoIA/1 - Meu tipo de Garota 15 Anos.mp3", trackArt: "Assets/MeuCaminhoIA/1 - Meu tipo de Garota 15 Anos.png" },
                { title: "Meu tipo de Herói", src: "Assets/MeuCaminhoIA/2 - Meu tipo de Herói.mp3", trackArt: "Assets/MeuCaminhoIA/2 - Meu tipo de Herói.png" },
                { title: "Meu tipo de Princesa", src: "Assets/MeuCaminhoIA/3 - Meu tipo de Princesa.mp3", trackArt: "Assets/MeuCaminhoIA/3 - Meu tipo de Princesa.png" },
                { title: "Irmandade Eterna", src: "Assets/MeuCaminhoIA/4 - Irmandade Eterna.mp3", trackArt: "Assets/MeuCaminhoIA/4 - Irmandade Eterna.png" },
                { title: "Um lugar chamado Sonia", src: "Assets/MeuCaminhoIA/5 - Um lugar chamado Sonia.mp3", trackArt: "Assets/MeuCaminhoIA/5 - Um lugar chamado Sonia.png" },
                { title: "Manolos", src: "Assets/MeuCaminhoIA/6 - Manolos.mp3", trackArt: "Assets/MeuCaminhoIA/6 - Manolos.png" },
                { title: "Obrigado Perdão e Cuida", src: "Assets/MeuCaminhoIA/7 - Obrigado Perdão e Cuida.mp3", trackArt: "Assets/MeuCaminhoIA/7 - Obrigado Perdão e Cuida.png" },
                { title: "Persistindo em Fé", src: "Assets/MeuCaminhoIA/8 - Persistindo em Fé.mp3", trackArt: "Assets/MeuCaminhoIA/8 - Persistindo em Fé.png" },
                { title: "Pedro Bryan Bônus", src: "Assets/MeuCaminhoIA/9 - Pedro Bryan Bônus.mp3", trackArt: "Assets/MeuCaminhoIA/9 - Pedro Bryan Bônus.png" },
                { title: "Pedro James Brown Bõnus", src: "Assets/MeuCaminhoIA/10 - Pedro James Brown Bõnus.mp3", trackArt: "Assets/MeuCaminhoIA/10 - Pedro James Brown Bõnus.png" }
            ]
        },
        {
            name: "Meu Tipo de Garota",
            coverImg: "Assets/MeuTipodeGarota/capadiscoARTINVOCCAL.png",
            bolachaImg: "Assets/MeuTipodeGarota/bolachameutipodegarota.png",
            topoImg: "Assets/MeuTipodeGarota/TopoMEUTIPODEGAROTA.png",
            tracks: [
                { title: "1 - Meu Tipo de Garota", src: "Assets/MeuTipodeGarota/1 - Meu Tipo de Garota.mp3", trackArt: "Assets/MeuTipodeGarota/1 - Meu Tipo de Garota.png" },
                { title: "2 - Mamãe", src: "Assets/MeuTipodeGarota/2 - Mamãe.mp3", trackArt: "Assets/MeuTipodeGarota/2 - Mamãe.png" },
                { title: "3 - Alguém que eu amo", src: "Assets/MeuTipodeGarota/3 - Alguém que eu amo.mp3", trackArt: "Assets/MeuTipodeGarota/3 - Alguém que eu amo.png" },
                { title: "4 - Meu Deus", src: "Assets/MeuTipodeGarota/4 - Meu Deus.mp3", trackArt: "Assets/MeuTipodeGarota/4 - Meu Deus.png" },
                { title: "5 - Teu Olhar", src: "Assets/MeuTipodeGarota/5 - Teu Olhar.mp3", trackArt: "Assets/MeuTipodeGarota/5 - Teu Olhar.png" },
                { title: "6 - Pai Nosso", src: "Assets/MeuTipodeGarota/6 - Pai Nosso.mp3", trackArt: "Assets/MeuTipodeGarota/6 - Pai Nosso.png" },
                { title: "7 - Happy Day", src: "Assets/MeuTipodeGarota/7 - Happy Day.mp3", trackArt: "Assets/MeuTipodeGarota/7 - Happy Day.png" },
                { title: "8 - Marcha Nupcial (bônus)", src: "Assets/MeuTipodeGarota/8 - Marcha Nupcial (bônus).mp3", trackArt: "Assets/MeuTipodeGarota/8 - Marcha Nupcial (bônus).png" }
            ]
        },
        {
            name: "Setinvoz",
            coverImg: "Assets/Setinvoz/capadiscoSETINVOZ.png",
            bolachaImg: "Assets/Setinvoz/bolachasetinvoz.png",
            topoImg: "Assets/Setinvoz/TopoSETINVOZ.png",
            tracks: [
                { title: "01 Introdução", src: "Assets/Setinvoz/01 Introdução.mp3", trackArt: "Assets/Setinvoz/01 Introdução.png" },
                { title: "02 Quero agradecer", src: "Assets/Setinvoz/02 Quero agradecer.mp3", trackArt: "Assets/Setinvoz/02 Quero agradecer.png" },
                { title: "03 Paz Interior", src: "Assets/Setinvoz/03 Paz Interior.mp3", trackArt: "Assets/Setinvoz/03 Paz Interior.png" },
                { title: "04 Aprendizado", src: "Assets/Setinvoz/04 Aprendizado.mp3", trackArt: "Assets/Setinvoz/04 Aprendizado.png" },
                { title: "05 Razão", src: "Assets/Setinvoz/05 Razão.mp3", trackArt: "Assets/Setinvoz/05 Razão.png" },
                { title: "06 Prece Musical", src: "Assets/Setinvoz/06 Prece Musical.mp3", trackArt: "Assets/Setinvoz/06 Prece Musical.png" },
                { title: "07 Viúva de Naim", src: "Assets/Setinvoz/07 Viúva de Naim.mp3", trackArt: "Assets/Setinvoz/07 Viúva de Naim.png" },
                { title: "08 Sou feliz - Vinheta", src: "Assets/Setinvoz/08 Sou feliz - Vinheta.mp3", trackArt: "Assets/Setinvoz/08 Sou feliz - Vinheta.png" },
                { title: "09 Oh Vem Emanuel", src: "Assets/Setinvoz/09 Oh Vem Emanuel.mp3", trackArt: "Assets/Setinvoz/09 Oh Vem Emanuel.png" },
                { title: "10 Graça excelsa", src: "Assets/Setinvoz/10 Graça excelsa.mp3", trackArt: "Assets/Setinvoz/10 Graça excelsa.png" },
                { title: "11 Samba pra DEUS", src: "Assets/Setinvoz/11 Samba pra DEUS.mp3", trackArt: "Assets/Setinvoz/11 Samba pra DEUS.png" },
                { title: "12 De Ti eu quero ser", src: "Assets/Setinvoz/12 De Ti eu quero ser.mp3", trackArt: "Assets/Setinvoz/12 De Ti eu quero ser.png" },
                { title: "13 Ele exaltado", src: "Assets/Setinvoz/13 Ele exaltado.mp3", trackArt: "Assets/Setinvoz/13 Ele exaltado.png" }
            ]
        }
    ];

    // Função para formatar o tempo (ex: 03:45)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    // Função para exibir as capas dos álbuns
    function displayAlbums() {
        albumListElement.innerHTML = ''; // Limpa a lista atual
        albums.forEach((album, index) => {
            const albumItem = document.createElement('div');
            albumItem.classList.add('album-item');
            albumItem.dataset.albumIndex = index; // Armazena o índice do álbum

            const albumCoverImg = document.createElement('img');
            albumCoverImg.src = album.coverImg;
            albumCoverImg.alt = `Capa do Álbum: ${album.name}`;

            const albumName = document.createElement('p');
            albumName.textContent = album.name;

            albumItem.appendChild(albumCoverImg);
            albumItem.appendChild(albumName);

            // Adiciona evento de clique para selecionar o álbum
            albumItem.addEventListener('click', () => {
                selectAlbum(index);
            });

            albumListElement.appendChild(albumItem);
        });
    }

    // Função para selecionar um álbum e exibir sua playlist
    function selectAlbum(albumIndex) {
        // Pausa a música atual se houver
        audioPlayer.pause();
        if (currentAlbumArtElement) {
            currentAlbumArtElement.classList.remove('spinning'); // Remove a animação de giro
        }
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Volta para o ícone de play

        currentAlbum = albums[albumIndex]; // Define o álbum atual
        currentTrackIndex = -1; // Reseta o índice da faixa
        audioPlayer.src = ''; // Limpa a fonte do áudio
        currentSongTitleElement.textContent = "No Track Playing"; // Reseta o título
        currentTimeElement.textContent = "00:00"; // Reseta o tempo
        durationElement.textContent = "00:00"; // Reseta a duração
        progressBar.value = 0; // Reseta a barra de progresso


        // Atualiza as imagens principais para as do álbum selecionado
        if (mainAlbumCoverElement) {
             mainAlbumCoverElement.src = currentAlbum.topoImg;
             mainAlbumCoverElement.alt = `Imagem Principal: ${currentAlbum.name}`;
        }
        if (currentAlbumArtElement) {
             currentAlbumArtElement.src = currentAlbum.bolachaImg; // Define a bolacha do álbum
             currentAlbumArtElement.alt = `Bolacha do Álbum: ${currentAlbum.name}`;
             // A animação de giro só é adicionada quando a música começa a tocar (na função playTrack)
        }

        // Atualiza a classe 'selected' na capa do álbum
        const albumItems = albumListElement.querySelectorAll('.album-item');
        albumItems.forEach((item, i) => {
            if (i === albumIndex) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });


        updatePlaylistDisplay(); // Exibe as músicas do álbum selecionado

        // Não ocultamos mais a área de seleção de álbuns
        // albumSelectionArea.style.display = 'none';
        // playlistArea.style.display = 'block'; // A área da playlist já está visível
    }


    // Função para carregar e (opcionalmente) tocar uma faixa específica
    function loadTrack(index, autoPlay = true) {
        // Usa a lista de tracks do álbum atualmente selecionado
        if (currentAlbum && index >= 0 && index < currentAlbum.tracks.length) {
            currentTrackIndex = index;
            const track = currentAlbum.tracks[currentTrackIndex];
            audioPlayer.src = track.src;
            currentSongTitleElement.textContent = track.title;

            // Define a capa giratória menor como a bolacha do álbum (garante que seja a do álbum atual)
            if (currentAlbumArtElement && currentAlbum) {
                 currentAlbumArtElement.src = currentAlbum.bolachaImg; // Usa a bolacha do álbum
                 currentAlbumArtElement.alt = `Bolacha do Álbum: ${currentAlbum.name}`;
            }

            // Atualiza a classe 'active' na lista de músicas
            const playlistItems = playlistElement.querySelectorAll('li');
            playlistItems.forEach((item, i) => {
                if (i === currentTrackIndex) {
                    item.classList.add('active');
                } else {
                    item.classList.remove('active');
                }
            });

            // Carrega a música. O autoplay é controlado pela função playTrack/togglePlayPause
            audioPlayer.load(); // Garante que o áudio seja carregado para obter a duração

            if (autoPlay) {
                // A reprodução é iniciada pela função playTrack ou togglePlayPause
                // Não chamamos audioPlayer.play() diretamente aqui
            } else {
                 // Garante que a bolacha não esteja girando se não for tocar automaticamente
                 if (currentAlbumArtElement) {
                    currentAlbumArtElement.classList.remove('spinning');
                 }
            }
        } else {
            console.error("Índice de faixa inválido ou nenhum álbum selecionado.");
            // Opcional: Limpar a playlist ou mostrar mensagem
            updatePlaylistDisplay(); // Limpa a lista se o álbum for inválido
        }
    }

    // Função para tocar a música atual
    function playTrack() {
        if (audioPlayer.src) { // Verifica se há uma fonte de áudio carregada
            audioPlayer.play();
            playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Muda para ícone de pause
            if (currentAlbumArtElement) {
                currentAlbumArtElement.classList.add('spinning'); // Adiciona a animação de giro
            }
        } else if (currentAlbum && currentAlbum.tracks.length > 0) {
             // Se não há fonte mas há um álbum selecionado, carrega e toca a primeira faixa
             loadTrack(0, true); // Carrega a primeira faixa e tenta tocar
             // playTrack será chamada novamente após loadTrack carregar a fonte
        } else {
             console.warn("Nenhuma faixa carregada ou álbum selecionado para tocar.");
        }
    }

    // Função para pausar a música atual
    function pauseTrack() {
        audioPlayer.pause();
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Volta para ícone de play
        if (currentAlbumArtElement) {
            currentAlbumArtElement.classList.remove('spinning'); // Remove a animação de giro
        }
    }

    // Função para parar a música
    function stopTrack() {
        audioPlayer.pause();
        audioPlayer.currentTime = 0; // Volta para o início
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Volta para ícone de play
        if (currentAlbumArtElement) {
            currentAlbumArtElement.classList.remove('spinning'); // Remove a animação de giro
        }
        // Opcional: Manter a capa e bolacha do álbum selecionado ou voltar para as principais
        // Para manter as do álbum selecionado, não faça nada aqui.
        // Para voltar para as principais:
        // if (mainAlbumCoverElement) mainAlbumCoverElement.src = "Assets/CapaPRINCIPAL.png";
        // if (currentAlbumArtElement) currentAlbumArtElement.src = "Assets/BolachaPRINCIPAL.png";
        // currentSongTitleElement.textContent = "No Track Playing";
        // currentTimeElement.textContent = "00:00";
        // durationElement.textContent = "00:00";
        // progressBar.value = 0;
        // currentTrackIndex = -1;
        // currentAlbum = null; // Opcional: deselecionar o álbum
        // updatePlaylistDisplay(); // Opcional: limpar a playlist exibida
    }


    // Função para tocar a música anterior
    function playPreviousSong() {
        if (!currentAlbum || currentAlbum.tracks.length === 0) return; // Não faz nada se não houver álbum ou músicas
        let newIndex = currentTrackIndex - 1;
        if (newIndex < 0) {
            newIndex = currentAlbum.tracks.length - 1; // Volta para a última faixa
        }
        loadTrack(newIndex, true); // Carrega e toca a faixa anterior
        playTrack(); // Garante que a reprodução comece
    }

    // Função para tocar a próxima música
    function playNextSong() {
        if (!currentAlbum || currentAlbum.tracks.length === 0) return; // Não faz nada se não houver álbum ou músicas
        let newIndex = currentTrackIndex + 1;
        if (newIndex >= currentAlbum.tracks.length) { // Verifica se chegou ao fim do álbum
            newIndex = 0; // Volta para a primeira faixa do álbum
        }
        loadTrack(newIndex, true); // Carrega e toca a próxima faixa
        playTrack(); // Garante que a reprodução comece
    }

    // Função para alternar entre tocar/pausar
    function togglePlayPause() {
        if (!currentAlbum) { // Adiciona verificação se um álbum foi selecionado
            console.warn("Nenhum álbum selecionado para tocar.");
            // Opcional: Mostrar uma mensagem para o usuário selecionar um álbum
            return; // Sai da função se nenhum álbum estiver selecionado
        }

        if (audioPlayer.paused || !audioPlayer.src) { // Se pausado ou sem fonte, tenta tocar
            // Se nenhum track foi carregado ainda para o álbum atual, carrega o primeiro
            if (currentTrackIndex === -1 && currentAlbum.tracks.length > 0) {
                 loadTrack(0, true); // Carrega a primeira faixa e toca
            } else if (currentTrackIndex !== -1) {
                 // Se um track já foi carregado, apenas continua de onde parou
                 playTrack();
            } else {
                 console.warn("Álbum selecionado não possui faixas.");
            }
        } else { // Se tocando, pausa
            pauseTrack();
        }
    }

    // Função para atualizar a exibição da playlist (agora exibe as faixas do álbum selecionado)
    function updatePlaylistDisplay() {
        playlistElement.innerHTML = ''; // Limpa a exibição atual da playlist
        if (currentAlbum && currentAlbum.tracks.length > 0) {
            emptyPlaylistMessage.style.display = 'none'; // Esconde a mensagem de playlist vazia
            currentAlbum.tracks.forEach((track, index) => { // Itera sobre as faixas do álbum atual
                const listItem = document.createElement('li');
                listItem.dataset.index = index; // Armazena o índice da faixa
                // Inclui a miniatura da capa da música (trackArt)
                listItem.innerHTML = `<img src="${track.trackArt}" alt="Capa da Música"> <span>${track.title}</span>`;

                listItem.addEventListener('click', () => {
                    loadTrack(index, true); // Carrega e toca a faixa clicada
                    playTrack(); // Garante que a reprodução comece
                });

                playlistElement.appendChild(listItem);
            });
            playlistCountElement.textContent = `${currentAlbum.tracks.length} música${currentAlbum.tracks.length > 1 ? 's' : ''}`;
        } else {
            // Se nenhum álbum selecionado ou álbum sem faixas
            playlistElement.innerHTML = ''; // Garante que a lista esteja vazia
            emptyPlaylistMessage.style.display = 'block'; // Mostra a mensagem de playlist vazia
            playlistCountElement.textContent = '0 músicas';
        }
    }

    // --- Listeners de Eventos dos Controles ---

    // Adiciona listener ao botão play/pause
    if (playPauseButton) { // Verifica se o elemento existe antes de adicionar o listener
        playPauseButton.addEventListener('click', togglePlayPause);
    } else {
        console.error("Elemento com ID 'play-pause-button' não encontrado.");
    }

    // Adiciona listener ao botão stop
     if (stopButton) { // Verifica se o elemento existe
        stopButton.addEventListener('click', stopTrack);
    } else {
        console.error("Elemento com ID 'stop-button' não encontrado.");
    }

    // Adiciona listeners aos botões prev/next
    if (prevButton) { // Verifica se o elemento existe
        prevButton.addEventListener('click', playPreviousSong);
    } else {
        console.error("Elemento com ID 'prev-button' não encontrado.");
    }

    if (nextButton) { // Verifica se o elemento existe
        nextButton.addEventListener('click', playNextSong);
    } else {
        console.error("Elemento com ID 'next-button' não encontrado.");
    }

    // ... existing code ...

    // --- Inicialização ---

    // Ao carregar a página, exibe a lista de álbuns para seleção
    displayAlbums();

    // A playlist é exibida vazia inicialmente, pois nenhum álbum foi selecionado
    updatePlaylistDisplay(); // Chama para mostrar a mensagem de playlist vazia

    // A primeira faixa não é carregada automaticamente ao carregar a página.
    // if (playlist.length > 0) { // REMOVIDO
    //     loadTrack(0, false); // REMOVIDO
    // }

});