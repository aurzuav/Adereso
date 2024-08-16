/* eslint no-undef: "off" */
/* eslint no-unused-vars: "off" */

import { processSegment } from "../utils/fragmenter.js";
import { checkIfRelated } from "../utils/checkIfRelated.js";
import dotenv from "dotenv";

dotenv.config();

describe("Fragmentation Process", () => {
  test("processSegment should correctly fragment an article", async () => {
    const segment = {
      type: "article",
      url: "https://www.adereso.so",
      text: "Esto es contenido de usabilidad de Adereso.",
    };

    const fragment = await processSegment(segment);

    expect(fragment).toHaveProperty("title");
    expect(fragment).toHaveProperty("summary");
    expect(fragment).toHaveProperty("tags");
    expect(fragment).toHaveProperty("reference");
    expect(fragment).toHaveProperty("type");
    expect(fragment).toHaveProperty("content");
  }, 100000); // Aumentar el timeout

  test("checkIfRelated should identify related fragments", () => {
    const fragment1 = {
      tags: "API, Tickets",
    };
    const fragment2 = {
      tags: "API, Servicio al Cliente",
    };
    const fragment3 = {
      tags: "Otro Tag",
    };

    expect(checkIfRelated(fragment1, fragment2)).toBe(true);
    expect(checkIfRelated(fragment1, fragment3)).toBe(false);
  });
});
