const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const ApiKeysService = require('../services/apiKeys');
const LogsServices = require('./../services/logs');
const UsersService = require('../services/users');
const validationHandler = require('../utils/middleware/validationHandler');

const {
  createUserSchema,
  createProviderUserSchema
} = require('../schemas/users');

const { config } = require('../config');

// Basic strategy
require('../utils/auth/strategies/basic');

function authApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);

  // const apiKeysService = new ApiKeysService();
  const logsServices = new LogsServices();
  const usersService = new UsersService();

  router.post('/sign-in', async function(req, res, next) {
    // const { apiKeyToken } = req.body;

    // if (!apiKeyToken) {
    //   next(boom.unauthorized('apiKeyToken is required'));
    // }

    try {

      if(!req.body) {
        next(boom.unauthorized());
      }

      const user = await usersService.getUser(req.body);

      if(!user) {
        return res.status(401).json({ error: 401, message: 'No existe el usuario' });
      }
      
      return bcrypt.compare(req.body.password, user.password)
      .then(equals => {
        if(equals === true) {
          const { _id: id, name, email } = user;

          const payload = {
            sub: id,
            name,
            email,
          };

          const token = jwt.sign(payload, config.authJwtSecret, {
            expiresIn: '15m'
          });

          let log = {
            method: "LOGIN",
            collection: 'users',
            description: `Login OK: user ${id}`
          }
          logsServices.registerLog({ log });
          return res.status(200).json({ token, user: { id, name, email } });
    
        } else {

          return res.status(401).json({ error: 401, message: 'Datos incorrectos' });
        
        }

      }).catch(err => {
        next(err);
      });

    } catch (error) {
      next(error);
    }
    


    // passport.authenticate('basic', function(error) {
    //   try {
    //     if (error || !user) {
    //       next(boom.unauthorized());
    //     }

    //     req.login(user, { session: false }, async function(error) {
    //       if (error) {
    //         next(error);
    //       }

    //       // const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

    //       // if (!apiKey) {
    //       //   next(boom.unauthorized());
    //       // }

    //       const { _id: id, name, email } = user;

    //       const payload = {
    //         sub: id,
    //         name,
    //         email,
    //       };

    //       const token = jwt.sign(payload, config.authJwtSecret, {
    //         expiresIn: '15m'
    //       });

    //       return res.status(200).json({ token, user: { id, name, email } });
    //     });
    //   } catch (error) {
    //     next(error);
    //   }
    // })(req, res, next);
  });

  router.post('/sign-up', validationHandler(createUserSchema), 
    async function(req, res, next) {
      const { body: user } = req;

      try {
        const createdUserId = await usersService.createUser({ user });
        let log = {
          method: "SIGNUP",
          collection: 'users',
          description: `Registro agregado: ${createdUserId}`
        }
        logsServices.registerLog({ log });
        if(createdUserId) {
          res.status(201).json({
            data: createdUserId,
            message: 'user created'
          });
        } else {
          res.status(401).json({
            error: 401,
            message: 'Ya existe el usuario'
          })
        }

      } catch (error) {
        next(error);
      }
    }
  );

  // router.post('/sign-provider', validationHandler(createProviderUserSchema),
  //   async function(req, res, next) {
  //     const { body } = req;

  //     const { apiKeyToken, ...user } = body;

  //     // if (!apiKeyToken) {
  //     //   next(boom.unauthorized('apiKeyToken is required'));
  //     // }

  //     try {
  //       const queriedUser = await usersService.getOrCreateUser({ user });
  //       const apiKey = await apiKeysService.getApiKey({ token: apiKeyToken });

  //       if (!apiKey) {
  //         next(boom.unauthorized());
  //       }

  //       const { _id: id, name, email } = queriedUser;

  //       const payload = {
  //         sub: id,
  //         name,
  //         email,
  //         scopes: apiKey.scopes
  //       };

  //       const token = jwt.sign(payload, config.authJwtSecret, {
  //         expiresIn: '15m'
  //       });

  //       return res.status(200).json({ token, user: { id, name, email } });
  //     } catch (error) {
  //       next(error);
  //     }
  //   }
  // );
}

module.exports = authApi;