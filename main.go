package main

import (
	"errors"
	"fmt"
	"strings"
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

func LambdaHandler(event MyEvent) (MyResponse, error) {
	var (
		out strings.Builder
		err        error
		jsonParsed *gabs.Container
	)
	jsonParsed, err = markdown.ParseStyles(event.Style)
	if err != nil {
		return MyResponse{}, errors.New(fmt.Sprintf("failed to process styles:", err))
	}

	err = markdown.Process(strings.NewReader(event.MD), &out, jsonParsed)
	if err != nil {
		return  MyResponse{}, errors.New(fmt.Sprintf("failed to process input:", err))
	}
	return MyResponse{BB: out.String()}, nil
}

func main() {
	lambda.Start(LambdaHandler)
}

