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
    score_query = "Evaluate how well the resume matches the job description. Give a score out of 100 and a short explanation."
    score_context = retrieve(index, all_chunks, embed_query(score_query), top_k=5)
    score_prompt = f"""You are an expert ATS (Applicant Tracking System) analyst.
Resume and Job Description excerpts:
{score_context}

Task: {score_query}
Answer concisely."""
    ats_score = generate(score_prompt)

    # 4. Missing Keywords
    kw_query = "List important skills, keywords, and qualifications from the job description that are missing in the resume. Format as bullet points."
    kw_context = retrieve(index, all_chunks, embed_query(kw_query), top_k=5)
    kw_prompt = f"""You are an expert career coach.
Excerpts:
{kw_context}

Task: {kw_query}
Answer concisely."""
    missing_keywords = generate(kw_prompt)

    # 5. Improved Bullets
    bullet_query = "Suggest improved, quantified bullet points for the resume experience section that better match the job description. Use STAR method."
    bullet_context = retrieve(index, all_chunks, embed_query(bullet_query), top_k=5)
    bullet_prompt = f"""You are an expert resume writer.
Excerpts:
{bullet_context}

Task: {bullet_query}
Answer concisely, output as a bulleted list."""
    improved_bullets = generate(bullet_prompt)

    return {
        "ats_score": ats_score,
        "missing_keywords": missing_keywords,
        "improved_bullets": improved_bullets
    }