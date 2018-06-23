aws lambda invoke                                                              `
	--invocation-type RequestResponse                                          `
	--function-name markdown-post                                              `
	--region eu-west-1                                                         `
	--payload file://./test.json                                               `
	--profile personal                                                         `
	outputfile.txt
cat outputfile.txt

