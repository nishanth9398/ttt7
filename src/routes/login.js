import { Router } from 'express'
import { db } from '../index.js'

export default Router().post('/', async (req, res) => {
    const serverUser = db.data.registeredUsers.find(u => u.email == req.body.email)

    if (serverUser) {
        if (serverUser.pass == req.body.pass) res.status(202).send()
        else res.status(401).send()
    } else {
        db.data.registeredUsers.push({
            email: req.body.email,
            pass: req.body.pass
        })
        await db.write()
        res.status(202).send()
    }
})