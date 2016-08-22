var usersExtensionPath = 'urn:ietf:params:scim:schemas:extension:auth0:1.0:User';

exports.users = {
  scimToAuth0: function (scimUser) {
    var auth0User = {
      connection: scimUser[usersExtensionPath] && scimUser[usersExtensionPath].connectionName,
      username: scimUser.userName,
      password: scimUser.password
    };

    if (scimUser.emails && scimUser.emails.length > 0) {
      auth0User.email = scimUser.emails[0].value;
    }

    return auth0User;
  },

  auth0ToScim: function (auth0User) {
    var scimUser = {}; // TODO
    return scimUser;
  }
};
