conn = new Mongo();
db = conn.getDB("public");
db.createUser({
    user: "db-username",
    pwd: "db-password",
    roles: [
        {
            role: "readWrite",
            db: "public"
        }
    ]
});
