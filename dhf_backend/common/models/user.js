'use strict'
const { USER_TYPE } = require('../lib/constants')
const axios = require('axios')
const path = require('path')
const senderAddress = 'noreply@ninja.org'
module.exports = function (User) {
  User.validatesInclusionOf('userType', {
    in: ['admin', 'user', 'backend'],
    message: 'must be an user'
  })

  User.updateProfile = function (
    firstName,
    lastName,
    username,
    email,
    avatar,
    callback
  ) {
    this.findOne(
      {
        where: {
          id: User.app.currentUserId.toString(),
          email: email,
          username: username
        }
      },
      function (err, user) {
        if (err) {
          callback(err)
        } else if (!user) {
          let mess =
            'No match between provided current logged user and email or username'
          let newErr = new Error(mess)
          newErr.statusCode = 405
          newErr.code = 'LOGIN_FAILED_EMAIL'
          callback(newErr)
        } else {
          user.updateAttributes(
            {
              firstName: firstName,
              lastName: lastName,
              avatar: avatar
            },
            function (err, instance) {
              if (err) {
                callback(err)
              } else {
                callback(null, user)
              }
            }
          )
        }
      }
    )
  }

  User.remoteMethod('updateProfile', {
    description: 'Update user profile',
    accepts: [
      { arg: 'firstName', type: 'string', required: true },
      { arg: 'lastName', type: 'string', required: true },
      { arg: 'username', type: 'string', required: true },
      { arg: 'email', type: 'string', required: true },
      { arg: 'avatar', type: 'string' }
    ],
    returns: { arg: 'data', root: true, type: 'Object' },
    http: { path: '/update-profile', verb: 'put' }
  })

  User.updatePassword = function (oldPassword, newPassword, callback) {
    let newErrMsg, newErr
    try {
      this.findOne(
        { where: { id: User.app.currentUserId.toString() } },
        function (err, user) {
          if (err) {
            callback(err)
          } else {
            user.hasPassword(oldPassword, function (err, isMatch) {
              if (isMatch) {
                user.updateAttributes({ password: newPassword }, function (
                  err,
                  instance
                ) {
                  if (err) {
                    callback(err)
                  } else {
                    callback(null, true)
                  }
                })
              } else {
                newErrMsg = 'User specified wrong current password !'
                newErr = new Error(newErrMsg)
                newErr.statusCode = 405
                newErr.code = 'LOGIN_FAILED_PWD'
                return callback(newErr)
              }
            })
          }
        }
      )
    } catch (err) {
      logger.error(err)
      callback(err)
    }
  }

  User.remoteMethod('updatePassword', {
    description: 'Allows a logged user to change his/her password.',
    http: { path: '/update-password', verb: 'put' },
    accepts: [
      {
        arg: 'oldPassword',
        type: 'string',
        required: true,
        description: 'The user old password'
      },
      {
        arg: 'newPassword',
        type: 'string',
        required: true,
        description: 'The user NEW password'
      }
    ],
    returns: { arg: 'passwordChange', type: 'boolean' }
  })

  User.listTrader = function (next) {
    User.find(
      {
        where: {
          userType: USER_TYPE.USER,
          isTrader: true
        }
      },
      next
    )
  }

  User.remoteMethod('listTrader', {
    description: 'Get all trader',
    returns: { arg: 'data', root: true, type: 'Object' },
    http: { path: '/list-trader', verb: 'get' }
  })

  User.observe('before save', function (ctx, next) {
    if (ctx.instance && ctx.isNewInstance) {
      if (
        (ctx.instance.userType === USER_TYPE.ADMIN ||
          ctx.instance.userType === USER_TYPE.BACKEND) &&
        ctx.instance.realm !== 'backend'
      ) {
        let err = new Error()
        err.status = 405
        err.message = "Admin type can't create from rest api"
        return next(err)
      }
    }
    next()
  })

  User.afterRemote('create', function (context, user, next) {
    /*
    add user to role
    * */
    let models = User.app.models
    models.Role.findOne({ where: { name: user.userType } }, function (
      err,
      role
    ) {
      if (err) return next(err)
      role.principals.create(
        {
          principalType: models.RoleMapping.USER,
          principalId: user.id
        },
        function (err, principal) {
          if (err) return next(err)
          console.log('user has been added to role', principal)
        }
      )
    })
    var options = {
      type: 'email',
      to: user.email,
      from: senderAddress,
      subject: 'Thanks for registering.',
      template: path.resolve(
        __dirname,
        '../../server/assets/email-templates/verify.ejs'
      ),
      redirect: '/',
      verifyHref: 'http://35.198.235.226:3000/verified',
      user: user
    }
    user.verify(options, function (err, response) {
      if (err) {
        User.deleteById(user.id)
        return next(err)
      }
      next()
    })
  })

  User.beforeRemote('create', function (context, user, next) {
    let body = context.req.body
    if (!body['g-recaptcha-response']) {
      let err = new Error("Need Captcha Response")
      err.status = 405
      return next(err)
    }
    async function verify (captcha) {
      let verifyResponse = await axios.post(
        `https://www.google.com/recaptcha/api/siteverify`,
        {
          secret: '6LfgU3cUAAAAAJPR774SNLQ2BPbqmnsh0U4Ghm6o',
          response: captcha
        }
      )
      return verifyResponse.success
    }
    verify(body['g-recaptcha-response']).then(isValid => {
      if (isValid) return next()
      return next(new Error('Captcha not correct'))
    })
  })
}
