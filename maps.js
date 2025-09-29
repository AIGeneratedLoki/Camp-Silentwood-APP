document.addEventListener('DOMContentLoaded', () => {
    const mapView = document.getElementById('map-view');
    const mapListContainer = document.getElementById('map-list-container');
    const tokenContextMenu = document.getElementById('token-context-menu');
    const deleteTokenBtn = document.getElementById('delete-token-btn');
    const colorPalette = document.getElementById('color-palette');
    const colorPaletteNewToken = document.getElementById('color-palette-new-token');

    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'white', 'black'];
    let selectedColor = colors[0];

    function populateColorPalettes() {
        colors.forEach(color => {
            const colorBox = document.createElement('div');
            colorBox.classList.add('color-box');
            colorBox.style.backgroundColor = color;
            colorPalette.appendChild(colorBox.cloneNode(true));
            const newTokenColorBox = colorBox.cloneNode(true);
            if (color === selectedColor) {
                newTokenColorBox.classList.add('active');
            }
            newTokenColorBox.addEventListener('click', () => {
                selectedColor = color;
                const activeColorBox = colorPaletteNewToken.querySelector('.active');
                if (activeColorBox) {
                    activeColorBox.classList.remove('active');
                }
                newTokenColorBox.classList.add('active');
            });
            colorPaletteNewToken.appendChild(newTokenColorBox);
        });
    }

    populateColorPalettes();

    let maps = [];
    let selectedMap = null;
    let selectedToken = null;

    function loadInitialMaps() {
        maps = [
            { id: 1, name: 'main map', src: 'Assets/main-map.png', tokens: [] },
            { id: 2, name: 'arts and crafts cabin', src: 'Assets/arts-and-crafts-cabin.png', tokens: [] },
            { id: 3, name: 'cabin 1', src: 'Assets/cabin-1.png', tokens: [] },
            { id: 4, name: 'cabin 2', src: 'Assets/cabin-2.png', tokens: [] },
            { id: 5, name: 'cabin 3', src: 'Assets/cabin-3.png', tokens: [] },
            { id: 6, name: 'cabin 4', src: 'Assets/cabin-4.png', tokens: [] },
            { id: 7, name: 'cabins basement', src: 'Assets/cabins-basement.png', tokens: [] },
            { id: 8, name: 'generator', src: 'Assets/generator.png', tokens: [] },
            { id: 9, name: 'tool shed', src: 'Assets/tool-shed.png', tokens: [] }
        ];
        console.log('Maps loaded:', maps);
        renderMapList();
        selectMap(maps[0].id);
    }

    function renderMapList() {
        const mapListContainer = document.getElementById('map-list-container');
        mapListContainer.innerHTML = '';
        maps.forEach(map => {
            const mapItem = document.createElement('div');
            mapItem.classList.add('map-list-item');
            mapItem.dataset.mapId = map.id;
            mapItem.textContent = map.name;
            if (selectedMap && map.id === selectedMap.id) {
                mapItem.classList.add('active');
            }
            mapItem.addEventListener('click', () => {
                selectMap(map.id);
            });
            mapListContainer.appendChild(mapItem);
        });
    }

    function selectMap(mapId) {
        selectedMap = maps.find(map => map.id === mapId);
        renderMapList();
        renderMap();
    }

    function renderMap() {
        mapView.innerHTML = '';
        if (selectedMap) {
            const mapImage = document.createElement('img');
            mapImage.src = selectedMap.src;
            mapImage.alt = selectedMap.name;
            mapImage.style.maxWidth = '100%';
            mapImage.style.maxHeight = '100%';
            mapView.appendChild(mapImage);

            selectedMap.tokens.forEach(token => {
                const tokenElement = document.createElement('div');
                tokenElement.classList.add('token');
                tokenElement.style.left = `${token.x}px`;
                tokenElement.style.top = `${token.y}px`;
                tokenElement.style.backgroundColor = token.color;
                tokenElement.dataset.tokenId = token.id;
                mapView.appendChild(tokenElement);
            });
        }
    }

    mapView.addEventListener('click', (event) => {
        if (selectedMap && event.target.tagName === 'IMG') {
            const rect = mapView.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const newToken = {
                id: Date.now(),
                x: x,
                y: y,
                color: selectedColor
            };
            selectedMap.tokens.push(newToken);
            renderMap();
        }
    });

    mapView.addEventListener('mousedown', (event) => {
        if (event.target.classList.contains('token')) {
            const tokenId = parseInt(event.target.dataset.tokenId);
            selectedToken = selectedMap.tokens.find(t => t.id === tokenId);
            const tokenElement = event.target;

            const offsetX = event.clientX - tokenElement.getBoundingClientRect().left;
            const offsetY = event.clientY - tokenElement.getBoundingClientRect().top;

            function onMouseMove(e) {
                const rect = mapView.getBoundingClientRect();
                selectedToken.x = e.clientX - rect.left - offsetX;
                selectedToken.y = e.clientY - rect.top - offsetY;
                renderMap();
            }

            function onMouseUp() {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
            }

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        }
    });

    mapView.addEventListener('contextmenu', (event) => {
        event.preventDefault();
        if (event.target.classList.contains('token')) {
            const tokenId = parseInt(event.target.dataset.tokenId);
            selectedToken = selectedMap.tokens.find(t => t.id === tokenId);
            tokenContextMenu.style.top = `${event.clientY}px`;
            tokenContextMenu.style.left = `${event.clientX}px`;
            tokenContextMenu.style.display = 'block';
        }
    });

    deleteTokenBtn.addEventListener('click', () => {
        if (selectedToken) {
            selectedMap.tokens = selectedMap.tokens.filter(t => t.id !== selectedToken.id);
            tokenContextMenu.style.display = 'none';
            renderMap();
        }
    });

    colorPalette.addEventListener('click', (event) => {
        if (event.target.classList.contains('color-box')) {
            if (selectedToken) {
                selectedToken.color = event.target.style.backgroundColor;
                tokenContextMenu.style.display = 'none';
                renderMap();
            }
        }
    });

    document.addEventListener('click', (event) => {
        if (event.target.id !== 'token-context-menu' && !event.target.classList.contains('token')) {
            tokenContextMenu.style.display = 'none';
        }
    });

    loadInitialMaps();
});