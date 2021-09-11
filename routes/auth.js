const express = require('express');
const bcrypt = require('bcrypt');
const boom = require('@hapi/boom');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const fs = require("fs");
const path = require("path");
const LogsServices = require('./../services/logs');
const UsersService = require('../services/users');
const validationHandler = require('../utils/middleware/validationHandler');
const { config } = require('../config');

const { createUserSchema } = require('../schemas/users');


// Basic strategy
require('../utils/auth/strategies/basic');

function authApi(app) {

  const router = express.Router();

  app.use('/api/auth', router);

  const logsServices = new LogsServices();
  const usersService = new UsersService();

  router.post('/sign-in', async function(req, res, next) {

    try {

      if(!req.body) {
        next(boom.unauthorized());
      }

      const [ user ] = await usersService.getUser(req.body.email);

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

  router.post('/forget-password', async function(req, res, next) {
    
    if(!req.body) {
      next(boom.unauthorized());
    }

    try {
      // TODO: Enviar mail de recuperación. Y respuesta al frontend para informar al usuario
      let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: config.googleEmail,
          pass: config.googlePassword,
          clientId: config.googleClientId,
          clientSecret: config.googleClientSecret,
          refreshToken: config.googleRefreshToken
        }
      });

      // TODO: Buscar usuario con mail, para obtener el nombre, y saludarlo en el mail.
      const [ user ] = await usersService.getUser(req.body.mail);
      if(!user) res.status(401).json({
        error: 401,
        message: 'No se encontró ningún usuario.'
      })

      const token = jwt.sign(req.body.mail, config.authJwtSecret);
      // TODO: Armar la url para enviar en el html handlebars
      const resetLink = `${config.frontendURL}reset-password/${user._id}/${token}`;

      const srcTemplate = fs.readFileSync(path.join(__dirname, "./../utils/mail/templates/requestResetPassword.handlebars"), "utf8");
      const compiledTemplate = handlebars.compile(srcTemplate);

      const mailOptions = () => {
        return {
          from: config.googleEmail,
          to: req.body.mail,
          subject: 'Antecedentes Laborales | Blanqueo de contraseña',
          html: compiledTemplate({
            name: user.name,
            link: resetLink
          }),
        };
      };

      transporter.sendMail(mailOptions(), function(err, info) {
        if(err) {
          // console.log(err);
          res.status(401).json({
            error: 401,
            message: 'No se pudo enviar el correo',
          })
        } else {
          // console.log(info);
          res.status(200).json({
            data: info,
            message: 'Se ha enviado un correo para continuar con el cambio de contraseña.'
          })
        }
      })

    } catch (error) {
      next(error);
    }
  })

  router.post("/reset-password/:userId/:token", async function(req, res, next) {
    try {

      const { newPassword } = req.body; 
      const { userId } = req.params;
      
      const user = await usersService.getUserById(userId);
      if(!user) res.status(400).send({ message: 'Invalid link or expired'});

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      const updatedUserId = await usersService.resetUserPassword(userId, hashedPassword);

      if(updatedUserId) {
        res.status(201).json({
          data: updatedUserId,
          message: 'password updated'
        });
      } else {
        res.status(401).json({
          error: 401,
          message: 'No se pudo blanquear la clave'
        })
      }

    } catch (error) {
      next(error);
    }
  })

}

module.exports = authApi;