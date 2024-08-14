package helper

import "os"

func Ev(name string) string {
	return os.Getenv(name)
}
