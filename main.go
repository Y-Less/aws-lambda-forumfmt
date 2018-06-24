package main

import (
	"log"
	"errors"
	"fmt"
	"strings"
	"encoding/json"
	"github.com/aws/aws-lambda-go/lambda"
	"./forumfmt/markdown"
	"github.com/Jeffail/gabs"
)

type MyEvent struct {
	MD string `json:"MD"`
	Style string `json:"Style"`
}

type MyResponse struct {
	BB string `json:"BB"`
}

type MyHeaders struct {
}

type AWSResponse struct {
	IsBase64Encoded bool `json:"isBase64Encoded"`
	StatusCode int `json:"statusCode"`
	Headers MyHeaders `json:"headers"`
	Body string `json:"body"`
}

type AWSRequest struct {
	Body string `json:"body"`
}

func AWSError(err error) (AWSResponse, error) {
	return AWSResponse{
		IsBase64Encoded: false,
		StatusCode: 500,
		Headers: MyHeaders{},
		Body: err.Error() }, err
}

func LambdaHandler(awsevent AWSRequest) (AWSResponse, error) {
	event := new(MyEvent)
	_ = json.Unmarshal([]byte(awsevent.Body), &event)
	log.Print("Hello from Lambda")
	var (
		out strings.Builder
		err        error
		jsonParsed *gabs.Container
	)
	log.Print(event.MD)
	jsonParsed, err = markdown.ParseStyles(event.Style)
	if err != nil {
		return AWSError(errors.New(fmt.Sprintf("failed to process styles:", err)))
	}

	err = markdown.Process(strings.NewReader(event.MD), &out, jsonParsed)
	if err != nil {
		return  AWSError(errors.New(fmt.Sprintf("failed to process input:", err)))
	}
	body, err := json.Marshal(MyResponse{BB: out.String()})
	log.Print(out.String())
	if err != nil {
		return AWSError(errors.New(fmt.Sprintf("failed to marshal response:", err)))
	}
	return AWSResponse{
		IsBase64Encoded: false,
		StatusCode: 200,
		Headers: MyHeaders{},
		Body: string(body) }, nil
}

func main() {
	lambda.Start(LambdaHandler)
}

