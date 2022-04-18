package redis

import (
	"context"
	"encoding/json"
	"fmt"
	"time"

	"crypto/sha256"

	"github.com/go-redis/redis/v8"
	"github.com/spf13/viper"
)

type Client interface {
	Save(key string, value interface{}, expire time.Duration) error
	Get(key string) ([]byte, error)
	Remove(key string) error
}

var Instance Client

type RedisClient struct {
	client *redis.Client
}

func (rds RedisClient) Save(key string, value interface{}, expire time.Duration) error {
	byt, err := json.Marshal(value)
	if err != nil {
		return err
	}
	_, err = rds.client.Set(context.Background(), key, string(byt), expire).Result()
	return err
}

func (rds RedisClient) Get(key string) ([]byte, error) {
	result, err := rds.client.Get(context.Background(), key).Result()
	if err != nil {
		return nil, err
	}
	return []byte(result), nil
}

func (rds RedisClient) Remove(key string) error {
	_, err := rds.client.Del(context.Background(), key).Result()
	return err
}

func Connect() {
	rdb := redis.NewClient(&redis.Options{
		Addr: fmt.Sprintf("%s:%d",
			viper.GetString("REDIS_HOST"),
			viper.GetInt("REDIS_PORT"),
		),
		DB:       viper.GetInt("REDIS_DB"),
		Username: viper.GetString("REDIS_USER"),
		Password: viper.GetString("REDIS_PASSWORD"),
	})

	Instance = &RedisClient{
		client: rdb,
	}
}

func GenKey(inputs ...interface{}) (string, error) {
	var result []byte
	for _, input := range inputs {
		bye, err := json.Marshal(input)
		if err != nil {
			return "", err
		}
		result = append(result, bye...)
	}
	hsha2 := sha256.Sum256(result)
	return string(hsha2[:]), nil
}
