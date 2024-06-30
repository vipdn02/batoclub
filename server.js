const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');
const { getPlaylistItems } = require('./api'); // Đảm bảo import đúng 'api.js'

const app = express();
const port = 3000;

const PLAYLIST_ID_1 = 'PLRxQ8Wje26wsfVhrz0caO1BQxUWwL0HMk'; // Thay bằng Playlist ID của bạn
const PLAYLIST_ID_2 = 'PLRxQ8Wje26wvF0Kt4VIvYDLgTasi5UkjB'; // Thay bằng Playlist ID của bạn

app.get('/', async (req, res) => {
    try {
        const items1 = await getPlaylistItems(PLAYLIST_ID_1);
        const items2 = await getPlaylistItems(PLAYLIST_ID_2);
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>YouTube Playlist</title>
                <style>
body {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #181818;
    color: #fff;
}

.header {
    display: flex;
    align-items: center;
    background-color: #202020;
    padding: 10px 20px;
}

.header h1 {
    margin: 0;
    font-size: 24px;
    color: #ffffff;
}

.menu {
    display: flex;
    justify-content: center;
    background-color: #202020;
    padding: 10px 0;
    border-bottom: 1px solid #333;
}

.menu-button {
    color: #bbb;
    text-decoration: none;
    padding: 14px 20px;
    display: block;
    margin: 0 10px;
    background: none;
    border: none;
    cursor: pointer;
    font-size: 16px;
}

.menu-button:hover, .menu-button.active {
    background-color: #333;
    color: white;
    border-radius: 4px;
}

.playlist {
    display: none;
    padding: 20px;
}

.playlist.active {
    display: block;
}

.playlist ul {
    list-style-type: none;
    padding: 0;
}

.playlist li {
    padding: 10px 0;
    border-bottom: 1px solid #333;
}

.playlist li:hover {
    background-color: #333;
    cursor: pointer;
}
                </style>
            </head>
            <body>
                <h1>Danh Sách Phát</h1>
                <div class="menu">
                    <a href="#" onclick="showPlaylist(1)">Playlist 1</a>
                    <a href="#" onclick="showPlaylist(2)">Playlist 2</a>
                </div>
                <div id="playlist-1" class="playlist">
                    <ul>
                        ${items1.map(item => `<li>${item.title}</li>`).join('')}
                    </ul>
                </div>
                <div id="playlist-2" class="playlist">
                    <ul>
                        ${items2.map(item => `<li>${item.title}</li>`).join('')}
                    </ul>
                </div>
                <script>
                    function showPlaylist(index) {
                        document.querySelectorAll('.playlist').forEach(el => el.classList.remove('active'));
                        document.getElementById('playlist-' + index).classList.add('active');
                    }
                    showPlaylist(1); // Hiển thị playlist 1 khi load trang
                </script>
            </body>
            </html>
        `);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.get('/video', (req, res) => {
    let url = req.query.url;
    if (!url) {
        return res.status(400).send('You must provide a URL');
    }

    res.header('Content-Disposition', 'attachment; filename="video.mp4"');
    ytdl(url, { format: 'mp4' }).pipe(res);
});

app.get('/playlist', async (req, res) => {
    const playlistId = req.query.playlistId;
    if (!playlistId) {
        return res.status(400).send('You must provide a Playlist ID');
    }

    try {
        const items = await getPlaylistItems(playlistId);
        res.json(items);
    } catch (error) {
        res.status(500).send(error.message);
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});