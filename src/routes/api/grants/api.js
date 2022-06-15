const express = require('express');
const apicache = require('apicache-plus');

const db = require('../../../db');
const auth = require('../../../middleware/sequelize-authorization-middleware');
const validateSchema = require('../../../middleware/validate-schema');
const pagination = require('../../../middleware/pagination');
const schemas = require('./schemas');

const router = express.Router({ mergeParams: true });

const cache = apicache.options({
  headers: {
    'cache-control': 'no-cache',
  },
}).middleware;

/**
 * Create grant
 */
router.post(
  `/`,
  [auth.can('Tag', 'create'), validateSchema(schemas.createGrant)],
  async function createGrant(req, res, next) {
    try {
      const body = req.body;
      body.siteId = req.params.siteId;
      const grant = await db.Grant.create(body);
      apicache.clear();
      return res.status(201).json(grant);
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * List grants
 */
router.get(
  `/`,
  [
    cache('5 min', (req) => req.headers['cache-control'] !== 'no-cache'),
    auth.can('Tag', 'list'),
    auth.useReqUser,
    pagination.init,
  ],
  async function listGrants(req, res, next) {
    try {
      const query = {
        ...req.dbQuery,
        where: {
          siteId: req.params.siteId,
        },
      };

      const result = await db.Grant.findAndCountAll(query);
      let listLength = query.pageSize ? result.count : result.rows.length;

      return res.json({
        metadata: {
          page: parseInt(req.query.page) || 0,
          pageSize: query.pageSize,
          pageCount:
            parseInt(listLength / query.pageSize) +
            (listLength % query.pageSize ? 1 : 0),
          totalCount: result.count,
          links: {
            self: null,
            first: null,
            last: null,
            previous: null,
            next: null,
          },
        },
        records: result.rows,
      });
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * Get grant by id
 */
router.get(
  '/:id(\\d+)',
  [auth.can('Tag', 'view')],
  async function getGrant(req, res, next) {
    try {
      const grants = await db.Grant.findOne({
        where: {
          id: req.params.id,
          siteId: req.params.siteId,
        },
      });
      return res.json(grants);
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * Update grant
 */
router.put(
  '/:id(\\d+)',
  [validateSchema(schemas.updateGrant)],
  async function updateGrant(req, res, next) {
    try {
      const grant = await db.Grant.findOne({
        where: {
          id: req.params.id,
          siteId: req.params.siteId,
        },
      });
      await grant.update(req.body);
      await grant.reload();
      apicache.clear();
      return res.json(grant);
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * Remove grant
 */
router.delete(
  '/:id(\\d+)',
  [auth.can('Tag', 'delete')],
  async function deleteGrant(req, res, next) {
    try {
      const grant = await db.Grant.findOne({
        where: {
          id: req.params.id,
          siteId: req.params.siteId,
        },
      });
      await grant.destroy();
      apicache.clear();
      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
