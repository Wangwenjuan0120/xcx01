export function getWorkpointMap(workpoint) {
    if (workpoint > 5 || workpoint < 0) {
        throw new Error('error arguments', 'getWorkpointMap')
    }
    let workpointMap = [0, 0, 0, 0, 0]
    if (!workpoint) {
        return workpointMap
    }
    const initworkpoint = parseInt(workpoint)
    if (initworkpoint === 5) {
        return [1, 1, 1, 1, 1]
    }
    if (initworkpoint < 5) {
        workpointMap[initworkpoint] = workpoint - initworkpoint
        for (let i = 0; i < initworkpoint; i++) {
            if (i < initworkpoint) {
                workpointMap[i] = 1
            }
        }
        return workpointMap
    }
}