cd compress
$env:GOOS = ""
$env:GOARCH = ""
go build
cp compress.exe ..
cd ..
$env:GOOS = "linux"
$env:GOARCH = "amd64"
go build -o main main.go
#zip main.zip ./main ./forumfmt/yless.json
.\compress.exe -o main.zip main forumfmt\yless.json
# --handler is the path to the executable inside the .zip
#aws lambda create-function                                                     `
#	--profile personal                                                         `
#	--region eu-west-1                                                         `
#	--function-name markdown-post                                              `
#	--memory 128                                                               `
#	--runtime go1.x                                                            `
#	--zip-file fileb://./main.zip                                              `
#	--handler main                                                             `
#	--role arn:aws:iam::166984398419:role/markdown-post-iam

aws lambda update-function-code                                                `
	--profile personal                                                         `
	--region eu-west-1                                                         `
	--function-name markdown-post                                              `
	--zip-file fileb://./main.zip

#aws lambda delete-function --profile personal --region eu-west-1 --function-name markdown-post

