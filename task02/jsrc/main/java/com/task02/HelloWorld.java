package com.task02;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayV2HTTPResponse;
import com.syndicate.deployment.annotations.lambda.LambdaHandler;
import com.syndicate.deployment.model.RetentionSetting;

import java.util.HashMap;
import java.util.Map;

@LambdaHandler(
		lambdaName = "hello_world",
		roleName = "hello_world-role",
		isPublishVersion = true,
		aliasName = "${lambdas_alias_name}",
		logsExpiration = RetentionSetting.SYNDICATE_ALIASES_SPECIFIED
)
public class HelloWorld implements RequestHandler<APIGatewayV2HTTPEvent, APIGatewayV2HTTPResponse> {

	@Override
	public APIGatewayV2HTTPResponse handleRequest(APIGatewayV2HTTPEvent event, Context context) {
		String path = event.getRawPath();
		String method = event.getRequestContext().getHttp().getMethod();

		if ("/hello".equals(path) && "GET".equalsIgnoreCase(method)) {
			return createResponse(200, "{\"statusCode\":200, \"message\":\"Hello from Lambda\"}");
		}

		String errorMessage = String.format(
				"{\"statusCode\":400, \"message\":\"Bad request syntax or unsupported method. Request path: %s. HTTP method: %s\"}",
				path, method
		);

		return createResponse(400, errorMessage);
	}

	private APIGatewayV2HTTPResponse createResponse(int statusCode, String body) {
		Map<String, String> headers = new HashMap<>();
		headers.put("Content-Type", "application/json");

		return APIGatewayV2HTTPResponse.builder()
				.withStatusCode(statusCode)
				.withHeaders(headers)
				.withBody(body)
				.build();
	}
}
