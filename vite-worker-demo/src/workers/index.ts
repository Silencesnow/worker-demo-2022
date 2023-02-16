import workerpool from 'workerpool'
import workerDepts from '../util/worker/worker-depts'

function runWithDepts(fn: any, ...args: any) {
    try {
        var f = new Function('return (' + fn + ').apply(null, arguments);')
        return f.apply(f, [workerDepts].concat(args))
    } catch (e) {
        console.error(e)
        throw e
    }
}

workerpool.worker({
    runWithDepts,
})