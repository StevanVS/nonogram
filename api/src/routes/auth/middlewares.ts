import { RequestHandler } from "express";

export const isAuth: RequestHandler = (req, res, next)  => {
  const token = req.header('x-auth')
  if (!token) {
    res.send('no hay token')
    return
  }

  // TODO: use JWT decode
  const user = JSON.parse(token)

  req.body.authUser = user
  next()
}
