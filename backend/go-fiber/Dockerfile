FROM golang:1.22.5 AS builder

COPY . /myapp
WORKDIR /myapp

RUN go mod download
WORKDIR /myapp/cmd/App
ENV CGO_ENABLED=0 GOOS=linux GOARCH=amd64
RUN go build -ldflags="-s -w" -o /myapp/myapp .

FROM alpine:latest
WORKDIR /myapp
COPY --from=builder /myapp/myapp /myapp/myapp
EXPOSE 8080
ENTRYPOINT ["/myapp/myapp"]