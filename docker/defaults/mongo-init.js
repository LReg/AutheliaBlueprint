db.createUser({
    user: "$DB_USERNAME",
    pwd: "$DB_PASSWORD",
    roles: [
        {
            role: "readWrite",
            db: "$DB_DATABASE_NAME"
        }
    ]
});
