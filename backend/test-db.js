import pkg from 'pg';
const { Client } = pkg;
import "dotenv/config";

async function testConnection() {
    const client = new Client({
        connectionString: process.env.DATABASE_URL,
    });

    try {
        await client.connect();
        console.log("✅ Conectado ao PostgreSQL com sucesso!");
        const result = await client.query("SELECT NOW()");
        console.log("📅 Hora do servidor:", result.rows[0]);
    } catch (err) {
        console.error("❌ Erro ao conectar:", err);
    } finally {
        await client.end();
    }
}

testConnection();
