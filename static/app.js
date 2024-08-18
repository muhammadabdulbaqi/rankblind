document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('start-btn');
    const characterInfo = document.getElementById('character-info');
    const rankingForm = document.getElementById('ranking-form');
    const rankingInput = document.getElementById('ranking');
    const submitRankingBtn = document.getElementById('submit-ranking');
    const characterList = document.getElementById('character-list');

    let usedRankings = new Set();
    let characters = [];
    const maxCharacters = 5;
    let currentCharacter = null;

    const generateCharacter = async () => {
        try {
            const response = await fetch('/random_character');
            const data = await response.json();

            if (response.ok) {
                currentCharacter = data;

                // Display character information
                characterInfo.textContent = `Character: ${data.character}, Anime: ${data.anime}`;
                rankingForm.style.display = 'block';
                rankingInput.value = ''; // Clear previous input
                rankingInput.focus();
            } else {
                alert(data.error || 'Failed to fetch character');
            }
        } catch (error) {
            console.error('Error fetching character:', error);
        }
    };

    const submitRanking = () => {
        const ranking = parseInt(rankingInput.value, 10);

        if (ranking < 1 || ranking > 5) {
            alert('Ranking must be between 1 and 5.');
            return;
        }

        if (usedRankings.has(ranking)) {
            alert('This ranking has already been used.');
            return;
        }

        if (!currentCharacter) {
            alert('No character to rank.');
            return;
        }

        // Add character and ranking to the list
        characters.push({ name: currentCharacter.character, ranking });

        // Update state
        usedRankings.add(ranking);
        rankingForm.style.display = 'none';

        // Display current list of ranked characters
        updateCharacterList();

        if (characters.length < maxCharacters) {
            generateCharacter();
        } else {
            displayFinalList();
        }
    };

    const updateCharacterList = () => {
        // Sort characters based on ranking
        const sortedCharacters = characters.slice().sort((a, b) => a.ranking - b.ranking);

        // Clear existing list and display sorted characters
        characterList.innerHTML = '';
        sortedCharacters.forEach(character => {
            const listItem = document.createElement('li');
            listItem.textContent = `${character.name} - Ranking: ${character.ranking}`;
            characterList.appendChild(listItem);
        });
    };

    const displayFinalList = () => {
        // Clear existing content
        characterInfo.textContent = '';
        rankingForm.style.display = 'none';

        // Clear existing list and display sorted characters
        const sortedCharacters = characters.slice().sort((a, b) => a.ranking - b.ranking);
        characterList.innerHTML = '';
        sortedCharacters.forEach(character => {
            const listItem = document.createElement('li');
            listItem.textContent = character.name;
            characterList.appendChild(listItem);
        });

        // Optionally, show a message indicating the end of the ranking
        const endMessage = document.createElement('p');
        endMessage.textContent = 'Ranking Complete! Here are the characters in order:';
        characterList.insertAdjacentElement('beforebegin', endMessage);

        // Optionally, show the start button again if you want to restart the process
        startBtn.style.display = 'block';
    };

    startBtn.addEventListener('click', () => {
        startBtn.style.display = 'none';  // Hide start button
        generateCharacter();
    });

    submitRankingBtn.addEventListener('click', submitRanking);
});
