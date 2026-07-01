from .parser import parse_file
from .chunker import chunk_text
from .embedder import embed_chunks, embed_query
from .vector_store import build_index, retrieve
from .llm_client import generate

def analyze(resume_bytes: bytes, resume_name: str, jd_bytes: bytes, jd_name: str) -> dict:
    # 1. Parse
    resume_text = parse_file(resume_bytes, resume_name)
    jd_text = parse_file(jd_bytes, jd_name)

    # 2. Chunk both docs and embed everything
    resume_chunks = chunk_text(resume_text)
    jd_chunks = chunk_text(jd_text)
    all_chunks = resume_chunks + jd_chunks
    all_embeddings = embed_chunks(all_chunks)
    index = build_index(all_embeddings)

    # 3. ATS Score
    score_context = retrieve(index, all_chunks, embed_query("ATS resume match score"), top_k=3)
    score_prompt = f"""Score this resume against the job description out of 100. Be brief.
Resume+JD excerpts:
{score_context}
Score:"""
    ats_score = generate(score_prompt)

    # 4. Missing Keywords
    kw_context = retrieve(index, all_chunks, embed_query("missing skills keywords"), top_k=3)
    kw_prompt = f"""List important missing keywords from this resume vs job. Bullet points only.
Excerpts:
{kw_context}
Keywords:"""
    missing_keywords = generate(kw_prompt)

    # 5. Improved Bullets
    bullet_context = retrieve(index, all_chunks, embed_query("improve resume bullets"), top_k=3)
    bullet_prompt = f"""Rewrite these resume bullets to be more impactful. Use action verbs and numbers.
Excerpts:
{bullet_context}
Improved:"""
    improved_bullets = generate(bullet_prompt)

    return {
        "ats_score": ats_score,
        "missing_keywords": missing_keywords,
        "improved_bullets": improved_bullets
    }