import express, { Request, Response } from 'express';
import cors from 'cors';
import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

const app = express();
const PORT = process.env.PORT || 5050;
const DEFAULT_TIMEOUT_MS = parseInt(process.env.EXECUTION_TIMEOUT_MS || '5000', 10);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

interface ExecuteRequest {
  code: string;
  className?: string;
  stdin?: string;
  timeoutMs?: number;
}

interface ExecuteResult {
  success: boolean;
  status: 'SUCCESS' | 'COMPILE_ERROR' | 'RUNTIME_ERROR' | 'TIMEOUT';
  stdout: string;
  stderr: string;
  executionTimeMs: number;
}

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    service: 'codevoyage-execution-service',
    status: 'UP',
    timestamp: new Date().toISOString(),
    runtime: 'JDK 21 Sandbox'
  });
});

app.post('/api/v1/execute', async (req: Request, res: Response) => {
  const { code, className = 'Solution', stdin = '', timeoutMs = DEFAULT_TIMEOUT_MS }: ExecuteRequest = req.body;

  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      success: false,
      status: 'COMPILE_ERROR',
      stdout: '',
      stderr: 'Code is required.',
      executionTimeMs: 0
    });
  }

  // Create isolated temp directory for this submission
  const runId = `run_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const tempDir = path.join(os.tmpdir(), 'codevoyage_sandbox', runId);

  try {
    fs.mkdirSync(tempDir, { recursive: true });
    const sourceFile = path.join(tempDir, `${className}.java`);
    fs.writeFileSync(sourceFile, code, 'utf8');

    const startTime = Date.now();

    // Step 1: Compile code with javac
    const compileCmd = `javac "${sourceFile}"`;
    exec(compileCmd, { timeout: timeoutMs }, (compileErr, _compileStdout, compileStderr) => {
      if (compileErr) {
        cleanDir(tempDir);
        return res.json({
          success: false,
          status: 'COMPILE_ERROR',
          stdout: '',
          stderr: compileStderr || compileErr.message,
          executionTimeMs: Date.now() - startTime
        } as ExecuteResult);
      }

      // Step 2: Run java with memory restrictions and security constraints
      // In containerized/sandbox environments, limits prevent fork bombs & high memory
      const runCmd = `java -Xmx128m -cp "${tempDir}" ${className}`;
      const child = exec(runCmd, { timeout: timeoutMs }, (runErr, stdout, stderr) => {
        const executionTimeMs = Date.now() - startTime;
        cleanDir(tempDir);

        if (runErr) {
          const isTimeout = runErr.killed || runErr.signal === 'SIGTERM';
          return res.json({
            success: false,
            status: isTimeout ? 'TIMEOUT' : 'RUNTIME_ERROR',
            stdout: stdout || '',
            stderr: isTimeout ? `Execution timed out after ${timeoutMs}ms` : (stderr || runErr.message),
            executionTimeMs
          } as ExecuteResult);
        }

        return res.json({
          success: true,
          status: 'SUCCESS',
          stdout: stdout || '',
          stderr: stderr || '',
          executionTimeMs
        } as ExecuteResult);
      });

      if (stdin && child.stdin) {
        child.stdin.write(stdin);
        child.stdin.end();
      }
    });
  } catch (err: any) {
    cleanDir(tempDir);
    return res.status(500).json({
      success: false,
      status: 'RUNTIME_ERROR',
      stdout: '',
      stderr: err?.message || 'Execution sandbox error',
      executionTimeMs: 0
    });
  }
});

function cleanDir(dirPath: string) {
  try {
    if (fs.existsSync(dirPath)) {
      fs.rmSync(dirPath, { recursive: true, force: true });
    }
  } catch {
    // Ignore cleanup errors
  }
}

app.listen(PORT, () => {
  console.log(`[Execution Service] Sandboxed runner listening on port ${PORT}`);
});
