#Stage 1: BUILD
FROM golang:alpine AS BUILD
ENV TZ=Asia/Ulaanbaatar
ENV GO111MODULE=on
RUN apk add bash ca-certificates git gcc g++ libc-dev make
RUN apk add --update tzdata
WORKDIR /go/src/github.com/Fibocloud/Sol/backend
COPY . .
RUN go mod tidy
RUN go install github.com/swaggo/swag/cmd/swag@latest
RUN swag fmt && swag init
RUN CGO_ENABLED=0 GOOS=linux go build -a -gcflags='-N -l' -installsuffix cgo -o main main.go

# Stage 2: RUN
FROM busybox:stable-musl
ENV TZ Asia/Ulaanbaatar
WORKDIR /home
COPY --from=BUILD /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/
COPY --from=BUILD /go/src/github.com/Fibocloud/Sol/backend/main /home/
COPY --from=BUILD /go/src/github.com/Fibocloud/Sol/backend/.env /home/
COPY --from=BUILD /go/src/github.com/Fibocloud/Sol/backend/docs /home/
EXPOSE 8080
ENTRYPOINT ["/home/main"]
