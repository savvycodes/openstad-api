const Joi = require('joi');

exports.createOrganisation = Joi.object({
  name: Joi.string().required(),
  street: Joi.string().max(2048),
  zip: Joi.string().regex(/^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-zA-Z]{2}$/),
  phone: Joi.string().max(10).trim(),
  district: Joi.string().required(),
  email: Joi.string().email(),
  website: Joi.string().uri(),
  facebook: Joi.string()
    .allow('', null)
    .uri()
    .regex(
      /(?:(?:http|https):\/\/)?(?:www.)?(?:m.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/m
    ),
  instagram: Joi.string()
    .allow('', null)
    .uri()
    .regex(
      /https?:\/\/(www\.)?instagram\.com\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)(\/)?/
    ),
  areaId: Joi.number(),
  tagIds: Joi.array().items(Joi.number()),

  // Contact details
  contactName: Joi.string().required(),
  contactPosition: Joi.string().required(),
  contactEmail: Joi.string().email().required(),
  contactPhone: Joi.string().max(10).trim().required(),

  // Municipality contact details
  municipalityContactName: Joi.string(),
  municipalityContactEmail: Joi.string().email(),
  municipalityContactPhone: Joi.string().min(10).max(10).trim(),
  municipalityContactStatement: Joi.string(),
}).options({ stripUnknown: true });

exports.updateOrganisation = Joi.object({
  name: Joi.string(),
  street: Joi.string().max(2048),
  zip: Joi.string().regex(/^[1-9][0-9]{3} ?(?!sa|sd|ss)[a-zA-Z]{2}$/),
  district: Joi.string(),
  phone: Joi.string().trim().max(10),
  email: Joi.string().email(),
  website: Joi.string().uri(),
  facebook: Joi.string()
    .allow('', null)
    .uri()
    .regex(
      /(?:(?:http|https):\/\/)?(?:www.)?(?:m.)?facebook.com\/(?:(?:\w)*#!\/)?(?:pages\/)?(?:[?\w\-]*\/)?(?:profile.php\?id=(?=\d.*))?([\w\-]*)?/m
    ),
  instagram: Joi.string()
    .allow('', null)
    .uri()
    .regex(
      /https?:\/\/(www\.)?instagram\.com\/([A-Za-z0-9_](?:(?:[A-Za-z0-9_]|(?:\.(?!\.))){0,28}(?:[A-Za-z0-9_]))?)/
    ),
  tagIds: Joi.array().items(Joi.number()),

  // Contact details
  contactName: Joi.string(),
  contactPosition: Joi.string(),
  contactEmail: Joi.string().email(),
  contactPhone: Joi.string().max(10).trim(),
}).options({ stripUnknown: true });
