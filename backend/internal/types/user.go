package types

var (
	RoleAdmin = "admin"
	RoleUser  = "user"
)

type Role string

type User struct {
	Email          string `json:"email"`
	Name           string `json:"name"`
	UniqueUserName string `json:"preferred_username"`
	Role           Role
}
