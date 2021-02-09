export type Neo4jScheme = 'neo4j' | 'neo4j+s' | 'neo4j+ssc' | 'bolt' | 'bolt+s' | 'bolt+ssc';
// connect to 'neo4j (without security service)', or 'neo4j with security built-in',
// or 'neo4j with self signed certificate' or 'bolt' （neo4j instance) with similar config.

export interface Neo4jConfig {
    scheme: Neo4jScheme;
    host: string;
    port: number | string;
    username: string;
    password: string;
    database?: string; //optional
}

