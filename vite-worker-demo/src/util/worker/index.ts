import workerpool from 'workerpool'
import type { WorkerPool } from 'workerpool'
import type TDepts from './worker-depts'

const MAX_WORKER = 8
let pool: WorkerPool

function patchWorker() {
    if (globalThis.Worker && !(globalThis.Worker as any).patched) {
        class PatchedWorker extends Worker {
            static patched = true
            constructor(scriptURL: string | URL, options?: WorkerOptions) {
                super(scriptURL, Object.assign({}, options, { type: 'module' }))
            }
        }
        globalThis.Worker = PatchedWorker
    }
}

export async function workerDraw<T extends any[], R>(
    fn: (depts: typeof TDepts, ...args: T) => Promise<R> | R,
    ...args: T
) {
    if (!pool) {
        patchWorker()
        if (import.meta.env && import.meta.env.DEV) {
            // 开发环境
            pool = workerpool.pool(
                new URL(`../../workers/index.ts?worker_file`, import.meta.url).href,
                {
                    maxWorkers: MAX_WORKER,
                },
            )
        } else {
            // // 构建环境
            pool = workerpool.pool('./worker.bundle.js', {
                maxWorkers: MAX_WORKER,
            })
        }
    }

    return pool.exec('runWithDepts', [String(fn)].concat(args))
}

