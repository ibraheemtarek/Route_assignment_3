const http = require("http");
const fs = require("fs");
const path = require("path");

const port = 3000
const usersPath = path.resolve("./users.json")
let users = JSON.parse(fs.readFileSync(usersPath, { encoding: "utf-8" }))
console.log(users)

const server = http.createServer((req, res) => {
    const { method, url } = req
    // console.log(req)
    //Create an API that adds a new user to your users stored in a JSON file. (ensure that the email of the new user doesn’t exist before)
    if (url === "/user" && method === "POST") {
        let body = ""
        req.on("data", chunk => {
            body += chunk
        })
        req.on("end", () => {
            try {
                const { name, age, email } = JSON.parse(body)
                const user = users.find((value) => {
                    return value.email === email
                })
                if (!email) {
                    res.writeHead(400, { "Content-Type": "text/plain" })
                    return res.end("email is required")
                } else if (user) {
                    res.writeHead(409, { "Content-Type": "text/plain" })
                    return res.end("email already exists")
                } else {
                    users.push({ name, age, email })
                    fs.writeFileSync(usersPath, JSON.stringify(users))
                    res.writeHead(201, { "Content-Type": "application/json" })
                    return res.end(JSON.stringify(users))
                }
            } catch (error) {
                res.writeHead(400, { "Content-Type": "text/plain" })
                return res.end(error.message)
            }
        })
    } else if (url.includes("/user") && method === "PATCH") {
        let id = url.split("/")[2]
        if (!id) {
            res.writeHead(400, { "Content-Type": "text/plain" })
            return res.end("id is required")
        }

        let body = ""

        req.on("data", chunk => {
            body += chunk
        })
        req.on("end", () => {
            try {
                body = JSON.parse(body)
                const user = users.find((value) => {
                    return value.id == id
                })

                if (!user) {
                    res.writeHead(404, { "Content-Type": "text/plain" })
                    return res.end("user not found")
                }
                res.writeHead(200, { "Content-Type": "application/json" })
                if (body.name !== undefined) {
                    user.name = body.name
                    res.write("user name updated \n")
                }
                if (body.age !== undefined) {
                    user.age = body.age
                    res.write("user age updated \n")
                }
                if (body.email !== undefined) {
                    user.email = body.email
                    res.write("user email updated \n")
                }
                fs.writeFileSync(usersPath, JSON.stringify(users))
                return res.end(JSON.stringify(user))

            } catch (error) {
                res.writeHead(400, { "Content-Type": "text/plain" })
                return res.end(error.message)
            }
        })
    } else if (url.includes("/user") && method === "DELETE") {
        let id = url.split("/")[2]
        if (!id) {
            res.writeHead(400, { "Content-Type": "text/plain" })
            return res.end("id is required")
        }
        try {
            const userIndex = users.findIndex((value) => {
                return value.id == id
            })
            if (userIndex === -1) {
                res.writeHead(404, { "Content-Type": "text/plain" })
                return res.end("user not found")
            }
            users.splice(userIndex, 1)
            fs.writeFileSync(usersPath, JSON.stringify(users))
            res.writeHead(200, { "Content-Type": "application/json" })
            return res.end("user deleted")


        } catch (error) {
            res.writeHead(400, { "Content-Type": "text/plain" })
            return res.end(error.message)
        }
    }
})

server.listen(port, () => {
    console.log(`server is running on port :: ${port}`)
})