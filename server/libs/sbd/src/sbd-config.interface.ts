import { AlignLanguage } from '../../../apps/admin/src/align/align.model';

export type sbdLanguage = AlignLanguage



export interface SbdRequest {
    text: string;
    lang: sbdLanguage;
    sentenceArray?: string[];
    sentenceLineBreak?: string;
}

/* Sample Request:
[{
    text: '这是一个能够管理多种语言的工具。它能用于训练分类器！真的吗？它原生支持40种语言，集成BERT后支持104种语言。',
    lang: 'zh'
},{
    text: "On Jan. 20, former Sen. Barack Obama became the 44th President of the U.S. Millions attended the Inauguration.",
    lang: 'en'
}]
*/
