package com.codevoyage.execution;

import com.codevoyage.execution.dto.SandboxExecutionRequest;
import com.codevoyage.execution.dto.SandboxExecutionResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;

@Service
public class ExecutionClient {

    private static final Logger log = LoggerFactory.getLogger(ExecutionClient.class);

    private final RestTemplate restTemplate;
    private final String executionServiceUrl;

    public ExecutionClient(
            RestTemplateBuilder restTemplateBuilder,
            @Value("${codevoyage.execution-service.url:http://localhost:5050}") String executionServiceUrl,
            @Value("${codevoyage.execution-service.timeout-ms:5000}") int timeoutMs
    ) {
        this.executionServiceUrl = executionServiceUrl.endsWith("/") ? executionServiceUrl.substring(0, executionServiceUrl.length() - 1) : executionServiceUrl;
        this.restTemplate = restTemplateBuilder
                .setConnectTimeout(Duration.ofMillis(timeoutMs))
                .setReadTimeout(Duration.ofMillis(timeoutMs + 2000))
                .build();
    }

    public SandboxExecutionResponse execute(String code, String className, String stdin, Integer timeoutMs) {
        String endpoint = executionServiceUrl + "/api/v1/execute";

        try {
            SandboxExecutionRequest request = new SandboxExecutionRequest(code, className, stdin, timeoutMs);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<SandboxExecutionRequest> entity = new HttpEntity<>(request, headers);

            ResponseEntity<SandboxExecutionResponse> response = restTemplate.postForEntity(
                    endpoint,
                    entity,
                    SandboxExecutionResponse.class
            );

            if (response.getBody() != null) {
                return response.getBody();
            }

            return new SandboxExecutionResponse(false, "RUNTIME_ERROR", "", "Execution runner returned empty response", 0L);
        } catch (Exception ex) {
            log.error("Failed to communicate with isolated Java execution service at {}: {}", endpoint, ex.getMessage());
            return new SandboxExecutionResponse(
                    false,
                    "RUNTIME_ERROR",
                    "",
                    "Sandbox communication error: Unable to contact isolated compilation runner.",
                    0L
            );
        }
    }
}
