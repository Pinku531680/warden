const measurePerformance = (fn) => {

    // takes a function fn, and then uses perofrmance API to measure
    // the running time
    // but we rely on avreages across 100 iterations not just 1
    // run fn() 100 times, compute times, take averages of that
    // also min and max

    let iterations = 100;

    let times = [];

    for(let k = 0; k < iterations; k++) {

        const start = performance.now();
        fn();
        const end = performance.now();

        times.push((end - start));
    }

    const avg = times.reduce((acc, val) => acc + val, 0);
    const max = Math.max(...times);
    const min = Math.min(...times);

    return {
        avg,
        max,
        min
    }
}