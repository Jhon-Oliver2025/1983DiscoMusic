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

    let currentTrackIndex = -1; // Índice da faixa atualmente tocando
    let isSeeking = false; // Flag para saber se o usuário está arrastando a barra
    let wasPlayingBeforeSeek = false; // Nova flag para lembrar o estado antes de arrastar

    // Lista de músicas com seus caminhos e capas
    let playlist = [
        { title: "Meu tipo de Garota 15 Anos", src: "assets/1 - Meu tipo de Garota 15 Anos.mp3", albumArt: "assets/1 - Meu tipo de Garota 15 Anos.png" },
        { title: "Meu tipo de Herói", src: "assets/2 - Meu tipo de Herói.mp3", albumArt: "assets/2 - Meu tipo de Herói.png" },
        { title: "Meu tipo de Princesa", src: "assets/3 - Meu tipo de Princesa.mp3", albumArt: "assets/3 - Meu tipo de Princesa.png" },
        { title: "Irmandade Eterna", src: "assets/4 - Irmandade Eterna.mp3", albumArt: "assets/4 - Irmandade Eterna.png" },
        { title: "Um lugar chamado Sonia", src: "assets/5 - Um lugar chamado Sonia.mp3", albumArt: "assets/5 - Um lugar chamado Sonia.png" },
        { title: "Manolos", src: "assets/6 - Manolos.mp3", albumArt: "assets/6 - Manolos.png" },
        { title: "Obrigado Perdão e Cuida", src: "assets/7 - Obrigado Perdão e Cuida.mp3", albumArt: "assets/7 - Obrigado Perdão e Cuida.png" },
        { title: "Persistindo em Fé", src: "assets/8 - Persistindo em Fé.mp3", albumArt: "assets/8 - Persistindo em Fé.png" },
        { title: "Pedro Bryan Bônus", src: "assets/9 - Pedro Bryan Bônus.mp3", albumArt: "assets/9 - Pedro Bryan Bônus.png" },
        { title: "Pedro James Brown Bõnus", src: "assets/10 - Pedro James Brown Bõnus.mp3", albumArt: "assets/10 - Pedro James Brown Bõnus.png" }
    ]; // <-- Adicionado o fechamento correto do array aqui

    // Função para formatar o tempo (ex: 03:45)
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');
        return `${formattedMinutes}:${formattedSeconds}`;
    }

    // Função para carregar e (opcionalmente) tocar uma faixa específica
    function loadTrack(index, autoPlay = true) {
        if (index >= 0 && index < playlist.length) {
            currentTrackIndex = index;
            audioPlayer.src = playlist[currentTrackIndex].src;
            currentSongTitleElement.textContent = playlist[currentTrackIndex].title;

            // Define a capa principal grande como a capa do álbum da música
            // REMOVIDO: Não definimos mais a capa principal aqui, ela é fixa no HTML
            // if (mainAlbumCoverElement) {
            //      mainAlbumCoverElement.src = playlist[currentTrackIndex].albumArt || ''; // Define a capa da música no topo
            //      mainAlbumCoverElement.alt = `Capa do Álbum: ${playlist[currentTrackIndex].title}`;
            // } else {
            //      console.error("Elemento com ID 'main-album-cover' não encontrado.");
            // }

            // Define a capa giratória menor como a capa do álbum da música
            if (currentAlbumArtElement) {
                 currentAlbumArtElement.src = playlist[currentTrackIndex].albumArt || ''; // Define a capa da música, padrão vazio se não houver
                 currentAlbumArtElement.alt = `Capa do Álbum: ${playlist[currentTrackIndex].title}`;
            } else {
                 console.error("Elemento com ID 'current-album-art' não encontrado.");
            }


            // Remove a classe 'active' de todos os itens da lista
            playlistElement.querySelectorAll('li').forEach((item) => {
                item.classList.remove('active');
            });

            // Adiciona a classe 'active' ao item da lista atual
            const currentItem = playlistElement.querySelector(`li[data-index="${currentTrackIndex}"]`);
            if (currentItem) {
                currentItem.classList.add('active');
            }

            audioPlayer.load(); // Carrega a nova faixa

            // Resetar a barra de progresso ao carregar uma nova faixa
            if (progressBar) {
                progressBar.value = 0;
            }

            if (autoPlay) {
                 // A reprodução será iniciada no evento 'loadedmetadata'
                 // para garantir que a duração esteja disponível.
                 // Se o navegador bloquear o autoplay, o usuário precisará clicar no play.
            }

        } else {
            // Lida com o caso em que o índice está fora dos limites (ex: fim da playlist)
            currentTrackIndex = -1; // Reseta o índice
            currentSongTitleElement.textContent = "No Track Playing";
            currentAlbumArtElement.src = ""; // Limpa a capa
            currentAlbumArtElement.alt = "Capa do Álbum";
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Reseta o ícone do botão
            currentAlbumArtElement.classList.remove('spinning'); // Para a animação de giro
            currentTimeElement.textContent = '00:00'; // Reseta a exibição do tempo atual
            durationElement.textContent = '00:00'; // Reseta a exibição da duração
            audioPlayer.removeAttribute('src'); // Limpa a fonte de áudio
            audioPlayer.load(); // Carrega fonte vazia para resetar o player
             // Remove a classe 'active' de todos os itens da lista
            playlistElement.querySelectorAll('li').forEach((item) => {
                item.classList.remove('active');
            });
            // Reseta a barra de progresso
            if (progressBar) {
                progressBar.value = 0;
                progressBar.max = 100; // Volta para um valor padrão
            }
        }
    }

    // Função para tocar a faixa atual
    function playTrack() {
         if (audioPlayer.src) { // Só toca se uma fonte estiver definida
            audioPlayer.play();
         } else if (playlist.length > 0) { // Se não houver fonte, mas a playlist existir, carrega a primeira faixa
             loadTrack(0);
             // A reprodução começará após loadedmetadata
         }
    }

    // Função para pausar a faixa atual
    function pauseTrack() {
        audioPlayer.pause();
    }

    // Função para parar a faixa atual
    function stopTrack() {
        audioPlayer.pause();
        audioPlayer.currentTime = 0; // Reseta o tempo para o início
        playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Reseta o ícone do botão
        currentAlbumArtElement.classList.remove('spinning'); // Para a animação de giro
        currentTimeElement.textContent = '00:00'; // Reseta a exibição do tempo atual
    }

    // Função para tocar a música anterior
    function playPreviousSong() {
        if (playlist.length === 0) return;
        const newIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(newIndex, false); // Carrega a faixa anterior, SEM autoplay dentro de loadTrack
        playTrack(); // Inicia a reprodução explicitamente
    }

    // Função para tocar a próxima música
    function playNextSong() {
        if (playlist.length === 0) return;
        const newIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(newIndex, false); // Carrega a próxima faixa, SEM autoplay dentro de loadTrack
        playTrack(); // Inicia a reprodução explicitamente
    }

    // Função para alternar entre tocar/pausar
    function togglePlayPause() {
        if (audioPlayer.paused || !audioPlayer.src) { // Se pausado ou sem fonte, tenta tocar
            playTrack();
        } else { // Se tocando, pausa
            pauseTrack();
        }
    }

    // Função para carregar e exibir a playlist na interface
    function loadPlaylist() {
        playlistElement.innerHTML = ''; // Limpa a exibição atual da playlist
        if (playlist.length === 0) {
            emptyPlaylistMessage.style.display = 'block'; // Mostra a mensagem de playlist vazia
            playlistCountElement.textContent = '0 músicas';
        } else {
            emptyPlaylistMessage.style.display = 'none'; // Esconde a mensagem de playlist vazia
            playlist.forEach((song, index) => {
                const listItem = document.createElement('li');
                listItem.textContent = song.title;
                listItem.setAttribute('data-index', index); // Armazena o índice para fácil acesso
                listItem.addEventListener('click', () => {
                    loadTrack(index, false); // Carrega a faixa clicada, desativando autoplay interno
                    playTrack(); // Inicia a reprodução explicitamente após carregar
                });
                playlistElement.appendChild(listItem);
            });
            playlistCountElement.textContent = `${playlist.length} música${playlist.length > 1 ? 's' : ''}`;
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


    // Adiciona listener para controle de volume - REMOVIDO
    /*
    if (volumeSlider && volumeValueElement) { // Verifica se os elementos existem
        volumeSlider.addEventListener('input', (event) => {
            const volume = event.target.value;
            audioPlayer.volume = volume;
            volumeValueElement.textContent = `${Math.round(volume * 100)}%`;
        });
    } else {
         console.error("Elementos de volume (slider ou value display) não encontrados.");
    }
    */


    // Adiciona listener para controle de velocidade (se existir no HTML)
    if (speedSlider && speedValueElement) { // Verifica se os elementos existem
        speedSlider.addEventListener('input', (event) => {
            const speed = parseFloat(event.target.value); // Obtém o valor como float
            audioPlayer.playbackRate = speed;
            // Atualiza a exibição da velocidade
            speedValueElement.textContent = `${speed.toFixed(1)}x`; // Exibe a velocidade com uma casa decimal
        });
    } // Não exibe erro se os elementos de velocidade não existirem, pois são opcionais


    // --- Listeners de Eventos do Audio Player ---

    // Quando o áudio começa a tocar
    audioPlayer.addEventListener('play', () => {
        if (playPauseButton) {
             playPauseButton.innerHTML = '<i class="fas fa-pause"></i>'; // Muda para ícone de pausa
        }
        if (currentAlbumArtElement) {
            currentAlbumArtElement.classList.add('spinning'); // Adiciona classe para animação de giro
        }
    });

    // Quando o áudio é pausado
    audioPlayer.addEventListener('pause', () => {
         if (playPauseButton) {
            playPauseButton.innerHTML = '<i class="fas fa-play"></i>'; // Muda para ícone de play
         }
         if (currentAlbumArtElement) {
            currentAlbumArtElement.classList.remove('spinning'); // Remove classe de animação de giro
         }
    });

    // Quando os metadados são carregados (duração, etc.)
    audioPlayer.addEventListener('loadedmetadata', () => {
        if (durationElement) { // Verifica se o elemento existe
            durationElement.textContent = formatTime(audioPlayer.duration);
        } else {
             console.error("Elemento com ID 'duration' não encontrado.");
        }

        // Atualiza o valor máximo da barra de progresso com a duração total
        if (progressBar) {
            progressBar.max = audioPlayer.duration;
        }

        // REMOVE a tentativa de tocar automaticamente aqui
        // A reprodução deve ser iniciada por interação do usuário (ex: clicar no play)
        // ou pelas funções playTrack, playNextSong, playPreviousSong
        // if (currentTrackIndex !== -1) {
        //      playTrack(); // Tenta iniciar a reprodução após carregar os metadados
        // }
    });

    // Atualiza a exibição do tempo atual enquanto a música toca
    audioPlayer.addEventListener('timeupdate', () => {
        if (currentTimeElement) { // Verifica se o elemento existe
            currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
        } else {
             console.error("Elemento com ID 'current-time' não encontrado.");
        }

        // Atualiza o valor da barra de progresso, mas apenas se o usuário NÃO estiver arrastando
        if (progressBar && !isSeeking) {
            progressBar.value = audioPlayer.currentTime;
        }
    });

    // Quando o áudio termina
    audioPlayer.addEventListener('ended', () => {
        playNextSong(); // Toca a próxima música automaticamente (agora playNextSong chama playTrack)
    });


    // --- Listeners de Eventos da Barra de Progresso ---

    if (progressBar) { // Verifica se o elemento existe
        // Quando o usuário começa a arrastar o thumb (Mouse)
        progressBar.addEventListener('mousedown', () => {
            isSeeking = true;
            // Lembra se a música estava tocando antes de pausar para arrastar
            wasPlayingBeforeSeek = !audioPlayer.paused;
            audioPlayer.pause(); // Pausa a música enquanto arrasta
        });

        // Quando o usuário solta o thumb (Mouse)
        progressBar.addEventListener('mouseup', () => {
            isSeeking = false;
            audioPlayer.currentTime = progressBar.value; // Define o tempo do áudio para o valor da barra
            // Agora verifica a flag que lembra o estado ANTES de arrastar
            if (wasPlayingBeforeSeek) { // Se estava tocando antes de arrastar
                 playTrack(); // Continua tocando a partir da nova posição
            } else {
                 // Se estava pausado, apenas atualiza o tempo exibido
                 if (currentTimeElement) {
                     currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
                 }
            }
            // Reseta a flag
            wasPlayingBeforeSeek = false;
        });

        // --- Adicionar Listeners de Eventos de Toque para Mobile ---

        // Quando o usuário começa a tocar na barra (Touch)
        progressBar.addEventListener('touchstart', () => {
            isSeeking = true;
            wasPlayingBeforeSeek = !audioPlayer.paused;
            audioPlayer.pause(); // Pausa a música enquanto arrasta
        });

        // Quando o usuário para de tocar na barra (Touch)
        progressBar.addEventListener('touchend', () => {
            isSeeking = false;
            audioPlayer.currentTime = progressBar.value; // Define o tempo do áudio para o valor da barra
            if (wasPlayingBeforeSeek) { // Se estava tocando antes de arrastar
                 playTrack(); // Continua tocando a partir da nova posição
            } else {
                 if (currentTimeElement) {
                     currentTimeElement.textContent = formatTime(audioPlayer.currentTime);
                 }
            }
            wasPlayingBeforeSeek = false;
        });

        // Opcional: Atualiza o tempo exibido enquanto arrasta (sem soltar)
        // Este listener 'input' funciona tanto para mouse quanto para touch
        progressBar.addEventListener('input', () => {
             if (currentTimeElement) {
                 currentTimeElement.textContent = formatTime(progressBar.value);
             }
        });

    } else {
        console.error("Elemento com ID 'progress-bar' não encontrado.");
    }


    // --- Inicialização ---

    // Carrega a playlist ao carregar a página
    loadPlaylist();

    // Opcionalmente, carrega a primeira faixa automaticamente ao carregar a página
    // Descomente as linhas abaixo se quiser que a primeira música seja carregada
    // (mas lembre-se da restrição de autoplay dos navegadores)
    if (playlist.length > 0) {
        loadTrack(0, false); // Carrega a primeira faixa, mas não tenta tocar automaticamente
    }

});