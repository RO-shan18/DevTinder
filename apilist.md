## APi LIST

authrouter
post /signup
post /login
post /logout

profilrouter
get /profile/view
patch /profile/edit
patch /profile/password

connectionRequestrouter
POST /request/send/intrested/:userid
POST /request/send/igonored/:userid
POSt /request/send/rejected/:userid
POST /request/send/accepted/:userid

userrouter
get /user/requests
get /user/connections
get /user/feed

Status : intrested, ignored, rejected, accepted
