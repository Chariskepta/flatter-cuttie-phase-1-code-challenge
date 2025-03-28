
function createMusicNotes() {
    const notes = ['♪', '♫', '♩', '♬', '♭', '♮'];
    const colors = ['#ffeb3b', '#4caf50', '#2196f3', '#9c27b0', '#ff9800'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const note = document.createElement('div');
            note.className = 'music-note';
            note.textContent = notes[Math.floor(Math.random() * notes.length)];
            note.style.left = `${Math.random() * 100}%`;
            note.style.color = colors[Math.floor(Math.random() * colors.length)];
            note.style.animationDuration = `${5 + Math.random() * 15}s`;
            document.body.appendChild(note);
            
            
            setTimeout(() => {
                note.remove();
            }, 10000);
        }, i * 1000);
    }
}


createMusicNotes();
setInterval(createMusicNotes, 15000);
const songContainer = document.getElementById('song-container');
const albumContainer = document.getElementById('album-container');
const messageDiv = document.getElementById('message');


const API_URL = 'http://localhost:3000';


window.addEventListener('DOMContentLoaded', () => {
    loadNominees();
});


async function loadNominees() {
    try {
        
        const [songs, albums] = await Promise.all([
            fetchData('songs'),
            fetchData('albums')
        ]);
        
        
        displayNominees(songs, songContainer, 'songs');
        displayNominees(albums, albumContainer, 'albums');
        
    } catch (error) {
        showMessage('Failed to load nominees. Please refresh the page.', 'error');
        console.error('Error:', error);
    }
}


async function fetchData(endpoint) {
    const response = await fetch(`${API_URL}/${endpoint}`);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}


function displayNominees(items, container, category) {
    container.innerHTML = items.map(item => `
        <div class="nominee">
            <span>${item.title} - ${item.artist}</span>
            <div>
                <span>${item.votes} votes</span>
                <button onclick="voteFor(${item.id}, '${category}')">Vote</button>
            </div>
        </div>
    `).join('');
}


async function voteFor(id, category) {
    try {
        
        const item = await fetchData(`${category}/${id}`);
        
        
        const updatedItem = {
            ...item,
            votes: item.votes + 1
        };
        
        
        await fetch(`${API_URL}/${category}/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItem)
        });
        
        showMessage(`Voted for ${item.title}!`, 'success');
        loadNominees(); 
        
    } catch (error) {
        showMessage('Failed to vote. Please try again.', 'error');
        console.error('Error:', error);
    }
}


function showMessage(text, type) {
    messageDiv.textContent = text;
    messageDiv.className = type;
}


window.voteFor = voteFor;