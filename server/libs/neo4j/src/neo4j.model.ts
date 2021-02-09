
import { AlignLanguage } from '../../../apps/admin/src/align/align.model';

export class Neo4jSentenceNode {
    text: string;
    lang: string;
    translText?: string;
    translLang?: string;
}

export class Neo4jSentenceTranslationRequest {
    srcText: string;
    srcLang: AlignLanguage;
    tgtLang: AlignLanguage;
}

export class Neo4jSentenceSimilarityRequest {
    srcSentence: string;
    tgtSentence: string;
}

export class Neo4jCreateSentenceRequest {
    text: string;
    lang: AlignLanguage;
    gene: string;
}

export class Neo4jCreateTranslationRequest {
    srcSentence: string;
    srcLang: string;
    tgtSentence: string;
    tgtLang: string;
    gene: string;
    provider: string;
}

export class Neo4jCreateSimilarityRequest {
    srcSentence: string;
    tgtSentence: string;
    score: number;
    provider: string;
}