import workerpool from 'workerpool'
import type { WorkerPool } from 'workerpool'
import type TDepts from './worker-depts'

const MAX_WORKER = 8
let pool: WorkerPool

export async function workerDraw<T extends any[], R>(
    fn: (depts: typeof TDepts, ...args: T) => Promise<R> | R,
    ...args: T
) {
    if (!pool) {
        pool = workerpool.pool('./worker.bundle.js', {
            maxWorkers: MAX_WORKER,
        })
    }
    return pool.exec('runWithDepts', [String(fn)].concat(args))
}
