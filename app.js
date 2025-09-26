document.addEventListener('DOMContentLoaded', () => {
        // --- ALL DOM ELEMENTS ---
        const DOM = {
            navLinks: document.querySelectorAll('.main-nav a[data-page]'),
            contentPanels: document.querySelectorAll('.content-panel'),
            // Story
            newActBtn: document.getElementById('new-act-btn'),
            newPlotPointBtn: document.getElementById('new-plot-point-btn'),
            newSideQuestBtn: document.getElementById('new-side-quest-btn'),
            hierarchyList: document.getElementById('story-hierarchy-list'),
            titleInput: document.getElementById('story-title-input'),
            contentTextArea: document.getElementById('story-content-textarea'),
            sideQuestIndicator: document.getElementById('side-quest-indicator'),
            storyDeleteBtn: document.getElementById('story-main-delete-btn'),
            prevNoteBtn: document.getElementById('prev-note-btn'),
            nextNoteBtn: document.getElementById('next-note-btn'),
            sessionNoteTextareas: {
                events: document.getElementById('session-events-story'),
                npc: document.getElementById('session-npc-characters'),
                world: document.getElementById('session-world-building'),
                misc: document.getElementById('session-misc'),
            },
            archiveNotesBtn: document.getElementById('archive-notes-btn'),
            // Encounters
            battlesContainer: document.getElementById('battles-container'),
            statusModal: document.getElementById('status-modal'),
            statusOptionsList: document.getElementById('status-options-list'),
            saveStatusBtn: document.getElementById('save-status-btn'),
            closeStatusBtn: document.getElementById('close-status-btn'),
            // Creatures
            creatureSearchInput: document.getElementById('creature-search-input'),
            creaturesSearchList: document.getElementById('creatures-search-list'),
            createCreatureBtn: document.getElementById('create-creature-btn'),
            savedCreaturesList: document.getElementById('saved-creatures-list'),
            creatureSheetModal: document.getElementById('creature-sheet-modal'),
            creatureSheetName: document.getElementById('creature-sheet-name'),
            creatureSheetBody: document.getElementById('creature-sheet-body'),
            saveCreatureSheetBtn: document.getElementById('save-creature-sheet-btn'),
            closeCreatureSheetBtn: document.getElementById('close-creature-sheet-btn'),
            // Players
            newPlayerBtn: document.getElementById('new-player-btn'),
            randomPlayerBtn: document.getElementById('random-player-btn'),
            savedPlayersList: document.getElementById('saved-players-list'),
            playerSheetModal: document.getElementById('player-sheet-modal'),
            playerSheetBody: document.getElementById('player-sheet-body'),
            playerSheetName: document.getElementById('player-sheet-name'),
            closePlayerSheetBtn: document.getElementById('close-player-sheet-btn'),
            editToggle: document.getElementById('player-sheet-edit-toggle'),
            // Notes
            newNoteBtn: document.getElementById('new-note-btn'),
            newSubNoteBtn: document.getElementById('new-sub-note-btn'),
            noteEditToggle: document.getElementById('note-edit-toggle'),
            notesListEl: document.getElementById('notes-list'),
            noteEditor: document.getElementById('note-editor'),
            // Shared
            feedbackModal: document.getElementById('feedback-modal'),
            feedbackMessage: document.getElementById('feedback-message'),
            allBulletToggles: document.querySelectorAll('.bullet-toggle'),
            // Chat
            chatMessages: document.getElementById('chat-messages'),
            chatInput: document.getElementById('chat-input'),
            chatSendBtn: document.getElementById('chat-send-btn'),
            chatHistoryList: document.getElementById('chat-history-list'),
        };

        // --- SHARED STATE ---
        let storyData = [{
            id: 'act-1',
            title: 'Act 1: The Warning',
            content: '<p>An eerie fog rolls into the summer camp...</p>',
            children: [{
                id: 'pp-1-1',
                type: 'plot-point',
                title: 'The Missing Counselor',
                content: '<p>Jessica is nowhere to be found...</p>'
            }, { 
                id: 'pp-1-2',
                type: 'side-quest',
                title: 'The Hermit\'s Tale',
                content: '<p>Following a trail leads to a shack...</p>'
            }]
        }];
        let notesData = [{
            id: `note-1`,
            title: new Date(Date.now() - 86400000).toLocaleString(),
            content: '<p>This is the main content for the first note about the mysterious cabin.</p>',
            children: [{
                id: `note-1-1`,
                title: 'Clue: Muddy Footprints',
                content: '<p>Found large, muddy footprints leading away from the back door. They don\'t look human.</p>'
            }, { 
                id: `note-1-2`,
                title: 'Item: Rusted Key',
                content: '<p>A small, rusted key was found under the loose floorboard in the bedroom.</p>'
            }]
        }, { 
            id: `note-2`,
            title: new Date().toLocaleString(),
            content: '<p>General thoughts on the session.</p>',
            children: [{ 
                id: `note-2-1`,
                title: 'Player Idea',
                content: '<p>Maybe the hermit character knows something about the key.</p>'
            }]
        }];
        let battles = [];
        let savedCreatures = [];
        let savedPlayers = [{
            id: `pc-${Date.now()}`,
            name: "Ash Williams",
            playerName: "Bruce",
            class: "fighter",
            level: 5,
            race: "human",
            alignment: "Chaotic Good",
            xp: 6500,
            strength: 16,
            dexterity: 14,
            constitution: 15,
            intelligence: 10,
            wisdom: 12,
            charisma: 13,
            ac: 18,
            hp: 45,
            maxHp: 45,
            speed: "30ft",
            tempHp: 0,
            hitDice: "5d10",
            proficiencies: "",
            attacks: "Boomstick: +6 to hit, 2d8 piercing damage.",
            features: "Second Wind, Action Surge.",
            notes: ""
        }];
        let allMonstersList = [], allRacesList = [], allClassesList = [];
        let selectedNoteId = null;
        let selectedStoryItemId = null, selectedActId = 'act-1';
        let currentlyEditingStatusForId = null;
        let currentCreatureData = null;
        let chatHistory = [];
        const allStatusEffects = ['Blinded', 'Charmed', 'Deafened', 'Exhaustion', 'Frightened', 'Grappled', 'Incapacitated', 'Invisible', 'Paralyzed', 'Petrified', 'Poisoned', 'Prone', 'Restrained', 'Stunned', 'Unconscious'];
        
        // --- D&D DATA FOR PLAYER SHEET ---
        const abilityScores = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        const skills = [
            { name: 'Acrobatics', ability: 'dexterity' },
            { name: 'Animal Handling', ability: 'wisdom' },
            { name: 'Arcana', ability: 'intelligence' },
            { name: 'Athletics', ability: 'strength' },
            { name: 'Deception', ability: 'charisma' },
            { name: 'History', ability: 'intelligence' },
            { name: 'Insight', ability: 'wisdom' },
            { name: 'Intimidation', ability: 'charisma' },
            { name: 'Investigation', ability: 'intelligence' },
            { name: 'Medicine', ability: 'wisdom' },
            { name: 'Nature', ability: 'intelligence' },
            { name: 'Perception', ability: 'wisdom' },
            { name: 'Performance', ability: 'charisma' },
            { name: 'Persuasion', ability: 'charisma' },
            { name: 'Religion', ability: 'intelligence' },
            { name: 'Sleight of Hand', ability: 'dexterity' },
            { name: 'Stealth', ability: 'dexterity' },
            { name: 'Survival', ability: 'wisdom' },
        ];
        const savingThrows = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
        const deathSaves = ['success', 'fail'];

        // --- GENERAL/SHARED FUNCTIONS ---

        function showFeedback(message) {
            clearTimeout(window.feedbackTimeout);
            DOM.feedbackMessage.textContent = message;
            DOM.feedbackModal.style.display = 'flex';
            window.feedbackTimeout = setTimeout(() => {
                DOM.feedbackModal.style.display = 'none';
            }, 2000);
        }

        function setupNavigation() {
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    const pageId = link.getAttribute('data-page');
                    if (!pageId) return;
                    DOM.navLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                    DOM.contentPanels.forEach(panel => {
                        panel.classList.remove('active');
                        if (panel.id === pageId) {
                            panel.classList.add('active');
                        }
                    });
                });
            });
        }

        function setupTabs(pageId) {
            const tabContainer = document.getElementById(pageId);
            if (!tabContainer) return;

            tabContainer.addEventListener('click', (e) => {
                if (e.target.classList.contains('page-tab-btn')) {
                    const tabId = e.target.getAttribute('data-tab');
                    const tabBtns = tabContainer.querySelectorAll('.page-tab-btn');
                    const tabContents = tabContainer.querySelectorAll('.page-tab-content-item');

                    tabBtns.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');

                    tabContents.forEach(content => {
                        content.classList.remove('active');
                        if (content.id === tabId) {
                            content.classList.add('active');
                        }
                    });
                }
            });
        }

        function handleBulletToggle(e) {
            const btn = e.currentTarget;
            btn.classList.toggle('active');
            const isActive = btn.classList.contains('active');

            const storyMainCard = btn.closest('.story-main-card');
            const sessionNoteBox = btn.closest('.session-note-box');
            
            let editor;
            if (storyMainCard) {
                editor = storyMainCard.querySelector('.editable-textarea');
            } else if (sessionNoteBox) {
                editor = sessionNoteBox.querySelector('.editable-textarea');
            }

            if (editor) {
                editor.focus();
                document.execCommand('insertParagraph', false);
                if (isActive) {
                    document.execCommand('insertHTML', false, '<p>● </p>');
                } 
            }
        }

        function handleEnterForBullets(e) {
            if (e.key === 'Enter') {
                const editor = e.target;
                const storyMainCard = editor.closest('.story-main-card');
                const sessionNoteBox = editor.closest('.session-note-box');
                
                let bulletToggle;
                if (storyMainCard) {
                    bulletToggle = storyMainCard.querySelector('.bullet-toggle');
                } else if (sessionNoteBox) {
                    bulletToggle = sessionNoteBox.querySelector('.bullet-toggle');
                }

                if (bulletToggle && bulletToggle.classList.contains('active')) {
                    e.preventDefault();
                    document.execCommand('insertHTML', false, '<p>● </p>');
                }
            }
        }
        
        // --- CHAT PAGE FUNCTIONS ---

        function renderChatHistory() {
            DOM.chatHistoryList.innerHTML = '';
            chatHistory.forEach(chat => {
                const historyItem = document.createElement('div');
                historyItem.className = 'chat-history-item';
                historyItem.textContent = chat.title;
                historyItem.dataset.chatId = chat.id;
                DOM.chatHistoryList.appendChild(historyItem);
            });
        }

        function renderChatMessages(chatId) {
            const chat = chatHistory.find(c => c.id === chatId);
            if (!chat) {
                DOM.chatMessages.innerHTML = '';
                return;
            }

            DOM.chatMessages.innerHTML = '';
            chat.messages.forEach(message => {
                const messageEl = document.createElement('div');
                messageEl.classList.add('chat-message', `chat-message-${message.role}`);
                messageEl.textContent = message.content;
                DOM.chatMessages.appendChild(messageEl);
            });
        }

        async function sendMessage() {
            const message = DOM.chatInput.value.trim();
            if (!message) return;

            const activeChatId = DOM.chatHistoryList.querySelector('.active')?.dataset.chatId;
            let activeChat = activeChatId ? chatHistory.find(c => c.id === activeChatId) : null;

            if (!activeChat) {
                const newChatId = `chat-${Date.now()}`;
                activeChat = {
                    id: newChatId,
                    title: message.substring(0, 30),
                    messages: []
                };
                chatHistory.push(activeChat);
                renderChatHistory();
                const newHistoryItem = DOM.chatHistoryList.querySelector(`[data-chat-id="${newChatId}"]`);
                if (newHistoryItem) {
                    newHistoryItem.classList.add('active');
                }
            }

            activeChat.messages.push({ role: 'user', content: message });
            renderChatMessages(activeChat.id);
            DOM.chatInput.value = '';

            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer AIzaSyCrUKy9clLMI2L7g4bMaG-c8Xm1CO3rXNI`
                    },
                    body: JSON.stringify({
                        model: 'gpt-3.5-turbo',
                        messages: activeChat.messages
                    })
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                const assistantMessage = data.choices[0].message.content;
                activeChat.messages.push({ role: 'assistant', content: assistantMessage });
                renderChatMessages(activeChat.id);

            } catch (error) {
                console.error("Error sending message:", error);
                showFeedback("Error sending message. Check console for details.");
            }
        }

        // --- STORY PAGE FUNCTIONS ---

        const findStoryItem = (id) => {
            for (const act of storyData) {
                if (act.id === id) return act;
                for (const child of act.children) {
                    if (child.id === id) return child;
                }
            }
            return null;
        };
        const renderHierarchy = () => {
            DOM.hierarchyList.innerHTML = '';
            storyData.forEach(act => {
                const actItem = document.createElement('li');
                actItem.className = 'act-item';
                const actTitle = document.createElement('div');
                actTitle.className = 'act-title';
                actTitle.textContent = act.title;
                actTitle.dataset.id = act.id;
                if (act.id === selectedActId) actTitle.classList.add('selected');
                if (act.id === selectedStoryItemId) actTitle.classList.add('selected');
                const plotPointsList = document.createElement('ul');
                plotPointsList.className = 'plot-points';
                act.children.forEach(child => {
                    const childItem = document.createElement('li');
                    childItem.className = child.type === 'plot-point' ? 'plot-point' : 'side-quest';
                    childItem.textContent = child.title;
                    childItem.dataset.id = child.id;
                    if (child.id === selectedStoryItemId) childItem.classList.add('selected');
                    plotPointsList.appendChild(childItem);
                });
                actItem.appendChild(actTitle);
                actItem.appendChild(plotPointsList);
                DOM.hierarchyList.appendChild(actItem);
            });
        };
        function deleteStoryItem(id) {
            if (!confirm('Are you sure you want to delete this story item?')) {
                return;
            }

            let found = false;
            // Find and delete the item
            for (let i = 0; i < storyData.length; i++) {
                if (storyData[i].id === id) {
                    storyData.splice(i, 1);
                    found = true;
                    break;
                }
                for (let j = 0; j < storyData[i].children.length; j++) {
                    if (storyData[i].children[j].id === id) {
                        storyData[i].children.splice(j, 1);
                        found = true;
                        break;
                    }
                }
                if(found) break;
            }

            if (found) {
                if (selectedStoryItemId === id) {
                    loadStoryItemToEditor(null);
                }
                renderHierarchy();
                showFeedback('Story item deleted.');
            }
        }

        const loadStoryItemToEditor = (id) => {
            const item = findStoryItem(id);
            if (item) {
                selectedStoryItemId = id;
                DOM.titleInput.value = item.title;
                DOM.contentTextArea.innerHTML = item.content;
                DOM.sideQuestIndicator.style.display = item.type === 'side-quest' ? 'block' : 'none';
                DOM.storyDeleteBtn.style.display = 'inline';
            } else {
                selectedStoryItemId = null;
                DOM.titleInput.value = 'Select a note...';
                DOM.contentTextArea.innerHTML = '';
                DOM.sideQuestIndicator.style.display = 'none';
                DOM.storyDeleteBtn.style.display = 'none';
            }
            renderHierarchy();
        };

        // --- NOTES PAGE FUNCTIONS ---
        
        function renderNotes() {
            DOM.notesListEl.innerHTML = '';
            notesData.forEach(note => {
                const li = document.createElement('li');
                li.innerHTML = `<div class="note-item ${note.id === selectedNoteId ? 'selected' : ''}" data-id="${note.id}">
                        <div class="note-header">
                            <span>${note.title}</span>
                            <span class="note-delete-btn" data-id="${note.id}">&times;</span>
                        </div>
                    </div>`;

                if (note.children && note.children.length > 0) {
                    const subList = document.createElement('ul');
                    subList.className = 'sub-notes-list';
                    note.children.forEach(child => {
                        const subLi = document.createElement('li');
                        subLi.innerHTML = `<div class="note-item ${child.id === selectedNoteId ? 'selected' : ''}" data-id="${child.id}">
                                <div class="note-header">
                                    <span>${child.title}</span>
                                    <span class="note-delete-btn" data-id="${child.id}">&times;</span>
                                </div>
                            </div>`;
                        subList.appendChild(subLi);
                    });
                    li.appendChild(subList);
                }
                DOM.notesListEl.appendChild(li);
            });
        }

        function archiveSessionNotes() {
            const events = DOM.sessionNoteTextareas.events.textContent.trim();
            const npc = DOM.sessionNoteTextareas.npc.textContent.trim();
            const world = DOM.sessionNoteTextareas.world.textContent.trim();
            const misc = DOM.sessionNoteTextareas.misc.textContent.trim();

            if (!events && !npc && !world && !misc) {
                showFeedback("All session notes are empty.");
                return;
            }

            let content = "";
            if (events) content += `<h3>Events and Story</h3><p>${events.replace(/\n/g, '</p><p>')}</p><br/>`;
            if (npc) content += `<h3>NPC/Characters</h3><p>${npc.replace(/\n/g, '</p><p>')}</p><br/>`;
            if (world) content += `<h3>World Building</h3><p>${world.replace(/\n/g, '</p><p>')}</p><br/>`;
            if (misc) content += `<h3>Misc</h3><p>${misc.replace(/\n/g, '</p><p>')}</p><br/>`;

            if (notesData.length === 0) {
                notesData.push({
                    id: `note-${Date.now()}`,
                    title: new Date().toLocaleString(),
                    content: '<p>Main note for archives.</p>',
                    children: []
                });
            }

            const lastMainNote = notesData[notesData.length - 1];
            const newSubNote = {
                id: `note-${Date.now()}`,
                title: `Session Archive ${new Date().toLocaleTimeString()}`,
                content: content.trim(),
                type: 'session'
            };

            if (!lastMainNote.children) lastMainNote.children = [];
            lastMainNote.children.push(newSubNote);

            // Clear textareas
            DOM.sessionNoteTextareas.events.innerHTML = '';
            DOM.sessionNoteTextareas.npc.innerHTML = '';
            DOM.sessionNoteTextareas.world.innerHTML = '';
            DOM.sessionNoteTextareas.misc.innerHTML = '';

            renderNotes();
            showFeedback("Session notes archived!");
        }
        
        // --- ENCOUNTERS PAGE FUNCTIONS ---

        function renderAllBattles() {
            if (battles.length === 0) {
                DOM.battlesContainer.innerHTML = `<div class="no-battles-notice">Add a combatant from the Creatures or Players tab to start a battle.</div>`;
                return;
            }
            DOM.battlesContainer.innerHTML = '';
            battles.forEach(battle => {
                const battleGroup = document.createElement('div');
                battleGroup.className = 'battle-group';
                battleGroup.dataset.battleId = battle.id;
                if (battle.isComplete) battleGroup.classList.add('completed');

                const controls = document.createElement('div');
                controls.className = 'combat-controls';

                const combatantsList = document.createElement('ul');
                combatantsList.className = 'combatants-list';
                battle.combatants.sort((a, b) => b.initiative - a.initiative);

                battle.combatants.forEach((c, index) => {
                    const li = document.createElement('li');
                    li.className = 'combatant-item';
                    if (index === battle.currentTurnIndex) li.classList.add('turn-highlight');
                    li.dataset.id = c.id;
                    const mainRow = document.createElement('div');
                    mainRow.className = 'combatant-row';
                    mainRow.innerHTML = `
                            <input type="number" class="combatant-row-input init" value="${c.initiative}" title="Initiative" ${battle.isComplete ? 'disabled' : ''}>
                            <input type="text" class="combatant-row-input name" value="${c.name}" title="Name" ${battle.isComplete ? 'disabled' : ''}>
                            <span>AC</span>
                            <input type="number" class="combatant-row-input ac" value="${c.ac}" title="Armor Class" ${battle.isComplete ? 'disabled' : ''}>
                            <span>HP</span>
                            <input type="number" class="combatant-row-input hp" value="${c.currentHp}" title="Current HP" ${battle.isComplete ? 'disabled' : ''}>
                            <span>/</span>
                            <input type="number" class="combatant-row-input max-hp" value="${c.maxHp}" title="Max HP" ${battle.isComplete ? 'disabled' : ''}>
                            <button class="btn status-btn" ${battle.isComplete ? 'disabled' : ''}>Status</button>
                        `;
                    const statusDisplay = document.createElement('div');
                    statusDisplay.className = 'status-effects-display';
                    c.statusEffects.forEach(effect => {
                        const tag = document.createElement('span');
                        tag.className = 'status-tag';
                        tag.textContent = effect;
                        statusDisplay.appendChild(tag);
                    });
                    li.appendChild(mainRow);
                    li.appendChild(statusDisplay);
                    combatantsList.appendChild(li);
                });

                battleGroup.appendChild(combatantsList);

                if (!battle.isComplete) {
                    const turnTrackerText = battle.currentTurnIndex === -1 ? 'Start' : 'Next';
                    controls.innerHTML = ` <button class="btn new-combatant-btn">New Combatant</button> <button class="btn sort-initiative-btn">Sort</button> <button class="btn turn-tracker-btn">${turnTrackerText}</button> `;
                    const actions = document.createElement('div');
                    actions.className = 'combat-actions';
                    actions.innerHTML = ` <button class="btn end-battle-btn">End Battle</button>`;
                    battleGroup.insertBefore(controls, combatantsList);
                    battleGroup.appendChild(actions);
                } else {
                    const actions = document.createElement('div');
                    actions.className = 'combat-actions';
                    actions.innerHTML = `<button class="btn archive-battle-btn">Archive Battle</button>`;
                    battleGroup.appendChild(actions);
                }

                DOM.battlesContainer.appendChild(battleGroup);
            });
        }

        function addCombatant(character) {
            let activeBattle = battles.find(b => !b.isComplete);

            if (!activeBattle) {
                const battleId = `battle-${Date.now()}`;
                activeBattle = {
                    id: battleId,
                    combatants: [],
                    currentTurnIndex: -1,
                    isComplete: false
                };
                battles.push(activeBattle);
            }

            const newCombatant = {
                id: character.id,
                name: character.name,
                ac: character.ac,
                currentHp: character.hp,
                maxHp: character.maxHp || character.hp,
                initiative: 0,
                statusEffects: []
            };

            activeBattle.combatants.push(newCombatant);
            renderAllBattles();
            
            // Switch to encounters tab
            DOM.navLinks.forEach(l => l.classList.remove('active'));
            document.querySelector('a[data-page="page-encounters"]').classList.add('active');
            DOM.contentPanels.forEach(p => p.classList.remove('active'));
            document.getElementById('page-encounters').classList.add('active');

            showFeedback(`${character.name} added to the encounter!`);
        }

        function archiveBattle(battleId) {
            const battleIndex = battles.findIndex(b => b.id == battleId);
            if (battleIndex === -1) return;
            const battle = battles[battleIndex];

            let content = "Init | Name                 | HP (End/Start) | Status\n";
            content += "--------------------------------------------------------\n";
            battle.combatants.forEach(c => {
                const status = c.statusEffects.join(', ') || 'None';
                content += `${c.initiative.toString().padEnd(4)} | ${c.name.padEnd(20)} | ${String(c.currentHp).padStart(3)}/${String(c.maxHp).padEnd(10)} | ${status}\n`;
            });

            if (notesData.length === 0) {
                notesData.push({
                    id: `note-${Date.now()}`,
                    title: new Date().toLocaleString(),
                    content: '<p>Main note for archives.</p>',
                    children: []
                });
            }
            const lastMainNote = notesData[notesData.length - 1];
            const newSubNote = {
                id: `note-${Date.now()}`,
                title: `Battle Archive ${new Date().toLocaleTimeString()}`,
                content,
                type: 'battle'
            };
            if (!lastMainNote.children) lastMainNote.children = [];
            lastMainNote.children.push(newSubNote);

            battles.splice(battleIndex, 1);

            renderAllBattles();
            renderNotes();
            showFeedback("Battle archived to Notes!");
        }

        // --- D&D API & CREATURE/PLAYER FUNCTIONS ---
        
        async function fetchAllMonsters() {
            try {
                const response = await fetch('https://www.dnd5eapi.co/api/monsters');
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                allMonstersList = data.results;
                populateSearchList(allMonstersList);
            } catch (error) {
                console.error("Failed to fetch monster list:", error);
                DOM.creaturesSearchList.innerHTML = 'Error loading monsters.';
            }
        }

        function populateSearchList(list) {
            DOM.creaturesSearchList.innerHTML = '';
            list.forEach(monster => {
                const item = document.createElement('div');
                item.className = 'creatures-list-item';
                item.textContent = monster.name;
                item.dataset.url = monster.url;
                DOM.creaturesSearchList.appendChild(item);
            });
        }

        async function fetchRacesAndClasses() {
            try {
                const [racesRes, classesRes] = await Promise.all([
                    fetch('https://www.dnd5eapi.co/api/races'),
                    fetch('https://www.dnd5eapi.co/api/classes')
                ]);
                if (!racesRes.ok || !classesRes.ok) throw new Error("HTTP error!");
                const racesData = await racesRes.json();
                const classesData = await classesRes.json();
                allRacesList = racesData.results;
                allClassesList = classesData.results;
            } catch (error) {
                console.error("Failed to fetch races/classes:", error);
            }
        }

        async function openCreatureModal(url) {
            try {
                const response = await fetch(`https://www.dnd5eapi.co${url}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const creature = await response.json();
                currentCreatureData = creature; // Store full creature data
                renderCreatureSheet(creature);
                DOM.creatureSheetModal.style.display = 'flex';
            } catch (error) {
                console.error("Failed to fetch creature details:", error);
                showFeedback("Error loading creature data.");
            }
        }

        function renderCreatureSheet(creature) {
            DOM.creatureSheetName.textContent = creature.name;
            const body = DOM.creatureSheetBody;

            const formatAbilityScore = (score) => {
                const modifier = Math.floor((score - 10) / 2);
                return `${score} (${modifier >= 0 ? '+' : ''}${modifier})`;
            };

            body.innerHTML = `
                <div>
                    <div class="sheet-ability-scores">
                        <div><span>STR</span><span>${formatAbilityScore(creature.strength)}</span></div>
                        <div><span>DEX</span><span>${formatAbilityScore(creature.dexterity)}</span></div>
                        <div><span>CON</span><span>${formatAbilityScore(creature.constitution)}</span></div>
                        <div><span>INT</span><span>${formatAbilityScore(creature.intelligence)}</span></div>
                        <div><span>WIS</span><span>${formatAbilityScore(creature.wisdom)}</span></div>
                        <div><span>CHA</span><span>${formatAbilityScore(creature.charisma)}</span></div>
                    </div>
                    <div class="sheet-box">
                        <h3>Info</h3>
                        <p><strong>AC:</strong> ${creature.armor_class}</p>
                        <p><strong>HP:</strong> ${creature.hit_points} (${creature.hit_dice})</p>
                        <p><strong>Speed:</strong> ${Object.entries(creature.speed).map(([type, dist]) => `${type} ${dist}`).join(', ')}</p>
                    </div>
                </div>
                <div>
                    <div class="sheet-box">
                        <h3>Special Abilities</h3>
                        <ul class="api-data-list">
                            ${(creature.special_abilities || []).map(a => `<li><strong>${a.name}:</strong> ${a.desc}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="sheet-box">
                        <h3>Actions</h3>
                        <ul class="api-data-list">
                            ${(creature.actions || []).map(a => `<li><strong>${a.name}:</strong> ${a.desc}</li>`).join('')}
                        </ul>
                    </div>
                     <div class="sheet-box">
                        <h3>Legendary Actions</h3>
                        <ul class="api-data-list">
                             ${(creature.legendary_actions || []).map(a => `<li><strong>${a.name}:</strong> ${a.desc}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
        }

        const formatModifier = (score) => Math.floor((score - 10) / 2);

        function renderPlayerSheet(player) {
            DOM.playerSheetName.textContent = player ? player.name : 'New Player';
            const body = DOM.playerSheetBody;
            const p = player || {
                name: '', playerName: '', race: '', class: '', xp: 0, level: 1, alignment: '', background: '', game: '',
                strength: 10, dexterity: 10, constitution: 10, intelligence: 10, wisdom: 10, charisma: 10, proficiencyBonus: 2,
                ac: 10, hp: 10, maxHp: 10, tempHp: 0, speed: '30ft', hitDice: '1d8', initiative: 0,
                deathSaves: { success: 0, fail: 0 },
                resistances: '',
                skills: {},
                attacks: [],
                proficiencies: '',
                features: '',
                notes: '',
                passivePerception: 10,
                vision: '',
                scratchpad: ''
            };

            const isEditMode = DOM.editToggle.checked;
            const disabledAttribute = isEditMode ? '' : 'disabled';
            const inputType = isEditMode ? 'text' : 'hidden';

            const skillsHtml = skills.map(skill => {
                const mod = formatModifier(p[skill.ability]);
                const skillTotal = p.skills[skill.name.toLowerCase()] ? mod + p.proficiencyBonus : mod;
                return `
                    <div class="skill-group">
                        <input type="checkbox" data-skill-name="${skill.name.toLowerCase()}" ${p.skills[skill.name.toLowerCase()] ? 'checked' : ''} ${disabledAttribute}>
                        <span>${skill.name} (${skill.ability.substring(0, 3).toUpperCase()})</span>
                        <span class="character-input">${skillTotal > 0 ? '+' : ''}${skillTotal}</span>
                    </div>
                `;
            }).join('');
            
            const attacksHtml = p.attacks.map(attack => `
                <div>
                    <input type="text" class="character-input" placeholder="Name" value="${attack.name}" ${disabledAttribute}>
                    <input type="text" class="character-input" placeholder="Hit" value="${attack.hit}" ${disabledAttribute}>
                    <input type="text" class="character-input" placeholder="Damage" value="${attack.damage}" ${disabledAttribute}>
                    <textarea class="character-input" placeholder="Notes" ${disabledAttribute}>${attack.notes}</textarea>
                </div>
            `).join('');


            body.innerHTML = `
                <div class="sheet-box">
                    <h3>Character Details</h3>
                    <div class="sheet-header-grid">
                        <div><label>Name</label><input type="text" class="character-input" value="${p.name}" ${disabledAttribute}></div>
                        <div><label>Race</label><input type="text" class="character-input" value="${p.race}" ${disabledAttribute}></div>
                        <div><label>Class</label><input type="text" class="character-input" value="${p.class}" ${disabledAttribute}></div>
                        <div><label>XP</label><input type="number" class="character-input" value="${p.xp}" ${disabledAttribute}></div>
                        <div><label>Level</label><input type="number" class="character-input" value="${p.level}" ${disabledAttribute}></div>
                        <div><label>Alignment</label><input type="text" class="character-input" value="${p.alignment}" ${disabledAttribute}></div>
                        <div><label>Background</label><input type="text" class="character-input" value="${p.background}" ${disabledAttribute}></div>
                        <div><label>Player</label><input type="text" class="character-input" value="${p.playerName}" ${disabledAttribute}></div>
                        <div><label>Game</label><input type="text" class="character-input" value="${p.game}" ${disabledAttribute}></div>
                    </div>
                </div>

                <div class="sheet-box">
                    <h3>Combat Info</h3>
                    <div class="combat-info-flex-container">
                        <div class="combat-info-stats-col">
                            <div class="sheet-main-stats">
                                <div><label>AC</label><input type="number" class="character-input" value="${p.ac}" ${disabledAttribute}></div>
                                <div><label>Speed</label><input type="text" class="character-input" value="${p.speed}" ${disabledAttribute}></div>
                                <div><label>Initiative</label><input type="number" class="character-input" value="${p.initiative}" ${disabledAttribute}></div>
                            </div>
                            <div class="sheet-main-stats">
                                <div><label>HP</label><input type="number" class="character-input" value="${p.hp}" ${disabledAttribute}></div>
                                <div><label>Max HP</label><input type="number" class="character-input" value="${p.maxHp}" ${disabledAttribute}></div>
                                <div><label>Temp HP</label><input type="number" class="character-input" value="${p.tempHp}" ${disabledAttribute}></div>
                            </div>
                            <div class="sheet-main-stats">
                                <div><label>Hit Dice</label><input type="text" class="character-input" value="${p.hitDice}" ${disabledAttribute}></div>
                            </div>
                            <div class="sheet-main-stats">
                                <div><label>Death Saves</label>
                                    <div>
                                        Success: ${deathSaves.map(ds => `<input type="checkbox" ${disabledAttribute}>`).join('')}
                                    </div>
                                    <div>
                                        Fail: ${deathSaves.map(ds => `<input type="checkbox" ${disabledAttribute}>`).join('')}
                                    </div>
                                </div>
                                <div>
                                    <label>Resistances</label>
                                    <textarea class="character-input" placeholder="Notes" ${disabledAttribute}>${p.resistances}</textarea>
                                </div>
                            </div>
                        </div>
                        <div class="scratchpad-col">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <label>Scratch Pad</label>
                                <button class="btn clear-scratchpad-btn" style="padding: 2px 8px; font-size: 14px;">Clear</button>
                            </div>
                            <textarea class="character-input scratchpad-textarea" placeholder="Use this space for quick notes...">${p.scratchpad}</textarea>
                        </div>
                    </div>
                </div>

                <div class="sheet-box">
                    <h3>Ability Scores</h3>
                    <div class="ability-scores-grid">
                        <div>
                            <span>STR</span>
                            <div class="score-group">
                                <input type="number" class="character-input ability-score" data-ability="strength" value="${p.strength}" ${disabledAttribute}>
                                <span class="ability-modifier">${formatModifier(p.strength) > 0 ? '+' : ''}${formatModifier(p.strength)}</span>
                            </div>
                        </div>
                        <div>
                            <span>DEX</span>
                            <div class="score-group">
                                <input type="number" class="character-input ability-score" data-ability="dexterity" value="${p.dexterity}" ${disabledAttribute}>
                                <span class="ability-modifier">${formatModifier(p.dexterity) > 0 ? '+' : ''}${formatModifier(p.dexterity)}</span>
                            </div>
                        </div>
                        <div>
                            <span>CON</span>
                            <div class="score-group">
                                <input type="number" class="character-input ability-score" data-ability="constitution" value="${p.constitution}" ${disabledAttribute}>
                                <span class="ability-modifier">${formatModifier(p.constitution) > 0 ? '+' : ''}${formatModifier(p.constitution)}</span>
                            </div>
                        </div>
                        <div>
                            <span>INT</span>
                            <div class="score-group">
                                <input type="number" class="character-input ability-score" data-ability="intelligence" value="${p.intelligence}" ${disabledAttribute}>
                                <span class="ability-modifier">${formatModifier(p.intelligence) > 0 ? '+' : ''}${formatModifier(p.intelligence)}</span>
                            </div>
                        </div>
                        <div>
                            <span>WIS</span>
                            <div class="score-group">
                                <input type="number" class="character-input ability-score" data-ability="wisdom" value="${p.wisdom}" ${disabledAttribute}>
                                <span class="ability-modifier">${formatModifier(p.wisdom) > 0 ? '+' : ''}${formatModifier(p.wisdom)}</span>
                            </div>
                        </div>
                        <div>
                            <span>CHA</span>
                            <div class="score-group">
                                <input type="number" class="character-input" data-ability="charisma" value="${p.charisma}" ${disabledAttribute}>
                                <span class="ability-modifier">${formatModifier(p.charisma) > 0 ? '+' : ''}${formatModifier(p.charisma)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="sheet-box">
                    <h3>Proficiency Bonus</h3>
                    <span class="proficiency-bonus" style="font-size: 24px;">+${p.proficiencyBonus}</span>
                </div>
                
                <div class="sheet-box">
                    <h3>Saving Throws</h3>
                    <div class="saving-throws-grid">
                        ${savingThrows.map(st => `
                            <div>
                                <span>${st.toUpperCase()}</span>
                                <span class="character-input">${formatModifier(p[st]) > 0 ? '+' : ''}${formatModifier(p[st])}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <div class="sheet-box">
                    <h3>Skills</h3>
                    <div class="skills-grid">
                        ${skillsHtml}
                    </div>
                </div>
                
                <div class="sheet-box">
                    <h3>Proficiencies & Languages</h3>
                    <textarea class="character-input" placeholder="Notes" ${disabledAttribute}>${p.proficiencies}</textarea>
                </div>
                <div class="sheet-box">
                    <h3>Features</h3>
                    <textarea class="character-input" placeholder="Notes" ${disabledAttribute}>${p.features}</textarea>
                </div>
                <div class="sheet-box">
                    <h3>Passive Perception</h3>
                    <input type="number" class="character-input" value="${p.passivePerception}" ${disabledAttribute}>
                </div>
                <div class="sheet-box">
                    <h3>Vision</h3>
                    <input type="text" class="character-input" value="${p.vision}" ${disabledAttribute}>
                </div>
                <div class="sheet-box">
                    <h3>Important Notes</h3>
                    <textarea class="character-input" placeholder="Notes" ${disabledAttribute}>${p.notes}</textarea>
                </div>
            `;
            
            // Re-attach the event listener to the new HTML elements
            DOM.editToggle.addEventListener('change', () => openPlayerModal(player));

            const clearScratchpadBtn = body.querySelector('.clear-scratchpad-btn');
            if (clearScratchpadBtn) {
                clearScratchpadBtn.addEventListener('click', () => {
                    const scratchpad = body.querySelector('.scratchpad-textarea');
                    if (scratchpad) {
                        scratchpad.value = '';
                    }
                    if (player) {
                        player.scratchpad = '';
                    }
                });
            }
        }


        function openPlayerModal(player) {
            renderPlayerSheet(player);
            DOM.playerSheetModal.style.display = 'flex';
        }

        function roll4d6dropLowest() {
            let rolls = [];
            for (let i = 0; i < 4; i++) {
                rolls.push(Math.floor(Math.random() * 6) + 1);
            }
            rolls.sort((a, b) => a - b);
            rolls.shift();
            return rolls.reduce((a, b) => a + b, 0);
        }

        function generateRandomPlayer() {
            const newPlayer = {
                id: `pc-${Date.now()}`,
                name: "Random Character",
                playerName: "Random",
                class: "fighter",
                level: 1,
                race: "human",
                alignment: "True Neutral",
                xp: 0,
                strength: roll4d6dropLowest(),
                dexterity: roll4d6dropLowest(),
                constitution: roll4d6dropLowest(),
                intelligence: roll4d6dropLowest(),
                wisdom: roll4d6dropLowest(),
                charisma: roll4d6dropLowest(),
                ac: 10,
                hp: 10,
                maxHp: 10,
                speed: "30ft",
                tempHp: 0,
                hitDice: "1d10",
                proficiencies: "",
                attacks: "",
                features: "",
                notes: "",
                passivePerception: 10,
                vision: '',
                scratchpad: ''
            };
            savedPlayers.push(newPlayer);
            renderPlayers();
            showFeedback('Random player created!');
        }

        function renderPlayers() {
            DOM.savedPlayersList.innerHTML = '';
            savedPlayers.forEach(player => {
                const card = document.createElement('div');
                card.className = 'character-card';
                card.dataset.characterId = player.id;
                card.innerHTML = `
                    <div class="character-card-minimized">
                        <div class="character-lvl">LVL<br>${player.level}</div>
                        <div class="character-name-race">
                            <h3>${player.name}</h3>
                            <p>${player.class}</p>
                        </div>
                        <div class="character-ac">AC<br>${player.ac}</div>
                        <div class="character-hp">HP<br>${player.hp}/${player.maxHp}</div>
                        <button class="btn send-character-btn">Send</button>
                    </div>
                `;
                DOM.savedPlayersList.appendChild(card);
            });
        }

        function renderCreatures() {
            DOM.savedCreaturesList.innerHTML = '';
            savedCreatures.forEach(creature => {
                const card = document.createElement('div');
                card.className = 'character-card';
                card.dataset.characterId = creature.id;
                card.innerHTML = `
                    <div class="character-card-minimized">
                        <div class="character-lvl">CR<br>${creature.challenge_rating}</div>
                        <div class="character-name-race">
                            <h3>${creature.name}</h3>
                            <p>${creature.size} ${creature.type}, ${creature.alignment}</p>
                        </div>
                        <div class="character-ac">AC<br>${creature.ac}</div>
                        <div class="character-hp">HP<br>${creature.hp}/${creature.hp}</div>
                        <button class="btn send-character-btn">Send</button>
                    </div>
                `;
                DOM.savedCreaturesList.appendChild(card);
            });
        }
        
        // --- EVENT LISTENERS ---

        // Story Page Listeners
        DOM.hierarchyList.addEventListener('click', (e) => {
            const target = e.target;
            if (target.classList.contains('story-delete-btn')) {
                const id = target.dataset.id;
                deleteStoryItem(id);
                return; // Stop further processing
            }
            if (target.dataset.id) {
                if (target.classList.contains('act-title')) {
                    selectedActId = target.dataset.id;
                }
                loadStoryItemToEditor(target.dataset.id);
            }
        });
        DOM.titleInput.addEventListener('input', () => {
            if (selectedStoryItemId) {
                const item = findStoryItem(selectedStoryItemId);
                if (item) {
                    item.title = DOM.titleInput.value;
                    renderHierarchy();
                }
            }
        });
        DOM.contentTextArea.addEventListener('input', () => {
            if (selectedStoryItemId) {
                const item = findStoryItem(selectedStoryItemId);
                if (item) { item.content = DOM.contentTextArea.innerHTML; }
            }
        });
        DOM.newActBtn.addEventListener('click', () => {
            const newActId = `act-${Date.now()}`;
            const newAct = {
                id: newActId,
                title: `Act ${storyData.length + 1}: New Act`,
                content: '',
                children: []
            };
            storyData.push(newAct);
            selectedActId = newActId;
            loadStoryItemToEditor(newActId);
        });
        const addStoryElement = (type) => {
            const act = storyData.find(a => a.id === selectedActId);
            if (!act) { return; }
            const newItemId = `item-${Date.now()}`;
            const newItem = {
                id: newItemId,
                type: type,
                title: type === 'side-quest' ? 'New Side Quest' : 'New Plot Point',
                content: ''
            };
            act.children.push(newItem);
            loadStoryItemToEditor(newItemId);
        };
        DOM.newPlotPointBtn.addEventListener('click', () => addStoryElement('plot-point'));
        DOM.newSideQuestBtn.addEventListener('click', () => addStoryElement('side-quest'));
        DOM.archiveNotesBtn.addEventListener('click', archiveSessionNotes);

        const handleStoryNavigation = (direction) => {
            const allStoryItems = storyData.flatMap(act => act.children);
            if (allStoryItems.length === 0) return;

            let currentIndex = allStoryItems.findIndex(item => item.id === selectedStoryItemId);

            if (direction === 'next') {
                currentIndex++;
                if (currentIndex >= allStoryItems.length) {
                    currentIndex = 0; // Loop to the beginning
                }
            } else { // 'prev'
                currentIndex--;
                if (currentIndex < 0) {
                    currentIndex = allStoryItems.length - 1; // Loop to the end
                }
            }

            const newStoryItemId = allStoryItems[currentIndex].id;
            const actOfNewItem = storyData.find(act => act.children.some(child => child.id === newStoryItemId));
            if (actOfNewItem) {
                selectedActId = actOfNewItem.id;
                loadStoryItemToEditor(newStoryItemId);
            }
        };

        DOM.prevNoteBtn.addEventListener('click', () => handleStoryNavigation('prev'));
        DOM.nextNoteBtn.addEventListener('click', () => handleStoryNavigation('next'));

        DOM.storyDeleteBtn.addEventListener('click', () => {
            if (selectedStoryItemId) {
                deleteStoryItem(selectedStoryItemId);
            }
        });

        // Creature Listeners
        DOM.creaturesSearchList.addEventListener('click', (e) => {
            if (e.target.classList.contains('creatures-list-item')) {
                const url = e.target.dataset.url;
                if (url) {
                    openCreatureModal(url);
                }
            }
        });

        DOM.closeCreatureSheetBtn.addEventListener('click', () => {
            DOM.creatureSheetModal.style.display = 'none';
            currentCreatureData = null;
        });

        DOM.saveCreatureSheetBtn.addEventListener('click', () => {
            if (!currentCreatureData) return;

            const isAlreadySaved = savedCreatures.some(c => c.name === currentCreatureData.name);
            if (isAlreadySaved) {
                showFeedback('Creature is already saved.');
                return;
            }

            const newCreature = {
                id: `creature-${Date.now()}`,
                name: currentCreatureData.name,
                size: currentCreatureData.size,
                type: currentCreatureData.type,
                alignment: currentCreatureData.alignment,
                ac: currentCreatureData.armor_class,
                hp: currentCreatureData.hit_points,
                challenge_rating: currentCreatureData.challenge_rating,
            };

            savedCreatures.push(newCreature);
            renderCreatures();
            DOM.creatureSheetModal.style.display = 'none';
            showFeedback(`${currentCreatureData.name} saved!`);
            currentCreatureData = null;
        });

        // Player & Creature List Listeners
        DOM.newPlayerBtn.addEventListener('click', () => openPlayerModal());
        DOM.randomPlayerBtn.addEventListener('click', generateRandomPlayer);
        DOM.savedPlayersList.addEventListener('click', (e) => {
            if (e.target.classList.contains('send-character-btn')) {
                const card = e.target.closest('.character-card');
                const characterId = card.dataset.characterId;
                const player = savedPlayers.find(p => p.id === characterId);
                if (player) {
                    addCombatant(player);
                }
            }
        });

        DOM.savedCreaturesList.addEventListener('click', (e) => {
            if (e.target.classList.contains('send-character-btn')) {
                const card = e.target.closest('.character-card');
                const characterId = card.dataset.characterId;
                const creature = savedCreatures.find(c => c.id === characterId);
                if (creature) {
                    addCombatant({
                        id: creature.id,
                        name: creature.name,
                        ac: creature.ac,
                        hp: creature.hp,
                        maxHp: creature.hp
                    });
                }
            }
        });

        DOM.battlesContainer.addEventListener('input', (e) => {
            if (e.target.classList.contains('init')) {
                const combatantItem = e.target.closest('.combatant-item');
                const battleGroup = e.target.closest('.battle-group');
                const combatantId = combatantItem.dataset.id;
                const battleId = battleGroup.dataset.battleId;
                const battle = battles.find(b => b.id == battleId);
                if (battle) {
                    const combatant = battle.combatants.find(c => c.id == combatantId);
                    if (combatant) {
                        combatant.initiative = parseInt(e.target.value, 10) || 0;
                    }
                }
            }
        });

        DOM.battlesContainer.addEventListener('click', e => {
            const battleGroup = e.target.closest('.battle-group');
            if (!battleGroup) return;
            
            const battleId = battleGroup.dataset.battleId;
            const battle = battles.find(b => b.id == battleId);
            if (!battle) return;

            if (e.target.classList.contains('sort-initiative-btn')) {
                battle.combatants.sort((a, b) => b.initiative - a.initiative);
                renderAllBattles();
            }

            if (e.target.classList.contains('turn-tracker-btn')) {
                if (battle.combatants.length > 0) {
                    if (battle.currentTurnIndex === -1) { // Starting the battle
                        battle.combatants.sort((a, b) => b.initiative - a.initiative);
                        battle.currentTurnIndex = 0;
                    } else { // Next turn
                        battle.currentTurnIndex++;
                        if (battle.currentTurnIndex >= battle.combatants.length) {
                            battle.currentTurnIndex = 0; // Loop back to the start
                        }
                    }
                    renderAllBattles();
                }
            }

            if (e.target.classList.contains('end-battle-btn')) {
                battle.isComplete = true;
                renderAllBattles();
            }
        });

        // Chat Page Listeners
        DOM.chatSendBtn.addEventListener('click', sendMessage);
        DOM.chatInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        DOM.chatHistoryList.addEventListener('click', (e) => {
            if (e.target.classList.contains('chat-history-item')) {
                const chatId = e.target.dataset.chatId;
                const allHistoryItems = DOM.chatHistoryList.querySelectorAll('.chat-history-item');
                allHistoryItems.forEach(item => item.classList.remove('active'));
                e.target.classList.add('active');
                renderChatMessages(chatId);
            }
        });
        
        // --- INITIALIZATION ---
        
        function initialize() {
            setupNavigation();
            setupTabs('page-story');
            setupTabs('page-encounters');
            setupTabs('page-chat');

            DOM.allBulletToggles.forEach(toggle => {
                toggle.addEventListener('click', handleBulletToggle);
            });

            DOM.contentTextArea.addEventListener('keydown', handleEnterForBullets);
            Object.values(DOM.sessionNoteTextareas).forEach(textarea => {
                textarea.addEventListener('keydown', handleEnterForBullets);
            });

            renderAllBattles();
            renderHierarchy();
            loadStoryItemToEditor('pp-1-1');
            renderNotes();
            renderCreatures();
            renderPlayers();
            renderChatHistory();

            fetchAllMonsters();
            fetchRacesAndClasses();
        }

        initialize();
    });