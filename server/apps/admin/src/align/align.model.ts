import { ApiProperty } from '@nestjs/swagger'

export type supportedLanguage = 'zh' | 'es' | 'en'

export interface Article {
    text: string,
    lang: supportedLanguage
    sentenceArray?: string[],
    sentenceLineBreak?: string,
    sentenceTranslatedArray?: string[],
    sentenceTranslatedLineBreak?: string,
    langTranslated?: supportedLanguage
}

export interface TextNode {
    articleIndex: number,
    sentenceIndex: number,
    text: string,
    lang: string
}

export interface Relation{
    nodes: [TextNode, TextNode],
    similarity: number,
    method: string
}

export class AlignRequest {   
    @ApiProperty({description: '对齐请求'})
    articles: Article[];
    relations?: Relation[]
}