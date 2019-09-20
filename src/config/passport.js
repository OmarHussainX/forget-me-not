import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcrypt'
import User from '../models/User'

/*
http://www.passportjs.org/packages/passport-local/

The local authentication strategy authenticates users using a username and password. The strategy requires a verify callback, which accepts these credentials and calls done providing a user.

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err) }
      if (!user) { return done(null, false) }
      if (!user.verifyPassword(password)) { return done(null, false) }
      return done(null, user)
    })
  }
)) */

export default (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  },
    // Verification callback for LocalStrategy - the purpose of a
    // verify callback is to find the user that possesses a set of credentials.
    // 
    // (When Passport authenticates a request, it parses the credentials
    // contained in the request. It then invokes the verify callback with
    // those credentials as arguments...)
    // 
    // If the credentials are valid, the verify callback invokes 'done'
    // to supply Passport with the user that authenticated.
    async (username, password, done) => {

      let registeredUser = null
      let passwordMatch = false

      try {
        registeredUser = await User.findOne({ email: username })
      } catch (err) {
        console.log(`Error searching for user with email '${username}': ${err.message}`)
        return done(err)  //exception occurred while verifying credentials
      }

      // If the email/username matches a user in the DB, then... 
      if (registeredUser) {
        console.log(`'${username}' is a valid email/username`)

        // ...check submitted password against credentials in the DB
        try {
          passwordMatch = await bcrypt.compare(password, registeredUser.password)
          if (passwordMatch) {
            console.log(`Password matches user: '${registeredUser.name}'`)
            console.log(`User authenticated!`)
            return done(null, registeredUser)
          } else {
            return done(null, false, { message: `Incorrect password` })
          }
        } catch (err) {
          console.log(`Password hashing error: ${err.message}`)
          return done(err)  //exception occurred while verifying credentials

        }


        // If the email/username is not in the DB, prepare a flash error
        // message and redirect to 'failureRedirect'
      } else {
        console.log(`No user with email/username: '${username}'`)
        return done(null, false, { message: `No user with email: '${username}'` })
      }
    }
  ))


  /* 
  In a typical web application, the credentials used to authenticate a user will only be transmitted during the login request. If authentication succeeds, a session will be established and maintained via a cookie set in the user's browser.

  Each subsequent request will not contain credentials, but rather the unique cookie that identifies the session. In order to support login sessions, Passport will serialize and deserialize user instances to and from the session.
  
  Here, only the user ID is serialized to the session (keeping the amount of data stored within the session small). When subsequent requests are received, this ID is used to find the user, --> which will be restored to req.user <--
  */
  passport.serializeUser((user, done) => {
    console.log(`serializeUser: '${user}'`)
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      console.log(`deserializeUser: '${user}'`)
      done(err, user)
    })
  })

}




/*
Strategies require what is known as a verify callback. The purpose of a verify callback is to find the user that possesses a set of credentials.

When Passport authenticates a request, it parses the credentials contained in the request. It then invokes the verify callback with those credentials as arguments, in this case username and password. If the credentials are valid, the verify callback invokes 'done' to supply Passport with the user that authenticated.

return done(null, user);

If the credentials are not valid (for example, if the password is incorrect), done should be invoked with false instead of a user to indicate an authentication failure.

return done(null, false);

An additional info message can be supplied to indicate the reason for the failure. This is useful for displaying a flash message prompting the user to try again.

return done(null, false, { message: 'Incorrect password.' });

Finally, if an exception occurred while verifying the credentials (for example, if the database is not available), done should be invoked with an error, in conventional Node style.

return done(err);

Note that it is important to distinguish the two failure cases that can occur. The latter is a server exception, in which err is set to a non-null value. Authentication failures are natural conditions, in which the server is operating normally. Ensure that err remains null, and use the final argument to pass additional details.
*/