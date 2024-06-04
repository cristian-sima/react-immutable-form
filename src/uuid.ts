/* eslint-disable no-magic-numbers */
const 
  generatedUUIDs = new Set(),
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

export const generateUniqueUUIDv4 = () => {
  let uuid =generateUUIDv4();
  
  while (generatedUUIDs.has(uuid)) {
    uuid =generateUUIDv4();
  }

  generatedUUIDs.add(uuid);

  return uuid;
}; 