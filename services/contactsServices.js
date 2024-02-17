import { Contact } from "../models/contact.js";

async function listContacts() {
  const data = await Contact.find();
  return data;
}

async function getContactById(id) {
  const result = await Contact.findById(id);
  return result;
}

async function updateById(id, data) {
  const result = await Contact.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
}

async function removeContact(id) {
  const result = await Contact.findByIdAndDelete(id);

  return result;
}

async function addContact(data) {
  const newContact = await Contact.create(data);

  return newContact;
}

async function upStatusContact(id, data) {
  const result = await Contact.findByIdAndUpdate(id, data, {
    new: true,
  });
  return result;
}

export {
  listContacts,
  addContact,
  getContactById,
  removeContact,
  updateById,
  upStatusContact,
};
