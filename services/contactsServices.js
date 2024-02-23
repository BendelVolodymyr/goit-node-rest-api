import { Contact } from "../models/contactModels.js";

async function listContacts(obj, query) {
  const { page = 1, limit = 10, favorite } = query;
  const skip = (page - 1) * limit;

  let filter = { ...obj };

  if (favorite !== undefined) {
    filter.favorite = favorite;
  }
  const data = await Contact.find(filter, "-owner", {
    skip,
    limit,
  });
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
  const { favorite } = data;
  const result = await Contact.findByIdAndUpdate(
    id,
    { favorite },
    { new: true }
  );
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
