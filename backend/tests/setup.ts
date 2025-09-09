import fs from 'fs';
import path from 'path';
import { setDbFilename, getDb } from "../src/services/db.service";

beforeAll(async () => {
    setDbFilename(":memory:")
    const db = await getDb();

    const filePath = path.join(__dirname, "../data/create_tables.sql");
    const sql = fs.readFileSync(filePath, "utf-8");
    await db.exec(sql);
})