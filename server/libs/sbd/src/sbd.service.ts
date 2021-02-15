import { Injectable } from '@nestjs/common';
import { SbdRequest } from './sbd-config.interface';

@Injectable()
export class SbdService {
    
    splitSentence(body: SbdRequest[]){
        body.forEach(async (item)=>{
            switch  (item.lang){
                case  'en': // English
                case  'es': // Spanish
                case  'fr': // French
                case  'de': // German
                case  'it': // Italian
                case  'pt': // Portuguese
                case  'ru': // Russian
                    item = await this.en(item) // Cary out SBD using English punctuation rules.
                case  'zh':
                    item = this.zh(item) // Cary out SBD using Chinese punctuation rules.
            }
        });
        return body
    }

    // English sentence boundary detection
    en(item: SbdRequest){
        var tokenizer = require('sbd');
        var optional_options = {
            "newline_boundaries" : true,
            "html_boundaries"    : false,
            "sanitize"           : false,
            "allowed_tags"       : false,
            "preserve_whitespace" : false,
            "abbreviations"      : null
        };
        var text = item.text;
        item.sentenceArray = tokenizer.sentences(text, optional_options);
        item.sentenceLineBreak = item.sentenceArray.join('\n');
        // console.log(item)
        return JSON.parse(JSON.stringify(item)) 
    }

    // Chinese sentence boundary detection
    zh(item: SbdRequest){
        var text = item.text;
        // JS replace /reg/ with 'new_string'
        // /reg/g stands for global search, otherwise it only replaces the 1st match.
        // '$1' refers to the 1st group in /reg/, aka the contents between the first ()
        text = text.replace(/([。！？\?])([^”’])/g, '$1\n$2'); //[。！？] not followed by [”’]
        text = text.replace(/(\.{6})([^”’])/g, '$1\n$2'); //...... not followed by [”’]
        text = text.replace(/(\…{2})([^”’])/g, '$1\n$2'); //…… not followed by [”’] 
        text = text.replace(/([。！？\?][”’])([^，。！？\?])/g, '$1\n$2'); // [。！？][”’] not followed by [，。！？]
        text = text.replace(/\s+\n/g, '\n'); // remove spaces before \n 
        text = text.replace(/(\n)+/g, '\n'); // only keep one \n when having multiple \n
        text = text.trim();
        item.sentenceLineBreak = text;
        item.sentenceArray = text.split('\n');
        // console.log(textArray);
        return item
    }
}
