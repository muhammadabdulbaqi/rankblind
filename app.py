from flask import Flask, jsonify, send_from_directory
import requests
from bs4 import BeautifulSoup
import random

app = Flask(__name__, static_folder='static')


def get_character_and_anime_names(url):
    response = requests.get(url)
    soup = BeautifulSoup(response.content, "html.parser")

    character_anime_pairs = []

    rows = soup.find_all("tr", class_="ranking-list")

    for row in rows:
        character_name = row.find("a", class_="fs14 fw-b").text.strip()
        anime_name = row.find("div", class_="title").find("a").text.strip()
        character_anime_pairs.append((character_name, anime_name))

    return character_anime_pairs


@app.route('/')
def index():
    return send_from_directory('static', 'index.html')


@app.route('/random_character', methods=['GET'])
def random_character():
    urls = [
        "https://myanimelist.net/character.php?limit=0",
        "https://myanimelist.net/character.php?limit=50"
    ]

    all_pairs = []

    for url in urls:
        pairs = get_character_and_anime_names(url)
        all_pairs.extend(pairs)

    if len(all_pairs) > 0:
        selected_pair = random.choice(all_pairs)
        return jsonify({
            'character': selected_pair[0],
            'anime': selected_pair[1]
        })
    else:
        return jsonify({'error': 'No characters found'}), 404


if __name__ == "__main__":
    app.run(debug=True)

