/* eslint no-undef: "off" */
/* eslint no-unused-vars: "off" */

import request from "supertest";
import app from "../index.js"; // Ruta relativa al archivo index.js

describe("GET /process", () => {
  it('should return 200 and "Processing complete"', async () => {
    const res = await request(app).get("/process");
    expect(res.statusCode).toEqual(200);
    expect(res.text).toBe(
      '{"message":"Processing complete, check ./src/data/processed_fragments.jsonl"}',
    );
  }, 100000); // Tiempo de espera de 10 segundos (10000 ms)
});
