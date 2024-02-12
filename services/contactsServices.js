import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = path.join(__dirname, "../db/contacts.json");
async function listContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function getContactById(contactId) {
  const AllContacts = await listContacts();
  const result = AllContacts.find((item) => item.id === contactId);
  return result || null;
}

async function updateById(contactId, data) {
  const AllContacts = await listContacts();
  const index = AllContacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  AllContacts[index] = { id: contactId, ...data };
  await fs.writeFile(contactsPath, JSON.stringify(AllContacts, null, 2));
  return AllContacts[index];
}

async function removeContact(contactId) {
  const AllContacts = await listContacts();
  const index = AllContacts.findIndex((item) => item.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = AllContacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(AllContacts, null, 2));

  return result;
}

async function addContact(objData) {
  const AllContacts = await listContacts();
  const newContact = { id: nanoid(), ...objData };
  AllContacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(AllContacts, null, 2));
  return newContact;
}

export { listContacts, getContactById, removeContact, addContact, updateById };
