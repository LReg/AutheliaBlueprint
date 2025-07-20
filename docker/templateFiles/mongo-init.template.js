conn = new Mongo();
db = conn.getDB("public");
db.createUser({
    user: "$DB_USERNAME",
    pwd: "$DB_PASSWORD",
    roles: [
        {
            role: "readWrite",
            db: "public"
        }
    ]
});
