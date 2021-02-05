import { Injectable } from '@nestjs/common';
import { SbdRequest } from './sbd-config.interface';

@Injectable()
export class SbdService {
    
    splitSentence(body: SbdRequest[]){
        body.forEach(async (item)=>{
            switch  (item.lang){
                case  'en':
                    item = await this.en(item)
                case  'es':
                    item = await this.en(item)
                case  'zh':
                    item = this.zh(item)
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
        return item
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
        text = text.trim();
        item.sentenceLineBreak = text;
        item.sentenceArray = text.split('\n');
        // console.log(textArray);
        return item
    }
}
