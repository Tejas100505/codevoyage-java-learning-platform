# CodeVoyage - Isolated Execution Service

This service provides an isolated sandbox to compile and execute student Java code.

### Security Guarantees:
1. **Separation of Concerns**: Student code is **NEVER** compiled or executed within the Spring Boot application.
2. **Dedicated Container**: Runs inside an unprivileged Docker container (`sandboxuser`).
3. **Execution Limits**:
   - Strict memory caps (`-Xmx128m`)
   - Strict timeout enforcement (`EXECUTION_TIMEOUT_MS=5000`)
   - Sandboxed temporary directories per execution, deleted immediately upon termination.
