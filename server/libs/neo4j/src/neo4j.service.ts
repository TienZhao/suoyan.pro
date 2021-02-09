import { Inject, Injectable } from '@nestjs/common';
import { Neo4jConfig, Neo4jScheme } from './neo4j-config.interface';
import { NEO4J_CONFIG, NEO4J_DRIVER } from './neo4j-contants';
import neo4j, { Driver, Result } from 'neo4j-driver'
import {Neo4jSentenceTranslationRequest, Neo4jCreateSentenceRequest, Neo4jCreateTranslationRequest, Neo4jCreateSimilarityRequest, Neo4jSentenceSimilarityRequest } from './neo4j.model';

@Injectable()
export class Neo4jService {

    constructor(
        @Inject(NEO4J_CONFIG) private readonly config: Neo4jConfig,
        @Inject(NEO4J_DRIVER) private readonly driver: Driver
    ){}

    // Real Functions
    async neo4jSentenceTranslation(req: Neo4jSentenceTranslationRequest) {
        // Get translation result from Neo4j
        const cypherSentence = `MATCH (m: Sentence {text: '${req.srcText}', lang: '${req.srcLang}'})-[r:TRANSL]->(n: Sentence {lang: '${req.tgtLang}'}) RETURN m,r,n`
        const result = await this.read(cypherSentence, {});
        var translation = ''
        if (result.records.length > 0){
          translation = result.records[0].get('n').properties.text
        }
        return translation
        // Return translation result; return '' when there is no result.
      }
    
    async neo4jSentenceSimilarity(req: Neo4jSentenceSimilarityRequest){
        const cypherSentence = `MATCH (a:Sentence)-[r:SIM]-(b:Sentence) WHERE a.text = '${req.srcSentence}' AND b.text = '${req.tgtSentence}'  RETURN r.score`
        const result = await this.read(cypherSentence, {});
        var score = 0;
        if (result.records.length > 0){
            score = result.records[0].get('r.score')
        }
        return score
        // Return similarity score; return 0 when there is no result.
    }

    async neo4jCreateSentenceNode(req: Neo4jCreateSentenceRequest){
        // Search a sentece node in Neo4j.
        const cypherSentenceSearch = `MATCH (a:Sentence {text: '${req.text}', lang: '${req.lang}', gene: '${req.gene}'}) RETURN a`
        const searchResult = await this.read(cypherSentenceSearch, {});
        var res
        if (searchResult.records.length == 0){
            // Create a sentence node when it doesn't exist.
            const cypherSentenceWrite = `CREATE (a:Sentence {text: '${req.text}', lang: '${req.lang}', gene: '${req.gene}', project: 'yanyesAlpha', user: 'yanyes'}) RETURN a`
            res = this.write(cypherSentenceWrite, {});
        } else {
            res = searchResult.records[0];
        }
        return res
    }

    async neo4jCreateTranslation(req: Neo4jCreateTranslationRequest){
        const cypherSentence = `MATCH (a:Sentence) WHERE a.text = '${req.srcSentence}' AND a.lang = '${req.srcLang}' CREATE (a)-[r:TRANSL {gene: '${req.gene}', provider: '${req.provider}'}]->(b:Sentence {text: '${req.tgtSentence}', lang: '${req.tgtLang}', gene: '${req.gene}', project: 'yanyesAlpha', user: 'yanyes'}) RETURN r,b`
        const res = this.write(cypherSentence, {});  
        return res
    }

    async neo4jCreateSimilarity(req: Neo4jCreateSimilarityRequest){
        const cypherSentence = `MATCH (a:Sentence),(b:Sentence) WHERE a.text = '${req.srcSentence}' AND b.text = '${req.tgtSentence}' MERGE (a)-[r:SIM {score: ${req.score}, provider: '${req.provider}'}]->(b) RETURN r`
        const res = this.write(cypherSentence, {});  
        return res
    }

    // Test Functions
    getDriver(): Driver{
        return this.driver
    }

    getConfig(): Neo4jConfig{
        return this.config
    }

    getReadSession(database?: string){
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: neo4j.session.READ
        })
    }

    getWriteSession(database?: string){
        return this.driver.session({
            database: database || this.config.database,
            defaultAccessMode: neo4j.session.WRITE
        })
    }

    read(cypher: string, params: Record<string, any>, database?: string): Result{
        const session = this.getReadSession(database)
        return session.run(cypher, params)
    }

    write(cypher: string, params: Record<string, any>, database?: string): Result{
        const session = this.getWriteSession(database)
        return session.run(cypher, params)
    }

}
