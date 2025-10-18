import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import WebUser from "../models/WebUser.js"
import session from "express-session"

passport.use(
		new GoogleStrategy(
				{
					clientID: process.env.GOOGLE_CLIENT_ID,
					clientSecret: process.env.GOOGLE_CLIENT_SECRET,
					callbackURL: process.env.GOOGLE_CALLBACK_URL,
				},
				async (accessToken, refreshToken, profile, cb) => {
					const [user, created] = await WebUser.findOrCreate({
						where: { provider_id: profile.id, provider: 'google' },
						defaults: {
							name: profile.displayName,
							email: profile.emails[0].value,
							first_name: profile.name?.givenName || '',
							last_name: profile.name?.familyName || '',
							image: profile.photos[0].value,
						}
					});
					cb(null, user.dataValues);
				}
		)
);

const initPassport = (app) => {
	app.use(session({
		secret: process.env.JWT_SECRET,
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false } // for localhost use; set to true in production with HTTPS
	}));

	app.use(passport.initialize());
	app.use(passport.session({}));
}

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	WebUser.findByPk(id)
			.then(user => done(null, user))
			.catch(err => done(err));
});

export { initPassport };
