'use strict';

module.exports = function(Model, options) {
  if (Model && Model.sharedClass) {
    let methodsToExpose = options.expose || [];
    let modelName = Model.sharedClass.name;
    let methods = Model.sharedClass.methods();
    let relationMethods = [];
    let hiddenMethods = [];
    try {
      Object.keys(Model.definition.settings.relations).forEach(function(relation) {
        relationMethods.push({name: '__findById__' + relation, isStatic: false});
        relationMethods.push({name: '__destroyById__' + relation, isStatic: false});
        relationMethods.push({name: '__updateById__' + relation, isStatic: false});
        relationMethods.push({name: '__exists__' + relation, isStatic: false});
        relationMethods.push({name: '__link__' + relation, isStatic: false});
        relationMethods.push({name: '__get__' + relation, isStatic: false});
        relationMethods.push({name: '__create__' + relation, isStatic: false});
        relationMethods.push({name: '__update__' + relation, isStatic: false});
        relationMethods.push({name: '__destroy__' + relation, isStatic: false});
        relationMethods.push({name: '__unlink__' + relation, isStatic: false});
        relationMethods.push({name: '__count__' + relation, isStatic: false});
        relationMethods.push({name: '__delete__' + relation, isStatic: false});
        relationMethods.push({name: 'prototype.__count__accessTokens', isStatic: false});
        relationMethods.push({name: 'prototype.__create__accessTokens', isStatic: false});
        relationMethods.push({name: 'prototype.__delete__accessTokens', isStatic: false});
        relationMethods.push({name: 'prototype.__destroyById__accessTokens', isStatic: false});
        relationMethods.push({name: 'prototype.__findById__accessTokens', isStatic: false});
        relationMethods.push({name: 'prototype.__get__accessTokens', isStatic: false});
        relationMethods.push({name: 'prototype.__updateById__accessTokens', isStatic: false});
        relationMethods.push({name: 'prototype.patchAttributes', isStatic: false});
      });
    } catch (err) {
      console.log(err); // TODO: log!
      throw err;
    }
    methods.concat(relationMethods).forEach(function(method) {
      let methodName = method.name;
      if (methodsToExpose.indexOf(methodName) < 0) {
        hiddenMethods.push(methodName);
        Model.disableRemoteMethodByName(methodName, method.isStatic);
      }
    });
    // DEBUG:
    // if(hiddenMethods.length > 0) {
    //     console.log('\nRemote mehtods hidden for', modelName, ':', hiddenMethods.join(', '), '\n');
    // }
  }
};
