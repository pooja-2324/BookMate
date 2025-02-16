// import passport from 'passport'
// import GoogleStrategy from ('passport-google-oauth20').Strategy
// import User from '../App/models/user-model.js'
// import dotenv from 'dotenv'
// dotenv.config()

// passport.use(new GoogleStrategy({
//     clientID:process.env.GOOGLE_CLIENT_ID,
//     clientSecret:process.env.GOOGLE_CLIENT_SECRET,
//     callbackURL:'/auth/google/callback'
// },
// async(accessToken,refreshToken,profile,done)=>{
//     try{
//         let user=await User.findOne({googleId:profile._id})
//         if(user){
//             return done(null,user)
//         }else{
//             user=new User({
//                 name:profile.displayName,
//                 email:profile.emails[0].value,
//                 googleId:profile._id
//             })
//             await user.save()
//             return done(null,user)
//         }
//     }catch(err){
//         return done(err,null)
//     }
// }

// ))
// passport.serializeUser((user,done)=>{
//     done (null,user._id)
// })
// passport.deserializeUser((id,done)=>{
//     User.findById(id)
//     .then(user=>{
//         done(null,user)
//     })
//     .catch(err=>{
//         done(err,null)
//     })
// })
// export default passport
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../App/models/user-model.js';
import dotenv from 'dotenv';
dotenv.config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: '/auth/google/callback',
            passReqToCallback: true, // Allows passing request parameters
        },
        async (req, accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ googleId: profile.id });

                if (!user) {
                    const role = req.session.role || "client"; // Default to "client" if not specified

                    user = new User({
                        name: profile.displayName,
                        email: profile.emails[0].value,
                        googleId: profile.id,
                        role: role, // Assign role dynamically
                    });

                    await user.save();
                }

                return done(null, user);
            } catch (err) {
                return done(err, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => done(null, user))
        .catch((err) => done(err, null));
});

export default passport;