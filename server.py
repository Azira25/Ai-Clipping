from flask import Flask, request, jsonify
from flask_cors import CORS
from youtube_transcript_api import YouTubeTranscriptApi
from youtube_transcript_api.formatters import TextFormatter
import random
import re

app = Flask(__name__)
CORS(app)  # Izinkan React mengakses server ini

def extract_video_id(url):
    # Regex sederhana untuk menangkap ID video YouTube
    regex = r"(?:v=|\/)([0-9A-Za-z_-]{11}).*"
    match = re.search(regex, url)
    return match.group(1) if match else None

def get_transcript_text(video_id):
    try:
        # Mengambil transcript bahasa Indonesia atau Inggris
        transcript_list = YouTubeTranscriptApi.get_transcript(video_id, languages=['id', 'en'])
        return transcript_list
    except Exception as e:
        print(f"Error getting transcript: {e}")
        return None

@app.route('/analyze', methods=['POST'])
def analyze_video():
    data = request.json
    url = data.get('url')
    category = data.get('category', 'general')

    video_id = extract_video_id(url)
    if not video_id:
        return jsonify({"error": "Invalid URL"}), 400

    print(f"Analyzing Video ID: {video_id} | Category: {category}")

    # 1. Ambil Data Real (Transcript)
    raw_transcript = get_transcript_text(video_id)
    
    if not raw_transcript:
        return jsonify({
            "error": "Transkrip tidak tersedia untuk video ini. Pastikan video memiliki CC/Subtitle."
        }), 404

    # 2. Proses Cerdas: Membagi transcript menjadi segmen (Clips)
    # Ini adalah simulasi logika "AI". Di dunia nyata, Anda akan mengirim teks ini ke GPT-4.
    # Di sini, kita akan memotong teks per ~60 detik untuk membuat klip.
    
    clips = []
    current_chunk = []
    current_start = raw_transcript[0]['start']
    current_duration = 0
    
    # Kumpulan template judul agar terlihat variatif (karena kita belum pakai LLM asli)
    titles_templates = [
        "Momen Kunci: {topic}", "Poin Penting: {topic}", 
        "Highlight {category}: {topic}", "Wajib Tonton: {topic}",
        "Rahasia Terungkap: {topic}"
    ]

    for entry in raw_transcript:
        current_chunk.append(entry['text'])
        current_duration = (entry['start'] + entry['duration']) - current_start

        # Jika durasi segmen sudah antara 60-120 detik, jadikan satu klip
        if 60 <= current_duration <= 120:
            full_text = " ".join(current_chunk)
            
            # Buat judul dari 5 kata pertama (simulasi ringkasan)
            words = full_text.split()
            topic_preview = " ".join(words[:5]) + "..."
            title = random.choice(titles_templates).format(topic=topic_preview, category=category.title())

            # Hitung skor berdasarkan keyword kategori (Logika Relevansi Sederhana)
            score = 7.0
            keywords = {
                'business': ['uang', 'modal', 'bisnis', 'jual', 'profit', 'money'],
                'gaming': ['menang', 'kalah', 'gg', 'mati', 'tembak', 'game'],
                'cooking': ['masak', 'bumbu', 'potong', 'rasa', 'enak', 'panas'],
                'podcast': ['cerita', 'takut', 'lucu', 'hantu', 'kenapa', 'bener']
            }
            
            # Boost score jika ada keyword yang cocok
            detected_keywords = []
            for kw in keywords.get(category, []):
                if kw in full_text.lower():
                    score += 0.5
                    detected_keywords.append(f"#{kw}")
            
            # Cap score max 9.9
            score = min(round(score + random.uniform(0, 1.5), 1), 9.9)

            clips.append({
                "id": len(clips) + 1,
                "title": title,
                "start": current_start,
                "end": entry['start'] + entry['duration'],
                "score": score,
                "description": full_text[:150] + "...", # Deskripsi REAL dari video
                "hashtags": detected_keywords if detected_keywords else ["#Viral", f"#{category}"],
                "reason": f"Terdeteksi kata kunci relevan dalam segmen ini ({len(words)} kata)."
            })

            # Reset untuk chunk berikutnya
            current_chunk = []
            current_start = entry['start'] + entry['duration'] + 0.1 # Sedikit offset
            
            if len(clips) >= 10: # Batasi 10 klip
                break

    # Sortir klip berdasarkan score tertinggi
    clips.sort(key=lambda x: x['score'], reverse=True)

    return jsonify(clips)

if __name__ == '__main__':
    print("Server berjalan di http://localhost:5000")
    app.run(debug=True, port=5000)
