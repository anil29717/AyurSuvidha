from typing import List

import re


def clean_text(text: str) -> str:
    """
    Lightweight normalisation before embeddings.
    """
    text = text.replace("\n", " ").strip()
    text = re.sub(r"\s+", " ", text)
    return text


def simple_ayur_split(text: str, max_chars: int = 600) -> List[str]:
    """
    Very simple chunker that respects sentence/section boundaries where possible.
    A richer Ayurvedic-aware splitter can replace this later.
    """
    text = clean_text(text)
    if len(text) <= max_chars:
        return [text]

    chunks: List[str] = []
    start = 0
    while start < len(text):
        end = min(len(text), start + max_chars)
        # try to cut at a sentence boundary
        period = text.rfind(".", start, end)
        if period == -1 or period - start < max_chars * 0.5:
            cut = end
        else:
            cut = period + 1
        chunks.append(text[start:cut].strip())
        start = cut
    return [c for c in chunks if c]

