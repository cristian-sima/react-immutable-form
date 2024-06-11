/* eslint-disable no-magic-numbers */
const 
  /**
   * Set containing generated UUIDs.
   */
  generatedUUIDs = new Set(),
  /**
   * Generates a UUID version 4.
   *
   * This function generates a random UUID (Universally Unique Identifier) version 4,
   * which is a 128-bit number used to identify information in computer systems.
   *
   * @returns {string} A randomly generated UUIDv4 string in the format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.
   */
  generateUUIDv4 = () => {
    let uuid = "";
    const HEX_BASE = 16,
      HEX_LENGTH = 16,
      UUID_LENGTH = 32,
      UUID_SECTIONS = [8, 12, 16, 20];

    for (let index = 0; index < UUID_LENGTH; index+=1) {
      if (UUID_SECTIONS.includes(index)) {
        uuid += "-";
      }
      uuid += Math.floor(Math.random() * HEX_BASE).toString(HEX_LENGTH);
    }
    return uuid;
  };
  
/**
 * Generates a unique UUID version 4.
 *
 * This function generates a UUID version 4 string that is guaranteed to be unique
 * among the set of previously generated UUIDs.
 *
 * @returns {string} A unique UUIDv4 string in the format `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`.
 */
export const generateUniqueUUIDv4 = () => {
  let uuid =generateUUIDv4();
  
  while (generatedUUIDs.has(uuid)) {
    uuid =generateUUIDv4();
  }

  generatedUUIDs.add(uuid);

  return uuid;
}; 