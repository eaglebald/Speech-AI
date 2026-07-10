from typing import Literal

from pydantic import BaseModel

Tone = Literal["success", "warning", "error"]


class PaceSentence(BaseModel):
    text: str
    startTime: float
    endTime: float
    status: Literal["fast", "slow", "stable"]


class PaceAnalysis(BaseModel):
    wpm: int
    statusLabel: str
    tone: Tone
    description: str
    sentences: list[PaceSentence]


class EnergySentence(BaseModel):
    text: str
    startTime: float
    endTime: float
    status: Literal["high", "low", "stable"]


class EnergyAnalysis(BaseModel):
    score: int
    title: str
    tone: Tone
    description: str
    sentences: list[EnergySentence]


class FillerWordItem(BaseModel):
    word: str
    timestamp: str


class FillerWordsAnalysis(BaseModel):
    count: int
    tone: Tone
    words: list[FillerWordItem]
    tip: str


class ContentLogicAnalysis(BaseModel):
    statusLabel: str
    tone: Tone
    strengthTitle: str
    strengthDescription: str
    tipTitle: str
    tipDescription: str


class SpeechAnalysisResult(BaseModel):
    globalScore: int
    statusLabel: str
    summary: str
    pace: PaceAnalysis
    energy: EnergyAnalysis
    fillerWords: FillerWordsAnalysis
    contentLogic: ContentLogicAnalysis
