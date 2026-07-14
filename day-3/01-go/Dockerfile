# ---- build stage ----
FROM golang:1.22 AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux go build -o /app ./cmd/server

# ---- final stage ----
FROM alpine:3.19
RUN apk add --no-cache ca-certificates
COPY --from=builder /app /app
ENTRYPOINT ["/app"]
