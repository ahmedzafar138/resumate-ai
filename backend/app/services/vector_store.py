import faiss
import numpy as np

def build_index(embeddings: np.ndarray) -> faiss.IndexFlatL2:
    index = faiss.IndexFlatL2(embeddings.shape[1])
    index.add(embeddings)
    return index

def retrieve(index: faiss.IndexFlatL2, chunks: list[str], query_emb: np.ndarray, top_k: int = 5) -> str:
    distances, indices = index.search(np.array([query_emb]), top_k)
    retrieved = [chunks[i] for i in indices[0] if i < len(chunks)]
    return "\n\n".join(retrieved)