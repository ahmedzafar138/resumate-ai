import re

def chunk_text(text: str, max_chars: int = 500, overlap: int = 50) -> list[str]:
    """
    Split text into chunks of roughly max_chars, trying to break at sentence endings.
    """
    # Split into sentences (naive: by ., !, ? followed by space/newline)
    sentences = re.split(r'(?<=[.!?])\s+', text)
    chunks = []
    current_chunk = ""
    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= max_chars:
            current_chunk += " " + sentence if current_chunk else sentence
        else:
            if current_chunk:
                chunks.append(current_chunk.strip())
                # Start new chunk with overlap (last few chars, but simple: use the last sentence if fits)
                if overlap > 0 and sentences:
                    # For simplicity, just start fresh; proper overlap can be added later
                    current_chunk = sentence
            else:
                # Single sentence longer than max_chars, force split
                for i in range(0, len(sentence), max_chars - overlap):
                    chunks.append(sentence[i:i+max_chars].strip())
                current_chunk = ""
    if current_chunk:
        chunks.append(current_chunk.strip())
    return chunks