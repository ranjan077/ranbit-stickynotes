var callbackURLString = process.env.OPENSHIFT_APP_DNS ? '/facebook/callback' : 'http://localhost:3000/auth/facebook/callback'

module.exports = {
	 'facebookAuth' : {
        'clientID'      : '555452741274972', // App ID
        'clientSecret'  : '35d5b1d51dca65e1abd166e8897fe8ef', // App Secret
        'callbackURL'   : callbackURLString
    }
}