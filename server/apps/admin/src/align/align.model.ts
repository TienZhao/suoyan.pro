import { ApiProperty } from '@nestjs/swagger'

export type AlignLanguage = 'zh' | 'en' | 'es' | 'fr' | 'de' | 'it' | 'pt' | 'ru' | 'auto'

export interface Article {
    text: string,
    lang: AlignLanguage
    sentenceArray?: string[],
    sentenceLineBreak?: string,
    translSentenceArray?: string[],
    translSentenceLineBreak?: string,
    translLang?: AlignLanguage
}

export interface TextNode {
    articleIndex: number,
    sentenceIndex: number,
    text: string,
    lang: string
}

export interface Relation {
    nodes: [TextNode, TextNode],
    similarity: number,
    hit?: boolean,
    method: string
}

export class AlignRequest {
    articles: Article[];
    relations?: Relation[];
    projectID?: string;
}
