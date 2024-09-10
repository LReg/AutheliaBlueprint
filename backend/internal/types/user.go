package types

var (
	RoleAdmin Role = "admin"
	RoleUser  Role = "user"
	NoRole    Role = ""
)

type Role string

type User struct {
	Email             string `json:"email"`
	Name              string `json:"name"`
	PreferredUsername string `json:"preferred_username"`
	Role              Role   `json:"role"`
}
