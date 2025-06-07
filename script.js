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
                { title: "Pedro James Brown Bõnus", src: "Assets/MeuCaminhoIA/10 - Pedro James Brown Bõnus.mp3", trackArt: "Assets/MeuCaminhoIA/10 - Pedro James Brown Bõnus.png" },
                { title: "Pra Sempre Irmãs", src: "Assets/MeuCaminhoIA/11 - Pra Sempre Irmãs.mp3", trackArt: "Assets/MeuCaminhoIA/11 - Pra Sempre Irmãs.png" } // Adiciona a nova faixa aqui
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
        console.log("displayAlbums: Exibindo álbuns."); // Log
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
                console.log(`Album clicked: ${album.name} (Index: ${index})`); // Log
                selectAlbum(index);
            });

            albumListElement.appendChild(albumItem);
        });
    }

    // Função para selecionar um álbum e exibir sua playlist
    function selectAlbum(albumIndex) {
        console.log(`selectAlbum: Selecionando álbum com índice ${albumIndex}`); // Log
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
        progressBar.max = 0; // Reseta o max da barra também


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
        console.log(`loadTrack: Carregando faixa índice ${index}, autoPlay: ${autoPlay}`); // Log
        // Usa a lista de tracks do álbum atualmente selecionado
        if (currentAlbum && index >= 0 && index < currentAlbum.tracks.length) {
            currentTrackIndex = index;
            const track = currentAlbum.tracks[currentTrackIndex];

            // Define a fonte do áudio. Isso pode disparar eventos de carregamento.
            audioPlayer.src = track.src;
            console.log(`loadTrack: src definido para ${track.src}`); // Log
            console.log(`loadTrack: currentTime ANTES de load(): ${audioPlayer.currentTime}`); // Log adicionado
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

            // Carrega a música.
            audioPlayer.load(); // Garante que o áudio seja carregado para obter a duração
            console.log("loadTrack: audioPlayer.load() chamado."); // Log
            console.log(`loadTrack: currentTime APÓS load(): ${audioPlayer.currentTime}`); // Log adicionado

            // Se autoPlay for true, tentamos tocar imediatamente.
            // A função playTrack agora lida com a espera pelo 'canplay' ou a Promise do play().
            if (autoPlay) {
                console.log("loadTrack: autoPlay é true, chamando playTrack()."); // Log
                playTrack();
            } else {
                 // Garante que a bolacha não esteja girando se não for tocar automaticamente
                 if (currentAlbumArtElement) {
                    currentAlbumArtElement.classList.remove('spinning');
                 }
                 console.log("loadTrack: autoPlay é false."); // Log
            }

        } else {
            console.error("loadTrack: Índice de faixa inválido ou nenhum álbum selecionado."); // Log
            // Opcional: Limpar a playlist ou mostrar mensagem
            updatePlaylistDisplay(); // Limpa a lista se o álbum for inválido
        }
    }

    // Função para tocar a música atual
    function playTrack() {
        console.log("playTrack: Tentando tocar..."); // Log
        // Verifica se há uma fonte de áudio carregada
        if (audioPlayer.src) {
            // Tenta tocar e lida com a Promise retornada por play()
            const playPromise = audioPlayer.play();

            if (playPromise !== undefined) {
                playPromise.then(() => {
                    // Playback started successfully
                    console.log("playTrack: Playback iniciado com sucesso."); // Log
                    playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Muda para ícone de pause
                    if (currentAlbumArtElement) {
                        currentAlbumArtElement.classList.add('spinning'); // Adiciona a animação de giro
                    }
                }).catch(error => {
                    // Handle potential errors, e.g., user gesture requirement
                    console.error("playTrack: Erro ao tentar tocar a música:", error); // Log
                    // Pode ser necessário adicionar uma mensagem para o usuário interagir
                    playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Volta para o ícone de play
                    if (currentAlbumArtElement) {
                        currentAlbumArtElement.classList.remove('spinning'); // Remove a animação de giro
                    }
                    // Se o erro for relacionado a user gesture, a música não tocará automaticamente.
                    // O usuário precisará clicar no botão play.
                });
            } else {
                 // Fallback para navegadores mais antigos que não retornam Promise
                 console.log("playTrack: play() não retornou Promise (navegador antigo?)."); // Log
                 playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Assume que vai tocar
                 if (currentAlbumArtElement) {
                    currentAlbumArtElement.classList.add('spinning'); // Assume que vai girar
                 }
            }
        } else {
             console.warn("playTrack: Nenhuma fonte de áudio definida."); // Log
             // Opcional: Tentar carregar o primeiro track se nenhum estiver carregado?
             // Isso já é tratado em togglePlayPause.
        }
    }

    // Função para pausar a música atual
    function pauseTrack() {
        console.log("pauseTrack: Pausando..."); // Log
        audioPlayer.pause();
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Volta para ícone de play
        if (currentAlbumArtElement) {
            currentAlbumArtElement.classList.remove('spinning'); // Remove a animação de giro
        }
    }

    // Função para parar a música
    function stopTrack() {
        console.log("stopTrack: Parando..."); // Log
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
        console.log("playPreviousSong: Tentando tocar faixa anterior."); // Log
        if (!currentAlbum || currentAlbum.tracks.length === 0) {
            console.warn("playPreviousSong: Nenhum álbum ou músicas disponíveis."); // Log
            return; // Não faz nada se não houver álbum ou músicas
        }
        let newIndex = currentTrackIndex - 1;
        if (newIndex < 0) {
            newIndex = currentAlbum.tracks.length - 1; // Volta para a última faixa
        }
        console.log(`playPreviousSong: Carregando índice ${newIndex}.`); // Log
        loadTrack(newIndex, true); // Carrega e toca a faixa anterior
    }

    // Função para tocar a próxima música
    function playNextSong() {
        console.log("playNextSong: Tentando tocar próxima faixa."); // Log
        if (!currentAlbum || currentAlbum.tracks.length === 0) {
             console.warn("playNextSong: Nenhum álbum ou músicas disponíveis."); // Log
             return; // Não faz nada se não houver álbum ou músicas
        }
        let newIndex = currentTrackIndex + 1;
        if (newIndex >= currentAlbum.tracks.length) { // Verifica se chegou ao fim do álbum
            newIndex = 0; // Volta para a primeira faixa do álbum
        }
        console.log(`playNextSong: Carregando índice ${newIndex}.`); // Log
        loadTrack(newIndex, true); // Carrega e toca a próxima faixa
    }

    // Função para alternar entre tocar/pausar
    function togglePlayPause() {
        console.log("togglePlayPause: Chamado."); // Log
        if (!currentAlbum) { // Adiciona verificação se um álbum foi selecionado
            console.warn("togglePlayPause: Nenhum álbum selecionado para tocar."); // Log
            // Opcional: Mostrar uma mensagem para o usuário selecionar um álbum
            return; // Sai da função se nenhum álbum estiver selecionado
        }

        if (audioPlayer.paused || !audioPlayer.src) { // Se pausado ou sem fonte, tenta tocar
            console.log("togglePlayPause: Player pausado ou sem src. Tentando tocar."); // Log
            // Se nenhum track foi carregado ainda para o álbum atual, carrega o primeiro
            if (currentTrackIndex === -1 && currentAlbum.tracks.length > 0) {
                 console.log("togglePlayPause: currentTrackIndex é -1, carregando primeiro track."); // Log
                 loadTrack(0, true); // Carrega a primeira faixa e toca
            } else if (currentTrackIndex !== -1) {
                 // Se um track já foi carregado, apenas continua de onde parou
                 console.log("togglePlayPause: currentTrackIndex válido, chamando playTrack()."); // Log
                 playTrack();
            } else {
                 console.warn("togglePlayPause: Álbum selecionado não possui faixas."); // Log
            }
        } else { // Se tocando, pausa
            console.log("togglePlayPause: Player tocando. Pausando."); // Log
            pauseTrack();
        }
    }

    // Função para atualizar a exibição da playlist (agora exibe as faixas do álbum selecionado)
    function updatePlaylistDisplay() {
        console.log("updatePlaylistDisplay: Atualizando exibição da playlist."); // Log
        playlistElement.innerHTML = ''; // Limpa a exibição atual da playlist
        if (currentAlbum && currentAlbum.tracks.length > 0) {
            emptyPlaylistMessage.style.display = 'none'; // Esconde a mensagem de playlist vazia
            currentAlbum.tracks.forEach((track, index) => { // Itera sobre as faixas do álbum atual
                const listItem = document.createElement('li');
                listItem.dataset.index = index; // Armazena o índice da faixa
                // Inclui a miniatura da capa da música (trackArt)
                listItem.innerHTML = `<img src="${track.trackArt}" alt="Capa da Música"> <span>${track.title}</span>`;

                listItem.addEventListener('click', () => {
                    console.log(`Playlist item clicked: ${track.title} (Index: ${index})`); // Log
                    loadTrack(index, true); // Carrega e toca a faixa clicada
                });

                playlistElement.appendChild(listItem);
            });
            playlistCountElement.textContent = `${currentAlbum.tracks.length} música${currentAlbum.tracks.length > 1 ? 's' : ''}`;
        } else {
            // Se nenhum álbum selecionado ou álbum sem faixas
            console.log("updatePlaylistDisplay: Nenhum álbum selecionado ou sem faixas. Limpando playlist."); // Log
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

    // --- Listeners para o Audio Player ---

    // Evento 'loadedmetadata' para obter a duração da música assim que os metadados estiverem disponíveis
    audioPlayer.addEventListener('loadedmetadata', () => {
        console.log(`loadedmetadata: Duração disponível. audioPlayer.duration: ${audioPlayer.duration}`); // Log
        if (!isNaN(audioPlayer.duration) && isFinite(audioPlayer.duration)) {
            durationElement.textContent = formatTime(audioPlayer.duration);
            progressBar.max = audioPlayer.duration; // Define o valor máximo da barra de progresso como a duração total
            progressBar.value = audioPlayer.currentTime; // <-- Adiciona esta linha para atualizar a barra no início
            console.log(`loadedmetadata: Duração formatada: ${durationElement.textContent}, progressBar.max: ${progressBar.max}, progressBar.value: ${progressBar.value}`); // Log atualizado
        } else {
            console.warn("loadedmetadata: Duração inválida ou infinita."); // Log
            durationElement.textContent = "00:00"; // Ou algum indicador de duração desconhecida
            progressBar.max = 0;
        }
    });

    // Evento 'timeupdate' para atualizar o tempo atual e a barra de progresso
    audioPlayer.addEventListener('timeupdate', () => {
        // console.log(`timeupdate: currentTime: ${audioPlayer.currentTime}, duration: ${audioPlayer.duration}, isSeeking: ${isSeeking}`); // Log mais detalhado - Revertido para menos verboso
        currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
        // Atualiza a barra de progresso APENAS se o usuário não estiver arrastando
        // Adiciona verificação se a duração é válida antes de atualizar a barra
        if (!isSeeking && !isNaN(audioPlayer.duration) && isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
            progressBar.value = audioPlayer.currentTime;
        } else if (!isSeeking) {
             // Log para entender por que a barra não está atualizando quando não está buscando - Revertido
             // console.warn(`timeupdate: Barra de progresso não atualizada. isSeeking: ${isSeeking}, duration: ${audioPlayer.duration}`);
        }
    });

    // Evento 'ended' para tocar a próxima música quando a atual terminar
    audioPlayer.addEventListener('ended', () => {
        console.log(`ended: Música terminou. Chamando playNextSong().`); // Log atualizado
        playNextSong();
    });

    // Evento 'error' para capturar erros de áudio
    audioPlayer.addEventListener('error', (e) => {
        console.error("Audio Error:", e); // Log o evento de erro
        switch (e.target.error.code) {
            case MediaError.MEDIA_ERR_ABORTED:
                console.error('Audio playback aborted.');
                break;
            case MediaError.MEDIA_ERR_NETWORK:
                console.error('A network error caused the audio download to fail.');
                break;
            case MediaError.MEDIA_ERR_DECODE:
                console.error('The audio playback was aborted due to a corruption problem or because the audio used features your browser did not support.');
                break;
            case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                console.error('The audio could not be loaded, either because the server or network failed or because the format is not supported.');
                break;
            default:
                console.error('An unknown audio error occurred.');
                break;
        }
        // Opcional: Mostrar uma mensagem de erro para o usuário
        currentSongTitleElement.textContent = "Erro ao carregar música";
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>';
        if (currentAlbumArtElement) {
            currentAlbumArtElement.classList.remove('spinning');
        }
    });

    // Evento 'canplay' - disparado quando o navegador pode começar a reproduzir
    audioPlayer.addEventListener('canplay', () => {
        console.log("canplay: Áudio pronto para começar a tocar."); // Log
        // Podemos adicionar lógica aqui se necessário, mas playTrack já lida com a Promise
    });

     // Evento 'canplaythrough' - disparado quando o navegador estima que pode reproduzir até o fim
    audioPlayer.addEventListener('canplaythrough', () => {
        console.log("canplaythrough: Áudio pronto para tocar até o fim."); // Log
        // Este evento é mais confiável para auto-play, mas 'canplay' geralmente é suficiente
    });


    // --- Listeners para a Barra de Progresso ---

    // Evento 'mousedown' ou 'touchstart' na barra de progresso (quando o usuário começa a arrastar)
    progressBar.addEventListener('mousedown', () => {
        console.log("progressBar mousedown: Iniciando seek."); // Log
        isSeeking = true;
        wasPlayingBeforeSeek = !audioPlayer.paused; // Salva se estava tocando
        pauseTrack(); // Pausa a música enquanto arrasta
    });
    // Adiciona também para dispositivos touch
    progressBar.addEventListener('touchstart', () => {
        console.log("progressBar touchstart: Iniciando seek."); // Log
        isSeeking = true;
        wasPlayingBeforeSeek = !audioPlayer.paused; // Salva se estava tocando
        pauseTrack(); // Pausa a música enquanto arrasta
    });


    // Evento 'input' na barra de progresso (enquanto o usuário está arrastando)
    // Atualiza apenas o tempo exibido, não a posição da música ainda
    progressBar.addEventListener('input', () => {
        // console.log(`progressBar input: value = ${progressBar.value}`); // Log - pode ser verboso
        currentTimeElement.textContent = formatTime(progressBar.value);
    });

    // Evento 'mouseup' ou 'touchend' na barra de progresso (quando o usuário solta)
    progressBar.addEventListener('mouseup', () => {
        console.log(`progressBar mouseup: Finalizando seek. Tentando definir currentTime para ${progressBar.value}`); // Log
        isSeeking = false;
        audioPlayer.currentTime = progressBar.value; // Define a posição da música para o valor da barra
        console.log(`progressBar mouseup: currentTime definido para ${audioPlayer.currentTime}`); // Log para confirmar
        if (wasPlayingBeforeSeek) {
            console.log("progressBar mouseup: Estava tocando antes, tentando retomar play com delay."); // Log adicionado
            // Adiciona um pequeno delay antes de tentar tocar
            setTimeout(() => {
                 // Tenta tocar e lida com a Promise retornada por play()
                const playPromise = audioPlayer.play();
                 if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log("progressBar mouseup: Playback retomado com sucesso após seek (com delay)."); // Log adicionado
                        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Muda para ícone de pause
                        if (currentAlbumArtElement) {
                            currentAlbumArtElement.classList.add('spinning'); // Adiciona a animação de giro
                        }
                    }).catch(error => {
                        console.error("progressBar mouseup: Erro ao tentar retomar play após seek (com delay):", error); // Log adicionado
                        playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Volta para o ícone de play
                        if (currentAlbumArtElement) {
                            currentAlbumArtElement.classList.remove('spinning'); // Remove a animação de giro
                        }
                    });
                } else {
                     // Fallback para navegadores mais antigos
                     console.log("progressBar mouseup: play() não retornou Promise (navegador antigo?) (com delay)."); // Log adicionado
                     playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Assume que vai tocar
                     if (currentAlbumArtElement) {
                        currentAlbumArtElement.classList.add('spinning'); // Assume que vai girar
                     }
                }
            }, 50); // Pequeno delay de 50ms adicionado
        } else {
             console.log("progressBar mouseup: Não estava tocando antes."); // Log
        }
    });
    // Adiciona também para dispositivos touch
    progressBar.addEventListener('touchend', () => {
        console.log(`progressBar touchend: Finalizando seek. Tentando definir currentTime para ${progressBar.value}`); // Log
        isSeeking = false;
        audioPlayer.currentTime = progressBar.value; // Define a posição da música para o valor da barra
        console.log(`progressBar touchend: currentTime definido para ${audioPlayer.currentTime}`); // Log para confirmar
        if (wasPlayingBeforeSeek) {
            console.log("progressBar touchend: Estava tocando antes, tentando retomar play com delay."); // Log adicionado
            // Adiciona um pequeno delay antes de tentar tocar
            setTimeout(() => {
                 // Tenta tocar e lida com a Promise retornada por play()
                const playPromise = audioPlayer.play();
                 if (playPromise !== undefined) {
                    playPromise.then(() => {
                        console.log("progressBar touchend: Playback retomado com sucesso após seek (com delay)."); // Log adicionado
                        playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Muda para ícone de pause
                        if (currentAlbumArtElement) {
                            currentAlbumArtElement.classList.add('spinning'); // Adiciona a animação de giro
                        }
                    }).catch(error => {
                        console.error("progressBar touchend: Erro ao tentar retomar play após seek (com delay):", error); // Log adicionado
                        // Tratar o erro, talvez mostrar uma mensagem para o usuário
                    });
                }
            }, 50); // Pequeno delay de 50ms
        }
    });


    // --- Inicialização ---
    displayAlbums(); // Exibe as capas dos álbuns ao carregar a página

    // Opcional: Carregar o primeiro álbum por padrão ao carregar a página
    // if (albums.length > 0) {
    //     selectAlbum(0);
    // }

}); // <--- ADICIONE ESTA CHAVE DE FECHAMENTO E O PARÊNTESE/PONTO E VÍRGULA