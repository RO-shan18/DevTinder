# APi LIST

## authrouter
post /signup
post /login
post /logout

## profilrouter
get /profile/view
patch /profile/edit
patch /profile/password

## connectionRequestrouter
POST /request/send/:status/:userid
POST /request/review/:status/:requestid

## userrouter
get /user/requests
get /user/connections
get /user/feed

Status : intrested, ignored, rejected, accepted
